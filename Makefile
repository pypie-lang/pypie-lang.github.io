LEARN_MAIN_TS := $(sort $(shell find learn -mindepth 2 -maxdepth 2 -name main.ts ! -path '* *'))
MANUAL_MAIN_TS := $(sort $(shell find manual -mindepth 2 -maxdepth 2 -name main.ts ! -path '* *'))
INSTALLATION_MAIN_TS := $(sort $(shell find installation -mindepth 1 -maxdepth 1 -name main.ts ! -path '* *' 2>/dev/null))
WHY_PYPIE_MAIN_TS := $(sort $(shell find why-pypie -mindepth 1 -maxdepth 1 -name main.ts ! -path '* *' 2>/dev/null))
DEVELOPER_NOTES_MAIN_TS := $(sort $(shell find developer-notes -mindepth 1 -maxdepth 1 -name main.ts ! -path '* *' 2>/dev/null))

TS_SOURCES := \
	code-types.ts \
	top-actions.ts \
	learn/learn-shared.ts \
	manual/manual-shared.ts \
	$(LEARN_MAIN_TS) \
	$(MANUAL_MAIN_TS) \
	$(INSTALLATION_MAIN_TS) \
	$(WHY_PYPIE_MAIN_TS) \
	$(DEVELOPER_NOTES_MAIN_TS)

GENERATED_JS := \
	code-types.js \
	top-actions.js \
	learn/learn-shared.js \
	manual/manual-shared.js \
	$(LEARN_MAIN_TS:.ts=.js) \
	$(MANUAL_MAIN_TS:.ts=.js) \
	$(INSTALLATION_MAIN_TS:.ts=.js) \
	$(WHY_PYPIE_MAIN_TS:.ts=.js) \
	$(DEVELOPER_NOTES_MAIN_TS:.ts=.js)

CLEAN_FILES := $(GENERATED_JS) *.tsbuildinfo

LEARN_TEMPLATE := learn/chapter-template.html
LEARN_TEMPLATE_GENERATOR := learn/generate-chapter-indexes.js
MANUAL_TEMPLATE := manual/chapter-template.html
MANUAL_TEMPLATE_GENERATOR := manual/generate-chapter-indexes.js
INSTALLATION_TEMPLATE := manual/chapter-template.html
INSTALLATION_TEMPLATE_GENERATOR := installation/generate-index.js
WHY_PYPIE_TEMPLATE := manual/chapter-template.html
WHY_PYPIE_TEMPLATE_GENERATOR := why-pypie/generate-index.js

TSC_BIN := node_modules/.bin/tsc
TSC := $(TSC_BIN)
TSC_FLAGS := --target ES2020 --lib DOM,ES2020 --module none --pretty false --skipLibCheck --noEmitOnError

.PHONY: build compile-ts generate-learn-html generate-manual-html generate-installation-html generate-why-pypie-html generate-developer-notes-html deps clean

build: generate-learn-html generate-manual-html generate-installation-html generate-why-pypie-html generate-developer-notes-html compile-ts

compile-ts: $(TSC_BIN)
	$(TSC) $(TSC_FLAGS) $(TS_SOURCES)

generate-learn-html: $(LEARN_TEMPLATE_GENERATOR) $(LEARN_TEMPLATE)
	node $(LEARN_TEMPLATE_GENERATOR)

generate-manual-html: $(MANUAL_TEMPLATE_GENERATOR) $(MANUAL_TEMPLATE)
	node $(MANUAL_TEMPLATE_GENERATOR)

generate-installation-html: $(INSTALLATION_TEMPLATE_GENERATOR) $(INSTALLATION_TEMPLATE)
	node $(INSTALLATION_TEMPLATE_GENERATOR)

generate-why-pypie-html: $(WHY_PYPIE_TEMPLATE_GENERATOR) $(WHY_PYPIE_TEMPLATE)
	node $(WHY_PYPIE_TEMPLATE_GENERATOR)

deps: $(TSC_BIN)

$(TSC_BIN): package-lock.json
	npm ci

clean:
	rm -f $(CLEAN_FILES)
