#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const INSTALLATION_DIR = __dirname;
const TEMPLATE_PATH = path.join(INSTALLATION_DIR, "..", "manual", "chapter-template.html");
const OUTPUT_PATH = path.join(INSTALLATION_DIR, "index.html");

const escapeAttribute = (value) =>
    String(value)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

const renderPage = (
    template,
    { pageId, docTitle, assetRoot, sharedScriptSrc, mainScriptSrc }
) =>
    template
        .replace(/__MANUAL_PAGE_ID__/g, escapeAttribute(pageId))
        .replace(/__DOC_TITLE__/g, escapeAttribute(docTitle))
        .replace(/__ASSET_ROOT__/g, escapeAttribute(assetRoot))
        .replace(/__SHARED_SCRIPT_SRC__/g, escapeAttribute(sharedScriptSrc))
        .replace(/__MAIN_SCRIPT_SRC__/g, escapeAttribute(mainScriptSrc));

const run = () => {
    const template = fs.readFileSync(TEMPLATE_PATH, "utf8");
    const html = renderPage(template, {
        pageId: "installation",
        docTitle: "PyPie - Installation",
        assetRoot: "../",
        sharedScriptSrc: "../manual/manual-shared.js",
        mainScriptSrc: "main.js",
    });

    fs.writeFileSync(OUTPUT_PATH, html);
    process.stdout.write("Generated installation/index.html from the manual template.\n");
};

run();
