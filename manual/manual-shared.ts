(() => {
    type AstBuilder = (ast: unknown) => unknown;

    type ManualPageMeta = {
        id?: string;
        slug: string;
        title: string;
        navTitle?: string;
    };

    type ManualNavPage = {
        id: string;
        slug: string;
        title: string;
        navTitle: string;
    };

    type ManualSectionContent = {
        prose?: string;
        code?: string;
        codeIndent?: number;
        codeClass?: string;
        codeLabel?: string;
        buildCodeBlock?: AstBuilder;
    };

    type ManualSection = {
        id?: string;
        title: string;
        body?: string;
        prose?: string;
        code?: string;
        codeIndent?: number;
        codeClass?: string;
        codeLabel?: string;
        buildCodeBlock?: AstBuilder;
        content?: ManualSectionContent[];
    };

    type ManualPageConfig = {
        id?: string;
        title?: string;
        lead?: string;
        intro?: string;
        sections?: ManualSection[];
        series?: ManualSeries;
    };

    type RenderedText = {
        html: string;
        keywords: Set<string>;
    };

    type RenderedSections = {
        html: string;
        keywords: Set<string>;
        keywordTargets: Map<string, string>;
    };

    type RenderBlock = {
        selector: string;
        block: unknown;
    };

    type ThemeName = "theme-dark" | "theme-solaris";

    type ManualWindow = Window & {
        PYPIE_AST?: unknown;
        PYPIE_SET_BLOCKS?: (blocks: RenderBlock[]) => void;
        PYPIE_MANUAL_RENDER?: (config?: ManualPageConfig) => void;
    };

    type ManualSeries = {
        title: string;
        pages: ManualPageMeta[];
    };

    const manualWindow = window as ManualWindow;
    const THEME_QUERY_PARAM = "theme";
    const THEME_CHANGE_EVENT = "pypie:theme-change";

    const getManualRootUrl = (): URL => {
        const currentScript = document.currentScript as HTMLScriptElement | null;
        if (currentScript && currentScript.src) {
            return new URL(".", currentScript.src);
        }
        return new URL("../", window.location.href);
    };

    const manualRootUrl = getManualRootUrl();
    const withManualRoot = (href: string): string => new URL(href, manualRootUrl).href;
    const isThemeName = (value: unknown): value is ThemeName =>
        value === "theme-dark" || value === "theme-solaris";
    const readThemeFromQuery = (): ThemeName | null => {
        try {
            const theme = new URL(window.location.href).searchParams.get(THEME_QUERY_PARAM);
            return isThemeName(theme) ? theme : null;
        } catch {
            return null;
        }
    };
    const readThemeFromBody = (): ThemeName | null => {
        const body = document.body;
        if (!body) {
            return null;
        }
        if (body.classList.contains("theme-solaris")) {
            return "theme-solaris";
        }
        if (body.classList.contains("theme-dark")) {
            return "theme-dark";
        }
        return null;
    };
    const getActiveTheme = (): ThemeName | null => readThemeFromQuery() || readThemeFromBody();
    const withManualRootNav = (href: string): string => {
        const pageUrl = new URL(href, manualRootUrl);
        const activeTheme = getActiveTheme();
        if (activeTheme) {
            pageUrl.searchParams.set(THEME_QUERY_PARAM, activeTheme);
        }
        return pageUrl.href;
    };
    const syncNavThemeLinks = (theme: ThemeName | null = getActiveTheme()): void => {
        const nav = document.querySelector("[data-manual-nav]");
        if (!nav) {
            return;
        }

        const links = nav.querySelectorAll<HTMLAnchorElement>("a[href]");
        links.forEach((link) => {
            const themedUrl = new URL(link.href, window.location.href);
            if (theme) {
                themedUrl.searchParams.set(THEME_QUERY_PARAM, theme);
            } else {
                themedUrl.searchParams.delete(THEME_QUERY_PARAM);
            }
            link.href = themedUrl.href;
        });
    };

    const DEFAULT_MANUAL_SERIES: ManualSeries = {
        title: "Language Reference",
        pages: [
            {
                slug: "guide/index.html",
                title: "The PyPie Guide",
            },
            {
                slug: "tensors_0/index.html",
                title: "Tensor Basics",
            },
            {
                slug: "ops/index.html",
                title: "Ops",
            },
            {
                slug: "parallel/index.html",
                title: "Parallelism",
            },
            {
                slug: "built_ins/index.html",
                title: "Built-in Ops",
            },
            {
                slug: "models/index.html",
                title: "Models",
            },
        ],
    };

    const pageIdFromSlug = (slug: string): string => String(slug).split("/")[0] || "";

    const formatPageTitle = (pageId: string): string =>
        String(pageId)
            .split("-")
            .filter((segment) => segment.length > 0)
            .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
            .join(" ");

    const getAllPages = (series: ManualSeries = DEFAULT_MANUAL_SERIES): ManualNavPage[] =>
        series.pages.map((page, index) => {
            const id = page.id || pageIdFromSlug(page.slug);
            return {
                id,
                slug: page.slug,
                title: page.title,
                navTitle: page.navTitle || `${index}. ${page.title}`,
            };
        });

    const getNavPageById = (
        pageId: string,
        series: ManualSeries = DEFAULT_MANUAL_SERIES
    ): ManualNavPage | null => {
        const normalized = String(pageId || "").trim().toLowerCase();
        if (!normalized) {
            return null;
        }

        return getAllPages(series).find((page) => page.id.toLowerCase() === normalized) || null;
    };

    const setText = (selector: string, value?: string): void => {
        const element = document.querySelector(selector);
        if (element && value !== undefined) {
            element.textContent = value;
        }
    };

    const setHtml = (selector: string, value?: string): void => {
        const element = document.querySelector(selector);
        if (element && value !== undefined) {
            element.innerHTML = value;
        }
    };

    const renderLead = (text: string): string => formatInlineCode(String(text || ""));

    const setHidden = (selector: string, hidden: boolean): void => {
        const element = document.querySelector(selector);
        if (element) {
            element.toggleAttribute("hidden", hidden);
        }
    };

    const escapeHtml = (value: string): string =>
        String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

    const formatBoldText = (text: string): string =>
        String(text || "").replace(/!!([^!\n]+)!!/g, "<strong>$1</strong>");

    const isSafeLinkHref = (href: string): boolean => {
        const normalizedHref = String(href || "").trim();
        if (!normalizedHref) {
            return false;
        }

        const lowerHref = normalizedHref.toLowerCase();
        if (
            lowerHref.startsWith("javascript:") ||
            lowerHref.startsWith("data:") ||
            lowerHref.startsWith("vbscript:")
        ) {
            return false;
        }

        return true;
    };

    const formatInlineLinks = (text: string): string =>
        String(text || "").replace(/\[([^\]\n]+)\]\(([^)\n]+)\)/g, (fullMatch, label, href) => {
            const safeHref = String(href || "").trim();
            if (!isSafeLinkHref(safeHref)) {
                return fullMatch;
            }

            return `<a class="manual-link" href="${escapeHtml(safeHref)}">${label}</a>`;
        });

    const formatInlineCode = (text: string): string => {
        const source = String(text || "");
        if (!source) {
            return "";
        }

        const codeSegments: string[] = [];
        const tokenized = source.replace(/`([^`\n]+)`/g, (_match, code: string) => {
            const token = `__PYPIE_CODE_TOKEN_${codeSegments.length}__`;
            codeSegments.push(`<code>${escapeHtml(code)}</code>`);
            return token;
        });

        const escaped = escapeHtml(tokenized);
        const withBold = formatBoldText(escaped);
        const withLinks = formatInlineLinks(withBold);
        return withLinks.replace(/__PYPIE_CODE_TOKEN_(\d+)__/g, (_match, indexText: string) => {
            const index = Number(indexText);
            return codeSegments[index] || "";
        });
    };

    const normalizeKeyword = (keyword: string): string =>
        String(keyword || "")
            .trim()
            .replace(/`([^`\n]+)`/g, "$1")
            .replace(/`/g, "")
            .replace(/\s+/g, " ");

    const collectKeywordsFromText = (text: string): Set<string> => {
        const keywords = new Set<string>();
        const keywordRegex = /!!([^!\n]+)!!/g;
        let match: RegExpExecArray | null = null;

        while ((match = keywordRegex.exec(String(text || ""))) !== null) {
            const keyword = normalizeKeyword(String(match[1] || ""));
            if (keyword) {
                keywords.add(keyword);
            }
        }

        return keywords;
    };

    const mergeKeywordSets = (target: Set<string>, source: Set<string>): void => {
        source.forEach((keyword) => target.add(keyword));
    };

    const sortKeywords = (keywords: Set<string>): string[] =>
        Array.from(keywords).sort((left, right) =>
            left.localeCompare(right, undefined, { sensitivity: "base" })
        );

    const renderKeywordList = (keywords: Set<string>, keywordTargets: Map<string, string>): string => {
        const sortedKeywords = sortKeywords(keywords);
        if (sortedKeywords.length === 0) {
            return '<li class="keyword-panel__item keyword-panel__item--empty">No keywords yet.</li>';
        }

        return sortedKeywords
            .map((keyword) => {
                const targetId = keywordTargets.get(keyword);
                if (!targetId) {
                    return `<li class="keyword-panel__item"><code>${escapeHtml(keyword)}</code></li>`;
                }

                return `<li class="keyword-panel__item"><a class="keyword-panel__link" href="#${escapeHtml(
                    targetId
                )}"><code>${escapeHtml(keyword)}</code></a></li>`;
            })
            .join("");
    };

    const trimFenceEdgeNewlines = (text: string): string => {
        let value = String(text || "");
        if (value.startsWith("\n")) {
            value = value.slice(1);
        }
        if (value.endsWith("\n")) {
            value = value.slice(0, -1);
        }
        return value;
    };

    const renderTextParagraphs = (text: string): string =>
        String(text || "")
            .split(/\n{2,}/)
            .map((paragraph) => paragraph.trim())
            .filter((paragraph) => paragraph.length > 0)
            .map((paragraph) => {
                const body = paragraph
                    .split("\n")
                    .map((line) => formatInlineCode(line))
                    .join("<br>");
                return `<p class="manual-prose">${body}</p>`;
            })
            .join("");

    const renderRichText = (text: string): RenderedText => {
        const source = String(text || "");
        if (!source) {
            return {
                html: "",
                keywords: new Set<string>(),
            };
        }

        const fenceRegex = /```([\s\S]*?)```/g;
        const segments: Array<{ kind: "text" | "code"; value: string }> = [];
        let cursor = 0;
        let match: RegExpExecArray | null = null;

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

        const keywords = new Set<string>();
        const html = segments
            .map((segment) => {
                if (segment.kind === "code") {
                    return `<pre class="doc-code manual-fenced-code" data-code-ignore="true"><code>${escapeHtml(
                        segment.value
                    )}</code></pre>`;
                }
                mergeKeywordSets(keywords, collectKeywordsFromText(segment.value));
                return renderTextParagraphs(segment.value);
            })
            .join("");

        return {
            html,
            keywords,
        };
    };

    const getSectionCodeClass = (pageId: string, index: number, contentIndex = 0): string =>
        contentIndex === 0
            ? `manual-code-${pageId}-${index}`
            : `manual-code-${pageId}-${index}-${contentIndex}`;

    const resolveCodeIndent = (content: ManualSectionContent): number => {
        if (typeof content.codeIndent === "number" && Number.isFinite(content.codeIndent)) {
            return Math.max(0, Math.floor(content.codeIndent));
        }
        if (typeof content.buildCodeBlock === "function") {
            return 4;
        }
        return 0;
    };

    const applyCodeIndent = (code: string, codeIndent: number): string => {
        if (codeIndent <= 0) {
            return code;
        }

        const indent = " ".repeat(codeIndent);
        return String(code || "")
            .split("\n")
            .map((line) => (line.length > 0 ? `${indent}${line}` : line))
            .join("\n");
    };

    const codeIndentStyle = (codeIndent: number): string =>
        codeIndent > 0 ? ` style="padding-left: ${codeIndent}ch;"` : "";

    const getSectionContent = (section: ManualSection): ManualSectionContent[] => {
        if (Array.isArray(section.content) && section.content.length > 0) {
            return section.content;
        }

        const content: ManualSectionContent[] = [];
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

    const joinClassNames = (...classNames: string[]): string =>
        classNames.filter((className) => className.trim().length > 0).join(" ");

    const renderCodeBlock = (content: ManualSectionContent, codeClass = ""): string => {
        const codeIndent = resolveCodeIndent(content);
        const codeIndentAttribute = codeIndentStyle(codeIndent);
        const className = joinClassNames(
            "doc-code",
            content.code !== undefined ? "manual-fenced-code" : "",
            codeClass
        );
        const ariaLabel = escapeHtml(content.codeLabel || "Code snippet");

        if (content.code !== undefined) {
            return `<pre class="${escapeHtml(className)}" data-code-ignore="true" aria-label="${ariaLabel}"${codeIndentAttribute}><code>${escapeHtml(
                applyCodeIndent(content.code, codeIndent)
            )}</code></pre>`;
        }

        if (!codeClass) {
            return "";
        }

        return `<pre class="${escapeHtml(className)}" aria-label="${ariaLabel}"${codeIndentAttribute}></pre>`;
    };

    const normalizeDomIdToken = (value: string): string =>
        String(value || "")
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9_-]+/g, "-")
            .replace(/^-+|-+$/g, "");

    const getSectionId = (pageId: string, section: ManualSection, index: number): string => {
        const pageToken = normalizeDomIdToken(pageId) || "manual";
        const sectionToken =
            normalizeDomIdToken(section.id || section.title) || `section-${index}`;
        return `${pageToken}-${sectionToken}`;
    };

    const renderSections = (sections: ManualSection[] = [], pageId = ""): RenderedSections => {
        const keywords = new Set<string>();
        const keywordTargets = new Map<string, string>();
        const html = sections
            .map((section, index) => {
                const sectionId = getSectionId(pageId, section, index);
                const contentHtml = getSectionContent(section)
                    .map((content, contentIndex) => {
                        const blockHtml: string[] = [];

                        if (typeof content.prose === "string" && content.prose.length > 0) {
                            const renderedProse = renderRichText(content.prose);
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
                                    ? getSectionCodeClass(pageId, index, contentIndex)
                                    : "";
                            const codeClass = content.codeClass || autoCodeClass;
                            blockHtml.push(renderCodeBlock(content, codeClass));
                        }

                        return blockHtml.join("");
                    })
                    .join("");

                return `<section id="${escapeHtml(sectionId)}" class="manual-section"><h2>${escapeHtml(
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

    const renderNav = (pageId: string, series: ManualSeries): void => {
        const nav = document.querySelector("[data-manual-nav]");
        if (!nav) {
            return;
        }

        const navLinks = getAllPages(series)
            .map((page) => {
                const currentAttr = page.id === pageId ? ' aria-current="page"' : "";
                return `<a href="${withManualRootNav(page.slug)}"${currentAttr}>${page.navTitle}</a>`;
            })
            .join("");

        nav.innerHTML = `<div class="doc-nav__title">${escapeHtml(series.title)}</div>${navLinks}`;
        syncNavThemeLinks();
    };

    const renderPage = (config: ManualPageConfig = {}): void => {
        const pageId = config.id || document.body?.dataset.manualPage;
        if (!pageId) {
            return;
        }

        const series = config.series || DEFAULT_MANUAL_SERIES;
        renderNav(pageId, series);

        const currentNavPage = getNavPageById(pageId, series);
        const resolvedTitle = config.title || currentNavPage?.title || formatPageTitle(pageId);
        const resolvedEyebrow = currentNavPage?.navTitle || resolvedTitle;
        const renderedIntro = renderRichText(config.intro || "");
        const renderedSections = renderSections(config.sections || [], pageId);
        const allKeywords = new Set<string>();

        mergeKeywordSets(allKeywords, renderedIntro.keywords);
        mergeKeywordSets(allKeywords, renderedSections.keywords);

        setText("[data-manual-eyebrow]", resolvedEyebrow);
        setText("[data-manual-title]", resolvedTitle);
        setHtml("[data-manual-lead]", renderLead(config.lead || ""));
        setHidden("[data-manual-lead]", !config.lead);

        const intro = document.querySelector("[data-manual-intro]");
        if (intro) {
            intro.innerHTML = renderedIntro.html;
        }

        const sections = document.querySelector("[data-manual-sections]");
        if (sections) {
            sections.innerHTML = renderedSections.html;
        }

        const keywords = document.querySelector("[data-manual-keywords]");
        if (keywords) {
            keywords.innerHTML = renderKeywordList(allKeywords, renderedSections.keywordTargets);
            const keywordPanel = keywords.closest(".keyword-panel");
            if (keywordPanel) {
                keywordPanel.toggleAttribute("hidden", allKeywords.size === 0);
            }
        }

        const ast = manualWindow.PYPIE_AST;
        const setBlocks = manualWindow.PYPIE_SET_BLOCKS;
        if (ast && typeof setBlocks === "function") {
            const blocks: RenderBlock[] = [];
            (config.sections || []).forEach((section, index) => {
                getSectionContent(section).forEach((content, contentIndex) => {
                    if (typeof content.buildCodeBlock !== "function") {
                        return;
                    }
                    const block = content.buildCodeBlock(ast);
                    if (!block) {
                        return;
                    }
                    const codeClass =
                        content.codeClass || getSectionCodeClass(pageId, index, contentIndex);
                    blocks.push({
                        selector: `.${codeClass}`,
                        block,
                    });
                });
            });
            if (blocks.length > 0) {
                setBlocks(blocks);
            }
        }

        const baseTitle = `PyPie - ${series.title}`;
        document.title = `${baseTitle}: ${resolvedTitle}`;
    };

    window.addEventListener(THEME_CHANGE_EVENT, (event) => {
        const themeEvent = event as CustomEvent<{ theme?: unknown }>;
        const theme = isThemeName(themeEvent.detail?.theme)
            ? themeEvent.detail.theme
            : getActiveTheme();
        syncNavThemeLinks(theme);
    });

    manualWindow.PYPIE_MANUAL_RENDER = renderPage;
})();
