const site = {
    title: "PyPie",
    url: "https://pypie.dev",
    description: "PyPie is a typed Python DSL for tensor programs.",
    tagline: "Typed tensor programming for Python.",
    nav: [
        { label: "Tutorial", section: "learn" },
        { label: "Manual", section: "manual" },
        { label: "Installation", section: "installation" },
        { label: "Updates", section: "updates" },
    ],
    sections: {
        learn: {
            title: "Tutorial",
            kind: "learn",
            pages: [
                {
                    id: "prelude",
                    slug: "learn/overview/index.html",
                    source: "learn/overview/main.js",
                    title: "Prelude",
                    navTitle: "0. Prelude",
                },
                {
                    id: "types",
                    slug: "learn/types/index.html",
                    source: "learn/types/main.js",
                    title: "Types, Shapes & Tensors",
                    navTitle: "1. Types, Shapes & Tensors",
                },
                {
                    id: "tensor_add",
                    slug: "learn/tensor_add/index.html",
                    source: "learn/tensor_add/main.js",
                    title: "One Function, Many Ranks",
                    navTitle: "2. One Function, Many Ranks",
                },
                {
                    id: "forward_line",
                    slug: "learn/forward_line/index.html",
                    source: "learn/forward_line/main.js",
                    title: "A Forward Line",
                    navTitle: "3. A Forward Line",
                },
                {
                    id: "model_line",
                    slug: "learn/model_line/index.html",
                    source: "learn/model_line/main.js",
                    title: "The Complete Line",
                    navTitle: "4. The Complete Line",
                },
                {
                    id: "corr",
                    slug: "learn/corr/index.html",
                    source: "learn/corr/main.js",
                    title: "Finding Patterns",
                    navTitle: "5. Finding Patterns",
                },
                {
                    id: "cnn",
                    slug: "learn/cnn/index.html",
                    source: "learn/cnn/main.js",
                    title: "CNN",
                    navTitle: "6. CNN",
                },
                {
                    id: "transformer",
                    slug: "learn/transformer/index.html",
                    source: "learn/transformer/main.js",
                    title: "The Transformer",
                    navTitle: "7. The Transformer",
                },
            ],
        },
        manual: {
            title: "Manual",
            kind: "manual",
            numbered: true,
            pages: [
                {
                    id: "guide",
                    slug: "manual/guide/index.html",
                    source: "manual/guide/main.js",
                    title: "The PyPie Guide",
                },
                {
                    id: "tensors_0",
                    slug: "manual/tensors_0/index.html",
                    source: "manual/tensors_0/main.js",
                    title: "Tensor Basics",
                },
                {
                    id: "ops",
                    slug: "manual/ops/index.html",
                    source: "manual/ops/main.js",
                    title: "Ops & Types",
                },
                {
                    id: "parallel",
                    slug: "manual/parallel/index.html",
                    source: "manual/parallel/main.js",
                    title: "Parallelism",
                },
                {
                    id: "built_ins",
                    slug: "manual/built_ins/index.html",
                    source: "manual/built_ins/main.js",
                    title: "Built-in Ops",
                },
                {
                    id: "models",
                    slug: "manual/models/index.html",
                    source: "manual/models/main.js",
                    title: "Models",
                },
            ],
        },
        installation: {
            title: "Installation",
            kind: "manual",
            pages: [
                {
                    id: "installation",
                    slug: "installation/index.html",
                    source: "installation/main.js",
                    title: "Install PyPie",
                    navTitle: "Install PyPie",
                },
            ],
        },
        updates: {
            title: "Updates",
            kind: "manual",
            pages: [
                {
                    id: "5_25_2026",
                    slug: "updates/5_25_2026/index.html",
                    source: "updates/5_25_2026/main.js",
                    title: "5/25/2026",
                    navTitle: "5/25/2026",
                },
            ],
        },
    },
};

module.exports = site;
