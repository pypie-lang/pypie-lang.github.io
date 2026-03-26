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
        id: "ops",
        title: "Ops",
        intro: "",
        lead: "The `op` decorator is available through `from pypie import op`. `op` marks a Python function, so PyPie may validate its type and parallelize its execution.",
        sections: [
            {
                title: "Static typing",
                body: "The definition must annotate the type of each argument and the result. PyPie validates the function definition using these annotations, " +
                "and gives errors if validation fails.",
            },
            {
                title: "Accepted types",
                body: "PyPie accepts atomic types `int` (as `i64`), `float` (as `float32`). PyPie accepts nested `Tensor`s and `Tuple`s if their element types are acceptable. " +
                "A Class is acceptable if all its fields are acceptable."
            },
            {
                title: "Implicit variables",
                body: "PyPie accepts two kinds of implicit variables. Without an annotation, an implicit variable represents an arbitrary type, like `T` below. " +
                "An implicit variable annotated by `int` is a unique integer value. E.g. if we had `n: int` and `m: int`, then PyPie treats " +
                "`n` and `m` as distinct values.",
                codeLabel: "Simple add op",
                buildCodeBlock: buildPlusExample,
            },
        ],
    });
})();
