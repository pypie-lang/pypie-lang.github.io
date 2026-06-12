LEARN_MAIN_TS := $(sort $(shell find learn -mindepth 2 -maxdepth 2 -name main.ts ! -path '* *'))
MANUAL_MAIN_TS := $(sort $(shell find manual -mindepth 2 -maxdepth 2 -name main.ts ! -path '* *'))
INSTALLATION_MAIN_TS := $(sort $(shell find installation -mindepth 1 -maxdepth 1 -name main.ts ! -path '* *' 2>/dev/null))
UPDATES_MAIN_TS := $(sort $(shell find updates -mindepth 2 -maxdepth 2 -name main.ts ! -path '* *' 2>/dev/null))
DEVELOPER_NOTES_MAIN_TS := $(sort $(shell find developer-notes -mindepth 1 -maxdepth 1 -name main.ts ! -path '* *' 2>/dev/null))
PLAYGROUND_TS := playground/main.ts playground/pyodide-worker.ts

TS_SOURCES := \
	code-types.ts \
	top-actions.ts \
	$(LEARN_MAIN_TS) \
	$(MANUAL_MAIN_TS) \
	$(INSTALLATION_MAIN_TS) \
	$(UPDATES_MAIN_TS) \
	$(DEVELOPER_NOTES_MAIN_TS)

GENERATED_JS := \
	code-types.js \
	top-actions.js \
	$(LEARN_MAIN_TS:.ts=.js) \
	$(MANUAL_MAIN_TS:.ts=.js) \
	$(INSTALLATION_MAIN_TS:.ts=.js) \
	$(UPDATES_MAIN_TS:.ts=.js) \
	$(DEVELOPER_NOTES_MAIN_TS:.ts=.js)

CLEAN_FILES := $(GENERATED_JS) site-manifest.js sitemap.xml robots.txt *.tsbuildinfo

SITE_CONFIG := site.config.js
SITE_TEMPLATE := templates/doc-page.html
SITE_GENERATOR := scripts/generate-site.js
SITE_CSS := assets/site.css

# Where the PyPie compiler checkout lives; `make playground-wheel` builds the
# wasm wheel there and copies it (plus its manifest) into playground/.
PYPIE_COMPILER_DIR ?= ../../pypie-compiler
PYODIDE_ARTIFACTS := $(PYPIE_COMPILER_DIR)/target/pyodide

TSC_BIN := node_modules/.bin/tsc
TSC := $(TSC_BIN)
TSC_FLAGS := --target ES2020 --lib DOM,ES2020 --module none --pretty false --skipLibCheck --noEmitOnError
ESBUILD_BIN := node_modules/.bin/esbuild
ESBUILD := $(ESBUILD_BIN)
ESBUILD_FLAGS := --bundle --target=es2020 --outdir=playground/dist --entry-names=[name] --chunk-names=chunks/[name] --asset-names=assets/[name]

.PHONY: build compile-ts build-playground playground-wheel generate-site-html deps clean

build: compile-ts generate-site-html build-playground

compile-ts: $(TSC_BIN)
	$(TSC) $(TSC_FLAGS) $(TS_SOURCES)

# main.js is a classic <script>; the worker is a module worker (Pyodide 314+
# only ships an ES-module core, which Firefox can only import there).
build-playground: $(ESBUILD_BIN) $(PLAYGROUND_TS)
	$(ESBUILD) playground/main.ts --format=iife $(ESBUILD_FLAGS)
	$(ESBUILD) playground/pyodide-worker.ts --format=esm $(ESBUILD_FLAGS)

# The wheel and manifest are committed so GitHub Pages can serve them; rerun
# this target (then commit the result) whenever the compiler changes.
playground-wheel:
	$(MAKE) -C "$(PYPIE_COMPILER_DIR)" pyodide-wheel
	rm -f playground/pypie_lang-*.whl
	cp "$(PYODIDE_ARTIFACTS)"/pypie_lang-*.whl playground/
	cp "$(PYODIDE_ARTIFACTS)"/pypie-wheel.json playground/

# Runs the committed wheel and playground examples under node (no browser).
test-playground: $(ESBUILD_BIN)
	$(ESBUILD) playground/tfjs-runtime.ts --bundle --format=esm --platform=neutral \
		--target=es2022 --outfile=playground/.smoke/tfjs-runtime.mjs
	node playground/smoke-test.mjs

generate-site-html: compile-ts $(SITE_GENERATOR) $(SITE_TEMPLATE) $(SITE_CONFIG) $(SITE_CSS)
	node $(SITE_GENERATOR)

deps: $(TSC_BIN) $(ESBUILD_BIN)

$(TSC_BIN): package-lock.json
	npm ci

$(ESBUILD_BIN): package-lock.json
	npm ci

clean:
	rm -f $(CLEAN_FILES)
	rm -rf playground/dist
