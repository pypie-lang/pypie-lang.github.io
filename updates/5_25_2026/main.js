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
        id: "5_25_2026",
        title: "5/25/2026",
        intro: "",
        lead: "PyPie is here! We invite feedback and criticism at hi@pypie.dev.",
        sections: [
            {
                title: "Language core",
                body: "PyPie is powered by a mini, fully functioning, and seasoned dependent type checker.\n" +
                    "It's mini, since there's only one universe (e.g. type does not have a type) and no user-defined datatypes. That's " +
                    "probably good enough for writing tensor programs. It's fully functioning in the sense that typing judgements, normalization by evaluation, " +
                    "and bi-directional type checking are up and running. It's seasoned with rank-polymorphism (so people don't need to write map everywhere) " +
                    "and some arithmetic rewriting (so people don't need to prove commutativity).\n" +
                    "We have intentionally left out some checks for the time being. For `xs[n]` as an example, PyPie does not require a proof like `n < len(xs)`, " +
                    "since we'd like to keep authoring as Pythonic as possible.\n"
            },
            {
                title: "Tutorial",
                body: "To help people think in PyPie, we've drafted a hands-on tutorial to build three models: a linear regression model, a CNN, and a transformer. " +
                    "The chapters are written in the style of [The Little Learner](https://www.thelittlelearner.com/). " +
                    "(The idea of PyPie came from \"What if The Little Learner were typed and Pythonic?\")"
            },
            {
                title: "Authoring",
                body: "PyPie is designed to be a natural part of Python.\n" +
                    "It's available through `pip install pypie-lang`, uses a subset of Python syntax, and runs as ordinary Python functions."
            },
            {
                title: "Optimization and backends",
                body: "PyPie currently compiles to JAX, which optimizes for fusion, parallelization, etc. PyPie has a few " +
                    "rewrite rules to help JAX recognize special patterns, like dot products and sliding windows.\n" +
                    "So, in theory, PyPie is supposed to work on any backend supported by JAX. We have tested Linux with CUDA and Apple Silicon."
            },
            {
                title: "AI slop",
                body: "It turns out that not every PL person is a professional web designer, a VS Code plugin author, or even a good parser writer. " +
                    "So we've offloaded the following components to Codex and Claude.\n" +
                    "In the compiler code, we've vibe-coded the syntax translation from Ruff AST to PyPie IR and from PyPie IR to JAX code. They seem " +
                    "to be working under hundreds of (AI-generated) test cases. So we don't have plans to revamp them yet.\n" +
                    "This website is made by Codex. We like its aesthetics after a few iterations and will probably keep most of it. One thing we need to " +
                    "change is the ASTs of code snippets. Now Codex has an AST grammar defined in TypeScript and \"makes\" an AST object out of a piece of Python code. " +
                    "Initially we thought it was funny, but now it has become unmanageable; e.g. it often generates the wrong type annotations. " +
                    "We are now exploring running PyPie in WebAssembly so that the type annotations are generated correctly.\n" +
                    "Codex also wrote the VS Code plugin, which seems to be small and harmless."
            },
        ],
    });
})();
