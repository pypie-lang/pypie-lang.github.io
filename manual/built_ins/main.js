(() => {
    const render = window.PYPIE_MANUAL_RENDER;
    if (typeof render !== "function") {
        return;
    }
    const buildExpressionExample = (ast) => {
        const n = ast.varId("n", "int");
        return ast.block([
            ast.noWrap(ast.funcDef("log_mean", [ast.arg("xs", ast.tensorType("float", [n]))], ast.typeId("float"), [
                ast.noWrap(ast.ret(ast.call(ast.attr(ast.call(ast.attr(ast.varId("xs"), "log"), []), "avg"), [ast.number(0)]))),
            ], { typeParams: [n] })),
        ]);
    };
    const buildMapGetExample = (ast) => {
        const n = ast.varId("n", "int");
        const m = ast.varId("m", "int");
        const itemType = ast.typeId("T");
        return ast.block([
            ast.noWrap(ast.funcDef("map_get", [
                ast.arg("emb", ast.tensorType("T", [n, m])),
                ast.arg("indices", ast.tensorType("int", [n]), "int"),
            ], ast.tensorType("T", [n]), [
                ast.noWrap(ast.ret(ast.listComp(ast.subscript(ast.varId("item"), ast.varId("idx", "int")), [ast.tupleExpr([ast.varId("item"), ast.varId("idx", "int")])], ast.call(ast.plainId("zip"), [
                    ast.varId("emb"),
                    ast.varId("indices", "int"),
                ])))),
            ], { typeParams: [itemType, n, m] })),
        ]);
    };
    const buildConcat11Example = (ast) => {
        const m = ast.varId("m", "int");
        const n1 = ast.varId("n1", "int");
        const n2 = ast.varId("n2", "int");
        const itemType = ast.typeId("T");
        const returnShape = ast.typeList([m, ast.typeId("n1 + n2")]);
        return ast.block([
            ast.funcDef("concat_1_1", [
                ast.arg("xs", ast.tensorType("T", [m, n1])),
                ast.arg("ys", ast.tensorType("T", [m, n2])),
            ], ast.typeSubscript(ast.typeSubscript(ast.typeId("Tensor"), itemType), returnShape), [
                ast.noWrap(ast.ret(ast.listComp(ast.call(ast.plainId("concat"), [ast.varId("x"), ast.varId("y")]), [ast.tupleExpr([ast.varId("x"), ast.varId("y")])], ast.call(ast.plainId("zip"), [ast.varId("xs"), ast.varId("ys")])))),
            ], { typeParams: [itemType, m, n1, n2] }),
        ]);
    };
    render({
        id: "built_ins",
        title: "Built-in Ops",
        intro: "",
        lead: "This section introduces the native Ops provided by PyPie.",
        sections: [
            {
                title: "Arithmetic",
                content: [
                    {
                        code: "__+__: [T](x: T, y: T) -> T",
                    },
                    {
                        code: "__-__: [T](x: T, y: T) -> T"
                    },
                    {
                        code: "__*__: [T](x: T, y: T) -> T"
                    },
                    {
                        code: "__/__: [T](x: T, y: T) -> T"
                    },
                    {
                        code: "__%__: [T](x: T, y: T) -> T"
                    },
                    {
                        code: "__**__: [T](x: T, y: T) -> T"
                    },
                    {
                        prose: "These dunder functions are desugared infix Ops, e.g. `__+__(x, y)` is for `x + y`. They all expect two rank-0 tensors of the same element type."
                    },
                    {
                        code: "larger: [T](x: T, y: T) -> T",
                    },
                    {
                        code: "smaller: [T](x: T, y: T) -> T",
                    },
                    {
                        prose: "The larger or smaller one between the two."
                    },
                    {
                        code: "exp: [T](x: T) -> T"
                    },
                    {
                        code: "sqrt: [T](x: T) -> T"
                    },
                ],
            },
            {
                title: "Reducers",
                content: [
                    {
                        prose: "A reducer takes a tensor and arbitrarily many dimensions to reduce. The dimensions must be integer literals. " +
                            "PyPie recognizes both `xs.sum(0, 1)` and `sum(xs, 0, 1)`--they are identical.\n" +
                            "In the result, the given dimensions are removed. E.g. if `xs` is a `Tensor[int][[a, b, c]]`, then `xs.sum(0, 2)` is a `Tensor[int][[b]]`. " +
                            "The given dimensions may not exceed the rank of the tensor. Duplicated dimensions are accepted, as if only one is give.\n" +
                            "A reducer expects the maximum rank on all its arguments. So rank polymorphism has no effect on reducers. " +
                            "PyPie provides five reducers."
                    },
                    {
                        code: "sum: SpecialHandling",
                    },
                    {
                        code: "product: SpecialHandling",
                    },
                    {
                        code: "avg: SpecialHandling",
                    },
                    {
                        code: "max: SpecialHandling",
                    },
                    {
                        code: "min: SpecialHandling",
                    },
                    {
                        prose: "Their types are `SpecialHandling` because they are beyond the expressivenss of PyPie's types.\n" +
                            "If we made up some syntax for a fully fledged dependent type, then their signatures would be something like " +
                            "`[T, s1: List[int]] (xs: Tensor[T][s1], s2: List[int]) -> Σ(s3: List[int], Tensor[int][s3] ∧ ...)`\n" +
                            "where `...` ensures that `s3` contains the unreduced dimensions and preserves their orders in `s1`, and nothing else.\n" +
                            "But such types are very tedious and do not help much with our usages."
                    }
                ]
            },
            {
                title: "Shapes",
                content: [
                    {
                        code: "reshape: [T, s1: List[int], s2: List[int]](xs: Tensor[T][s2]]) -> Tensor[T][s2]"
                    },
                    {
                        prose: "PyPie validates `s1` and `s2`--the products of their elements must be identical."
                    },
                    {
                        code: "permute: SpecialHandling"
                    },
                    {
                        prose: "`permute` takes a tensor and arbitrarily many dimensions. It reorders the elements in the tensor. " +
                            "E.g. if `xs` is a `Tensor[int][[a, b, c]]`, then `permute(xs, 0, 2, 1)` transposes the last two dimensions: `Tensor[int][[a, c, b]]`.\n" +
                            "The dimensions must be integer literals and each dimension in the tensor must occur once. E.g. `permute(xs, 0, 1)` would be a type eror for missing dimension `2`.\n" +
                            "`permute` expects the maximum rank on all its arguments.\n" +
                            "`xs.permute(0, 2, 1)` is identical to `permute(xs, 0, 2, 1)`."
                    },
                    {
                        code: "rep: [T](shape: List[int], x: T) -> Tensor[T][shape]"
                    },
                    {
                        prose: "Creating a Tensor of `shape`, filled with `x`."
                    },
                    {
                        code: "iota: (i: int) -> Tensor[int][[i]]"
                    },
                    {
                        prose: "Creating a sequence of integers up to `i - 1`."
                    },
                    {
                        code: "length: [T, n: int](xs: Tensor[T][[n]]) -> int",
                    },
                    {
                        code: "concat: [T, n: int, m: int](xs: Tensor[T][[n]], ys: Tensor[T][[m]]) -> Tensor[T][[n + m]]",
                    },
                    {
                        prose: "All shape ops also have maximum expected ranks for their inputs. But we can always customize their behavior by " +
                            "wrapping them in an ordinary `op`. E.g. given"
                    },
                    {
                        code: "xs = Tensor([[1, 2], [3, 4]])\nys = Tensor([[5, 6], [7, 8]])\n" +
                            "print(concat(xs, y))\n" +
                            "[[1, 2], [3, 4], [5, 6], [7, 8]]"
                    },
                    {
                        prose: "If we need to concatenate the inner elements, we may define",
                        codeLabel: "concat_1_1",
                        buildCodeBlock: buildConcat11Example,
                    },
                    {
                        prose: "then we have the following."
                    },
                    {
                        code: "print(concat_1_1(xs, ys))\n[[1, 2, 5, 6], [3, 4, 7, 8]]"
                    }
                ]
            },
            {
                title: "Getters",
                content: [
                    {
                        code: "__getitem__: [T, n: int](xs: Tensor[T][[n]], idx: int) -> T",
                    },
                    {
                        prose: "`__getitem__(xs, idx)` is the desugared form of `xs[idx]`. Its inputs have maximum expected ranks.\n" +
                            "PyPie does not check if `idx` is smaller than `n`."
                    },
                    {
                        code: "slice_get: [T, n: int](xs: Tensor[T][[n]], start: int, end: int) -> Tensor[T][[end - start + 1]]",
                    },
                    {
                        prose: "`slice_get(xs, start, end)` is the desugared form of `xs[start:end]`. Its inputs have maximum expected ranks\n" +
                            "PyPie does not check if `end` is not smaller than `start` or if `n` is not smaller than `end - start + 1`."
                    }
                ]
            },
            {
                title: "Random Numbers",
                content: [
                    {
                        prose: "Caveat: with PyPie's current implementation, random seeds are generated at compilation. " +
                            "So, running a cached PyPie artifact generates the same random numbers."
                    },
                    {
                        code: "rand: [T](shape: List[int], low: T, high: T) -> Tensor[T][shape]"
                    },
                    {
                        prose: "Creating random numbers with a uniform distribution."
                    },
                    {
                        code: "randn: [T](shape: List[int], mean: T, variance: T) -> Tensor[T][shape]"
                    },
                    {
                        prose: "Creating random numbers with a normal distribution."
                    }
                ]
            }
        ],
    });
})();
