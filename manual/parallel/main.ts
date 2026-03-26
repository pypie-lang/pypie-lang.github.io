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

    const buildExpressionExample = (ast: AstApi) => {
        const n = ast.varId("n", "int");
        return ast.block([
            ast.noWrap(
                ast.funcDef(
                    "log_mean",
                    [ast.arg("xs", ast.tensorType("float", [n]))],
                    ast.typeId("float"),
                    [
                        ast.noWrap(
                            ast.ret(
                                ast.call(
                                    ast.attr(ast.call(ast.attr(ast.varId("xs"), "log"), []), "avg"),
                                    [ast.number(0)]
                                )
                            )
                        ),
                    ],
                    { typeParams: [n] }
                )
            ),
        ]);
    };

    const buildMapGetExample = (ast: AstApi) => {
        const n = ast.varId("n", "int");
        const m = ast.varId("m", "int");
        const itemType = ast.typeId("T");
        return ast.block([
            ast.noWrap(
                ast.funcDef(
                    "map_get",
                    [
                        ast.arg("emb", ast.tensorType("T", [n, m])),
                        ast.arg("indices", ast.tensorType("int", [n]), "int"),
                    ],
                    ast.tensorType("T", [n]),
                    [
                        ast.noWrap(
                            ast.ret(
                                ast.listComp(
                                    ast.subscript(ast.varId("item"), ast.varId("idx", "int")),
                                    [ast.tupleExpr([ast.varId("item"), ast.varId("idx", "int")])],
                                    ast.call(ast.plainId("zip"), [
                                        ast.varId("emb"),
                                        ast.varId("indices", "int"),
                                    ])
                                )
                            )
                        ),
                    ],
                    { typeParams: [itemType, n, m] }
                )
            ),
        ]);
    };

    render({
        id: "parallel",
        title: "Parallelism",
        intro: "",
        lead:
            "PyPie parallelizes two kinds of ops: mappers and reducers.",
        sections: [
            {
                title: "Mappers & Tensor Comprehension",
                content: [
                    {
                        prose:
                            "When executing an `op`, PyPie parallizes `[f(x) for x in tensor_x]`,\nor, in the case of multiple tensors, `[f(x, y, ...) for (x, y) in zip(tensor_x, tensor_y, ...)]`.\n" +
                            "Tensor comprehension is the most common form of !!mapper!!s: they map the operator `f` in parallel to each element in the tensors.\n\n" +
                            "Below, the `map_get` definition shows the zipped form: each `(item, idx)` pair selects one element from the aligned row in `emb`. " +
                            "During runtime, `item[idx]` is mapped in parallel to the outermost dimension of `emb` and `indices`."
                    },
                    {
                        codeLabel: "Batched get",
                        buildCodeBlock: buildMapGetExample,
                    },
                ],
            },
            {
                title: "Reducers",
                content: [
                    {
                        prose:
                        "A !!reducer!! removes some dimensions of a Tensor. E.g."
                    },
                    {
                        code:
                        "print(Tensor([1, 2, 3]).sum(0))\n" +
                        "6"
                    },
                    {
                        prose:
                        "sum(0) removes the first dimension, by adding the elements of the first dimension.\n" +
                        "PyPie parallelizes the reduction of each dimension, which takes O(log n)."
                    },
                ],
            },
            {
                title: "Rank Polymorphism",
                content: [
                    {
                        prose: "An `op` may apply to tensors that exceed its expected ranks.\n" +
                        "In the above example, `map_get` expects a rank-2 tensor for `emb` and a rank-1 tensor for `indices`. " +
                        "And it may take tensors of larger ranks, like the following." 
                    },
                    {
                        code:
                        "batch_emb = Tensor([[[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]], [[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]]])\n" +
                        "indices = Tensor([0, 1])\n" +
                        "print(map_get(batch_emb, indices))\n" +
                        "Tensor([[1.0, 5.0], [1.0, 5.0]])",
                    },
                    {
                        prose: "Here, PyPie automatically creates a mapper that runs in parallel, effectively like the following."
                    },
                    {
                        code:
                        "[map_getter(x, indices) for x in batch_emb]"
                    }
                ]
            },
        ],
    });
})();
