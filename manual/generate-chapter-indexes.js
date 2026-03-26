#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const MANUAL_DIR = __dirname;
const TEMPLATE_PATH = path.join(MANUAL_DIR, "chapter-template.html");
const CHAPTER_FOLDER_PATTERN = /^[a-z0-9_-]+$/;

const escapeAttribute = (value) =>
    String(value)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

const getChapterFolders = () => {
    const entries = fs.readdirSync(MANUAL_DIR, { withFileTypes: true });
    return entries
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .filter((folder) => CHAPTER_FOLDER_PATTERN.test(folder))
        .filter((folder) => fs.existsSync(path.join(MANUAL_DIR, folder, "main.ts")))
        .sort();
};

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
    const folders = getChapterFolders();

    if (folders.length === 0) {
        throw new Error("No manual chapter folders found (expected folders with main.ts)");
    }

    folders.forEach((folder) => {
        const outputPath = path.join(MANUAL_DIR, folder, "index.html");
        const html = renderPage(template, {
            pageId: folder,
            docTitle: "PyPie - Language Reference",
            assetRoot: "../../",
            sharedScriptSrc: "../manual-shared.js",
            mainScriptSrc: "main.js",
        });
        fs.writeFileSync(outputPath, html);
    });

    process.stdout.write(`Generated ${folders.length} manual chapter pages from template.\n`);
};

run();
