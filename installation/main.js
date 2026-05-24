(() => {
    const render = window.PYPIE_MANUAL_RENDER;
    if (typeof render !== "function") {
        return;
    }
    render({
        id: "installation",
        title: "Install PyPie",
        lead: "",
        intro: "",
        series: {
            title: "Installation",
            pages: [
                {
                    id: "installation",
                    slug: "../installation/index.html",
                    title: "Install PyPie",
                    navTitle: "Install PyPie",
                },
            ],
        },
        sections: [
            {
                title: "Dependencies",
                prose: "- Python >=3.12\n" +
                    "- [Optional] Python >=3.14, to avoid writing `from __future__ import annotations` in every file"
            },
            {
                title: "Install PyPie",
                content: [
                    {
                        code: "pip install -U pypie-lang",
                        codeLabel: "Install PyPie from pip",
                    },
                    {
                        prose: "To run on CUDA:",
                        code: "pip install -U \"pypie-lang[cuda13]\"",
                        codeLabel: "Install PyPie with CUDA support",
                    },
                ],
            },
            {
                title: "IDE Support",
                prose: "PyPie's [vscode extension](vscode:extension/PyPie.pypie) is available.",
            },
        ],
    });
})();
