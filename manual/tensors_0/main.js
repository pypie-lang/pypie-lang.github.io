(() => {
    const render = window.PYPIE_MANUAL_RENDER;
    if (typeof render !== "function") {
        return;
    }
    const buildTensorExample = (ast) => {
        const m = ast.varId("m", "int");
        const n = ast.varId("n", "int");
        return ast.block([
            ast.noWrap(ast.funcDef("column_energy", [ast.arg("xs", ast.tensorType("float", [m, n]))], ast.tensorType("float", [n]), [
                ast.noWrap(ast.assign(ast.varId("squared"), ast.binOp(ast.varId("xs"), "*", ast.varId("xs")))),
                ast.noWrap(ast.ret(ast.call(ast.attr(ast.varId("squared"), "sum"), [ast.number(0)]))),
            ], { typeParams: [m, n] })),
        ]);
    };
    render({
        id: "tensors_0",
        title: "Tensor Basics",
        intro: "",
        lead: "Tensors are available through `from pypie import Tensor`",
        sections: [
            {
                title: "Tensor as a type",
                body: "`Tensor[t][s]` is a type, when `t` is a type and `s` is a `List[int]`. `s` can be any value--" +
                    "literals, variables, and function calls--as long as PyPie can infer its type as `List[int]`.\n" +
                    "PyPie normalizes types during type checking, e.g. `Tensor[int][[a, b + c]]` and `Tensor[Tensor[int][[c + b]]][[a]]` are identical. " +
                    "PyPie rewrites the shapes to identify some equalities, like `b + c` vs `c + b`. PyPie does not evaluate function calls in shapes, e.g. " +
                    "`my_plus(b, c)` is not equal to `b + c`, even if `my_plus` was just a wrapper of `+`."
            },
            {
                title: "Tensor as a constructor",
                body: "Tensor converts a nested list to a Tensor value, such as `Tensor([[1, 2, 3], [4, 5, 6]])`. " +
                    "It automatically infers elements' type using the upper bound, e.g. `Tensor([[1, 2, 3], [4, 5, 6.0]])` has type `Tensor[float][[2, 3]]`."
            },
            {
                title: "Interop with other systems",
                body: "Tensor implements DLPack. It is cheap to exchange a PyPie Tensor with a counterpart in another system that also implements DLPack, like NumPy and PyTorch."
            },
        ],
    });
})();
