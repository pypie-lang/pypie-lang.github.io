// Playground worker: a thin Pyodide host for the PyPie wheel.
//
// The worker only knows how to load Pyodide, install the wheel described by
// `playground/pypie-wheel.json`, and forward requests to the wheel's Python
// API (`pypie.analyze_source_json`, `pypie.browser.run_source`). Everything
// PyPie-specific ships inside the wheel; the TensorFlow.js execution half
// lives in `tfjs-runtime.ts`. Build both with `make playground-wheel` (wheel)
// and `make build-playground` (scripts).
//
// This runs as a *module* worker: Pyodide 314+ ships only an ES-module core
// (pyodide.asm.mjs), and Firefox allows the dynamic imports needed to load it
// only in module workers.

import { initTfjsRuntime } from "./tfjs-runtime";

type RequestMessage = {
    id: number;
    type: "init" | "runSource" | "analyzeSource";
    payload?: Record<string, unknown>;
};

type PyodideRuntime = {
    loadPackage(names: string | string[]): Promise<void>;
    loadPackagesFromImports(source: string): Promise<void>;
    runPythonAsync(source: string): Promise<unknown>;
    setStdout(options: { batched: (text: string) => void }): void;
    setStderr(options: { batched: (text: string) => void }): void;
};

type PyodideModule = {
    loadPyodide(options: { indexURL: string }): Promise<PyodideRuntime>;
};

type WheelManifest = {
    pyodideVersion: string;
    wheel: string;
};

type RuntimeStatus = {
    status: string;
    backend: string;
};

type RunResult = {
    stdout: string;
    stderr: string;
    result: unknown;
};

type AnalyzeResult = {
    version: number;
    diagnostics: unknown[];
    hovers: unknown[];
};

const WORKER_URL = self.location.href;
const WORKER_CACHE_BUSTER = new URL(WORKER_URL).searchParams.get("v");
const WHEEL_MANIFEST_URL = new URL("../pypie-wheel.json", WORKER_URL).href;

let initPromise: Promise<RuntimeStatus> | null = null;
let pyodide: PyodideRuntime | null = null;
let stdoutBuffer: string[] = [];
let stderrBuffer: string[] = [];

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

async function loadRuntime(): Promise<RuntimeStatus> {
    const manifest = await loadWheelManifest();
    const pyodideIndexUrl = `https://cdn.jsdelivr.net/pyodide/v${manifest.pyodideVersion}/full/`;
    const { loadPyodide } = (await import(`${pyodideIndexUrl}pyodide.mjs`)) as PyodideModule;
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
    const backend = await initTfjsRuntime();
    await pyodide.loadPackage(["micropip", "numpy"]);
    const wheelUrl = new URL(`../${manifest.wheel}`, WORKER_URL);
    if (WORKER_CACHE_BUSTER) {
        wheelUrl.searchParams.set("v", WORKER_CACHE_BUSTER);
    }
    try {
        await pyodide.runPythonAsync(`
import micropip
await micropip.install(${JSON.stringify(wheelUrl.href)}, deps=False)
`);
    } catch (error) {
        throw new Error(
            `The PyPie wasm wheel failed to install from ${wheelUrl.href}: ${errorMessage(error)}. ` +
                "Rebuild it with `make playground-wheel` in the website repository.",
        );
    }
    return { status: "Ready", backend };
}

async function loadWheelManifest(): Promise<WheelManifest> {
    let manifest: Partial<WheelManifest> | null = null;
    try {
        const response = await fetch(WHEEL_MANIFEST_URL, { cache: "no-store" });
        if (response.ok) {
            manifest = (await response.json()) as Partial<WheelManifest>;
        }
    } catch {
        // Treated as a missing manifest below.
    }
    if (manifest?.pyodideVersion && manifest?.wheel) {
        return { pyodideVersion: manifest.pyodideVersion, wheel: manifest.wheel };
    }
    throw new Error(
        `The PyPie wheel manifest is missing or invalid at ${WHEEL_MANIFEST_URL}. ` +
            "Run `make playground-wheel` in the website repository to build the wasm wheel.",
    );
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

async function runSource(source: string): Promise<RunResult> {
    if (!pyodide) {
        throw new Error("Pyodide is not ready");
    }
    stdoutBuffer = [];
    stderrBuffer = [];
    await pyodide.loadPackagesFromImports(source);
    await pyodide.runPythonAsync(`
import pypie.browser
pypie.browser.run_source(${JSON.stringify(source)})
`);
    return {
        stdout: stdoutBuffer.join("\n"),
        stderr: stderrBuffer.join("\n"),
        result: null,
    };
}

function errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}
