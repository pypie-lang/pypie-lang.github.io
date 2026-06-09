type RequestMessage = {
    id: number;
    type: "init" | "runSource" | "analyzeSource";
    payload?: Record<string, unknown>;
};

type PyProxy = {
    toJs(options?: { dict_converter?: (entries: [unknown, unknown][]) => unknown }): unknown;
    destroy?: () => void;
};

type PyodideRuntime = {
    loadPackage(names: string | string[]): Promise<void>;
    loadPackagesFromImports(source: string): Promise<void>;
    runPythonAsync(source: string): Promise<unknown>;
    setStdout(options: { batched: (text: string) => void }): void;
    setStderr(options: { batched: (text: string) => void }): void;
    toPy(value: unknown): PyProxy;
};

declare function importScripts(...urls: string[]): void;
declare function loadPyodide(options: { indexURL: string }): Promise<PyodideRuntime>;

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

type WheelManifest = {
    pyodideVersion: string;
    wheel: string;
};

type RuntimeStatus = {
    status: string;
    backend: string;
};

type AnalyzeResult = {
    version: number;
    diagnostics: unknown[];
    hovers: unknown[];
};

type RuntimeSchema =
    | { kind: "tensor"; dtype: "float32" | "int32" | "bool" | "string"; shape: number[] }
    | { kind: "scalar"; dtype: "float32" | "int32" | "bool" | "string" }
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

const DEFAULT_PYODIDE_VERSION = "0.27.7";
const DEFAULT_PYPIE_WHEEL_FILE = "pypie_lang-0.0.6-cp310-abi3-emscripten_3_1_58_wasm32.whl";
const TFJS_VERSION = "4.22.0";
const TFJS_SCRIPT_URL = `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@${TFJS_VERSION}/dist/tf.min.js`;
const TFJS_WEBGL_SCRIPT_URL = `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl@${TFJS_VERSION}/dist/tf-backend-webgl.min.js`;
const TFJS_WASM_SCRIPT_URL = `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${TFJS_VERSION}/dist/tf-backend-wasm.min.js`;
const TFJS_WASM_PATH = `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${TFJS_VERSION}/dist/`;
const TFJS_BACKEND_CANDIDATES: TfjsBackend[] = ["webgl", "wasm"];
const WORKER_URL = self.location.href;
const WORKER_CACHE_BUSTER = new URL(WORKER_URL).searchParams.get("v");
const WHEEL_MANIFEST_URL = new URL("../pypie-wheel.json", WORKER_URL).href;

let initPromise: Promise<RuntimeStatus> | null = null;
let tfjsInitPromise: Promise<string> | null = null;
let pyodide: PyodideRuntime | null = null;
let stdoutBuffer: string[] = [];
let stderrBuffer: string[] = [];
const loadedTfjsBackendScripts = new Set<string>();

(self as unknown as { __pypieRunTfjsSync: (payload: RuntimePayload) => unknown }).__pypieRunTfjsSync =
    runTfjsSync;

self.addEventListener("message", (event: MessageEvent<RequestMessage>) => {
    const message = event.data;
    void handleMessage(message)
        .then((result) => {
            self.postMessage({ id: message.id, ok: true, result });
        })
        .catch((error) => {
            self.postMessage({ id: message.id, ok: false, error: errorMessage(error) });
        });
});

async function handleMessage(message: RequestMessage): Promise<unknown> {
    switch (message.type) {
        case "init":
            return initRuntime();
        case "runSource":
            await initRuntime();
            return runSource(String(message.payload?.source || ""));
        case "analyzeSource":
            await initRuntime();
            return analyzeSource(
                String(message.payload?.source || ""),
                Number(message.payload?.version || 0),
            );
    }
}

function initRuntime(): Promise<RuntimeStatus> {
    if (!initPromise) {
        initPromise = loadRuntime();
    }
    return initPromise;
}

function initTfjs(): Promise<string> {
    if (!tfjsInitPromise) {
        tfjsInitPromise = (async () => {
            importScripts(TFJS_SCRIPT_URL, TFJS_WASM_SCRIPT_URL);
            loadedTfjsBackendScripts.add("wasm");
            tf.wasm.setWasmPaths(TFJS_WASM_PATH);
            await selectTfjsBackend();
            return `TFJS ${tf.getBackend().toUpperCase()}`;
        })();
    }
    return tfjsInitPromise;
}

async function selectTfjsBackend(): Promise<void> {
    const failures: string[] = [];
    for (const backend of TFJS_BACKEND_CANDIDATES) {
        try {
            loadTfjsBackendScript(backend);
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

function loadTfjsBackendScript(backend: TfjsBackend): void {
    if (loadedTfjsBackendScripts.has(backend)) {
        return;
    }
    switch (backend) {
        case "webgl":
            importScripts(TFJS_WEBGL_SCRIPT_URL);
            break;
        case "wasm":
            importScripts(TFJS_WASM_SCRIPT_URL);
            break;
    }
    loadedTfjsBackendScripts.add(backend);
}

async function loadRuntime(): Promise<RuntimeStatus> {
    const wheelManifest = await loadWheelManifest();
    const pyodideIndexUrl = `https://cdn.jsdelivr.net/pyodide/v${wheelManifest.pyodideVersion}/full/`;
    const pypieWheelUrl = new URL(`../${wheelManifest.wheel}`, WORKER_URL);
    if (WORKER_CACHE_BUSTER) {
        pypieWheelUrl.searchParams.set("v", WORKER_CACHE_BUSTER);
    }
    importScripts(`${pyodideIndexUrl}pyodide.js`);
    pyodide = await loadPyodide({ indexURL: pyodideIndexUrl });
    pyodide.setStdout({
        batched: (text) => {
            stdoutBuffer.push(text);
        },
    });
    pyodide.setStderr({
        batched: (text) => {
            stderrBuffer.push(text);
        },
    });
    const backend = await initTfjs();
    await pyodide.loadPackage(["micropip", "numpy"]);
    await pyodide.runPythonAsync(`
import os
os.environ["PYPIE_BACKEND"] = "tfjs"
`);
    try {
        await pyodide.runPythonAsync(`
import micropip
await micropip.install(${JSON.stringify(pypieWheelUrl.href)}, deps=False)
`);
    } catch (error) {
        throw new Error(
            `PyPie wasm wheel is missing or failed to install from ${pypieWheelUrl.href}: ${errorMessage(error)}. Run \`make pyodide-wheel\` in /Users/mvc/Documents/code/pypie-compiler.`
        );
    }
    await installBrowserRuntimeBridge();
    return { status: "Ready", backend };
}

async function loadWheelManifest(): Promise<WheelManifest> {
    try {
        const response = await fetch(WHEEL_MANIFEST_URL, { cache: "no-store" });
        if (response.ok) {
            const manifest = (await response.json()) as Partial<WheelManifest>;
            if (manifest.pyodideVersion && manifest.wheel) {
                return {
                    pyodideVersion: manifest.pyodideVersion,
                    wheel: manifest.wheel,
                };
            }
        }
    } catch {
        // Fall through to the default missing-wheel path below.
    }
    return {
        pyodideVersion: DEFAULT_PYODIDE_VERSION,
        wheel: DEFAULT_PYPIE_WHEEL_FILE,
    };
}

async function installBrowserRuntimeBridge(): Promise<void> {
    if (!pyodide) {
        throw new Error("Pyodide is not ready");
    }
    await pyodide.runPythonAsync(`
import sys
import types
import numpy as np
import js
from pyodide.ffi import to_js

def _plain(value):
    if hasattr(value, "tolist"):
        return value.tolist()
    if isinstance(value, tuple):
        return [_plain(item) for item in value]
    if isinstance(value, list):
        return [_plain(item) for item in value]
    if isinstance(value, dict):
        return {key: _plain(item) for key, item in value.items()}
    return value

def _np_dtype(name):
    if name == "float32":
        return np.float32
    if name == "int32":
        return np.int32
    if name == "bool":
        return np.bool_
    if name == "string":
        return np.str_
    return None

def _from_tfjs(value, schema):
    if hasattr(value, "to_py"):
        value = value.to_py()
    kind = schema.get("kind")
    if isinstance(value, dict) and value.get("__pypieTensor"):
        array = np.asarray(value.get("value"), dtype=_np_dtype(value.get("dtype")))
        if kind == "scalar":
            return array.item()
        return array
    if kind == "tuple":
        elems = schema.get("elems", [])
        if len(value) != len(elems):
            raise TypeError(f"TFJS returned tuple with {len(value)} elements, expected {len(elems)}")
        return tuple(_from_tfjs(item, item_schema) for item, item_schema in zip(value, elems))
    if kind == "list":
        return [_from_tfjs(item, schema.get("elem", {"kind": "value"})) for item in value]
    if kind == "record":
        fields = schema.get("fields", {})
        missing = [key for key in fields if key not in value]
        if missing:
            raise TypeError(f"TFJS returned record missing field(s): {', '.join(missing)}")
        return {key: _from_tfjs(value[key], fields.get(key, {"kind": "value"})) for key in value}
    return value

def call_tfjs(program, inputs):
    payload = {
        "runtimeSource": program["runtimeSource"],
        "resultType": program["resultType"],
        "inputs": [
            {
                "name": item["name"],
                "schema": item["schema"],
                "value": _plain(item["value"]),
            }
            for item in inputs
        ],
    }
    js_payload = to_js(payload, dict_converter=js.Object.fromEntries)
    result = js.__pypieRunTfjsSync(js_payload)
    return _from_tfjs(result, program["resultType"])

module = types.ModuleType("pypie_browser_runtime")
module.call_tfjs = call_tfjs
sys.modules["pypie_browser_runtime"] = module
`);
}

async function analyzeSource(source: string, version: number): Promise<AnalyzeResult> {
    if (!pyodide) {
        throw new Error("Pyodide is not ready");
    }
    const rawResult = await pyodide.runPythonAsync(`
import pypie
pypie.analyze_source_json(${JSON.stringify(source)}, "playground.py")
`);
    const result = JSON.parse(String(rawResult)) as Partial<AnalyzeResult>;
    return {
        version,
        diagnostics: Array.isArray(result.diagnostics) ? result.diagnostics : [],
        hovers: Array.isArray(result.hovers) ? result.hovers : [],
    };
}

async function runSource(source: string): Promise<{ stdout: string; stderr: string; result: unknown }> {
    if (!pyodide) {
        throw new Error("Pyodide is not ready");
    }
    stdoutBuffer = [];
    stderrBuffer = [];
    await pyodide.loadPackagesFromImports(source);
    const rawResult = await pyodide.runPythonAsync(`
import linecache
import types
__pypie_playground_source = ${JSON.stringify(source)}
__pypie_playground_filename = "playground.py"
linecache.cache[__pypie_playground_filename] = (
    len(__pypie_playground_source),
    None,
    __pypie_playground_source.splitlines(True),
    __pypie_playground_filename,
)
__pypie_playground_module = types.ModuleType("__pypie_playground_user__")
__pypie_playground_globals = __pypie_playground_module.__dict__
__pypie_playground_globals["__name__"] = "__main__"
__pypie_playground_globals["__package__"] = ""
exec(
    compile(__pypie_playground_source, __pypie_playground_filename, "exec"),
    __pypie_playground_globals,
    __pypie_playground_globals,
)
`);
    return {
        stdout: stdoutBuffer.join("\n"),
        stderr: stderrBuffer.join("\n"),
        result: pyResultToJs(rawResult),
    };
}

function runTfjsSync(payload: RuntimePayload): unknown {
    if (!tf.getBackend()) {
        throw new Error("TensorFlow.js backend is not ready");
    }
    const { result, args } = executeTfjs(payload);
    try {
        return serializeResultSync(result);
    } finally {
        disposeResult(result);
        disposeResult(args);
    }
}

function executeTfjs(payload: RuntimePayload): { result: unknown; args: unknown[] } {
    const factory = new Function("tf", payload.runtimeSource) as (tfModule: TfModule) => (...args: unknown[]) => unknown;
    const entry = factory(tf);
    if (typeof entry !== "function") {
        throw new Error("Generated TensorFlow.js runtime source did not return an entrypoint");
    }
    const args = payload.inputs.map((input) => materializeRuntimeValue(input.schema, input.value));
    const result = entry(tf, ...args);
    return { result, args };
}

function materializeRuntimeValue(schema: RuntimeSchema, value: unknown): unknown {
    switch (schema.kind) {
        case "tensor":
            return tf.tensor(value, schema.shape, schema.dtype);
        case "scalar":
            return tf.scalar(value as number | boolean | string, schema.dtype);
        case "tuple":
            return schema.elems.map((elem, index) => materializeRuntimeValue(elem, (value as unknown[])[index]));
        case "list":
            return (value as unknown[]).map((item) => materializeRuntimeValue(schema.elem, item));
        case "record": {
            const out: Record<string, unknown> = {};
            for (const [key, fieldSchema] of Object.entries(schema.fields)) {
                out[key] = materializeRuntimeValue(fieldSchema, (value as Record<string, unknown>)[key]);
            }
            return out;
        }
        case "value":
            return value;
    }
}

function serializeResultSync(value: unknown): unknown {
    if (value instanceof tf.Tensor) {
        return {
            __pypieTensor: true,
            dtype: value.dtype,
            shape: value.shape,
            value: value.arraySync(),
        };
    }
    if (Array.isArray(value)) {
        return value.map(serializeResultSync);
    }
    if (value && typeof value === "object") {
        const out: Record<string, unknown> = {};
        for (const [key, child] of Object.entries(value)) {
            out[key] = serializeResultSync(child);
        }
        return out;
    }
    return value;
}

function disposeResult(value: unknown): void {
    if (value instanceof tf.Tensor) {
        value.dispose();
    } else if (Array.isArray(value)) {
        value.forEach(disposeResult);
    } else if (value && typeof value === "object") {
        Object.values(value).forEach(disposeResult);
    }
}

function pyResultToJs(value: unknown): unknown {
    if (isPyProxy(value)) {
        try {
            return value.toJs({ dict_converter: Object.fromEntries });
        } finally {
            value.destroy?.();
        }
    }
    return value;
}

function isPyProxy(value: unknown): value is PyProxy {
    return typeof value === "object" && value !== null && "toJs" in value;
}

function errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}
