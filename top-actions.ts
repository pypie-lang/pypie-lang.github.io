(() => {
    type ThemeName = "light" | "dark";

    type SiteNavItem = {
        href: string;
        label: string;
        section?: string;
    };

    type SiteManifest = {
        home?: string;
        nav?: SiteNavItem[];
        title?: string;
    };

    type SiteWindow = Window & {
        PYPIE_SITE?: SiteManifest;
    };

    const THEME_STORAGE_KEY = "pypie.theme";
    const root = document.documentElement;
    const siteWindow = window as SiteWindow;

    const isThemeName = (value: unknown): value is ThemeName =>
        value === "light" || value === "dark";

    const normalizeStoredTheme = (value: unknown): ThemeName | null => {
        if (isThemeName(value)) {
            return value;
        }
        if (value === "theme-dark") {
            return "dark";
        }
        if (value === "theme-solaris") {
            return "light";
        }
        return null;
    };

    const readStoredTheme = (): ThemeName | null => {
        try {
            return normalizeStoredTheme(window.localStorage.getItem(THEME_STORAGE_KEY));
        } catch {
            return null;
        }
    };

    const writeStoredTheme = (theme: ThemeName): void => {
        try {
            window.localStorage.setItem(THEME_STORAGE_KEY, theme);
        } catch {
            // Ignore storage failures.
        }
    };

    const systemTheme = (): ThemeName =>
        window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";

    const activeTheme = (): ThemeName => {
        const explicitTheme = normalizeStoredTheme(root.dataset.theme);
        return explicitTheme || readStoredTheme() || systemTheme();
    };

    const getRootUrl = (): URL => {
        const currentScript = document.currentScript as HTMLScriptElement | null;
        if (currentScript && currentScript.src) {
            return new URL(".", currentScript.src);
        }
        return new URL("./", window.location.href);
    };

    const rootUrl = getRootUrl();
    const withRoot = (href: string): string => new URL(href, rootUrl).href;

    const escapeHtml = (value: string): string =>
        String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");

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

    const renderTopActions = (container: Element): HTMLButtonElement | null => {
        const existingToggle = container.querySelector<HTMLButtonElement>(".theme-toggle");
        if (existingToggle) {
            return existingToggle;
        }

        const manifest = siteWindow.PYPIE_SITE || {};
        const nav = Array.isArray(manifest.nav) ? manifest.nav : [];
        const homeHref = withRoot(manifest.home || "index.html");
        const linksMarkup = nav
            .map(
                (link) =>
                    `<a href="${escapeHtml(withRoot(link.href))}">${escapeHtml(link.label)}</a>`
            )
            .join("");

        container.innerHTML =
            `<header class="site-header"><div class="site-header__inner">` +
            `<a class="brand" href="${escapeHtml(homeHref)}">${BRAND_MARK_SVG}<span class="brand__name">${escapeHtml(
                manifest.title || "PyPie"
            )}</span></a>` +
            `<nav class="site-nav" aria-label="Site">${linksMarkup}</nav>` +
            `<button class="theme-toggle" type="button" aria-label="Toggle color theme" title="Toggle color theme">${THEME_TOGGLE_ICONS}</button>` +
            `</div></header>`;

        return container.querySelector<HTMLButtonElement>(".theme-toggle");
    };

    const setTheme = (theme: ThemeName): void => {
        root.dataset.theme = theme;
        writeStoredTheme(theme);
    };

    const syncToggleLabel = (toggle: HTMLButtonElement, theme: ThemeName): void => {
        const nextTheme = theme === "dark" ? "light" : "dark";
        const label = `Switch to ${nextTheme} theme`;
        toggle.setAttribute("aria-label", label);
        toggle.setAttribute("title", label);
    };

    const container = document.querySelector("[data-top-actions]");
    if (!container) {
        return;
    }

    const themeToggle = renderTopActions(container);
    const explicitInitialTheme = normalizeStoredTheme(root.dataset.theme) || readStoredTheme();
    if (explicitInitialTheme) {
        setTheme(explicitInitialTheme);
    }
    const initialTheme = activeTheme();

    if (!themeToggle) {
        return;
    }

    syncToggleLabel(themeToggle, initialTheme);
    themeToggle.addEventListener("click", () => {
        const nextTheme = activeTheme() === "dark" ? "light" : "dark";
        setTheme(nextTheme);
        syncToggleLabel(themeToggle, nextTheme);
    });
})();
