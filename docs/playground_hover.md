# Playground Diagnostics And Hover Plan

## Goal

Implement CodeMirror diagnostics and hover in the static PyPie playground without adding a second PyPie checker.

The playground should reuse the same analysis path as the native `pypie-lsp` server. The browser adapter should only translate PyPie/LSP analysis results into CodeMirror lint markers, diagnostics panel entries, and hover tooltips.

## Core Invariant

There must be one source of truth for PyPie analysis:

```text
PyPie parser/type analysis/LSP semantic collection
  -> native LSP diagnostics and hover
  -> browser playground diagnostics and hover
```

Do not parse traceback strings, duplicate type checking in TypeScript, or add a playground-only semantic checker.

## Step 0: Restore Playground Build Reproducibility

Before adding diagnostics or hover, make the current playground bundle reproducible.

1. Fix `make build-playground`, which currently fails while resolving TensorFlow.js imports.
2. Keep the build fix separate from diagnostics and hover work.
3. Validate with:

```bash
make build-playground
```

No editor feature work should depend on a stale generated bundle.

## Step 1: Extract Reusable PyPie Analysis

In `/Users/mvc/Documents/code/pypie-compiler`, put the browser/editor-facing adapter in an owned analysis module:

```text
src/lsp/analysis.rs
```

Expose one internal Rust entry point:

```rust
pub(crate) fn analyze_source_for_editor(
    source: &str,
    filename: &str,
    position_encoding: PositionEncodingKind,
) -> Result<EditorAnalysis>
```

Requirements:

1. Reuse the existing parse, type, diagnostic, semantic-info, and top-level-definition collection logic.
2. Keep `pypie-lsp` behavior unchanged.
3. Keep native `src/lsp/actions.rs` on the existing `analyze_document` path.
4. Add a small internal source helper in `src/lsp/actions.rs` only to feed `src/lsp/analysis.rs`.
5. Make the browser Python API call `src/lsp/analysis.rs`, which converts the shared `DocumentAnalysis` into serializable editor diagnostics and hovers.

No duplicate parsing or type-checking pipeline should be introduced.

## Step 2: Define Browser-Stable Analysis Types

Define serializable editor-facing analysis types that preserve LSP-compatible ranges and messages.

Suggested shape:

```rust
#[derive(Clone, Debug, Serialize)]
pub struct EditorAnalysis {
    pub diagnostics: Vec<Diagnostic>,
    pub hovers: Vec<EditorHover>,
}

#[derive(Clone, Debug, Serialize)]
pub struct EditorHover {
    pub range: Range,
    pub contents: HoverContents,
}
```

Use `lsp_types::Range`, `lsp_types::Diagnostic`, and `lsp_types::HoverContents` so the TypeScript adapter can stay mechanical.

Use `PositionEncodingKind::UTF16` for the browser-facing API. CodeMirror and browser strings use UTF-16 offsets, so this avoids a lossy conversion layer.

## Step 3: Add Pyodide-Facing Python API

Expose one Python function from the PyPie wheel:

```rust
#[pyfunction]
fn analyze_source_json(source: &str, filename: Option<&str>) -> PyResult<String>
```

Implementation:

```text
analyze_source_json
  -> analyze_source_for_editor(source, filename.unwrap_or("<playground>"), UTF16)
  -> serde_json::to_string(EditorAnalysis)
```

Rules:

1. Do not execute user code.
2. Do not import user modules dynamically.
3. Do not initialize TensorFlow.js.
4. Do not mutate the runtime execution namespace.
5. Return structured diagnostics and hover ranges only.

## Step 4: Add Worker Analysis Request

In `/Users/mvc/Documents/code/pypie-lang.github.io/playground/pyodide-worker.ts`, extend the worker protocol:

```ts
type RequestMessage = {
    id: number;
    type: "init" | "runSource" | "analyzeSource";
    payload?: Record<string, unknown>;
};
```

Add:

```ts
case "analyzeSource":
    await initRuntime();
    return analyzeSource(
        String(message.payload?.source || ""),
        Number(message.payload?.version || 0),
    );
```

Add:

```ts
async function analyzeSource(source: string, version: number): Promise<AnalyzeResult> {
    if (!pyodide) {
        throw new Error("Pyodide is not ready");
    }
    const json = await pyodide.runPythonAsync(`
import pypie
pypie.analyze_source_json(${JSON.stringify(source)}, "playground.py")
`);
    return {
        version,
        ...JSON.parse(String(json)),
    };
}
```

Do not call `loadPackagesFromImports` for analysis.

## Step 5: Add CodeMirror Dependencies

Add direct website dependencies:

```json
"@codemirror/lint": "...",
"@codemirror/view": "..."
```

Use:

```ts
import { linter, lintGutter } from "@codemirror/lint";
import { hoverTooltip } from "@codemirror/view";
```

CodeMirror references:

1. `@codemirror/lint` `linter`: https://codemirror.net/docs/ref/#lint.linter
2. `@codemirror/view` `hoverTooltip`: https://codemirror.net/docs/ref/#view.hoverTooltip

## Step 6: Add A Shared Analysis Client

In `playground/main.ts`, create one analysis client used by both lint and hover.

Suggested API:

```ts
class AnalysisClient {
    analyze(source: string, version: number): Promise<AnalyzeResult>;
    latest(): AnalyzeResult | null;
}
```

Responsibilities:

1. Send `analyzeSource` requests to the Pyodide worker.
2. Track monotonically increasing document versions.
3. Ignore stale worker responses.
4. Cache the latest successful analysis.
5. Share that cache with hover lookup.

This prevents the linter and hover tooltip from independently spamming Pyodide.

## Step 7: Implement CodeMirror Linter

Create:

```ts
function createPypieLinter(client: AnalysisClient)
```

It should:

```text
CodeMirror document
  -> client.analyze(source, version)
  -> map LSP diagnostics to CodeMirror diagnostics
```

Required helper functions:

```ts
function lspDiagnosticToCodeMirror(doc: Text, diagnostic: LspDiagnostic): CmDiagnostic;
function lspRangeToOffsets(doc: Text, range: LspRange): { from: number; to: number };
function lspPositionToOffset(doc: Text, position: LspPosition): number;
function lspSeverityToCodeMirror(severity?: number): "error" | "warning" | "info";
```

Add the linter and gutter to the editor extensions:

```ts
extensions: [
    basicSetup,
    python(),
    lintGutter(),
    createPypieLinter(analysisClient),
    createPypieHover(analysisClient),
    vimCompartment.of([]),
]
```

## Step 8: Implement CodeMirror Hover Tooltip

Create:

```ts
function createPypieHover(client: AnalysisClient)
```

Behavior:

1. Read the latest cached analysis.
2. Convert each hover LSP range to CodeMirror offsets.
3. Find the smallest range containing the hovered offset.
4. Return a CodeMirror tooltip.
5. Render content safely with `textContent`, not unsanitized `innerHTML`.

Suggested shape:

```ts
const pypieHover = hoverTooltip((view, pos) => {
    const analysis = client.latest();
    if (!analysis) {
        return null;
    }

    const match = findHoverAtOffset(view.state.doc, analysis.hovers, pos);
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
});
```

Required helper functions:

```ts
function findHoverAtOffset(doc: Text, hovers: EditorHover[], pos: number): HoverMatch | null;
function hoverContentsToPlainText(contents: LspHoverContents): string;
```

Markdown rendering can be added later with a sanitizer. The first implementation should prioritize correctness and safety.

## Step 9: Replace Fake Diagnostics Panel

The current diagnostics panel renders fixed messages such as `Run to see Python errors`, `Running`, and `No Python errors`.

Replace that with a panel driven by CodeMirror lint state:

```ts
function renderDiagnosticsFromEditor(view: EditorView): void
```

It should:

1. Read active diagnostics from CodeMirror lint state.
2. Set the diagnostics count to the actual number of diagnostics.
3. Render each diagnostic with range and message.
4. Render `No Python errors` only when the actual diagnostic set is empty.

Run-time errors should still appear in the output panel, but they should not pretend to be editor diagnostics unless they came from the analyzer.

## Step 10: Compiler Tests

Add focused compiler tests for the reusable analysis API.

Test cases:

1. Syntax error produces a diagnostic with a precise range.
2. Free variable or type error produces a PyPie diagnostic.
3. Hover over a local variable returns its inferred type.
4. Hover over a top-level op/model definition returns its type.
5. `analyze_source_json` serializes diagnostics and hovers.
6. Existing native LSP tests still pass.

Validation:

```bash
cargo test lsp --lib
cargo check --lib --bin pypie-lsp
```

## Step 11: Website Tests

Add browser/E2E coverage for the static playground.

Test cases:

1. Open `/playground/` and wait for runtime `Ready`.
2. Type invalid PyPie code without pressing Run.
3. Assert CodeMirror lint marker appears.
4. Assert diagnostics panel updates.
5. Hover over a typed symbol and assert tooltip contains PyPie type text.
6. Fix the code and assert diagnostics clear.
7. Run Baseline Line and assert learned parameters appear in output.
8. Stop/restart the worker and assert analysis resumes.

Validation:

```bash
make build-playground
python -m http.server 8000
```

Then run the browser automation test against:

```text
http://127.0.0.1:8000/playground/
```

## Do Not Do

1. Do not parse Python traceback strings into diagnostics.
2. Do not create a TypeScript PyPie checker.
3. Do not start `pypie-lsp` as a subprocess for GitHub Pages.
4. Do not run arbitrary user code for diagnostics or hover.
5. Do not render compiler-provided markdown with unsanitized `innerHTML`.
6. Do not let hover trigger full analysis on every mouse move.
7. Do not add a second semantic-info format unless the existing LSP types are proven insufficient.

## Expected Final Architecture

```text
main.ts
  CodeMirror editor
  AnalysisClient
  @codemirror/lint adapter
  hoverTooltip adapter
        |
        v
pyodide-worker.ts
  analyzeSource request
        |
        v
Pyodide + pypie wheel
  pypie.analyze_source_json(...)
        |
        v
pypie-compiler
  shared LSP analysis path
  diagnostics
  hover ranges
```

This architecture remains compatible with GitHub Pages because every component runs from static assets in the browser.
