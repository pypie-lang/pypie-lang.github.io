// TensorFlow.js half of the PyPie browser runtime.
//
// The PyPie wheel's Python half (`pypie.browser.call_tfjs`) hands compiled
// programs to the `__pypieRunTfjsSync` global that `initTfjsRuntime` installs
// on the worker scope. A program payload carries:
//
// - `runtimeSource`: generated JavaScript that evaluates to an entrypoint
//   `(tf, ...args) => result`,
// - `inputs`: runtime arguments with schemas describing how to materialize
//   them as tf.js values,
// - `resultType`: the schema used to serialize the result back to Python.
//
// Tensors cross the JS/Python boundary as
// `{ __pypieTensor: true, dtype, shape, value }`.
//
// The tf.js CDN bundles are UMD scripts; loaded via dynamic import (the
// worker is a module worker, so importScripts is unavailable) they attach
// `tf` to the global scope.

type TfDType = "float32" | "int32" | "bool" | "string";
type TfjsBackend = "webgl" | "wasm";

type TfTensor = {
    dtype: TfDType | string;
    shape: number[];
    arraySync(): unknown;
    dispose(): void;
};

type TfTensorConstructor = {
    new (...args: never[]): TfTensor;
    prototype: TfTensor;
};

type TfModule = {
    Tensor: TfTensorConstructor;
    getBackend(): string;
    ready(): Promise<void>;
    scalar(value: number | boolean | string, dtype: TfDType): TfTensor;
    setBackend(name: string): Promise<boolean>;
    tensor(value: unknown, shape: number[], dtype: TfDType): TfTensor;
    wasm: {
        setWasmPaths(path: string): void;
    };
};

declare const tf: TfModule;

type RuntimeSchema =
    | { kind: "tensor"; dtype: TfDType; shape: number[] }
    | { kind: "scalar"; dtype: TfDType }
    | { kind: "tuple"; elems: RuntimeSchema[] }
    | { kind: "list"; elem: RuntimeSchema }
    | { kind: "record"; fields: Record<string, RuntimeSchema> }
    | { kind: "value" };

type RuntimeInput = {
    name: string;
    schema: RuntimeSchema;
    value: unknown;
};

type RuntimePayload = {
    runtimeSource: string;
    resultType: RuntimeSchema;
    inputs: RuntimeInput[];
};

const TFJS_VERSION = "4.22.0";
const TFJS_SCRIPT_URL = `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@${TFJS_VERSION}/dist/tf.min.js`;
const TFJS_WEBGL_SCRIPT_URL = `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl@${TFJS_VERSION}/dist/tf-backend-webgl.min.js`;
const TFJS_WASM_SCRIPT_URL = `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${TFJS_VERSION}/dist/tf-backend-wasm.min.js`;
const TFJS_WASM_PATH = `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${TFJS_VERSION}/dist/`;
const TFJS_BACKEND_CANDIDATES: TfjsBackend[] = ["webgl", "wasm"];

let initPromise: Promise<string> | null = null;
const loadedBackendScripts = new Set<TfjsBackend>();

// Loads tf.js, selects a backend, and installs `__pypieRunTfjsSync` on the
// worker global scope. Resolves to a human-readable backend label.
export function initTfjsRuntime(): Promise<string> {
    if (!initPromise) {
        initPromise = (async () => {
            await loadUmdScript(TFJS_SCRIPT_URL);
            await selectBackend();
            (self as unknown as Record<string, unknown>).__pypieRunTfjsSync = runTfjsSync;
            return `TFJS ${tf.getBackend().toUpperCase()}`;
        })();
    }
    return initPromise;
}

async function loadUmdScript(url: string): Promise<void> {
    await import(/* @vite-ignore */ url);
}

async function selectBackend(): Promise<void> {
    const failures: string[] = [];
    for (const backend of TFJS_BACKEND_CANDIDATES) {
        try {
            await loadBackendScript(backend);
            const ok = await tf.setBackend(backend);
            await tf.ready();
            if (ok && tf.getBackend() === backend) {
                return;
            }
            failures.push(`${backend}: backend was not selected`);
        } catch (error) {
            failures.push(`${backend}: ${errorMessage(error)}`);
        }
    }
    throw new Error(`No TensorFlow.js backend is available (${failures.join("; ")})`);
}

async function loadBackendScript(backend: TfjsBackend): Promise<void> {
    if (loadedBackendScripts.has(backend)) {
        return;
    }
    switch (backend) {
        case "webgl":
            await loadUmdScript(TFJS_WEBGL_SCRIPT_URL);
            break;
        case "wasm":
            await loadUmdScript(TFJS_WASM_SCRIPT_URL);
            tf.wasm.setWasmPaths(TFJS_WASM_PATH);
            break;
    }
    loadedBackendScripts.add(backend);
}

// Exported for the node smoke test (playground/smoke-test.mjs), which calls
// it with a `tf` global provided by @tensorflow/tfjs instead of the CDN
// scripts that initTfjsRuntime loads.
export function runTfjsSync(payload: RuntimePayload): unknown {
    if (!tf.getBackend()) {
        throw new Error("TensorFlow.js backend is not ready");
    }
    const { result, args } = execute(payload);
    try {
        return serializeResult(result);
    } finally {
        dispose(result);
        dispose(args);
    }
}

function execute(payload: RuntimePayload): { result: unknown; args: unknown[] } {
    const factory = new Function("tf", payload.runtimeSource) as (
        tfModule: TfModule,
    ) => (...args: unknown[]) => unknown;
    const entry = factory(tf);
    if (typeof entry !== "function") {
        throw new Error("Generated TensorFlow.js runtime source did not return an entrypoint");
    }
    const args = payload.inputs.map((input) => materializeValue(input.schema, input.value));
    const result = entry(tf, ...args);
    return { result, args };
}

function materializeValue(schema: RuntimeSchema, value: unknown): unknown {
    switch (schema.kind) {
        case "tensor":
            return tf.tensor(value, schema.shape, schema.dtype);
        case "scalar":
            return tf.scalar(value as number | boolean | string, schema.dtype);
        case "tuple":
            return schema.elems.map((elem, index) => materializeValue(elem, (value as unknown[])[index]));
        case "list":
            return (value as unknown[]).map((item) => materializeValue(schema.elem, item));
        case "record": {
            const out: Record<string, unknown> = {};
            for (const [key, fieldSchema] of Object.entries(schema.fields)) {
                out[key] = materializeValue(fieldSchema, (value as Record<string, unknown>)[key]);
            }
            return out;
        }
        case "value":
            return value;
    }
}

function serializeResult(value: unknown): unknown {
    if (value instanceof tf.Tensor) {
        return {
            __pypieTensor: true,
            dtype: value.dtype,
            shape: value.shape,
            value: value.arraySync(),
        };
    }
    if (Array.isArray(value)) {
        return value.map(serializeResult);
    }
    if (value && typeof value === "object") {
        const out: Record<string, unknown> = {};
        for (const [key, child] of Object.entries(value)) {
            out[key] = serializeResult(child);
        }
        return out;
    }
    return value;
}

function dispose(value: unknown): void {
    if (value instanceof tf.Tensor) {
        value.dispose();
    } else if (Array.isArray(value)) {
        value.forEach(dispose);
    } else if (value && typeof value === "object") {
        Object.values(value).forEach(dispose);
    }
}

function errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}
