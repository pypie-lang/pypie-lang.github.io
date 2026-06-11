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

TSC_BIN := node_modules/.bin/tsc
TSC := $(TSC_BIN)
TSC_FLAGS := --target ES2020 --lib DOM,ES2020 --module none --pretty false --skipLibCheck --noEmitOnError
ESBUILD_BIN := node_modules/.bin/esbuild
ESBUILD := $(ESBUILD_BIN)
ESBUILD_FLAGS := --bundle --format=iife --target=es2020 --outdir=playground/dist --entry-names=[name] --chunk-names=chunks/[name] --asset-names=assets/[name]

.PHONY: build compile-ts build-playground generate-site-html deps clean

build: compile-ts generate-site-html build-playground

compile-ts: $(TSC_BIN)
	$(TSC) $(TSC_FLAGS) $(TS_SOURCES)

build-playground: $(ESBUILD_BIN) $(PLAYGROUND_TS)
	$(ESBUILD) $(PLAYGROUND_TS) $(ESBUILD_FLAGS)

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
