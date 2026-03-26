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

    const buildGuideExample = (ast: AstApi) => {
        const n = ast.varId("n", "int");
        return ast.block([
            ast.noWrap(
                ast.funcDef(
                    "normalize",
                    [ast.arg("xs", ast.tensorType("float", [n]))],
                    ast.tensorType("float", [n]),
                    [
                        ast.noWrap(
                            ast.assign(
                                ast.varId("scores"),
                                ast.call(ast.attr(ast.varId("xs"), "exp"), [])
                            )
                        ),
                        ast.noWrap(
                            ast.ret(
                                ast.binOp(
                                    ast.varId("scores"),
                                    "/",
                                    ast.call(ast.attr(ast.varId("scores"), "sum"), [ast.number(0)])
                                )
                            )
                        ),
                    ],
                    { typeParams: [n] }
                )
            ),
        ]);
    };

    render({
        id: "guide",
        title: "The PyPie Guide",
        lead: "PyPie is a Python DSL. A PyPie function is just a Python function--it is defined among other " +
        "Python functions and can be invoked like any other Python function.\nThis guide shows what Python syntax is " +
        "supported by PyPie and what the expected behaviors are.",
        intro: "",
        sections: [
        ],
    });
})();
