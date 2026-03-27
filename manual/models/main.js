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
    render({
        id: "models",
        title: "Models",
        intro: "",
        lead: "under construction",
        sections: [],
    });
})();
