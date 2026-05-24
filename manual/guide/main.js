(() => {
    const render = window.PYPIE_MANUAL_RENDER;
    if (typeof render !== "function") {
        return;
    }
    const buildGuideExample = (ast) => {
        const n = ast.varId("n", "int");
        return ast.block([
            ast.noWrap(ast.funcDef("normalize", [ast.arg("xs", ast.tensorType("float", [n]))], ast.tensorType("float", [n]), [
                ast.noWrap(ast.assign(ast.varId("scores"), ast.call(ast.attr(ast.varId("xs"), "exp"), []))),
                ast.noWrap(ast.ret(ast.binOp(ast.varId("scores"), "/", ast.call(ast.attr(ast.varId("scores"), "sum"), [ast.number(0)])))),
            ], { typeParams: [n] })),
        ]);
    };
    render({
        id: "guide",
        title: "The PyPie Guide",
        lead: "PyPie is a Python DSL. A PyPie function is just a Python function, with an `@op` on it.\n" +
            "This guide shows the subset of Python syntax supported in an `@op` " +
            "and their expected behaviors.",
        intro: "",
        sections: [],
    });
})();
