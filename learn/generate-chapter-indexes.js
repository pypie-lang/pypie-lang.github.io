#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const LEARN_DIR = __dirname;
const TEMPLATE_PATH = path.join(LEARN_DIR, "chapter-template.html");

const PAGE_ID_OVERRIDES = {
    overview: "prelude",
};

const escapeAttribute = (value) =>
    String(value)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

const getChapterFolders = () => {
    const entries = fs.readdirSync(LEARN_DIR, { withFileTypes: true });
    return entries
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .filter((folder) => fs.existsSync(path.join(LEARN_DIR, folder, "main.ts")))
        .sort();
};

const renderPage = (template, pageId) =>
    template.replace(/__LEARN_PAGE_ID__/g, escapeAttribute(pageId));

const run = () => {
    const template = fs.readFileSync(TEMPLATE_PATH, "utf8");
    const folders = getChapterFolders();

    if (folders.length === 0) {
        throw new Error("No learn chapter folders found (expected folders with main.ts)");
    }

    folders.forEach((folder) => {
        const pageId = PAGE_ID_OVERRIDES[folder] || folder;
        const outputPath = path.join(LEARN_DIR, folder, "index.html");
        const html = renderPage(template, pageId);
        fs.writeFileSync(outputPath, html);
    });

    process.stdout.write(`Generated ${folders.length} learn chapter pages from template.\n`);
};

run();
