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
                    navTitle: "0. Install PyPie",
                },
            ],
        },
        sections: [
            {
                title: "Dependencies",
                prose: "- Python >=3.10\n" +
                    "- C Compiler, such as `gcc` or `clang`.\n" +
                    "- [Optional] for the CUDA runtime, PyPie requires these headers: `libcuda`, `libcudart`, `libnvrtc`, and `lcublas`."
            },
            {
                title: "Install PyPie",
                content: [
                    {
                        code: "pip install pypie-lang",
                        codeLabel: "Install PyPie from pip",
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
