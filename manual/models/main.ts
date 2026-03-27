(() => {
    type AstApi = any;

    type ManualSectionContent = {
        prose?: string;
        code?: string;
        codeClass?: string;
        codeLabel?: string;
        buildCodeBlock?: (ast: AstApi) => unknown;
    };

    type ManualSection = {
        id?: string;
        title: string;
        body?: string;
        prose?: string;
        code?: string;
        codeClass?: string;
        codeLabel?: string;
        buildCodeBlock?: (ast: AstApi) => unknown;
        content?: ManualSectionContent[];
    };

    type ManualPageConfig = {
        id: string;
        title: string;
        lead: string;
        intro?: string;
        sections: ManualSection[];
    };

    type ManualRender = (config: ManualPageConfig) => void;

    type ManualWindow = Window & {
        PYPIE_MANUAL_RENDER?: ManualRender;
    };

    const render = (window as ManualWindow).PYPIE_MANUAL_RENDER;
    if (typeof render !== "function") {
        return;
    }

    const buildPlusExample = (ast: AstApi) => {
        const t = ast.typeId("T");
        const n = ast.varId("n", "int");
        return ast.block([
            ast.noWrap(
                ast.funcDef(
                    "plus",
                    [
                        ast.arg("x", ast.tensorType("T", [n])),
                        ast.arg("y", ast.tensorType("T", [n])),
                    ],
                    ast.tensorType("T", [n]),
                    [
                        ast.noWrap(
                            ast.ret(ast.binOp(ast.varId("x"), "+", ast.varId("y")))
                        ),
                    ],
                    { typeParams: [t, n] }
                )
            ),
        ]);
    };

    render({
        id: "models",
        title: "Models",
        intro: "",
        lead: "under construction",
        sections: [
        ],
    });
})();
