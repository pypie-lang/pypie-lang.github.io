(() => {
    const render = window.PYPIE_MANUAL_RENDER;
    if (typeof render !== "function") {
        return;
    }
    const blankLine = () => ({ kind: "BlankLine" });
    const pypieImport = (ast, names) => ({
        kind: "ImportFrom",
        module: ast.plainId("pypie"),
        names,
    });
    const buildPlusExample = (ast) => {
        const t = ast.typeId("T");
        const n = ast.varId("n", "int");
        return ast.block([
            pypieImport(ast, [ast.typeId("Tensor"), ast.fnId("op")]),
            blankLine(),
            ast.noWrap(ast.funcDef("plus", [
                ast.arg("x", ast.tensorType("T", [n])),
                ast.arg("y", ast.tensorType("T", [n])),
            ], ast.tensorType("T", [n]), [
                ast.noWrap(ast.ret(ast.binOp(ast.varId("x"), "+", ast.varId("y")))),
            ], { typeParams: [t, n] })),
        ]);
    };
    const buildStrictConversionErrors = (ast) => {
        const x = ast.typeId("X");
        const y = ast.typeId("Y");
        const float32 = ast.typeId("float32");
        const float16 = ast.typeId("float16");
        const addReturn = (left, right) => [
            ast.noWrap(ast.ret(ast.binOp(left, "+", right))),
        ];
        const commentReturn = (text, left, right) => [
            ast.comment(text),
            ...addReturn(left, right),
        ];
        return ast.block([
            pypieImport(ast, [ast.fnId("op")]),
            blankLine(),
            ast.noWrap(ast.funcDef("x_is_not_y", [
                ast.arg("x", x, "X"),
                ast.arg("y", y, "Y"),
            ], x, commentReturn("`X` != `Y`", ast.varId("x", "X"), ast.varId("y", "Y")), { typeParams: [x, y] })),
            blankLine(),
            ast.noWrap(ast.funcDef("x_is_not_float", [
                ast.arg("x", x, "X"),
                ast.arg("y", float32, "float32"),
            ], float32, commentReturn("`X` != `float32`", ast.varId("x", "X"), ast.varId("y", "float32")), { typeParams: [x] })),
            blankLine(),
            ast.noWrap(ast.funcDef("f32_is_not_f16", [
                ast.arg("x", float32, "float32"),
                ast.arg("y", float16, "float16"),
            ], float32, commentReturn("`float32` != `float16`", ast.varId("x", "float32"), ast.varId("y", "float16")), { typeParams: [x] })),
        ]);
    };
    const buildStrictConversionCasts = (ast) => {
        const x = ast.typeId("X");
        const y = ast.typeId("Y");
        const float32 = ast.typeId("float32");
        const float16 = ast.typeId("float16");
        const cast = (value, target) => ast.call(ast.attr(value, "cast"), [target]);
        const addReturn = (left, right) => [
            ast.noWrap(ast.ret(ast.binOp(left, "+", right))),
        ];
        return ast.block([
            pypieImport(ast, [ast.fnId("op")]),
            blankLine(),
            ast.noWrap(ast.funcDef("cast_y", [
                ast.arg("x", x, "X"),
                ast.arg("y", y, "Y"),
            ], x, addReturn(ast.varId("x", "X"), cast(ast.varId("y", "Y"), x)), { typeParams: [x, y] })),
            blankLine(),
            ast.noWrap(ast.funcDef("cast_to_float", [
                ast.arg("x", x, "X"),
                ast.arg("y", float32, "float32"),
            ], float32, addReturn(cast(ast.varId("x", "X"), float32), ast.varId("y", "float32")), { typeParams: [x] })),
            blankLine(),
            ast.noWrap(ast.funcDef("cast_bits", [
                ast.arg("x", float32, "float32"),
                ast.arg("y", float16, "float16"),
            ], float32, addReturn(ast.varId("x", "float32"), cast(ast.varId("y", "float16"), float32)), { typeParams: [x] })),
        ]);
    };
    const buildLiteralIsFlexible = (ast) => {
        const x = ast.typeId("X");
        return ast.block([
            pypieImport(ast, [ast.fnId("op")]),
            blankLine(),
            ast.noWrap(ast.funcDef("literal_is_flexible", [
                ast.arg("x", x, "X"),
            ], x, [
                ast.noWrap(ast.ret(ast.binOp(ast.varId("x", "X"), "+", ast.number(0.1)))),
            ], { typeParams: [x] })),
        ]);
    };
    render({
        id: "ops",
        title: "Ops & Types",
        intro: "",
        lead: "The `op` decorator is available through `from pypie import op`. `op` marks a Python function, so PyPie may validate its type and parallelize its execution.",
        sections: [
            {
                title: "Static typing",
                body: "The definition must annotate the type of each argument and the result. PyPie validates the function definition using these annotations, " +
                    "and gives errors if validation fails.",
            },
            {
                title: "Supported types",
                body: "PyPie provides `Tensor` and common scalar types, such as `float32` and `bf32`.\n" +
                    "PyPie supports Python Lists, Tuples, and Classes, if their elements are recursively supported."
            },
            {
                title: "Implicit variables",
                body: "PyPie infers the type of implicit variables, e.g. `[T, n]`. Here, `T` is a type and `n` is an `int64`. " +
                    "Optionally, you may annotate the variables that are `int64`s, e.g. `[T, n: int64]`.\n" +
                    "PyPie rejects other annotations for implicits given by users.",
                codeLabel: "Simple add op",
                buildCodeBlock: buildPlusExample,
            },
            {
                title: "Strict conversions",
                content: [
                    {
                        prose: "PyPie does not implicitly convert datatypes. E.g. the followings trigger type errors.",
                        codeLabel: "Type errors",
                        buildCodeBlock: buildStrictConversionErrors,
                    },
                    {
                        prose: "They need explicit casts.",
                        codeLabel: "Explicit casts",
                        buildCodeBlock: buildStrictConversionCasts,
                    },
                ],
            },
            {
                title: "Flexible literals",
                content: [
                    {
                        prose: "Literals do not need casts. E.g. PyPie is happy with the following."
                    },
                    {
                        codeLabel: "Flexible literal",
                        buildCodeBlock: buildLiteralIsFlexible,
                    },
                ],
            },
        ],
    });
})();
