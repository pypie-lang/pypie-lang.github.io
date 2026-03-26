(() => {
    const THEME_STORAGE_KEY = "pypie.theme";
    const THEME_QUERY_PARAM = "theme";
    const THEME_CHANGE_EVENT = "pypie:theme-change";
    const isThemeName = (value) => value === "theme-dark" || value === "theme-solaris";
    const readThemeFromQuery = () => {
        try {
            const theme = new URL(window.location.href).searchParams.get(THEME_QUERY_PARAM);
            return isThemeName(theme) ? theme : null;
        }
        catch {
            return null;
        }
    };
    const readStoredTheme = () => {
        try {
            const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
            return isThemeName(stored) ? stored : null;
        }
        catch {
            return null;
        }
    };
    const writeStoredTheme = (theme) => {
        try {
            window.localStorage.setItem(THEME_STORAGE_KEY, theme);
        }
        catch {
            // Ignore storage failures (private mode, quotas, etc.).
        }
    };
    const getRootUrl = () => {
        const currentScript = document.currentScript;
        if (currentScript && currentScript.src) {
            return new URL(".", currentScript.src);
        }
        return new URL("./", window.location.href);
    };
    const rootUrl = getRootUrl();
    const withRoot = (href) => new URL(href, rootUrl).href;
    const withThemeParam = (href, theme) => {
        const themedUrl = new URL(href, rootUrl);
        themedUrl.searchParams.set(THEME_QUERY_PARAM, theme);
        return themedUrl.href;
    };
    const syncLocationTheme = (theme) => {
        try {
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set(THEME_QUERY_PARAM, theme);
            window.history.replaceState(window.history.state, "", `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`);
        }
        catch {
            // Ignore URL synchronization failures.
        }
    };
    const links = [
        { href: withRoot("learn/overview/index.html"), label: "ML Programming 101" },
        { href: withRoot("why-pypie/index.html"), label: "Why PyPie?" },
        { href: withRoot("manual/guide/index.html"), label: "Language Reference" },
        { href: withRoot("installation/index.html"), label: "Installation" },
    ];
    const homeLink = withRoot("index.html");
    const syncTopActionLinks = (theme) => {
        const topActionLinks = document.querySelectorAll('[data-top-actions] a[data-theme-link="true"]');
        topActionLinks.forEach((link) => {
            const baseHref = link.dataset.baseHref;
            if (!baseHref) {
                return;
            }
            link.href = withThemeParam(baseHref, theme);
        });
    };
    const renderTopActions = (theme) => {
        const container = document.querySelector("[data-top-actions]");
        if (!container) {
            return null;
        }
        const linksMarkup = links
            .map((link) => `<a class="btn" data-theme-link="true" data-base-href="${link.href}" href="${withThemeParam(link.href, theme)}">${link.label}</a>`)
            .join("");
        container.innerHTML = `
        <div class="top-actions">
            <a class="home-link"
               style="position:absolute;left:2rem;top:50%;transform:translateY(-50%);text-decoration:none;font-size:1.25rem;line-height:1;color:var(--btn-text);"
               data-theme-link="true"
               data-base-href="${homeLink}"
               href="${withThemeParam(homeLink, theme)}" aria-label="Home" title="Home">&#8962;</a>
            ${linksMarkup}
            <button class="theme-toggle" id="theme-toggle" type="button" aria-label="To the light side!" title="To the light side!"></button>
        </div>
    `.trim();
        return container.querySelector("#theme-toggle");
    };
    const notifyThemeChange = (theme) => {
        window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, {
            detail: { theme },
        }));
    };
    const initialTheme = readThemeFromQuery() || readStoredTheme() || "theme-dark";
    const themeToggle = renderTopActions(initialTheme);
    const root = document.body;
    if (!root) {
        return;
    }
    const setTheme = (name) => {
        root.classList.remove("theme-dark", "theme-solaris");
        root.classList.add(name);
        writeStoredTheme(name);
        syncLocationTheme(name);
        syncTopActionLinks(name);
        notifyThemeChange(name);
        if (themeToggle) {
            const label = name === "theme-solaris" ? "To the dark side!" : "To the light side!";
            themeToggle.setAttribute("aria-label", label);
            themeToggle.setAttribute("title", label);
        }
    };
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const isSolaris = root.classList.contains("theme-solaris");
            setTheme(isSolaris ? "theme-dark" : "theme-solaris");
        });
    }
    setTheme(initialTheme);
})();
