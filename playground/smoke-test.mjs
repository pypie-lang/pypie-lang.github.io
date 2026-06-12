// End-to-end smoke test for the playground runtime, no browser required.
//
// Loads Pyodide under node, installs the committed PyPie wasm wheel, wires
// the real tfjs-runtime (bundled by `make test-playground`) to a node tf.js
// backend, and runs every playground example through pypie.browser.run_source
// — the same path the worker uses.
//
// Run with: make test-playground

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as tf from "@tensorflow/tfjs";
import { loadPyodide } from "pyodide";

import { runTfjsSync } from "./.smoke/tfjs-runtime.mjs";

const playgroundDir = dirname(fileURLToPath(import.meta.url));

function fail(message) {
    console.error(`FAIL: ${message}`);
    process.exit(1);
}

const manifest = JSON.parse(readFileSync(join(playgroundDir, "pypie-wheel.json"), "utf8"));
if (!manifest.pyodideVersion || !manifest.wheel) {
    fail("pypie-wheel.json is missing pyodideVersion or wheel; run `make playground-wheel`");
}

await tf.setBackend("cpu");
await tf.ready();
// tfjs-runtime resolves `tf` from the global scope (the worker loads it via
// importScripts); mirror that here.
globalThis.tf = tf;
globalThis.__pypieRunTfjsSync = runTfjsSync;

const stdout = [];
const stderr = [];
const pyodide = await loadPyodide({
    stdout: (text) => stdout.push(text),
    stderr: (text) => stderr.push(text),
});
if (pyodide.version !== manifest.pyodideVersion) {
    console.warn(
        `WARNING: node pyodide ${pyodide.version} differs from manifest pyodideVersion ` +
            `${manifest.pyodideVersion}; update the pyodide devDependency to match.`,
    );
}

await pyodide.loadPackage(["micropip", "numpy"], { messageCallback: () => {} });
pyodide.FS.writeFile(`/tmp/${manifest.wheel}`, readFileSync(join(playgroundDir, manifest.wheel)));
await pyodide.runPythonAsync(`
import micropip
await micropip.install("emfs:/tmp/${manifest.wheel}", deps=False)
`);

const analysis = await pyodide.runPythonAsync(`
import pypie
pypie.analyze_source_json("x = 1", "playground.py")
`);
if (!JSON.parse(analysis).hasOwnProperty("diagnostics")) {
    fail("pypie.analyze_source_json returned no diagnostics field");
}
console.log("PASS analyze_source_json");

const examples = readdirSync(join(playgroundDir, "examples")).filter((name) => name.endsWith(".py"));
if (examples.length === 0) {
    fail("no playground examples found");
}
for (const example of examples) {
    const source = readFileSync(join(playgroundDir, "examples", example), "utf8");
    stdout.length = 0;
    stderr.length = 0;
    const startedAt = Date.now();
    try {
        await pyodide.runPythonAsync(`
import pypie.browser
pypie.browser.run_source(${JSON.stringify(source)})
`);
    } catch (error) {
        console.error(stderr.join("\n"));
        fail(`examples/${example} raised: ${error}`);
    }
    if (stdout.length === 0) {
        fail(`examples/${example} produced no output`);
    }
    console.log(`PASS examples/${example} (${((Date.now() - startedAt) / 1000).toFixed(1)}s)`);
    console.log(stdout.map((line) => `  | ${line}`).join("\n"));
}

console.log("Playground smoke test passed.");
process.exit(0);
