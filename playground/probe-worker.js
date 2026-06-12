// Temporary diagnostic worker: runs each runtime-init step separately and
// reports progress/failures back to the page. Delete me.
const report = (msg) => self.postMessage(String(msg));

(async () => {
    try {
        const manifest = await (await fetch(new URL("./pypie-wheel.json", self.location.href).href)).json();
        report("STEP manifest ok " + JSON.stringify(manifest));
        const indexUrl = `https://cdn.jsdelivr.net/pyodide/v${manifest.pyodideVersion}/full/`;
        try {
            importScripts(`${indexUrl}pyodide.js`);
            report("STEP importScripts(pyodide.js) ok, loadPyodide=" + typeof loadPyodide);
        } catch (e) {
            report("STEP importScripts(pyodide.js) FAIL " + e.name + ": " + e.message);
            throw e;
        }
        try {
            importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js");
            report("STEP importScripts(tf.js) ok");
        } catch (e) {
            report("STEP importScripts(tf.js) FAIL " + e.name + ": " + e.message);
        }
        const pyodide = await loadPyodide({ indexURL: indexUrl });
        report("STEP loadPyodide ok, version=" + pyodide.version);
        await pyodide.loadPackage(["micropip", "numpy"]);
        report("STEP loadPackage ok");
        report("DONE");
    } catch (e) {
        report("PROBE_FAIL " + (e && e.message ? e.name + ": " + e.message : String(e)));
    }
})();
