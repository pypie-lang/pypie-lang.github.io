// playground/tfjs-runtime.ts
var TFJS_VERSION = "4.22.0";
var TFJS_SCRIPT_URL = `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@${TFJS_VERSION}/dist/tf.min.js`;
var TFJS_WEBGL_SCRIPT_URL = `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl@${TFJS_VERSION}/dist/tf-backend-webgl.min.js`;
var TFJS_WASM_SCRIPT_URL = `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${TFJS_VERSION}/dist/tf-backend-wasm.min.js`;
var TFJS_WASM_PATH = `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${TFJS_VERSION}/dist/`;
var TFJS_BACKEND_CANDIDATES = ["webgl", "wasm"];
var initPromise = null;
var loadedBackendScripts = /* @__PURE__ */ new Set();
function initTfjsRuntime() {
  if (!initPromise) {
    initPromise = (async () => {
      await loadUmdScript(TFJS_SCRIPT_URL);
      await selectBackend();
      self.__pypieRunTfjsSync = runTfjsSync;
      return `TFJS ${tf.getBackend().toUpperCase()}`;
    })();
  }
  return initPromise;
}
async function loadUmdScript(url) {
  await import(
    /* @vite-ignore */
    url
  );
}
async function selectBackend() {
  const failures = [];
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
async function loadBackendScript(backend) {
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
function runTfjsSync(payload) {
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
function execute(payload) {
  const factory = new Function("tf", payload.runtimeSource);
  const entry = factory(tf);
  if (typeof entry !== "function") {
    throw new Error("Generated TensorFlow.js runtime source did not return an entrypoint");
  }
  const args = payload.inputs.map((input) => materializeValue(input.schema, input.value));
  const result = entry(tf, ...args);
  return { result, args };
}
function materializeValue(schema, value) {
  switch (schema.kind) {
    case "tensor":
      return tf.tensor(value, schema.shape, schema.dtype);
    case "scalar":
      return tf.scalar(value, schema.dtype);
    case "tuple":
      return schema.elems.map((elem, index) => materializeValue(elem, value[index]));
    case "list":
      return value.map((item) => materializeValue(schema.elem, item));
    case "record": {
      const out = {};
      for (const [key, fieldSchema] of Object.entries(schema.fields)) {
        out[key] = materializeValue(fieldSchema, value[key]);
      }
      return out;
    }
    case "value":
      return value;
  }
}
function serializeResult(value) {
  if (value instanceof tf.Tensor) {
    return {
      __pypieTensor: true,
      dtype: value.dtype,
      shape: value.shape,
      value: value.arraySync()
    };
  }
  if (Array.isArray(value)) {
    return value.map(serializeResult);
  }
  if (value && typeof value === "object") {
    const out = {};
    for (const [key, child] of Object.entries(value)) {
      out[key] = serializeResult(child);
    }
    return out;
  }
  return value;
}
function dispose(value) {
  if (value instanceof tf.Tensor) {
    value.dispose();
  } else if (Array.isArray(value)) {
    value.forEach(dispose);
  } else if (value && typeof value === "object") {
    Object.values(value).forEach(dispose);
  }
}
function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

// playground/pyodide-worker.ts
var WORKER_URL = self.location.href;
var WORKER_CACHE_BUSTER = new URL(WORKER_URL).searchParams.get("v");
var WHEEL_MANIFEST_URL = new URL("../pypie-wheel.json", WORKER_URL).href;
var initPromise2 = null;
var pyodide = null;
var stdoutBuffer = [];
var stderrBuffer = [];
self.addEventListener("message", (event) => {
  const message = event.data;
  void handleMessage(message).then((result) => {
    self.postMessage({ id: message.id, ok: true, result });
  }).catch((error) => {
    self.postMessage({ id: message.id, ok: false, error: errorMessage2(error) });
  });
});
async function handleMessage(message) {
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
        Number(message.payload?.version || 0)
      );
  }
}
function initRuntime() {
  if (!initPromise2) {
    initPromise2 = loadRuntime();
  }
  return initPromise2;
}
async function loadRuntime() {
  const manifest = await loadWheelManifest();
  const pyodideIndexUrl = `https://cdn.jsdelivr.net/pyodide/v${manifest.pyodideVersion}/full/`;
  const { loadPyodide } = await import(`${pyodideIndexUrl}pyodide.mjs`);
  pyodide = await loadPyodide({ indexURL: pyodideIndexUrl });
  pyodide.setStdout({
    batched: (text) => {
      stdoutBuffer.push(text);
    }
  });
  pyodide.setStderr({
    batched: (text) => {
      stderrBuffer.push(text);
    }
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
      `The PyPie wasm wheel failed to install from ${wheelUrl.href}: ${errorMessage2(error)}. Rebuild it with \`make test playground\` from the repository root.`
    );
  }
  return { status: "Ready", backend };
}
async function loadWheelManifest() {
  let manifest = null;
  try {
    const response = await fetch(WHEEL_MANIFEST_URL, { cache: "no-store" });
    if (response.ok) {
      manifest = await response.json();
    }
  } catch {
  }
  if (manifest?.pyodideVersion && manifest?.wheel) {
    return { pyodideVersion: manifest.pyodideVersion, wheel: manifest.wheel };
  }
  throw new Error(
    `The PyPie wheel manifest is missing or invalid at ${WHEEL_MANIFEST_URL}. Run \`make test playground\` from the repository root to build the wasm wheel.`
  );
}
async function analyzeSource(source, version) {
  if (!pyodide) {
    throw new Error("Pyodide is not ready");
  }
  const rawResult = await pyodide.runPythonAsync(`
import pypie
pypie.analyze_source_json(${JSON.stringify(source)}, "playground.py")
`);
  const result = JSON.parse(String(rawResult));
  return {
    version,
    diagnostics: Array.isArray(result.diagnostics) ? result.diagnostics : [],
    hovers: Array.isArray(result.hovers) ? result.hovers : []
  };
}
async function runSource(source) {
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
    result: null
  };
}
function errorMessage2(error) {
  return error instanceof Error ? error.message : String(error);
}
