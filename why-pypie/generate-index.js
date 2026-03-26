#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const WHY_PYPIE_DIR = __dirname;
const TEMPLATE_PATH = path.join(WHY_PYPIE_DIR, "..", "manual", "chapter-template.html");
const OUTPUT_PATH = path.join(WHY_PYPIE_DIR, "index.html");
const BENCHMARKS_PATH = path.join(WHY_PYPIE_DIR, "..", "benchmarks");

const escapeAttribute = (value) =>
    String(value)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

const escapeScriptText = (value) =>
    String(value)
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e")
        .replace(/&/g, "\\u0026");

const renderPage = (
    template,
    { pageId, docTitle, assetRoot, sharedScriptSrc, mainScriptSrc, benchmarkDataJson }
) =>
    template
        .replace(/__MANUAL_PAGE_ID__/g, escapeAttribute(pageId))
        .replace(/__DOC_TITLE__/g, escapeAttribute(docTitle))
        .replace(/__ASSET_ROOT__/g, escapeAttribute(assetRoot))
        .replace(/__SHARED_SCRIPT_SRC__/g, escapeAttribute(sharedScriptSrc))
        .replace(
            /<script src="__MAIN_SCRIPT_SRC__"><\/script>/,
            `<script id="why-pypie-benchmarks-data" type="application/json">${escapeScriptText(
                benchmarkDataJson
            )}</script>\n    <script src="${escapeAttribute(mainScriptSrc)}"></script>`
        );

const run = () => {
    const template = fs.readFileSync(TEMPLATE_PATH, "utf8");
    const benchmarkData = JSON.parse(fs.readFileSync(BENCHMARKS_PATH, "utf8"));
    const html = renderPage(template, {
        pageId: "why-pypie",
        docTitle: "PyPie - Why PyPie?",
        assetRoot: "../",
        sharedScriptSrc: "../manual/manual-shared.js",
        mainScriptSrc: "main.js",
        benchmarkDataJson: JSON.stringify(benchmarkData),
    });

    fs.writeFileSync(OUTPUT_PATH, html);
    process.stdout.write("Generated why-pypie/index.html from the manual template.\n");
};

run();
