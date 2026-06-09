import { basicSetup } from "codemirror";
import { python } from "@codemirror/lang-python";
import {
    diagnosticCount,
    forEachDiagnostic,
    forceLinting,
    linter,
    lintGutter,
    type Diagnostic as CmDiagnostic,
} from "@codemirror/lint";
import { Compartment, EditorState, type Text } from "@codemirror/state";
import { EditorView, hoverTooltip } from "@codemirror/view";
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
    path: string;
};

type RuntimeStatus = {
    status: string;
    backend?: string;
};

type LspPosition = {
    line: number;
    character: number;
};

type LspRange = {
    start: LspPosition;
    end: LspPosition;
};

type LspDiagnostic = {
    range: LspRange;
    severity?: number;
    source?: string;
    message: string;
};

type LspLanguageString = {
    language?: string;
    value: string;
};

type LspMarkupContent = {
    kind?: string;
    value: string;
};

type LspMarkedString = string | LspLanguageString;
type LspHoverContents = LspMarkedString | LspMarkedString[] | LspMarkupContent;

type EditorHover = {
    range: LspRange;
    contents: LspHoverContents;
};

type AnalyzeResult = {
    version: number;
    diagnostics: LspDiagnostic[];
    hovers: EditorHover[];
};

type HoverMatch = {
    hover: EditorHover;
    from: number;
    to: number;
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
            if (message.ok === true) {
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

class AnalysisClient {
    private nextVersion = 0;
    private acceptedVersion = 0;
    private latestResult: AnalyzeResult | null = null;

    async analyze(source: string): Promise<AnalyzeResult> {
        const version = ++this.nextVersion;
        try {
            const result = normalizeAnalyzeResult(
                await ensureWorkerClient().request<AnalyzeResult>("analyzeSource", {
                    source,
                    version,
                }),
                version,
            );
            if (result.version >= this.acceptedVersion) {
                this.acceptedVersion = result.version;
                this.latestResult = result;
            }
            return result.version === this.acceptedVersion ? result : emptyAnalysis(version);
        } catch (error) {
            const result = analysisFailure(version, error);
            if (version >= this.acceptedVersion) {
                this.acceptedVersion = version;
                this.latestResult = result;
            }
            return result;
        }
    }

    latest(): AnalyzeResult | null {
        return this.latestResult;
    }

    reset(): void {
        this.nextVersion += 1;
        this.acceptedVersion = this.nextVersion;
        this.latestResult = null;
    }
}

const SCRIPT_URL = (() => {
    const script = document.currentScript;
    if (script instanceof HTMLScriptElement && script.src) {
        return script.src;
    }
    return new URL("./dist/main.js", document.baseURI).href;
})();

const PLAYGROUND_BUILD_ID = "20260609-tfjs-gpu-e";
const LOCAL_PLAYGROUND_URL = "http://localhost:8000/playground/";
const DEFAULT_SAMPLE_KEY = "line";
const PLAYGROUND_ROOT_URL = new URL("../", SCRIPT_URL).href;

const samples: Record<string, Sample> = {
    line: {
        label: "Baseline Line",
        path: "./examples/baseline_line.py",
    },
    add: {
        label: "Vector Add",
        path: "./examples/vector_add.py",
    },
    matmul: {
        label: "Matrix Multiply",
        path: "./examples/matrix_multiply.py",
    },
    reduce: {
        label: "Reduce Mean",
        path: "./examples/reduce_mean.py",
    },
};

let pyWorker: WorkerClient | null = null;
let sampleLoadVersion = 0;
let isRunning = false;
let currentRunId = 0;
const stoppedRunIds = new Set<number>();

const editorElement = requiredElement("editor");
const runButton = requiredElement<HTMLButtonElement>("run-button");
const vimButton = requiredElement<HTMLButtonElement>("vim-button");
const sampleSelect = requiredElement<HTMLSelectElement>("sample-select");
const statusElement = requiredElement("runtime-status");
const diagnosticsElement = requiredElement("diagnostics");
const outputElement = requiredElement("output");
const analysisClient = new AnalysisClient();
const vimCompartment = new Compartment();
const view = createEditor();

main();

function main(): void {
    populateSampleSelect();
    sampleSelect.value = DEFAULT_SAMPLE_KEY;
    renderDiagnosticsMessage("Loading example");
    if (window.location.protocol === "file:") {
        renderFileProtocolError();
        return;
    }
    void loadSample(DEFAULT_SAMPLE_KEY);
    initializeRuntime();
    renderRunButton();

    sampleSelect.addEventListener("change", () => {
        void loadSample(sampleSelect.value);
    });
    runButton.addEventListener("click", () => {
        if (isRunning) {
            stopCurrentRun();
        } else {
            void runCurrentSource();
        }
    });
    vimButton.addEventListener("click", toggleVimMode);
}

function createEditor(): EditorView {
    return new EditorView({
        parent: editorElement,
        state: EditorState.create({
            doc: "",
            extensions: [
                basicSetup,
                python(),
                lintGutter(),
                createPypieLinter(analysisClient),
                createPypieHover(analysisClient),
                EditorView.updateListener.of((update) => {
                    renderDiagnosticsFromEditor(update.view);
                }),
                vimCompartment.of([]),
            ],
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
            statusElement.dataset.backend = result.backend || "";
            if (!isRunning) {
                setStatus(result.status);
            }
            forceLinting(view);
        })
        .catch((error) => {
            if (!isRunning) {
                setStatus(errorMessage(error));
            }
        });
}

function createPypieLinter(client: AnalysisClient) {
    return linter(
        async (editorView): Promise<CmDiagnostic[]> => {
            const result = await client.analyze(editorView.state.doc.toString());
            return result.diagnostics.map((diagnostic) =>
                lspDiagnosticToCodeMirror(editorView.state.doc, diagnostic),
            );
        },
        {
            delay: 500,
        },
    );
}

function createPypieHover(client: AnalysisClient) {
    return hoverTooltip(
        (editorView, pos) => {
            const analysis = client.latest();
            if (!analysis) {
                return null;
            }
            const match = findHoverAtOffset(editorView.state.doc, analysis.hovers, pos);
            if (!match) {
                return null;
            }
            return {
                pos: match.from,
                end: match.to,
                above: true,
                create() {
                    const dom = document.createElement("div");
                    dom.className = "pypie-hover";
                    dom.textContent = hoverContentsToPlainText(match.hover.contents);
                    return { dom };
                },
            };
        },
        {
            hoverTime: 300,
            hideOnChange: true,
        },
    );
}

async function runCurrentSource(): Promise<void> {
    if (window.location.protocol === "file:") {
        renderFileProtocolError();
        return;
    }
    if (isRunning) {
        return;
    }
    const runId = ++currentRunId;
    setRunning(true);
    const source = view.state.doc.toString();
    outputElement.textContent = "";
    renderDiagnosticsMessage("Analyzing");
    try {
        const analysis = await analysisClient.analyze(source);
        if (stoppedRunIds.has(runId)) {
            return;
        }
        if (source !== view.state.doc.toString()) {
            setStatus("Ready");
            return;
        }
        if (analysis.diagnostics.length > 0) {
            renderDiagnosticsFromAnalysis(view.state.doc, analysis.diagnostics);
            setStatus("Fix diagnostics");
            return;
        }
        showOutputResult();
        setStatus("Running");
        const result = await ensureWorkerClient().request<RunResult>("runSource", {
            source,
        });
        if (stoppedRunIds.has(runId)) {
            return;
        }
        renderRunResult(result);
        setStatus("Ready");
    } catch (error) {
        if (stoppedRunIds.has(runId)) {
            return;
        }
        renderError(error);
        setStatus("Run failed");
    } finally {
        stoppedRunIds.delete(runId);
        if (currentRunId === runId) {
            setRunning(false);
        }
    }
}

function stopCurrentRun(): void {
    if (!isRunning) {
        return;
    }
    stoppedRunIds.add(currentRunId);
    pyWorker?.terminate();
    pyWorker = createWorkerClient();
    analysisClient.reset();
    setRunning(false);
    setStatus("Restarting");
    renderDiagnosticsMessage("Analyzing");
    initializeRuntime();
    forceLinting(view);
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
    outputElement.textContent = chunks.join("\n") || "No output";
    showOutputResult();
}

function renderError(error: unknown): void {
    const message = errorMessage(error);
    outputElement.textContent = message;
    showOutputResult();
}

function renderFileProtocolError(): void {
    const url = new URL(LOCAL_PLAYGROUND_URL);
    url.search = window.location.search;
    const message = `Firefox cannot reliably run the Pyodide worker from a file:// URL. Serve the site and open ${url.href}.`;
    setRunning(false);
    runButton.disabled = true;
    setStatus("Open via localhost");
    outputElement.textContent = message;
    renderDiagnosticsMessage(message, 1);
}

function setStatus(text: string): void {
    statusElement.textContent = text;
}

function setRunning(running: boolean): void {
    isRunning = running;
    renderRunButton();
}

function renderRunButton(): void {
    runButton.textContent = isRunning ? "■" : "▶";
    runButton.setAttribute("aria-label", isRunning ? "Stop" : "Run");
    runButton.title = isRunning ? "Stop" : "Run";
}

function toggleVimMode(): void {
    const pressed = vimButton.getAttribute("aria-pressed") === "true";
    vimButton.setAttribute("aria-pressed", String(!pressed));
    view.dispatch({
        effects: vimCompartment.reconfigure(pressed ? [] : vim()),
    });
    view.focus();
}

function populateSampleSelect(): void {
    sampleSelect.replaceChildren(
        ...Object.entries(samples).map(([key, sample]) => {
            const option = document.createElement("option");
            option.value = key;
            option.textContent = sample.label;
            return option;
        }),
    );
}

async function loadSample(key: string): Promise<void> {
    const sampleKey = samples[key] ? key : DEFAULT_SAMPLE_KEY;
    const sample = samples[sampleKey];
    const loadVersion = ++sampleLoadVersion;
    sampleSelect.value = sampleKey;
    outputElement.textContent = "";
    renderDiagnosticsMessage("Loading example");
    try {
        const response = await fetch(new URL(sample.path, PLAYGROUND_ROOT_URL), {
            cache: "no-cache",
        });
        if (!response.ok) {
            throw new Error(`Failed to load ${sample.path}: ${response.status} ${response.statusText}`);
        }
        const code = await response.text();
        if (loadVersion !== sampleLoadVersion) {
            return;
        }
        setEditorSource(code);
        renderDiagnosticsMessage("Analyzing");
        forceLinting(view);
    } catch (error) {
        if (loadVersion !== sampleLoadVersion) {
            return;
        }
        const message = errorMessage(error);
        renderDiagnosticsMessage(message, 1);
    }
}

function setEditorSource(source: string): void {
    view.dispatch({
        changes: {
            from: 0,
            to: view.state.doc.length,
            insert: source,
        },
    });
}

function renderDiagnosticsFromEditor(editorView: EditorView): void {
    const count = diagnosticCount(editorView.state);
    diagnosticsElement.innerHTML = "";
    if (count === 0) {
        if (outputElement.textContent) {
            showOutputResult();
        } else {
            showDiagnosticsResult();
        }
        return;
    }
    outputElement.textContent = "";
    forEachDiagnostic(editorView.state, (diagnostic, from, to) => {
        diagnosticsElement.append(renderDiagnosticItem(editorView.state.doc, diagnostic, from, to));
    });
    showDiagnosticsResult();
}

function renderDiagnosticsFromAnalysis(doc: Text, diagnostics: LspDiagnostic[]): void {
    diagnosticsElement.innerHTML = "";
    outputElement.textContent = "";
    for (const diagnostic of diagnostics) {
        const cmDiagnostic = lspDiagnosticToCodeMirror(doc, diagnostic);
        diagnosticsElement.append(renderDiagnosticItem(doc, cmDiagnostic, cmDiagnostic.from, cmDiagnostic.to));
    }
    showDiagnosticsResult();
}

function renderDiagnosticsMessage(message: string, count = 0): void {
    diagnosticsElement.innerHTML = "";
    if (count > 0) {
        outputElement.textContent = "";
    }
    diagnosticsElement.append(emptyState(message));
    showDiagnosticsResult();
}

function showDiagnosticsResult(): void {
    diagnosticsElement.hidden = false;
    outputElement.hidden = true;
}

function showOutputResult(): void {
    diagnosticsElement.hidden = true;
    outputElement.hidden = false;
}

function renderDiagnosticItem(doc: Text, diagnostic: CmDiagnostic, from: number, to: number): HTMLElement {
    const line = doc.lineAt(from);
    const endLine = doc.lineAt(Math.max(from, to));
    const div = document.createElement("div");
    div.className = `diagnostic-item diagnostic-${diagnostic.severity}`;

    const location = document.createElement("div");
    location.className = "diagnostic-location";
    location.textContent =
        line.number === endLine.number ? `Line ${line.number}` : `Lines ${line.number}-${endLine.number}`;

    const message = document.createElement("div");
    message.className = "diagnostic-message";
    message.textContent = diagnostic.message;

    div.append(location, message);
    return div;
}

function lspDiagnosticToCodeMirror(doc: Text, diagnostic: LspDiagnostic): CmDiagnostic {
    const { from, to } = lspRangeToOffsets(doc, diagnostic.range);
    return {
        from,
        to,
        severity: lspSeverityToCodeMirror(diagnostic.severity),
        source: diagnostic.source || "pypie",
        message: diagnostic.message,
    };
}

function lspRangeToOffsets(doc: Text, range: LspRange): { from: number; to: number } {
    const from = lspPositionToOffset(doc, range.start);
    const to = Math.max(from, lspPositionToOffset(doc, range.end));
    return { from, to };
}

function lspPositionToOffset(doc: Text, position: LspPosition): number {
    const lineNumber = clamp(Math.trunc(position.line) + 1, 1, doc.lines);
    const line = doc.line(lineNumber);
    return clamp(line.from + Math.trunc(position.character), line.from, line.to);
}

function lspSeverityToCodeMirror(severity?: number): CmDiagnostic["severity"] {
    switch (severity) {
        case 1:
            return "error";
        case 2:
            return "warning";
        case 4:
            return "hint";
        default:
            return "info";
    }
}

function findHoverAtOffset(doc: Text, hovers: EditorHover[], pos: number): HoverMatch | null {
    let best: HoverMatch | null = null;
    for (const hover of hovers) {
        const { from, to } = lspRangeToOffsets(doc, hover.range);
        if (pos < from || pos > to) {
            continue;
        }
        if (!best || to - from < best.to - best.from) {
            best = { hover, from, to };
        }
    }
    return best;
}

function hoverContentsToPlainText(contents: LspHoverContents): string {
    if (typeof contents === "string") {
        return hoverMarkdownToPlainText(contents);
    }
    if (Array.isArray(contents)) {
        return contents.map(markedStringToPlainText).filter(Boolean).join("\n\n");
    }
    if ("value" in contents && typeof contents.value === "string") {
        return hoverMarkdownToPlainText(contents.value);
    }
    return "";
}

function markedStringToPlainText(value: LspMarkedString): string {
    if (typeof value === "string") {
        return hoverMarkdownToPlainText(value);
    }
    return hoverMarkdownToPlainText(value.value);
}

function hoverMarkdownToPlainText(value: string): string {
    return value
        .replace(/```[^\n`]*\n([\s\S]*?)```/g, (_, code: string) => code.trim())
        .replace(/`([^`\n]+)`/g, "$1")
        .replace(/\*\*([^*\n]+)\*\*/g, "$1")
        .replace(/\*([^*\n]+)\*/g, "$1")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

function normalizeAnalyzeResult(value: AnalyzeResult, version: number): AnalyzeResult {
    return {
        version: Number.isFinite(value.version) ? value.version : version,
        diagnostics: Array.isArray(value.diagnostics) ? value.diagnostics : [],
        hovers: Array.isArray(value.hovers) ? value.hovers : [],
    };
}

function emptyAnalysis(version: number): AnalyzeResult {
    return {
        version,
        diagnostics: [],
        hovers: [],
    };
}

function analysisFailure(version: number, error: unknown): AnalyzeResult {
    return {
        version,
        diagnostics: [
            {
                range: {
                    start: { line: 0, character: 0 },
                    end: { line: 0, character: 0 },
                },
                severity: 1,
                source: "pypie",
                message: errorMessage(error),
            },
        ],
        hovers: [],
    };
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
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
