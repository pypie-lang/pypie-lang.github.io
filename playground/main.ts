import { basicSetup, EditorView } from "codemirror";
import { python } from "@codemirror/lang-python";
import { Compartment, EditorState } from "@codemirror/state";
import { vim } from "@replit/codemirror-vim";

type WorkerResponse =
    | { id: number; ok: true; result: unknown }
    | { id: number; ok: false; error: string };

type RunResult = {
    stdout: string;
    stderr: string;
    result: unknown;
};

type Sample = {
    label: string;
    code: string;
};

type RuntimeStatus = {
    status: string;
    backend: string;
};

class WorkerClient {
    private worker: Worker;
    private nextId = 1;
    private pending = new Map<number, { resolve: (value: unknown) => void; reject: (error: Error) => void }>();

    constructor(url: URL) {
        this.worker = new Worker(url);
        this.worker.addEventListener("message", (event: MessageEvent<WorkerResponse>) => {
            const message = event.data;
            const pending = this.pending.get(message.id);
            if (!pending) {
                return;
            }
            this.pending.delete(message.id);
            if (message.ok) {
                pending.resolve(message.result);
            } else {
                pending.reject(new Error(message.error));
            }
        });
    }

    request<T>(type: string, payload: unknown = {}): Promise<T> {
        const id = this.nextId++;
        this.worker.postMessage({ id, type, payload });
        return new Promise<T>((resolve, reject) => {
            this.pending.set(id, { resolve: resolve as (value: unknown) => void, reject });
        });
    }

    terminate(): void {
        this.worker.terminate();
        for (const pending of this.pending.values()) {
            pending.reject(new Error("Worker stopped"));
        }
        this.pending.clear();
    }
}

const SCRIPT_URL = (() => {
    const script = document.currentScript;
    if (script instanceof HTMLScriptElement && script.src) {
        return script.src;
    }
    return new URL("./dist/main.js", document.baseURI).href;
})();

const PLAYGROUND_BUILD_ID = "20260608-firefox-file-guard-a";
const LOCAL_PLAYGROUND_URL = "http://localhost:8000/playground/";

const samples: Record<string, Sample> = {
    line: {
        label: "Baseline Line",
        code: `from typing import Tuple

from pypie import Model, Tensor, float32


class Line(Model):
    def predict(x: float32, p: Tuple[float32, float32]) -> float32:
        return p[0] * x + p[1]

    def loss[n](ys_pred: Tensor[float32][[n]], ys: Tensor[float32][[n]]) -> float32:
        return ((ys_pred - ys) ** 2).sum(0)

    def update(p: float32, g: float32) -> float32:
        return p - (0.01 * g)


xs = Tensor([2.0, 1.0, 4.0, 3.0], float32)
ys = Tensor([1.8, 1.2, 4.2, 3.3], float32)

params = (0.0, 0.0)

params = Line.learn(xs, ys, params, 100)
w, b = params[0], params[1]

print(params)
assert 0.8 < float(w) < 1.2
assert -0.2 < float(b) < 0.2
`,
    },
    add: {
        label: "Vector Add",
        code: `from pypie import Tensor, op, float32

@op
def main[T](x: Tensor[T][[2]], y: Tensor[T][[2]]) -> Tensor[T][[2]]:
    return x + y

x = Tensor([1.0, 2.0], float32)
y = Tensor([3.0, 4.0], float32)
print(main(x, y))
`,
    },
    matmul: {
        label: "Matrix Multiply",
        code: `from pypie import Tensor, op, float32

@op
def main(x: Tensor[float32][[2, 2]], y: Tensor[float32][[2, 2]]) -> Tensor[float32][[2, 2]]:
    return x @ y

x = Tensor([[1.0, 2.0], [3.0, 4.0]], float32)
y = Tensor([[5.0, 6.0], [7.0, 8.0]], float32)
print(main(x, y))
`,
    },
    reduce: {
        label: "Reduce Mean",
        code: `from pypie import Tensor, op, float32

@op
def main(x: Tensor[float32][[4]]) -> Tensor[float32][[]]:
    return x.mean()

x = Tensor([1.0, 2.0, 3.0, 4.0], float32)
print(main(x))
`,
    },
};

let pyWorker: WorkerClient | null = null;

const editorElement = requiredElement("editor");
const runButton = requiredElement<HTMLButtonElement>("run-button");
const stopButton = requiredElement<HTMLButtonElement>("stop-button");
const vimButton = requiredElement<HTMLButtonElement>("vim-button");
const sampleSelect = requiredElement<HTMLSelectElement>("sample-select");
const statusElement = requiredElement("runtime-status");
const diagnosticsElement = requiredElement("diagnostics");
const diagnosticCountElement = requiredElement("diagnostic-count");
const inputsElement = requiredElement("inputs");
const outputElement = requiredElement("output");
const entryNameElement = requiredElement("entry-name");
const backendNameElement = requiredElement("backend-name");
const vimCompartment = new Compartment();
const view = createEditor();

main();

function main(): void {
    sampleSelect.value = "line";
    renderDiagnostics("Run to see Python errors");
    renderScriptPanel();
    if (window.location.protocol === "file:") {
        renderFileProtocolError();
        return;
    }
    initializeRuntime();

    sampleSelect.addEventListener("change", () => {
        loadSample(sampleSelect.value);
    });
    runButton.addEventListener("click", () => {
        void runCurrentSource();
    });
    stopButton.addEventListener("click", () => {
        pyWorker?.terminate();
        pyWorker = createWorkerClient();
        setStatus("Restarting");
        initializeRuntime();
    });
    vimButton.addEventListener("click", toggleVimMode);
}

function createEditor(): EditorView {
    return new EditorView({
        parent: editorElement,
        state: EditorState.create({
            doc: samples.line.code,
            extensions: [basicSetup, python(), vimCompartment.of([])],
        }),
    });
}

function createWorkerClient(): WorkerClient {
    const url = new URL("pyodide-worker.js", SCRIPT_URL);
    url.searchParams.set("v", PLAYGROUND_BUILD_ID);
    return new WorkerClient(url);
}

function ensureWorkerClient(): WorkerClient {
    if (!pyWorker) {
        pyWorker = createWorkerClient();
    }
    return pyWorker;
}

function initializeRuntime(): void {
    void ensureWorkerClient()
        .request<RuntimeStatus>("init")
        .then((result) => {
            backendNameElement.textContent = result.backend;
            setStatus(result.status);
        })
        .catch((error) => {
            backendNameElement.textContent = "Unavailable";
            setStatus(errorMessage(error));
        });
}

async function runCurrentSource(): Promise<void> {
    if (window.location.protocol === "file:") {
        renderFileProtocolError();
        return;
    }
    runButton.disabled = true;
    outputElement.textContent = "";
    renderDiagnostics("Running");
    setStatus("Running");
    try {
        const result = await ensureWorkerClient().request<RunResult>("runSource", {
            source: view.state.doc.toString(),
        });
        renderRunResult(result);
        renderDiagnostics("No Python errors");
        setStatus("Ready");
    } catch (error) {
        renderError(error);
        setStatus("Run failed");
    } finally {
        runButton.disabled = false;
    }
}

function renderRunResult(result: RunResult): void {
    const chunks: string[] = [];
    if (result.stdout) {
        chunks.push(result.stdout.trimEnd());
    }
    if (result.stderr) {
        chunks.push(result.stderr.trimEnd());
    }
    if (result.result !== undefined && result.result !== null) {
        chunks.push(`Result:\n${formatValue(result.result)}`);
    }
    outputElement.textContent = chunks.join("\n");
}

function renderError(error: unknown): void {
    const message = errorMessage(error);
    outputElement.textContent = message;
    renderDiagnostics(message);
}

function renderFileProtocolError(): void {
    const url = new URL(LOCAL_PLAYGROUND_URL);
    url.search = window.location.search;
    const message = `Firefox cannot reliably run the Pyodide worker from a file:// URL. Serve the site and open ${url.href}.`;
    runButton.disabled = true;
    stopButton.disabled = true;
    backendNameElement.textContent = "Unavailable";
    setStatus("Open via localhost");
    outputElement.textContent = message;
    renderDiagnostics(message);
}

function setStatus(text: string): void {
    statusElement.textContent = text;
}

function toggleVimMode(): void {
    const pressed = vimButton.getAttribute("aria-pressed") === "true";
    vimButton.setAttribute("aria-pressed", String(!pressed));
    view.dispatch({
        effects: vimCompartment.reconfigure(pressed ? [] : vim()),
    });
    view.focus();
}

function loadSample(key: string): void {
    const sample = samples[key] || samples.line;
    view.dispatch({
        changes: {
            from: 0,
            to: view.state.doc.length,
            insert: sample.code,
        },
    });
    outputElement.textContent = "";
    renderDiagnostics("Run to see Python errors");
    renderScriptPanel();
}

function renderDiagnostics(message: string): void {
    const isError = message !== "No Python errors" && message !== "Run to see Python errors" && message !== "Running";
    diagnosticCountElement.textContent = isError ? "1" : "0";
    diagnosticsElement.innerHTML = "";
    diagnosticsElement.append(emptyState(message));
}

function renderScriptPanel(): void {
    entryNameElement.textContent = "playground.py";
    inputsElement.innerHTML = "";
    inputsElement.append(emptyState("Python script"));
}

function emptyState(text: string): HTMLElement {
    const div = document.createElement("div");
    div.className = "empty-state";
    div.textContent = text;
    return div;
}

function formatValue(value: unknown): string {
    if (typeof value === "string") {
        return value;
    }
    try {
        return JSON.stringify(value, null, 2);
    } catch {
        return String(value);
    }
}

function errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

function requiredElement<T extends HTMLElement = HTMLElement>(id: string): T {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`Missing #${id}`);
    }
    return element as T;
}
