(() => {
    const render = window.PYPIE_MANUAL_RENDER;
    if (typeof render !== "function") {
        return;
    }
    const buildPlusExample = (ast) => {
        const t = ast.typeId("T");
        const n = ast.varId("n", "int");
        return ast.block([
            ast.noWrap(ast.funcDef("plus", [
                ast.arg("x", ast.tensorType("T", [n])),
                ast.arg("y", ast.tensorType("T", [n])),
            ], ast.tensorType("T", [n]), [
                ast.noWrap(ast.ret(ast.binOp(ast.varId("x"), "+", ast.varId("y")))),
            ], { typeParams: [t, n] })),
        ]);
    };
    const buildModelContract = (ast) => {
        const x = ast.typeId("X");
        const yp = ast.typeId("Yp");
        const y = ast.typeId("Y");
        const p = ast.typeId("P");
        const ps = ast.typeId("Ps");
        const g = ast.typeId("G");
        const n = ast.varId("n", "int64");
        const ellipsisBody = () => [
            ast.exprStmt(ast.ellipsis()),
        ];
        return ast.block([
            {
                kind: "ClassDef",
                name: ast.typeId("SomeModel"),
                typeParams: [x, yp, y, p, ps, g],
                body: [
                    ast.noWrap(ast.funcDef("predict", [
                        ast.arg("x", x, "X"),
                        ast.arg("p", ps, "Ps"),
                    ], yp, ellipsisBody(), { decorator: null })),
                    {
                        kind: "BlankLine",
                    },
                    ast.noWrap(ast.funcDef("loss", [
                        ast.arg("ys_pred", ast.tensorType("Yp", [n]), "Tensor[Yp][[n]]"),
                        ast.arg("ys", ast.tensorType("Y", [n]), "Tensor[Y][[n]]"),
                    ], g, ellipsisBody(), { decorator: null, typeParams: [n] })),
                    {
                        kind: "BlankLine",
                    },
                    ast.noWrap(ast.funcDef("update", [
                        ast.arg("p", p, "P"),
                        ast.arg("g", g, "G"),
                    ], p, ellipsisBody(), { decorator: null })),
                    {
                        kind: "BlankLine",
                    },
                    ast.noWrap(ast.funcDef("learn", [
                        ast.arg("xs", ast.tensorType("X", [n]), "Tensor[X][[n]]"),
                        ast.arg("ys", ast.tensorType("Y", [n]), "Tensor[Y][[n]]"),
                        ast.arg("p", ps, "Ps"),
                        ast.arg("revs", ast.typeId("int64"), "int64"),
                    ], ps, ellipsisBody(), { decorator: null, typeParams: [n] })),
                ],
            },
        ]);
    };
    const buildHighLevelInterfaces = (ast) => {
        const x = ast.typeId("X");
        const yp = ast.typeId("Yp");
        const y = ast.typeId("Y");
        const p = ast.typeId("P");
        const ps = ast.typeId("Ps");
        const pi = ast.typeId("Pi");
        const g = ast.typeId("G");
        const n = ast.varId("n", "int64");
        const ellipsisBody = () => [
            ast.exprStmt(ast.ellipsis()),
        ];
        return ast.block([
            {
                kind: "ClassDef",
                name: ast.typeId("SomeStatefulModel"),
                typeParams: [x, yp, y, p, ps, pi, g],
                body: [
                    ast.noWrap(ast.funcDef("predict", [
                        ast.arg("x", x, "X"),
                        ast.arg("p", ps, "Ps"),
                    ], yp, ellipsisBody(), { decorator: null })),
                    {
                        kind: "BlankLine",
                    },
                    ast.noWrap(ast.funcDef("loss", [
                        ast.arg("ys_pred", ast.tensorType("Yp", [n]), "Tensor[Yp][[n]]"),
                        ast.arg("ys", ast.tensorType("Y", [n]), "Tensor[Y][[n]]"),
                    ], g, ellipsisBody(), { decorator: null, typeParams: [n] })),
                    {
                        kind: "BlankLine",
                    },
                    ast.noWrap(ast.funcDef("update", [
                        ast.arg("s", pi, "Pi"),
                        ast.arg("g", g, "G"),
                    ], pi, ellipsisBody(), { decorator: null })),
                    {
                        kind: "BlankLine",
                    },
                    ast.noWrap(ast.funcDef("inflate", [
                        ast.arg("p", p, "P"),
                    ], pi, ellipsisBody(), { decorator: null })),
                    {
                        kind: "BlankLine",
                    },
                    ast.noWrap(ast.funcDef("deflate", [
                        ast.arg("s", pi, "Pi"),
                    ], p, ellipsisBody(), { decorator: null })),
                    {
                        kind: "BlankLine",
                    },
                    ast.noWrap(ast.funcDef("learn", [
                        ast.arg("xs", ast.tensorType("X", [n]), "Tensor[X][[n]]"),
                        ast.arg("ys", ast.tensorType("Y", [n]), "Tensor[Y][[n]]"),
                        ast.arg("p", ps, "Ps"),
                        ast.arg("revs", ast.typeId("int64"), "int64"),
                    ], ps, ellipsisBody(), { decorator: null, typeParams: [n] })),
                ],
            },
        ]);
    };
    const buildLineModel = (ast) => {
        const float32 = ast.typeId("float32");
        const n = ast.varId("n", "int64");
        const lineParams = ast.typeSubscript(ast.typeId("Tuple"), ast.typeList([float32, float32]));
        const lineParamsType = "Tuple[float32, float32]";
        const lineParamsId = () => ast.varId("p", lineParamsType);
        const lineTensor = ast.tensorType("float32", [n]);
        const lineTensorType = "Tensor[float32][[n]]";
        return ast.block([
            {
                kind: "ImportFrom",
                module: ast.plainId("pypie"),
                names: [ast.typeId("Model"), ast.typeId("Tensor")],
            },
            {
                kind: "ImportFrom",
                module: ast.plainId("typing"),
                names: [ast.typeId("Tuple")],
            },
            {
                kind: "BlankLine",
            },
            {
                kind: "ClassDef",
                name: ast.typeId("Line"),
                bases: [
                    ast.typeId("Model"),
                ],
                body: [
                    ast.noWrap(ast.funcDef("predict", [
                        ast.arg("x", float32, "float32"),
                        ast.arg("p", lineParams, lineParamsType),
                    ], float32, [
                        ast.noWrap(ast.ret(ast.binOp(ast.binOp(ast.subscript(lineParamsId(), ast.number(0)), "*", ast.varId("x", "float32")), "+", ast.subscript(lineParamsId(), ast.number(1))))),
                    ], { decorator: null })),
                    {
                        kind: "BlankLine",
                    },
                    ast.noWrap(ast.funcDef("loss", [
                        ast.arg("ys_pred", lineTensor, lineTensorType),
                        ast.arg("ys", lineTensor, lineTensorType),
                    ], float32, [
                        ast.noWrap(ast.ret(ast.call(ast.attr(ast.binOp(ast.binOp(ast.varId("ys_pred", lineTensorType), "-", ast.varId("ys", lineTensorType)), "**", ast.number(2)), "sum"), [ast.number(0)]))),
                    ], { decorator: null, typeParams: [n] })),
                    {
                        kind: "BlankLine",
                    },
                    ast.noWrap(ast.funcDef("update", [
                        ast.arg("p", float32, "float32"),
                        ast.arg("g", float32, "float32"),
                    ], float32, [
                        ast.noWrap(ast.ret(ast.binOp(ast.varId("p", "float32"), "-", ast.parenthesized(ast.binOp(ast.number(0.01), "*", ast.varId("g", "float32")))))),
                    ], { decorator: null })),
                ],
            },
        ]);
    };
    const buildLineAdamModel = (ast) => {
        const t = ast.typeId("T");
        const n = ast.varId("n", "int64");
        const paramsType = ast.typeSubscript(ast.typeId("Params"), t);
        const paramsTypeText = "Params[T]";
        const tensorType = ast.tensorType("T", [n]);
        const tensorTypeText = "Tensor[T][[n]]";
        const stateType = ast.typeSubscript(ast.typeId("Tuple"), ast.typeList([t, t, t]));
        const stateTypeText = "Tuple[T, T, T]";
        const stateItem = (index) => ast.subscript(ast.varId("s", stateTypeText), ast.number(index));
        return ast.block([
            {
                kind: "ImportFrom",
                module: ast.plainId("pypie"),
                names: [ast.typeId("Model"), ast.typeId("Tensor")],
            },
            {
                kind: "ImportFrom",
                module: ast.plainId("typing"),
                names: [ast.typeId("Tuple")],
            },
            {
                kind: "BlankLine",
            },
            {
                kind: "ClassDef",
                decorator: ast.fnId("dataclass"),
                name: ast.typeId("Params"),
                typeParams: [t],
                body: [
                    {
                        kind: "AnnAssign",
                        target: ast.varId("w", "T"),
                        annotation: t,
                    },
                    {
                        kind: "AnnAssign",
                        target: ast.varId("b", "T"),
                        annotation: t,
                    },
                ],
            },
            {
                kind: "BlankLine",
            },
            {
                kind: "ClassDef",
                name: ast.typeId("LineAdam"),
                typeParams: [t],
                bases: [
                    ast.typeId("Model"),
                ],
                body: [
                    ast.noWrap(ast.funcDef("predict", [
                        ast.arg("x", t, "T"),
                        ast.arg("p", paramsType, paramsTypeText),
                    ], t, [
                        ast.noWrap(ast.ret(ast.binOp(ast.binOp(ast.attr(ast.varId("p", paramsTypeText), "w"), "*", ast.varId("x", "T")), "+", ast.attr(ast.varId("p", paramsTypeText), "b")))),
                    ], { decorator: null })),
                    {
                        kind: "BlankLine",
                    },
                    ast.noWrap(ast.funcDef("loss", [
                        ast.arg("ys_pred", tensorType, tensorTypeText),
                        ast.arg("ys", tensorType, tensorTypeText),
                    ], t, [
                        ast.noWrap(ast.ret(ast.call(ast.attr(ast.binOp(ast.binOp(ast.varId("ys_pred", tensorTypeText), "-", ast.varId("ys", tensorTypeText)), "**", ast.number(2)), "sum"), [ast.number(0)]))),
                    ], { decorator: null, typeParams: [n] })),
                    {
                        kind: "BlankLine",
                    },
                    ast.noWrap(ast.funcDef("inflate", [
                        ast.arg("p", t, "T"),
                    ], stateType, [
                        ast.noWrap(ast.ret(ast.tupleExpr([
                            ast.varId("p", "T"),
                            ast.number(0),
                            ast.number(0),
                        ]))),
                    ], { decorator: null })),
                    {
                        kind: "BlankLine",
                    },
                    ast.noWrap(ast.funcDef("deflate", [
                        ast.arg("s", stateType, stateTypeText),
                    ], t, [
                        ast.noWrap(ast.ret(stateItem(0))),
                    ], { decorator: null })),
                    {
                        kind: "BlankLine",
                    },
                    ast.noWrap(ast.funcDef("update", [
                        ast.arg("s", stateType, stateTypeText),
                        ast.arg("g", t, "T"),
                    ], stateType, [
                        ast.noWrap(ast.assign(ast.varId("m", "T"), ast.binOp(ast.parenthesized(ast.binOp(ast.number(0.9), "*", stateItem(1))), "+", ast.parenthesized(ast.binOp(ast.number(0.1), "*", ast.varId("g", "T")))))),
                        ast.noWrap(ast.assign(ast.varId("v", "T"), ast.binOp(ast.parenthesized(ast.binOp(ast.number(0.999), "*", stateItem(2))), "+", ast.parenthesized(ast.binOp(ast.number(0.01), "*", ast.parenthesized(ast.binOp(ast.varId("g", "T"), "**", ast.number(2)))))))),
                        ast.noWrap(ast.ret(ast.tupleExpr([
                            ast.binOp(stateItem(0), "-", ast.parenthesized(ast.binOp(ast.number(0.05), "*", ast.parenthesized(ast.binOp(ast.varId("m", "T"), "/", ast.parenthesized(ast.binOp(ast.call(ast.fnId("sqrt", "T"), [ast.varId("v", "T")]), "+", ast.number(1e-8)))))))),
                            ast.varId("m", "T"),
                            ast.varId("v", "T"),
                        ]))),
                    ], { decorator: null })),
                ],
            },
        ]);
    };
    render({
        id: "models",
        title: "Models",
        intro: "",
        lead: "A model is a set of `OP`s to run machine learning.",
        sections: [
            {
                title: "The basic interface",
                content: [
                    {
                        prose: "A basic model has four `OP`s, as follows."
                    },
                    {
                        codeLabel: "Model contract",
                        buildCodeBlock: buildModelContract,
                    },
                    {
                        prose: "Users define `predict`, `loss`, and `update`. Then PyPie generates `learn`.\n" +
                            "`predict` and `update` operates on individual elements, while `loss` is for batched elements. That is, `predict` " +
                            "takes each `X` in a `Tensor[X][[n]]`; `update` works on each `P` inside the potentially nested structure `Ps`.\n\n" +
                            "Here's a concrete example. When subclassing a `Model`, we omit the `op` decorators on its methods.",
                        codeLabel: "Line model",
                        buildCodeBlock: buildLineModel,
                    },
                    {
                        prose: "Here, `X` is `float32`, `P` is `float32`, and `Ps` is `Tuple[float32, float32]`."
                    },
                ],
            },
            {
                title: "Training",
                content: [
                    {
                        prose: "`learn` iterates for `revs` rounds. At each revision, it applies `predict` " +
                            "to `xs` and the current `p`, feeds the result (`ys_pred`) to `loss`, computes the gradients, and then generates a new `p` using `update`.\n" +
                            "`learn` may take two optional arguments, `batch_size` and `debug`:\n" +
                            "\t- if the given `batch_size` is between 1 and `n`, then `learn` creates another loop " +
                            "inside each revision that runs the above process in batches;\n" +
                            "\t- if `debug` is true, `learn` also returns the history of all inputs passed to `update` at every revision."
                    }
                ]
            },
            {
                title: "The stateful interface",
                content: [
                    {
                        prose: "Some algorithms need additional information to update parameters, such as Adam and RMS. These algorithms need two more `OP`s: " +
                            "`inflate` and `deflate`.",
                        codeLabel: "High-level interfaces",
                        buildCodeBlock: buildHighLevelInterfaces,
                    },
                    {
                        prose: "Now `update` expects `Pi`, a leaf parameter inflated with some additional information. " +
                            "`inflate` initializes this info at the beginning of `learn`, then `deflate` removes it at the end of `learn`.\n" +
                            "Here's an example that implements Adam.",
                        codeLabel: "LineAdam model",
                        buildCodeBlock: buildLineAdamModel,
                    },
                    {
                        prose: "Here, `T` is the leaf parameter `P` and `Tuple[T, T, T]` is the inflated leaf `Pi`."
                    }
                ]
            },
        ],
    });
})();
