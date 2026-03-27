(() => {
    type ManualPageMeta = {
        id?: string;
        slug: string;
        title: string;
        navTitle?: string;
    };

    type ManualSeries = {
        title: string;
        pages: ManualPageMeta[];
    };

    type ManualSectionContent = {
        prose?: string;
        code?: string;
        codeClass?: string;
        codeLabel?: string;
    };

    type ManualSection = {
        id?: string;
        title: string;
        body?: string;
        prose?: string;
        code?: string;
        codeClass?: string;
        codeLabel?: string;
        content?: ManualSectionContent[];
    };

    type ManualPageConfig = {
        id: string;
        title: string;
        lead: string;
        intro?: string;
        sections: ManualSection[];
        series?: ManualSeries;
    };

    type ManualRender = (config: ManualPageConfig) => void;

    type ManualWindow = Window & {
        PYPIE_MANUAL_RENDER?: ManualRender;
    };

    const render = (window as ManualWindow).PYPIE_MANUAL_RENDER;
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
