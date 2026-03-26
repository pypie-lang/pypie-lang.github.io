(() => {
    type Side = "left" | "right";
    type AstBuilder = (ast: unknown) => unknown;

    type DialogSegment = {
        kind: "text" | "code";
        value: string;
    };

    type RenderedMessageText = {
        html: string;
        keywords: Set<string>;
    };

    type RenderedDialog = {
        html: string;
        keywords: Set<string>;
        keywordTargets: Map<string, string>;
    };

    type LearnPageMeta = {
        slug: string;
        title?: string;
    };

    type LearnNavPage = {
        id: string;
        slug: string;
        title: string;
        navTitle: string;
    };

    type LearnDialogMessage = {
        side?: Side;
        speaker?: string;
        text?: string;
        textAfterCode?: string;
        figureSrc?: string;
        figureAlt?: string;
        codeClass?: string;
        codeLabel?: string;
        buildCodeBlock?: AstBuilder;
    };

    type LearnPageConfig = {
        id?: string;
        dialog?: LearnDialogMessage[];
        notes?: string;
    };

    type RenderBlock = {
        selector: string;
        block: unknown;
    };

    type LearnWindow = Window & {
        PYPIE_AST?: unknown;
        PYPIE_SET_BLOCKS?: (blocks: RenderBlock[]) => void;
        PYPIE_LEARN_RENDER?: (config?: LearnPageConfig) => void;
    };

    type LearnSeries = {
        title: string;
        preludeSlug: string;
        pages: LearnPageMeta[];
    };

    type ThemeName = "theme-dark" | "theme-solaris";

    const learnWindow = window as LearnWindow;
    const THEME_QUERY_PARAM = "theme";
    const THEME_CHANGE_EVENT = "pypie:theme-change";

    const getLearnRootUrl = (): URL => {
        const currentScript = document.currentScript as HTMLScriptElement | null;
        if (currentScript && currentScript.src) {
            return new URL(".", currentScript.src);
        }
        return new URL("../", window.location.href);
    };

    const learnRootUrl = getLearnRootUrl();
    const withLearnRoot = (href: string): string => new URL(href, learnRootUrl).href;
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
    const withLearnRootNav = (href: string): string => {
        const pageUrl = new URL(href, learnRootUrl);
        const activeTheme = getActiveTheme();
        if (activeTheme) {
            pageUrl.searchParams.set(THEME_QUERY_PARAM, activeTheme);
        }
        return pageUrl.href;
    };
    const syncNavThemeLinks = (theme: ThemeName | null = getActiveTheme()): void => {
        const nav = document.querySelector("[data-learn-nav]");
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

    const LEARN_SERIES: LearnSeries = {
        title: "ML Programming 101",
        preludeSlug: "overview/index.html",
        pages: [
            {
                slug: "types/index.html",
                title: "Types, Shapes & Tensors",
            },
            {
                slug: "tensor_add/index.html",
                title: "One Function, Many Ranks",
            },
            {
                slug: "forward_line/index.html",
                title: "A Forward Line",
            },
            {
                slug: "model_line/index.html",
                title: "The Complete Line",
            },
            {
                slug: "corr/index.html",
                title: "Finding Patterns",
            },
            {
                slug: "cnn/index.html",
                title: "CNN",
            },
            {
                slug: "transformer/index.html",
                title: "transformer",
            },
        ],
    };

    const PRELUDE_PAGE_ID = "prelude";

    const pageIdFromSlug = (slug: string): string => {
        const firstPathSegment = String(slug).split("/")[0] || "";
        return firstPathSegment === "overview" ? PRELUDE_PAGE_ID : firstPathSegment;
    };

    const formatPageTitle = (pageId: string): string =>
        String(pageId)
            .split("-")
            .filter((segment) => segment.length > 0)
            .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
            .join(" ");

    const getAllPages = (): LearnNavPage[] => {
        const allPages: LearnPageMeta[] = [{ slug: LEARN_SERIES.preludeSlug }, ...LEARN_SERIES.pages];
        return allPages.map((page, index) => {
            const slug = page.slug;
            const id = pageIdFromSlug(slug);
            const title = page.title || formatPageTitle(id);
            return {
                id,
                slug,
                title,
                navTitle: `${index}. ${title}`,
            };
        });
    };

    const getNavPageById = (pageId: string): LearnNavPage | null => {
        const normalized = String(pageId || "").trim().toLowerCase();
        if (!normalized) {
            return null;
        }

        const allPages = getAllPages();
        return allPages.find((page) => page.id.toLowerCase() === normalized) || null;
    };

    const setText = (selector: string, value?: string): void => {
        const element = document.querySelector(selector);
        if (element && value !== undefined) {
            element.textContent = value;
        }
    };

    const setHidden = (selector: string, hidden: boolean): void => {
        const element = document.querySelector(selector);
        if (element) {
            element.toggleAttribute("hidden", hidden);
        }
    };

    const setMarginTop = (selector: string, value: string): void => {
        const element = document.querySelector(selector) as HTMLElement | null;
        if (element) {
            element.style.marginTop = value;
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

            return `<a class="chat-bubble__link" href="${escapeHtml(safeHref)}">${label}</a>`;
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
                return `<p class="chat-bubble__text">${body}</p>`;
            })
            .join("");

    const renderNotesText = (text: string): string =>
        String(text || "")
            .split(/\n{2,}/)
            .map((paragraph) => paragraph.trim())
            .filter((paragraph) => paragraph.length > 0)
            .map((paragraph) => {
                const body = paragraph
                    .split("\n")
                    .map((line) => formatInlineCode(line))
                    .join("<br>");
                return `<p class="lesson-chat__intro">${body}</p>`;
            })
            .join("");

    const renderMessageText = (text: string): RenderedMessageText => {
        const source = String(text || "");
        if (!source) {
            return {
                html: "",
                keywords: new Set<string>(),
            };
        }

        const fenceRegex = /```([\s\S]*?)```/g;
        const segments: DialogSegment[] = [];
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
                    return `<pre class="doc-code chat-bubble__fenced-code" data-code-ignore="true"><code>${escapeHtml(
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

    const getDialogCodeClass = (pageId: string, index: number): string =>
        `chat-code-${pageId}-${index}`;

    const normalizeDomIdToken = (value: string): string =>
        String(value || "")
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9_-]+/g, "-")
            .replace(/^-+|-+$/g, "");

    const getDialogBubbleId = (pageId: string, index: number): string => {
        const normalizedPageId = normalizeDomIdToken(pageId) || "learn";
        return `chat-bubble-${normalizedPageId}-${index + 1}`;
    };

    const renderDialog = (dialog: LearnDialogMessage[] = [], pageId = ""): RenderedDialog => {
        const keywords = new Set<string>();
        const keywordTargets = new Map<string, string>();
        const html = dialog
            .map((message, index) => {
                const side: Side = message.side === "right" ? "right" : "left";
                const bubbleNumber = `<span class="chat-bubble__index">${index + 1}</span>`;
                const bubbleId = getDialogBubbleId(pageId, index);
                const speaker = message.speaker
                    ? `<p class="chat-bubble__speaker">${escapeHtml(message.speaker)}</p>`
                    : "";
                const renderedText = message.text ? renderMessageText(message.text) : null;
                const renderedTextAfterCode = message.textAfterCode
                    ? renderMessageText(message.textAfterCode)
                    : null;
                if (renderedText) {
                    mergeKeywordSets(keywords, renderedText.keywords);
                    renderedText.keywords.forEach((keyword) => {
                        if (!keywordTargets.has(keyword)) {
                            keywordTargets.set(keyword, bubbleId);
                        }
                    });
                }
                if (renderedTextAfterCode) {
                    mergeKeywordSets(keywords, renderedTextAfterCode.keywords);
                    renderedTextAfterCode.keywords.forEach((keyword) => {
                        if (!keywordTargets.has(keyword)) {
                            keywordTargets.set(keyword, bubbleId);
                        }
                    });
                }
                const text = renderedText ? renderedText.html : "";
                const textAfterCode = renderedTextAfterCode ? renderedTextAfterCode.html : "";
                const figureSrc = isSafeLinkHref(String(message.figureSrc || ""))
                    ? withLearnRoot(String(message.figureSrc || ""))
                    : "";
                const figure = figureSrc
                    ? `<figure class="chat-bubble__figure" style="margin: 0.75rem 0 0;"><img class="chat-bubble__image" src="${escapeHtml(
                          figureSrc
                      )}" alt="${escapeHtml(
                          message.figureAlt || "Dialog illustration"
                      )}" loading="lazy" style="display: block; max-width: 100%; height: auto; border-radius: 10px; border: 1px solid var(--code-border);"></figure>`
                    : "";
                const autoCodeClass =
                    typeof message.buildCodeBlock === "function"
                        ? getDialogCodeClass(pageId, index)
                        : "";
                const codeClass = message.codeClass || autoCodeClass;
                const code = codeClass
                    ? `<pre class="doc-code ${codeClass}" aria-label="${escapeHtml(
                          message.codeLabel || "Code snippet"
                      )}"></pre>`
                    : "";

                return `<div class="chat-row chat-row--${side}"><article id="${escapeHtml(
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

    const renderNav = (pageId: string): void => {
        const nav = document.querySelector("[data-learn-nav]");
        if (!nav) {
            return;
        }

        const allPages = getAllPages();
        const navLinks = allPages
            .map((page) => {
                const currentAttr = page.id === pageId ? ' aria-current="page"' : "";
                return `<a href="${withLearnRootNav(page.slug)}"${currentAttr}>${page.navTitle}</a>`;
            })
            .join("");

        nav.innerHTML = `<div class="doc-nav__title">${LEARN_SERIES.title}</div>${navLinks}`;
        syncNavThemeLinks();
    };

    const renderChapter = (
        dialogMessages: LearnDialogMessage[] = [],
        pageId: string,
        notes = ""
    ): void => {
        setMarginTop("[data-learn-section]", "0");

        const section = document.querySelector("[data-learn-section]");
        if (!section) {
            return;
        }

        section.id = pageId;

        const sectionTitle = section.querySelector("[data-learn-section-title]");
        if (sectionTitle) {
            sectionTitle.toggleAttribute("hidden", true);
            sectionTitle.textContent = "";
        }

        const sectionBody = section.querySelector("[data-learn-section-body]");
        if (sectionBody) {
            sectionBody.toggleAttribute("hidden", true);
            sectionBody.textContent = "";
        }

        const renderedDialog = renderDialog(dialogMessages, pageId);
        const renderedNotes =
            typeof notes === "string" && notes.trim().length > 0 ? renderNotesText(notes) : "";

        const dialog = section.querySelector("[data-learn-dialog]");
        if (dialog) {
            dialog.innerHTML = `${renderedDialog.html}${renderedNotes}`;
        }

        const keywords = document.querySelector("[data-learn-keywords]");
        const hasKeywords = renderedDialog.keywords.size > 0;
        if (keywords) {
            keywords.innerHTML = hasKeywords
                ? renderKeywordList(renderedDialog.keywords, renderedDialog.keywordTargets)
                : "";
            const keywordPanel = keywords.closest(".keyword-panel");
            if (keywordPanel) {
                keywordPanel.toggleAttribute("hidden", !hasKeywords);
            }
        }

        const ast = learnWindow.PYPIE_AST;
        const setBlocks = learnWindow.PYPIE_SET_BLOCKS;
        if (ast && typeof setBlocks === "function") {
            const blocks: RenderBlock[] = [];

            dialogMessages.forEach((message, index) => {
                if (typeof message.buildCodeBlock !== "function") {
                    return;
                }
                const block = message.buildCodeBlock(ast);
                if (!block) {
                    return;
                }
                const codeClass = message.codeClass || getDialogCodeClass(pageId, index);
                blocks.push({
                    selector: `.${codeClass}`,
                    block,
                });
            });

            if (blocks.length > 0) {
                setBlocks(blocks);
            }
        }
    };

    const renderPage = (config: LearnPageConfig = {}): void => {
        const pageId = config.id || document.body?.dataset.learnPage;
        if (!pageId) {
            return;
        }

        const currentBodyPageId = document.body?.dataset.learnPage || pageId;
        renderNav(currentBodyPageId);

        const currentNavPage = getNavPageById(currentBodyPageId) || getNavPageById(pageId);
        const renderedTitle = currentNavPage ? currentNavPage.navTitle : formatPageTitle(pageId);
        setText("[data-learn-eyebrow]", renderedTitle);

        const baseTitle = `PyPie - ${LEARN_SERIES.title}`;
        const documentTitle = currentNavPage ? currentNavPage.title : formatPageTitle(pageId);
        document.title = `${baseTitle}: ${documentTitle}`;

        setHidden("[data-learn-title]", true);
        setHidden("[data-learn-lead]", true);
        setText("[data-learn-title]", "");
        setText("[data-learn-lead]", "");
        renderChapter(config.dialog, pageId, config.notes);
    };

    window.addEventListener(THEME_CHANGE_EVENT, (event) => {
        const themeEvent = event as CustomEvent<{ theme?: unknown }>;
        const theme = isThemeName(themeEvent.detail?.theme)
            ? themeEvent.detail.theme
            : getActiveTheme();
        syncNavThemeLinks(theme);
    });

    learnWindow.PYPIE_LEARN_RENDER = renderPage;
})();
