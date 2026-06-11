#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const site = require("../site.config.js");

const ROOT = path.resolve(__dirname, "..");
const TEMPLATE_PATH = path.join(ROOT, "templates", "doc-page.html");
const CODE_TYPES_PATH = path.join(ROOT, "code-types.js");
const MANIFEST_PATH = path.join(ROOT, "site-manifest.js");
const SITEMAP_PATH = path.join(ROOT, "sitemap.xml");
const ROBOTS_PATH = path.join(ROOT, "robots.txt");

const BRAND_MARK_SVG =
    '<svg class="brand__mark" viewBox="0 0 64 64" aria-hidden="true">' +
    '<path d="M32 34 L54.5 21 A26 26 0 1 1 32 8 Z" fill="#2aa198"/>' +
    '<path d="M35 29 L35 3 A26 26 0 0 1 57.5 16 Z" fill="#b58900"/></svg>';

const THEME_TOGGLE_ICONS =
    '<svg class="theme-toggle__sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
    '<circle cx="12" cy="12" r="4.4"/>' +
    '<path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.3 5.3l1.7 1.7M17 17l1.7 1.7M18.7 5.3L17 7M7 17l-1.7 1.7"/></svg>' +
    '<svg class="theme-toggle__moon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
    '<path d="M20.6 14.6A8.7 8.7 0 0 1 9.4 3.4 8.9 8.9 0 1 0 20.6 14.6Z"/></svg>';

const toPosix = (value) => String(value).replace(/\\/g, "/");
const rootPath = (...parts) => path.join(ROOT, ...parts);

const escapeHtml = (value) =>
    String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

const escapeAttribute = (value) =>
    escapeHtml(value)
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

const stripMarkup = (value) =>
    String(value ?? "")
        .replace(/```([\s\S]*?)```/g, "$1")
        .replace(/!!([^!\n]+)!!/g, "$1")
        .replace(/`([^`\n]+)`/g, "$1")
        .replace(/\[([^\]\n]+)\]\(([^)\n]+)\)/g, "$1")
        .replace(/\s+/g, " ")
        .trim();

const truncateDescription = (value) => {
    const text = stripMarkup(value);
    if (text.length <= 155) {
        return text;
    }
    return `${text.slice(0, 152).trimEnd()}...`;
};

const normalizeDomIdToken = (value) =>
    String(value || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, "-")
        .replace(/^-+|-+$/g, "");

const isSafeLinkHref = (href) => {
    const normalizedHref = String(href || "").trim();
    if (!normalizedHref) {
        return false;
    }

    const lowerHref = normalizedHref.toLowerCase();
    return !(
        lowerHref.startsWith("javascript:") ||
        lowerHref.startsWith("data:") ||
        lowerHref.startsWith("vbscript:")
    );
};

const isExternalHref = (href) => /^[a-z][a-z0-9+.-]*:/i.test(String(href || ""));

const relativeHref = (fromSlug, toSlug) => {
    if (isExternalHref(toSlug) || String(toSlug).startsWith("/")) {
        return toSlug;
    }
    const fromDir = path.posix.dirname(toPosix(fromSlug));
    const relative = toPosix(path.posix.relative(fromDir, toPosix(toSlug)));
    return relative || path.posix.basename(toSlug);
};

const pageAssetHref = (page, assetPath) => {
    if (!isSafeLinkHref(assetPath)) {
        return "";
    }
    if (isExternalHref(assetPath) || String(assetPath).startsWith("/")) {
        return assetPath;
    }
    const sectionRoot = toPosix(page.slug).split("/")[0];
    return relativeHref(page.slug, path.posix.join(sectionRoot, assetPath));
};

const getSectionEntries = () => Object.entries(site.sections || {});

const getPageRecords = () =>
    getSectionEntries().flatMap(([sectionId, section]) =>
        (section.pages || []).map((page, index) => ({
            sectionId,
            section,
            page,
            index,
        }))
    );

const getSectionFirstPage = (sectionId) => {
    const section = site.sections?.[sectionId];
    return section?.pages?.[0] || null;
};

const getTopNavTargets = () =>
    (site.nav || []).map((item) => {
        const page = item.section ? getSectionFirstPage(item.section) : null;
        return {
            label: item.label,
            section: item.section || "",
            href: item.href || page?.slug || "index.html",
        };
    });

const pageNavTitle = (section, page, index) => {
    if (page.navTitle) {
        return page.navTitle;
    }
    if (section.numbered) {
        return `${index}. ${page.title}`;
    }
    return page.title;
};

const renderTopActions = (currentSlug, currentSectionId = "") => {
    const homeHref = relativeHref(currentSlug, "index.html");
    const navLinks = getTopNavTargets()
        .map((item) => {
            const href = relativeHref(currentSlug, item.href);
            const currentAttr = item.section === currentSectionId ? ' aria-current="page"' : "";
            return `<a href="${escapeAttribute(href)}"${currentAttr}>${escapeHtml(item.label)}</a>`;
        })
        .join("");

    return (
        `<header class="site-header"><div class="site-header__inner">` +
        `<a class="brand" href="${escapeAttribute(homeHref)}">${BRAND_MARK_SVG}<span class="brand__name">${escapeHtml(
            site.title
        )}</span></a>` +
        `<nav class="site-nav" aria-label="Site">${navLinks}</nav>` +
        `<button class="theme-toggle" type="button" aria-label="Toggle color theme" title="Toggle color theme">${THEME_TOGGLE_ICONS}</button>` +
        `</div></header>`
    );
};

const renderSiteFooter = (currentSlug) => {
    const homeHref = relativeHref(currentSlug, "index.html");
    const navLinks = getTopNavTargets()
        .map(
            (item) =>
                `<a href="${escapeAttribute(relativeHref(currentSlug, item.href))}">${escapeHtml(
                    item.label
                )}</a>`
        )
        .join("");

    return (
        `<footer class="site-footer"><div class="site-footer__inner">` +
        `<a class="brand" href="${escapeAttribute(homeHref)}">${BRAND_MARK_SVG}<span class="brand__name">${escapeHtml(
            site.title
        )}</span></a>` +
        `<nav class="site-footer__nav" aria-label="Footer">${navLinks}</nav>` +
        `<p class="site-footer__note">${escapeHtml(site.tagline || site.description)}</p>` +
        `</div></footer>`
    );
};

const canonicalUrl = (slug) => {
    const baseUrl = String(site.url || "").replace(/\/+$/, "");
    const cleanPath = toPosix(slug).replace(/(^|\/)index\.html$/, "$1");
    return `${baseUrl}/${cleanPath}`;
};

const renderDocPager = (record) => {
    const pages = record.section.pages || [];
    const prev = pages[record.index - 1] || null;
    const next = pages[record.index + 1] || null;
    if (!prev && !next) {
        return "";
    }

    const renderLink = (page, index, direction) =>
        `<a class="doc-pager__link doc-pager__link--${direction}" href="${escapeAttribute(
            relativeHref(record.page.slug, page.slug)
        )}" rel="${direction}"><span class="doc-pager__label">${
            direction === "prev" ? "Previous" : "Next"
        }</span><span class="doc-pager__title">${escapeHtml(
            pageNavTitle(record.section, page, index)
        )}</span></a>`;

    const prevLink = prev ? renderLink(prev, record.index - 1, "prev") : "";
    const nextLink = next ? renderLink(next, record.index + 1, "next") : "";
    return `<nav class="doc-pager" aria-label="Adjacent pages">${prevLink}${nextLink}</nav>`;
};

const renderDocNav = (record) => {
    const { section, page: currentPage, sectionId } = record;
    const links = (section.pages || [])
        .map((page, index) => {
            const href = relativeHref(currentPage.slug, page.slug);
            const currentAttr = page.id === currentPage.id ? ' aria-current="page"' : "";
            return `<a href="${escapeAttribute(href)}"${currentAttr}>${escapeHtml(
                pageNavTitle(section, page, index)
            )}</a>`;
        })
        .join("");

    return `<div class="doc-nav__title">${escapeHtml(section.title || sectionId)}</div>${links}`;
};

const trimFenceEdgeNewlines = (text) => {
    let value = String(text || "");
    if (value.startsWith("\n")) {
        value = value.slice(1);
    }
    if (value.endsWith("\n")) {
        value = value.slice(0, -1);
    }
    return value;
};

const formatBoldText = (text) => String(text || "").replace(/!!([^!\n]+)!!/g, "<strong>$1</strong>");

const formatInlineLinks = (text, linkClass) =>
    String(text || "").replace(/\[([^\]\n]+)\]\(([^)\n]+)\)/g, (fullMatch, label, href) => {
        const safeHref = String(href || "").trim();
        if (!isSafeLinkHref(safeHref)) {
            return fullMatch;
        }

        return `<a class="${linkClass}" href="${escapeAttribute(safeHref)}">${label}</a>`;
    });

const formatInlineCode = (text, linkClass) => {
    const source = String(text || "");
    if (!source) {
        return "";
    }

    const codeSegments = [];
    const tokenized = source.replace(/`([^`\n]+)`/g, (_match, code) => {
        const token = `__PYPIE_CODE_TOKEN_${codeSegments.length}__`;
        codeSegments.push(`<code>${escapeHtml(code)}</code>`);
        return token;
    });

    const escaped = escapeHtml(tokenized);
    const withBold = formatBoldText(escaped);
    const withLinks = formatInlineLinks(withBold, linkClass);
    return withLinks.replace(/__PYPIE_CODE_TOKEN_(\d+)__/g, (_match, indexText) => {
        const index = Number(indexText);
        return codeSegments[index] || "";
    });
};

const normalizeKeyword = (keyword) =>
    String(keyword || "")
        .trim()
        .replace(/`([^`\n]+)`/g, "$1")
        .replace(/`/g, "")
        .replace(/\s+/g, " ");

const collectKeywordsFromText = (text) => {
    const keywords = new Set();
    const keywordRegex = /!!([^!\n]+)!!/g;
    let match = null;

    while ((match = keywordRegex.exec(String(text || ""))) !== null) {
        const keyword = normalizeKeyword(String(match[1] || ""));
        if (keyword) {
            keywords.add(keyword);
        }
    }

    return keywords;
};

const mergeKeywordSets = (target, source) => {
    source.forEach((keyword) => target.add(keyword));
};

const sortKeywords = (keywords) =>
    Array.from(keywords).sort((left, right) =>
        left.localeCompare(right, undefined, { sensitivity: "base" })
    );

const renderKeywordList = (keywords, keywordTargets) => {
    const sortedKeywords = sortKeywords(keywords);
    if (sortedKeywords.length === 0) {
        return "";
    }

    return sortedKeywords
        .map((keyword) => {
            const targetId = keywordTargets.get(keyword);
            if (!targetId) {
                return `<li class="keyword-panel__item"><code>${escapeHtml(keyword)}</code></li>`;
            }

            return `<li class="keyword-panel__item"><a class="keyword-panel__link" href="#${escapeAttribute(
                targetId
            )}"><code>${escapeHtml(keyword)}</code></a></li>`;
        })
        .join("");
};

const renderTextParagraphs = (text, paragraphClass, linkClass) =>
    String(text || "")
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.trim())
        .filter((paragraph) => paragraph.length > 0)
        .map((paragraph) => {
            const body = paragraph
                .split("\n")
                .map((line) => formatInlineCode(line, linkClass))
                .join("<br>");
            return `<p class="${paragraphClass}">${body}</p>`;
        })
        .join("");

const renderRichText = (text, options) => {
    const source = String(text || "");
    if (!source) {
        return {
            html: "",
            keywords: new Set(),
        };
    }

    const fenceRegex = /```([\s\S]*?)```/g;
    const segments = [];
    let cursor = 0;
    let match = null;

    while ((match = fenceRegex.exec(source)) !== null) {
        if (match.index > cursor) {
            segments.push({ kind: "text", value: source.slice(cursor, match.index) });
        }
        segments.push({ kind: "code", value: trimFenceEdgeNewlines(match[1]) });
        cursor = fenceRegex.lastIndex;
    }

    if (cursor < source.length) {
        segments.push({ kind: "text", value: source.slice(cursor) });
    }

    const keywords = new Set();
    const html = segments
        .map((segment) => {
            if (segment.kind === "code") {
                return `<pre class="doc-code ${options.fencedCodeClass}" data-code-ignore="true"><code>${escapeHtml(
                    segment.value
                )}</code></pre>`;
            }
            mergeKeywordSets(keywords, collectKeywordsFromText(segment.value));
            return renderTextParagraphs(segment.value, options.paragraphClass, options.linkClass);
        })
        .join("");

    return {
        html,
        keywords,
    };
};

const renderNotesText = (text) =>
    renderTextParagraphs(text, "lesson-chat__intro", "chat-bubble__link");

const createCodeRenderer = () => {
    const codeTypesSource = fs.readFileSync(CODE_TYPES_PATH, "utf8");
    const elements = new Map();
    const fakeDocument = {
        querySelector(selector) {
            return elements.get(selector) || null;
        },
        querySelectorAll() {
            return [];
        },
        addEventListener() {},
        fonts: {
            ready: Promise.resolve(),
        },
    };
    const fakeWindow = {
        document: fakeDocument,
        addEventListener() {},
    };
    const context = {
        window: fakeWindow,
        document: fakeDocument,
        console,
        requestAnimationFrame(callback) {
            if (typeof callback === "function") {
                callback();
            }
        },
    };

    vm.createContext(context);
    vm.runInContext(codeTypesSource, context, { filename: CODE_TYPES_PATH });

    if (!fakeWindow.PYPIE_AST || typeof fakeWindow.PYPIE_SET_BLOCKS !== "function") {
        throw new Error("code-types.js did not expose the expected AST renderer API");
    }

    let nextId = 0;
    const renderBlock = (block) => {
        const selector = `.build-code-${nextId++}`;
        const element = { innerHTML: "" };
        elements.set(selector, element);
        fakeWindow.PYPIE_SET_BLOCKS([{ selector, block }]);
        elements.delete(selector);
        return element.innerHTML;
    };

    return {
        ast: fakeWindow.PYPIE_AST,
        renderBlock,
    };
};

const loadPageConfig = (record) => {
    const sourcePath = rootPath(record.page.source);
    const source = fs.readFileSync(sourcePath, "utf8");
    let captured = null;
    const fakeWindow = {
        PYPIE_LEARN_RENDER(config) {
            captured = { kind: "learn", config };
        },
        PYPIE_MANUAL_RENDER(config) {
            captured = { kind: "manual", config };
        },
    };
    const context = {
        window: fakeWindow,
        console,
    };

    vm.createContext(context);
    vm.runInContext(source, context, { filename: sourcePath });

    if (!captured) {
        throw new Error(`No page config was rendered by ${record.page.source}`);
    }

    return captured;
};

const getDialogCodeClass = (pageId, index) => `chat-code-${pageId}-${index}`;

const getDialogBubbleId = (pageId, index) => {
    const normalizedPageId = normalizeDomIdToken(pageId) || "learn";
    return `chat-bubble-${normalizedPageId}-${index + 1}`;
};

const renderDialog = (dialog = [], page, codeRenderer) => {
    const keywords = new Set();
    const keywordTargets = new Map();
    const pageId = page.id;
    const html = dialog
        .map((message, index) => {
            const side = message.side === "right" ? "right" : "left";
            const bubbleNumber = `<span class="chat-bubble__index">${index + 1}</span>`;
            const bubbleId = getDialogBubbleId(pageId, index);
            const speaker = message.speaker
                ? `<p class="chat-bubble__speaker">${escapeHtml(message.speaker)}</p>`
                : "";
            const renderedText = message.text
                ? renderRichText(message.text, {
                      paragraphClass: "chat-bubble__text",
                      linkClass: "chat-bubble__link",
                      fencedCodeClass: "chat-bubble__fenced-code",
                  })
                : null;
            const renderedTextAfterCode = message.textAfterCode
                ? renderRichText(message.textAfterCode, {
                      paragraphClass: "chat-bubble__text",
                      linkClass: "chat-bubble__link",
                      fencedCodeClass: "chat-bubble__fenced-code",
                  })
                : null;

            [renderedText, renderedTextAfterCode].forEach((rendered) => {
                if (!rendered) {
                    return;
                }
                mergeKeywordSets(keywords, rendered.keywords);
                rendered.keywords.forEach((keyword) => {
                    if (!keywordTargets.has(keyword)) {
                        keywordTargets.set(keyword, bubbleId);
                    }
                });
            });

            const text = renderedText ? renderedText.html : "";
            const textAfterCode = renderedTextAfterCode ? renderedTextAfterCode.html : "";
            const figureSrc = pageAssetHref(page, message.figureSrc || "");
            const figure = figureSrc
                ? `<figure class="chat-bubble__figure"><img class="chat-bubble__image" src="${escapeAttribute(
                      figureSrc
                  )}" alt="${escapeAttribute(
                      message.figureAlt || "Dialog illustration"
                  )}" loading="lazy"></figure>`
                : "";
            const autoCodeClass =
                typeof message.buildCodeBlock === "function" ? getDialogCodeClass(pageId, index) : "";
            const codeClass = message.codeClass || autoCodeClass;
            const codeHtml =
                typeof message.buildCodeBlock === "function"
                    ? codeRenderer.renderBlock(message.buildCodeBlock(codeRenderer.ast))
                    : "";
            const code = codeClass
                ? `<pre class="doc-code ${escapeAttribute(codeClass)}" aria-label="${escapeAttribute(
                      message.codeLabel || "Code snippet"
                  )}">${codeHtml}</pre>`
                : "";

            return `<div class="chat-row chat-row--${side}"><article id="${escapeAttribute(
                bubbleId
            )}" class="chat-bubble chat-bubble--${side}">${bubbleNumber}${speaker}${text}${code}${figure}${textAfterCode}</article></div>`;
        })
        .join("");

    return {
        html,
        keywords,
        keywordTargets,
    };
};

const renderLearnArticle = (record, config, codeRenderer) => {
    const title = record.page.title;
    const renderedDialog = renderDialog(config.dialog || [], record.page, codeRenderer);
    const renderedNotes =
        typeof config.notes === "string" && config.notes.trim().length > 0
            ? renderNotesText(config.notes)
            : "";
    const article = `<header class="doc-header"><p class="doc-eyebrow">${escapeHtml(
        record.section.title
    )}</p><h1>${escapeHtml(title)}</h1></header><section class="lesson-chat"><div class="chat-thread">${renderedDialog.html}${renderedNotes}</div></section>`;

    return {
        article,
        title,
        lead: "",
        keywords: renderedDialog.keywords,
        keywordTargets: renderedDialog.keywordTargets,
        descriptionSource:
            config.dialog?.find((message) => typeof message.text === "string" && message.text.trim())
                ?.text || title,
    };
};

const resolveCodeIndent = (content) => {
    if (typeof content.codeIndent === "number" && Number.isFinite(content.codeIndent)) {
        return Math.max(0, Math.floor(content.codeIndent));
    }
    if (typeof content.buildCodeBlock === "function") {
        return 4;
    }
    return 0;
};

const applyCodeIndent = (code, codeIndent) => {
    if (codeIndent <= 0) {
        return String(code || "");
    }

    const indent = " ".repeat(codeIndent);
    return String(code || "")
        .split("\n")
        .map((line) => (line.length > 0 ? `${indent}${line}` : line))
        .join("\n");
};

const codeIndentStyle = (codeIndent) => (codeIndent > 0 ? ` style="padding-left: ${codeIndent}ch;"` : "");

const getSectionContent = (section) => {
    if (Array.isArray(section.content) && section.content.length > 0) {
        return section.content;
    }

    const content = [];
    const prose = section.prose ?? section.body;
    if (typeof prose === "string" && prose.length > 0) {
        content.push({ prose });
    }

    if (
        section.code !== undefined ||
        typeof section.buildCodeBlock === "function" ||
        Boolean(section.codeClass)
    ) {
        content.push({
            code: section.code,
            codeIndent: section.codeIndent,
            codeClass: section.codeClass,
            codeLabel: section.codeLabel,
            buildCodeBlock: section.buildCodeBlock,
        });
    }

    return content;
};

const joinClassNames = (...classNames) =>
    classNames.filter((className) => String(className || "").trim().length > 0).join(" ");

const getSectionCodeClass = (pageId, index, contentIndex = 0) =>
    contentIndex === 0
        ? `manual-code-${pageId}-${index}`
        : `manual-code-${pageId}-${index}-${contentIndex}`;

const renderCodeBlock = (content, codeClass, codeRenderer) => {
    const codeIndent = resolveCodeIndent(content);
    const codeIndentAttribute = codeIndentStyle(codeIndent);
    const className = joinClassNames(
        "doc-code",
        content.code !== undefined ? "manual-fenced-code" : "",
        codeClass
    );
    const ariaLabel = escapeAttribute(content.codeLabel || "Code snippet");

    if (content.code !== undefined) {
        return `<pre class="${escapeAttribute(
            className
        )}" data-code-ignore="true" aria-label="${ariaLabel}"${codeIndentAttribute}><code>${escapeHtml(
            applyCodeIndent(content.code, codeIndent)
        )}</code></pre>`;
    }

    if (!codeClass || typeof content.buildCodeBlock !== "function") {
        return "";
    }

    const codeHtml = codeRenderer.renderBlock(content.buildCodeBlock(codeRenderer.ast));
    return `<pre class="${escapeAttribute(
        className
    )}" aria-label="${ariaLabel}"${codeIndentAttribute}>${codeHtml}</pre>`;
};

const getSectionId = (pageId, section, index) => {
    const pageToken = normalizeDomIdToken(pageId) || "manual";
    const sectionToken = normalizeDomIdToken(section.id || section.title) || `section-${index}`;
    return `${pageToken}-${sectionToken}`;
};

const renderSections = (sections = [], page, codeRenderer) => {
    const keywords = new Set();
    const keywordTargets = new Map();
    const html = sections
        .map((section, index) => {
            const sectionId = getSectionId(page.id, section, index);
            const contentHtml = getSectionContent(section)
                .map((content, contentIndex) => {
                    const blockHtml = [];

                    if (typeof content.prose === "string" && content.prose.length > 0) {
                        const renderedProse = renderRichText(content.prose, {
                            paragraphClass: "manual-prose",
                            linkClass: "manual-link",
                            fencedCodeClass: "manual-fenced-code",
                        });
                        mergeKeywordSets(keywords, renderedProse.keywords);
                        renderedProse.keywords.forEach((keyword) => {
                            if (!keywordTargets.has(keyword)) {
                                keywordTargets.set(keyword, sectionId);
                            }
                        });
                        blockHtml.push(renderedProse.html);
                    }

                    if (
                        content.code !== undefined ||
                        typeof content.buildCodeBlock === "function" ||
                        Boolean(content.codeClass)
                    ) {
                        const autoCodeClass =
                            typeof content.buildCodeBlock === "function"
                                ? getSectionCodeClass(page.id, index, contentIndex)
                                : "";
                        const codeClass = content.codeClass || autoCodeClass;
                        blockHtml.push(renderCodeBlock(content, codeClass, codeRenderer));
                    }

                    return blockHtml.join("");
                })
                .join("");

            return `<section id="${escapeAttribute(sectionId)}" class="manual-section"><h2>${escapeHtml(
                section.title
            )}</h2>${contentHtml}</section>`;
        })
        .join("");

    return {
        html,
        keywords,
        keywordTargets,
    };
};

const renderManualArticle = (record, config, codeRenderer) => {
    const title = config.title || record.page.title;
    const lead = config.lead || "";
    const renderedIntro = renderRichText(config.intro || "", {
        paragraphClass: "manual-prose",
        linkClass: "manual-link",
        fencedCodeClass: "manual-fenced-code",
    });
    const renderedSections = renderSections(config.sections || [], record.page, codeRenderer);
    const keywords = new Set();
    const keywordTargets = new Map(renderedSections.keywordTargets);
    mergeKeywordSets(keywords, renderedIntro.keywords);
    mergeKeywordSets(keywords, renderedSections.keywords);

    const article = `<header class="doc-header"><p class="doc-eyebrow">${escapeHtml(
        record.section.title
    )}</p><h1>${escapeHtml(title)}</h1>${
        lead ? `<p class="doc-lead">${formatInlineCode(lead, "manual-link")}</p>` : ""
    }</header><div class="manual-intro">${renderedIntro.html}</div><div class="manual-sections">${renderedSections.html}</div>`;

    const firstSectionText =
        config.sections
            ?.flatMap((section) => getSectionContent(section))
            .find((content) => typeof content.prose === "string" && content.prose.trim())?.prose || "";

    return {
        article,
        title,
        lead,
        keywords,
        keywordTargets,
        descriptionSource: lead || config.intro || firstSectionText || title,
    };
};

const renderPage = (record, captured, codeRenderer, template) => {
    const renderer =
        record.section.kind === "learn" ? renderLearnArticle : renderManualArticle;
    const rendered = renderer(record, captured.config, codeRenderer);
    const keywords = renderKeywordList(rendered.keywords, rendered.keywordTargets);
    const sectionTitle = record.section.title || record.sectionId;
    const title =
        rendered.title === sectionTitle
            ? `${site.title} - ${rendered.title}`
            : `${site.title} - ${sectionTitle}: ${rendered.title}`;
    const description = truncateDescription(rendered.descriptionSource || site.description);
    const assetRoot = relativeHref(record.page.slug, ".");

    return template
        .replace(/__DOC_TITLE__/g, escapeAttribute(title))
        .replace(/__DOC_DESCRIPTION__/g, escapeAttribute(description || site.description))
        .replace(/__CANONICAL_URL__/g, escapeAttribute(canonicalUrl(record.page.slug)))
        .replace(/__ASSET_ROOT__/g, assetRoot === "." ? "" : `${assetRoot.replace(/\/?$/, "/")}`)
        .replace(/__DOC_SECTION__/g, escapeAttribute(record.sectionId))
        .replace(/__DOC_PAGE__/g, escapeAttribute(record.page.id))
        .replace(/__TOP_ACTIONS__/g, renderTopActions(record.page.slug, record.sectionId))
        .replace(/__SITE_FOOTER__/g, renderSiteFooter(record.page.slug))
        .replace(/__SECTION_TITLE__/g, escapeAttribute(sectionTitle))
        .replace(/__DOC_NAV__/g, renderDocNav(record))
        .replace(/__DOC_ARTICLE__/g, rendered.article)
        .replace(/__DOC_PAGER__/g, renderDocPager(record))
        .replace(/__KEYWORDS_HIDDEN__/g, keywords ? "" : " hidden")
        .replace(/__KEYWORDS__/g, keywords);
};

const writeSiteManifest = () => {
    const manifest = {
        title: site.title,
        home: "index.html",
        nav: getTopNavTargets().map((item) => ({
            label: item.label,
            href: item.href,
            section: item.section,
        })),
    };
    const source = `window.PYPIE_SITE = ${JSON.stringify(manifest, null, 4)};\n`;
    fs.writeFileSync(MANIFEST_PATH, source);
};

const writeSitemap = (records) => {
    const urls = ["index.html", ...records.map((record) => record.page.slug)];
    const entries = urls
        .map((slug) => `    <url><loc>${escapeHtml(canonicalUrl(slug))}</loc></url>`)
        .join("\n");
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
    fs.writeFileSync(SITEMAP_PATH, xml);
};

const writeRobots = () => {
    const lines = ["User-agent: *", "Allow: /", `Sitemap: ${canonicalUrl("sitemap.xml")}`, ""];
    fs.writeFileSync(ROBOTS_PATH, lines.join("\n"));
};

const run = () => {
    const template = fs.readFileSync(TEMPLATE_PATH, "utf8");
    const codeRenderer = createCodeRenderer();
    const records = getPageRecords();

    writeSiteManifest();
    writeSitemap(records);
    writeRobots();

    records.forEach((record) => {
        const captured = loadPageConfig(record);
        const html = renderPage(record, captured, codeRenderer, template);
        const outputPath = rootPath(record.page.slug);
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, html);
    });

    process.stdout.write(`Generated ${records.length} static documentation pages.\n`);
};

run();
