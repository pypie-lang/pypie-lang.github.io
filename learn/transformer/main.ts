(() => {
    type AstApi = unknown;

    type LearnPageConfig = {
        id: string;
        dialog: LearnDialogMessage[];
        notes?: string;
    };

    type Side = "left" | "right";

    type LearnDialogMessage = {
        side: Side;
        speaker: string;
        text: string;
        textAfterCode?: string;
        figureSrc?: string;
        figureAlt?: string;
        codeClass?: string;
        codeLabel?: string;
        buildCodeBlock?: (ast: AstApi) => unknown;
    };

    type LearnRender = (config: LearnPageConfig) => void;

    type LearnWindow = Window & {
        PYPIE_LEARN_RENDER?: LearnRender;
    };

    const render = (window as LearnWindow).PYPIE_LEARN_RENDER;
    if (typeof render !== "function") {
        return;
    }

    const message = (speaker: "D" | "W", text: string): LearnDialogMessage => ({
        side: speaker === "W" ? "right" : "left",
        speaker,
        text,
    });

    const intTypeParam = (name: string) => ({
        kind: "Identifier",
        name,
        role: "var",
        type: "int",
    });

    const intTypeParams = (...names: string[]) =>
        names.map((name) => intTypeParam(name));

    const selfAttentionDefinitionBlock = {
        kind: "Block",
        body: [
            {
                kind: "ClassDef",
                name: {
                    kind: "Identifier",
                    name: "AttentionParams",
                    role: "type",
                },
                typeParams: intTypeParams("n", "d"),
                body: [
                    {
                        kind: "AnnAssign",
                        target: {
                            kind: "Identifier",
                            name: "q",
                            role: "var",
                            type: "Tensor[float][[l, n]]",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "Identifier",
                                name: "LinearParams",
                                role: "type",
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "Identifier",
                                        name: "float",
                                        role: "type",
                                    },
                                    intTypeParam("n"),
                                    intTypeParam("d"),
                                ],
                            },
                        },
                    },
                    {
                        kind: "AnnAssign",
                        target: {
                            kind: "Identifier",
                            name: "k",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "Identifier",
                                name: "LinearParams",
                                role: "type",
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "Identifier",
                                        name: "float",
                                        role: "type",
                                    },
                                    intTypeParam("n"),
                                    intTypeParam("d"),
                                ],
                            },
                        },
                    },
                    {
                        kind: "AnnAssign",
                        target: {
                            kind: "Identifier",
                            name: "v",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "Identifier",
                                name: "LinearParams",
                                role: "type",
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "Identifier",
                                        name: "float",
                                        role: "type",
                                    },
                                    intTypeParam("n"),
                                    intTypeParam("d"),
                                ],
                            },
                        },
                    },
                ],
            },
            {
                kind: "BlankLine",
            },
            {
                kind: "FunctionDef",
                name: {
                    kind: "Identifier",
                    name: "attention",
                    role: "fn",
                },
                typeParams: intTypeParams("l", "d", "n"),
                args: [
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "x",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "TypeSubscript",
                                base: {
                                    kind: "Identifier",
                                    name: "Tensor",
                                    role: "type",
                                },
                                index: {
                                    kind: "Identifier",
                                    name: "float",
                                    role: "type",
                                },
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "TypeList",
                                        items: [
                                            intTypeParam("l"),
                                            intTypeParam("d"),
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "p",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "Identifier",
                                name: "AttentionParams",
                                role: "type",
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    intTypeParam("n"),
                                    intTypeParam("d"),
                                ],
                            },
                        },
                    },
                ],
                returns: {
                    kind: "TypeSubscript",
                    base: {
                        kind: "TypeSubscript",
                        base: {
                            kind: "Identifier",
                            name: "Tensor",
                            role: "type",
                        },
                        index: {
                            kind: "Identifier",
                            name: "float",
                            role: "type",
                        },
                    },
                    index: {
                        kind: "TypeList",
                        items: [
                            {
                                kind: "TypeList",
                                items: [
                                    intTypeParam("l"),
                                    intTypeParam("n"),
                                ],
                            },
                        ],
                    },
                },
                decorator: {
                    kind: "Identifier",
                    name: "op",
                    role: "fn",
                },
                body: [
                    {
                        kind: "Assign",
                        target: {
                            kind: "Identifier",
                            name: "q",
                            role: "var",
                            type: "Tensor[float][[l, n]]",
                        },
                        value: {
                            kind: "Call",
                            callee: {
                                kind: "Identifier",
                                name: "linear",
                                role: "fn",
                                type: "Tensor[float][[l, n]]",
                            },
                            args: [
                                {
                                    kind: "Identifier",
                                    name: "x",
                                    role: "var",
                                    type: "Tensor[float][[l, d]]",
                                },
                                {
                                    kind: "Attribute",
                                    value: {
                                        kind: "Identifier",
                                        name: "p",
                                        role: "var",
                                    },
                                    attr: {
                                        kind: "Identifier",
                                        name: "q",
                                        role: "var",
                                        type: "LinearParams[float, n, d]",
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: "Assign",
                        target: {
                            kind: "Identifier",
                            name: "k",
                            role: "var",
                            type: "Tensor[float][[l, n]]",
                        },
                        value: {
                            kind: "Call",
                            callee: {
                                kind: "Identifier",
                                name: "linear",
                                role: "fn",
                                type: "Tensor[float][[l, n]]",
                            },
                            args: [
                                {
                                    kind: "Identifier",
                                    name: "x",
                                    role: "var",
                                    type: "Tensor[float][[l, d]]",
                                },
                                {
                                    kind: "Attribute",
                                    value: {
                                        kind: "Identifier",
                                        name: "p",
                                        role: "var",
                                    },
                                    attr: {
                                        kind: "Identifier",
                                        name: "k",
                                        role: "var",
                                        type: "LinearParams[float, n, d]",
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: "Assign",
                        target: {
                            kind: "Identifier",
                            name: "v",
                            role: "var",
                            type: "Tensor[float][[l, n]]",
                        },
                        value: {
                            kind: "Call",
                            callee: {
                                kind: "Identifier",
                                name: "linear",
                                role: "fn",
                                type: "Tensor[float][[l, n]]",
                            },
                            args: [
                                {
                                    kind: "Identifier",
                                    name: "x",
                                    role: "var",
                                    type: "Tensor[float][[l, d]]",
                                },
                                {
                                    kind: "Attribute",
                                    value: {
                                        kind: "Identifier",
                                        name: "p",
                                        role: "var",
                                    },
                                    attr: {
                                        kind: "Identifier",
                                        name: "v",
                                        role: "var",
                                        type: "LinearParams[float, n, d]",
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: "Assign",
                        target: {
                            kind: "Identifier",
                            name: "weights",
                            role: "var",
                            type: "Tensor[float][[l, l]]",
                        },
                        value: {
                            kind: "BinOp",
                            left: {
                                kind: "BinOp",
                                left: {
                                    kind: "Identifier",
                                    name: "q",
                                    role: "var",
                                    type: "Tensor[float][[l, n]]",
                                },
                                op: "@",
                                right: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Attribute",
                                        type: "Tensor[float][[n, l]]",
                                        value: {
                                            kind: "Identifier",
                                            name: "k",
                                            role: "var",
                                            type: "Tensor[float][[l, n]]",
                                        },
                                        attr: {
                                            kind: "Identifier",
                                            name: "permute",
                                            role: "plain",
                                            type: "Tensor[float][[n, l]]",
                                        },
                                    },
                                    args: [
                                        {
                                            kind: "Number",
                                            value: "1",
                                        },
                                        {
                                            kind: "Number",
                                            value: "0",
                                        },
                                    ],
                                },
                            },
                            op: "/",
                            right: {
                                kind: "Call",
                                callee: {
                                    kind: "Attribute",
                                    type: "float",
                                    value: {
                                        kind: "Identifier",
                                        name: "n",
                                        role: "var",
                                        type: "int",
                                    },
                                    attr: {
                                        kind: "Identifier",
                                        name: "sqrt",
                                        role: "plain",
                                        type: "float",
                                    },
                                },
                                args: [],
                            },
                        },
                    },
                    {
                        kind: "ExprStmt",
                        value: {
                            kind: "Identifier",
                            name: "...",
                            role: "plain",
                        },
                    },
                    {
                        kind: "Assign",
                        target: {
                            kind: "Identifier",
                            name: "weights",
                            role: "var",
                            type: "Tensor[float][[l, l]]",
                        },
                        value: {
                            kind: "Call",
                            callee: {
                                kind: "Identifier",
                                name: "softmax",
                                role: "fn",
                                type: "Tensor[float][[l, l]]",
                            },
                            args: [
                                {
                                    kind: "Identifier",
                                    name: "weights",
                                    role: "var",
                                    type: "Tensor[float][[l, l]]",
                                },
                            ],
                        },
                    },
                    {
                        kind: "Return",
                        value: {
                            kind: "BinOp",
                            left: {
                                kind: "Identifier",
                                name: "weights",
                                role: "var",
                                type: "Tensor[float][[l, l]]",
                            },
                            op: "@",
                            right: {
                                kind: "Identifier",
                                name: "v",
                                role: "var",
                                type: "Tensor[float][[l, n]]",
                            },
                        },
                    },
                ],
            },
        ],
    };

    const layerNormDefinitionBlock = {
        kind: "Block",
        body: [
            {
                kind: "ClassDef",
                name: {
                    kind: "Identifier",
                    name: "LayerNormParams",
                    role: "type",
                },
                typeParams: intTypeParams("d"),
                body: [
                    {
                        kind: "AnnAssign",
                        target: {
                            kind: "Identifier",
                            name: "weight",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "TypeSubscript",
                                base: {
                                    kind: "Identifier",
                                    name: "Tensor",
                                    role: "type",
                                },
                                index: {
                                    kind: "Identifier",
                                    name: "float",
                                    role: "type",
                                },
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "TypeList",
                                        items: [intTypeParam("d")],
                                    },
                                ],
                            },
                        },
                    },
                    {
                        kind: "AnnAssign",
                        target: {
                            kind: "Identifier",
                            name: "bias",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "TypeSubscript",
                                base: {
                                    kind: "Identifier",
                                    name: "Tensor",
                                    role: "type",
                                },
                                index: {
                                    kind: "Identifier",
                                    name: "float",
                                    role: "type",
                                },
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "TypeList",
                                        items: [intTypeParam("d")],
                                    },
                                ],
                            },
                        },
                    },
                ],
            },
            {
                kind: "BlankLine",
            },
            {
                kind: "FunctionDef",
                name: {
                    kind: "Identifier",
                    name: "layer_norm",
                    role: "fn",
                },
                typeParams: intTypeParams("l", "d"),
                args: [
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "x",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "TypeSubscript",
                                base: {
                                    kind: "Identifier",
                                    name: "Tensor",
                                    role: "type",
                                },
                                index: {
                                    kind: "Identifier",
                                    name: "float",
                                    role: "type",
                                },
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "TypeList",
                                        items: [
                                            intTypeParam("l"),
                                            intTypeParam("d"),
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "p",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "Identifier",
                                name: "LayerNormParams",
                                role: "type",
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "Identifier",
                                        name: "float",
                                        role: "type",
                                    },
                                    intTypeParam("d"),
                                ],
                            },
                        },
                    },
                ],
                returns: {
                    kind: "TypeSubscript",
                    base: {
                        kind: "TypeSubscript",
                        base: {
                            kind: "Identifier",
                            name: "Tensor",
                            role: "type",
                        },
                        index: {
                            kind: "Identifier",
                            name: "float",
                            role: "type",
                        },
                    },
                    index: {
                        kind: "TypeList",
                        items: [
                            {
                                kind: "TypeList",
                                items: [
                                    intTypeParam("l"),
                                    intTypeParam("d"),
                                ],
                            },
                        ],
                    },
                },
                decorator: {
                    kind: "Identifier",
                    name: "op",
                    role: "fn",
                },
                body: [
                    {
                        kind: "Assign",
                        target: {
                            kind: "Identifier",
                            name: "eps",
                            role: "var",
                            type: "float",
                        },
                        value: {
                            kind: "Number",
                            value: "1e-5",
                        },
                    },
                    {
                        kind: "Assign",
                        target: {
                            kind: "Identifier",
                            name: "means",
                            role: "var",
                            type: "Tensor[float][[l, 1]]",
                        },
                        value: {
                            kind: "Call",
                            callee: {
                                kind: "Attribute",
                                type: "Tensor[float][[l, 1]]",
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Attribute",
                                        type: "Tensor[float][[l]]",
                                        value: {
                                            kind: "Identifier",
                                            name: "x",
                                            role: "var",
                                            type: "Tensor[float][[l, d]]",
                                        },
                                        attr: {
                                            kind: "Identifier",
                                            name: "avg",
                                            role: "plain",
                                            type: "Tensor[float][[l]]",
                                        },
                                    },
                                    args: [
                                        {
                                            kind: "Number",
                                            value: "1",
                                        },
                                    ],
                                },
                                attr: {
                                    kind: "Identifier",
                                    name: "reshape",
                                    role: "plain",
                                    type: "Tensor[float][[l, 1]]",
                                },
                            },
                            args: [
                                {
                                    kind: "List",
                                    elements: [
                                        intTypeParam("l"),
                                        {
                                            kind: "Number",
                                            value: "1",
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                    {
                        kind: "Assign",
                        target: {
                            kind: "Identifier",
                            name: "variances",
                            role: "var",
                            type: "Tensor[float][[l, 1]]",
                        },
                        value: {
                            kind: "Call",
                            callee: {
                                kind: "Attribute",
                                type: "Tensor[float][[l, 1]]",
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Attribute",
                                        type: "Tensor[float][[l]]",
                                        value: {
                                            kind: "Parenthesized",
                                            value: {
                                                kind: "BinOp",
                                                left: {
                                                    kind: "Parenthesized",
                                                    value: {
                                                        kind: "BinOp",
                                                        left: {
                                                            kind: "Identifier",
                                                            name: "x",
                                                            role: "var",
                                                            type: "Tensor[float][[l, d]]",
                                                        },
                                                        op: "-",
                                                        right: {
                                                            kind: "Identifier",
                                                            name: "means",
                                                            role: "var",
                                                            type: "Tensor[float][[l, 1]]",
                                                        },
                                                    },
                                                },
                                                op: "**",
                                                right: {
                                                    kind: "Number",
                                                    value: "2",
                                                },
                                            },
                                        },
                                        attr: {
                                            kind: "Identifier",
                                            name: "avg",
                                            role: "plain",
                                            type: "Tensor[float][[l]]",
                                        },
                                    },
                                    args: [
                                        {
                                            kind: "Number",
                                            value: "1",
                                        },
                                    ],
                                },
                                attr: {
                                    kind: "Identifier",
                                    name: "reshape",
                                    role: "plain",
                                    type: "Tensor[float][[l, 1]]",
                                },
                            },
                            args: [
                                {
                                    kind: "List",
                                    elements: [
                                        intTypeParam("l"),
                                        {
                                            kind: "Number",
                                            value: "1",
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                    {
                        kind: "Return",
                        value: {
                            kind: "BinOp",
                            left: {
                                kind: "BinOp",
                                left: {
                                    kind: "Parenthesized",
                                    value: {
                                        kind: "BinOp",
                                        left: {
                                            kind: "Parenthesized",
                                            value: {
                                                kind: "BinOp",
                                                left: {
                                                   kind: "Identifier",
                                                   name: "x",
                                                   role: "var",
                                                   type: "Tensor[float][[l, d]]",
                                               },
                                                op: "-",
                                                right: {
                                                   kind: "Identifier",
                                                   name: "means",
                                                   role: "var",
                                                   type: "Tensor[float][[l, 1]]",
                                               },
                                            },
                                        },
                                        op: "/",
                                        right: {
                                            kind: "Call",
                                            callee: {
                                                kind: "Attribute",
                                                type: "Tensor[float][[l, 1]]",
                                                value: {
                                                    kind: "Parenthesized",
                                                    value: {
                                                        kind: "BinOp",
                                                        left: {
                                                           kind: "Identifier",
                                                           name: "variances",
                                                           role: "var",
                                                           type: "Tensor[float][[l, 1]]",
                                                       },
                                                        op: "+",
                                                        right: {
                                                           kind: "Identifier",
                                                           name: "eps",
                                                           role: "var",
                                                           type: "float",
                                                       },
                                                    },
                                                },
                                                attr: {
                                                    kind: "Identifier",
                                                    name: "sqrt",
                                                    role: "plain",
                                                    type: "Tensor[float][[l, 1]]",
                                                },
                                            },
                                            args: [],
                                        },
                                    },
                                },
                                op: "*",
                                right: {
                                    kind: "Attribute",
                                    value: {
                                        kind: "Identifier",
                                        name: "p",
                                        role: "var",
                                    },
                                    attr: {
                                        kind: "Identifier",
                                        name: "weight",
                                        role: "var",
                                        type: "Tensor[float][[d]]",
                                    },
                                },
                            },
                            op: "+",
                            right: {
                                kind: "Attribute",
                                value: {
                                    kind: "Identifier",
                                    name: "p",
                                    role: "var",
                                },
                                attr: {
                                    kind: "Identifier",
                                    name: "bias",
                                    role: "var",
                                    type: "Tensor[float][[d]]",
                                },
                            },
                        },
                    },
                ],
            },
        ],
    };

    const causalMaskDefinitionBlock = {
        kind: "Block",
        body: [
            {
                kind: "FunctionDef",
                name: {
                    kind: "Identifier",
                    name: "causal_mask",
                    role: "fn",
                },
                typeParams: intTypeParams("l"),
                args: [
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "scores",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "TypeSubscript",
                                base: {
                                    kind: "Identifier",
                                    name: "Tensor",
                                    role: "type",
                                },
                                index: {
                                    kind: "Identifier",
                                    name: "float",
                                    role: "type",
                                },
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "TypeList",
                                        items: [
                                            intTypeParam("l"),
                                            intTypeParam("l"),
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                ],
                returns: {
                    kind: "TypeSubscript",
                    base: {
                        kind: "TypeSubscript",
                        base: {
                            kind: "Identifier",
                            name: "Tensor",
                            role: "type",
                        },
                        index: {
                            kind: "Identifier",
                            name: "float",
                            role: "type",
                        },
                    },
                    index: {
                        kind: "TypeList",
                        items: [
                            {
                                kind: "TypeList",
                                items: [
                                    intTypeParam("l"),
                                    intTypeParam("l"),
                                ],
                            },
                        ],
                    },
                },
                decorator: {
                    kind: "Identifier",
                    name: "op",
                    role: "fn",
                },
                body: [
                    {
                        kind: "Assign",
                        target: {
                            kind: "Identifier",
                            name: "blocked",
                            role: "var",
                        },
                        value: {
                            kind: "UnaryOp",
                            op: "-",
                            operand: {
                                kind: "Number",
                                value: "1e9",
                            },
                        },
                    },
                    {
                        kind: "Return",
                        value: {
                            kind: "ListComp",
                            elt: {
                                kind: "ListComp",
                                elt: {
                                    kind: "IfExpr",
                                    body: {
                                        kind: "Subscript",
                                        value: {
                                            kind: "Subscript",
                                            value: {
                                                kind: "Identifier",
                                                name: "scores",
                                                role: "var",
                                            },
                                            index: {
                                                kind: "Identifier",
                                                name: "row",
                                                role: "var",
                                                type: "int",
                                            },
                                        },
                                        index: {
                                            kind: "Identifier",
                                            name: "col",
                                            role: "var",
                                            type: "int",
                                        },
                                    },
                                    test: {
                                        kind: "Compare",
                                        left: {
                                            kind: "Identifier",
                                            name: "col",
                                            role: "var",
                                            type: "int",
                                        },
                                        op: "<=",
                                        right: {
                                            kind: "Identifier",
                                            name: "row",
                                            role: "var",
                                            type: "int",
                                        },
                                    },
                                    orelse: {
                                        kind: "Identifier",
                                        name: "blocked",
                                        role: "var",
                                    },
                                },
                                target: [
                                    {
                                        kind: "Identifier",
                                        name: "col",
                                        role: "var",
                                        type: "int",
                                    },
                                ],
                                iter: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "iota",
                                        role: "fn",
                                        type: "Tensor[int][[l]]",
                                    },
                                    args: [
                                        intTypeParam("l"),
                                    ],
                                },
                            },
                            target: [
                                {
                                    kind: "Identifier",
                                    name: "row",
                                    role: "var",
                                    type: "int",
                                },
                            ],
                            iter: {
                                kind: "Call",
                                callee: {
                                    kind: "Identifier",
                                    name: "iota",
                                    role: "fn",
                                    type: "Tensor[int][[l]]",
                                },
                                args: [
                                    intTypeParam("l"),
                                ],
                            },
                        },
                    },
                ],
            },
        ],
    };

    const selfAttentionCompleteBlock = {
        kind: "Block",
        body: [
            {
                kind: "FunctionDef",
                name: {
                    kind: "Identifier",
                    name: "attention",
                    role: "fn",
                },
                typeParams: intTypeParams("l", "d", "n"),
                args: [
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "x",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "TypeSubscript",
                                base: {
                                    kind: "Identifier",
                                    name: "Tensor",
                                    role: "type",
                                },
                                index: {
                                    kind: "Identifier",
                                    name: "float",
                                    role: "type",
                                },
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "TypeList",
                                        items: [
                                            intTypeParam("l"),
                                            intTypeParam("d"),
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "p",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "Identifier",
                                name: "AttentionParams",
                                role: "type",
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    intTypeParam("n"),
                                    intTypeParam("d"),
                                ],
                            },
                        },
                    },
                ],
                returns: {
                    kind: "TypeSubscript",
                    base: {
                        kind: "TypeSubscript",
                        base: {
                            kind: "Identifier",
                            name: "Tensor",
                            role: "type",
                        },
                        index: {
                            kind: "Identifier",
                            name: "float",
                            role: "type",
                        },
                    },
                    index: {
                        kind: "TypeList",
                        items: [
                            {
                                kind: "TypeList",
                                items: [
                                    intTypeParam("l"),
                                    intTypeParam("n"),
                                ],
                            },
                        ],
                    },
                },
                decorator: {
                    kind: "Identifier",
                    name: "op",
                    role: "fn",
                },
                body: [
                    {
                        kind: "Assign",
                        target: {
                            kind: "Identifier",
                            name: "q",
                            role: "var",
                            type: "Tensor[float][[l, n]]",
                        },
                        value: {
                            kind: "Call",
                            callee: {
                                kind: "Identifier",
                                name: "linear",
                                role: "fn",
                                type: "Tensor[float][[l, n]]",
                            },
                            args: [
                                {
                                    kind: "Identifier",
                                    name: "x",
                                    role: "var",
                                    type: "Tensor[float][[l, d]]",
                                },
                                {
                                    kind: "Attribute",
                                    value: { kind: "Identifier", name: "p", role: "var" },
                                    attr: {
                                        kind: "Identifier",
                                        name: "q",
                                        role: "var",
                                        type: "LinearParams[float, n, d]",
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: "Assign",
                        target: {
                            kind: "Identifier",
                            name: "k",
                            role: "var",
                            type: "Tensor[float][[l, n]]",
                        },
                        value: {
                            kind: "Call",
                            callee: {
                                kind: "Identifier",
                                name: "linear",
                                role: "fn",
                                type: "Tensor[float][[l, n]]",
                            },
                            args: [
                                {
                                    kind: "Identifier",
                                    name: "x",
                                    role: "var",
                                    type: "Tensor[float][[l, d]]",
                                },
                                {
                                    kind: "Attribute",
                                    value: { kind: "Identifier", name: "p", role: "var" },
                                    attr: {
                                        kind: "Identifier",
                                        name: "k",
                                        role: "var",
                                        type: "LinearParams[float, n, d]",
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: "Assign",
                        target: {
                            kind: "Identifier",
                            name: "v",
                            role: "var",
                            type: "Tensor[float][[l, n]]",
                        },
                        value: {
                            kind: "Call",
                            callee: {
                                kind: "Identifier",
                                name: "linear",
                                role: "fn",
                                type: "Tensor[float][[l, n]]",
                            },
                            args: [
                                {
                                    kind: "Identifier",
                                    name: "x",
                                    role: "var",
                                    type: "Tensor[float][[l, d]]",
                                },
                                {
                                    kind: "Attribute",
                                    value: { kind: "Identifier", name: "p", role: "var" },
                                    attr: {
                                        kind: "Identifier",
                                        name: "v",
                                        role: "var",
                                        type: "LinearParams[float, n, d]",
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: "Assign",
                        target: {
                            kind: "Identifier",
                            name: "weights",
                            role: "var",
                            type: "Tensor[float][[l, l]]",
                        },
                        value: {
                            kind: "BinOp",
                            left: {
                                kind: "BinOp",
                                left: {
                                    kind: "Identifier",
                                    name: "q",
                                    role: "var",
                                    type: "Tensor[float][[l, n]]",
                                },
                                op: "@",
                                right: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Attribute",
                                        type: "Tensor[float][[n, l]]",
                                        value: {
                                            kind: "Identifier",
                                            name: "k",
                                            role: "var",
                                            type: "Tensor[float][[l, n]]",
                                        },
                                        attr: {
                                            kind: "Identifier",
                                            name: "permute",
                                            role: "plain",
                                            type: "Tensor[float][[n, l]]",
                                        },
                                    },
                                    args: [
                                        { kind: "Number", value: "1" },
                                        { kind: "Number", value: "0" },
                                    ],
                                },
                            },
                                op: "/",
                                right: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Attribute",
                                        type: "float",
                                        value: {
                                            kind: "Identifier",
                                            name: "n",
                                            role: "var",
                                            type: "int",
                                        },
                                        attr: {
                                            kind: "Identifier",
                                            name: "sqrt",
                                            role: "plain",
                                            type: "float",
                                        },
                                    },
                                    args: [],
                                },
                            },
                        },
                    {
                        kind: "Assign",
                        target: {
                            kind: "Identifier",
                            name: "weights",
                            role: "var",
                            type: "Tensor[float][[l, l]]",
                        },
                        value: {
                            kind: "Call",
                            callee: {
                                kind: "Identifier",
                                name: "causal_mask",
                                role: "fn",
                                type: "Tensor[float][[l, l]]",
                            },
                            args: [
                                {
                                    kind: "Identifier",
                                    name: "weights",
                                    role: "var",
                                    type: "Tensor[float][[l, l]]",
                                },
                            ],
                        },
                    },
                    {
                        kind: "Assign",
                        target: {
                            kind: "Identifier",
                            name: "weights",
                            role: "var",
                            type: "Tensor[float][[l, l]]",
                        },
                        value: {
                            kind: "Call",
                            callee: {
                                kind: "Identifier",
                                name: "softmax",
                                role: "fn",
                                type: "Tensor[float][[l, l]]",
                            },
                            args: [
                                {
                                    kind: "Identifier",
                                    name: "weights",
                                    role: "var",
                                    type: "Tensor[float][[l, l]]",
                                },
                            ],
                        },
                    },
                    {
                        kind: "Return",
                        value: {
                            kind: "BinOp",
                            left: { kind: "Identifier", name: "weights", role: "var" },
                            op: "@",
                            right: { kind: "Identifier", name: "v", role: "var" },
                        },
                    },
                ],
            },
        ],
    };

    const multiHeadsAttentionDefinitionBlock = {
        kind: "Block",
        body: [
            {
                kind: "ClassDef",
                name: {
                    kind: "Identifier",
                    name: "MultiHeadsAttentionParams",
                    role: "type",
                },
                typeParams: intTypeParams("h", "d", "n"),
                body: [
                    {
                        kind: "AnnAssign",
                        target: {
                            kind: "Identifier",
                            name: "qw",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "TypeSubscript",
                                base: {
                                    kind: "Identifier",
                                    name: "Tensor",
                                    role: "type",
                                },
                                index: {
                                    kind: "Identifier",
                                    name: "float",
                                    role: "type",
                                },
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "TypeList",
                                        items: [
                                            intTypeParam("h"),
                                            intTypeParam("d"),
                                            intTypeParam("n"),
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                    {
                        kind: "AnnAssign",
                        target: {
                            kind: "Identifier",
                            name: "kw",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "TypeSubscript",
                                base: {
                                    kind: "Identifier",
                                    name: "Tensor",
                                    role: "type",
                                },
                                index: {
                                    kind: "Identifier",
                                    name: "float",
                                    role: "type",
                                },
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "TypeList",
                                        items: [
                                            intTypeParam("h"),
                                            intTypeParam("d"),
                                            intTypeParam("n"),
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                    {
                        kind: "AnnAssign",
                        target: {
                            kind: "Identifier",
                            name: "vw",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "TypeSubscript",
                                base: {
                                    kind: "Identifier",
                                    name: "Tensor",
                                    role: "type",
                                },
                                index: {
                                    kind: "Identifier",
                                    name: "float",
                                    role: "type",
                                },
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "TypeList",
                                        items: [
                                            intTypeParam("h"),
                                            intTypeParam("d"),
                                            intTypeParam("n"),
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                    {
                        kind: "AnnAssign",
                        target: {
                            kind: "Identifier",
                            name: "proj",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "TypeSubscript",
                                base: {
                                    kind: "Identifier",
                                    name: "Tensor",
                                    role: "type",
                                },
                                index: {
                                    kind: "Identifier",
                                    name: "float",
                                    role: "type",
                                },
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "TypeList",
                                        items: [
                                            {
                                                kind: "BinOp",
                                                left: intTypeParam("h"),
                                                op: "*",
                                                right: intTypeParam("n"),
                                            },
                                            intTypeParam("d"),
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                ],
            },
            {
                kind: "BlankLine",
            },
            {
                kind: "FunctionDef",
                name: {
                    kind: "Identifier",
                    name: "multi_heads_attention",
                    role: "fn",
                },
                typeParams: intTypeParams("l", "d", "n", "h"),
                args: [
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "x",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "TypeSubscript",
                                base: {
                                    kind: "Identifier",
                                    name: "Tensor",
                                    role: "type",
                                },
                                index: {
                                    kind: "Identifier",
                                    name: "float",
                                    role: "type",
                                },
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "TypeList",
                                        items: [
                                            intTypeParam("l"),
                                            intTypeParam("d"),
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "p",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "Identifier",
                                name: "MultiHeadsAttentionParams",
                                role: "type",
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    intTypeParam("h"),
                                    intTypeParam("d"),
                                    intTypeParam("n"),
                                ],
                            },
                        },
                    },
                ],
                returns: {
                    kind: "TypeSubscript",
                    base: {
                        kind: "TypeSubscript",
                        base: {
                            kind: "Identifier",
                            name: "Tensor",
                            role: "type",
                        },
                        index: {
                            kind: "Identifier",
                            name: "float",
                            role: "type",
                        },
                    },
                    index: {
                        kind: "TypeList",
                        items: [
                            {
                                kind: "TypeList",
                                items: [
                                    intTypeParam("l"),
                                    intTypeParam("d"),
                                ],
                            },
                        ],
                    },
                },
                decorator: {
                    kind: "Identifier",
                    name: "op",
                    role: "fn",
                },
                body: [
                    {
                        kind: "Assign",
                        target: {
                            kind: "Identifier",
                            name: "q",
                            role: "var",
                        },
                        value: {
                            kind: "BinOp",
                            left: {
                                kind: "Identifier",
                                name: "x",
                                role: "var",
                                type: "Tensor[float][[l, d]]",
                            },
                            op: "@",
                            right: {
                                kind: "Attribute",
                                value: {
                                    kind: "Identifier",
                                    name: "p",
                                    role: "var",
                                },
                                attr: {
                                    kind: "Identifier",
                                    name: "qw",
                                    role: "var",
                                    type: "Tensor[float][[h, d, n]]",
                                },
                            },
                        },
                    },
                    {
                        kind: "Assign",
                        target: {
                            kind: "Identifier",
                            name: "k",
                            role: "var",
                            type: "Tensor[float][[h, l, n]]",
                        },
                        value: {
                            kind: "BinOp",
                            left: {
                                kind: "Identifier",
                                name: "x",
                                role: "var",
                                type: "Tensor[float][[l, d]]",
                            },
                            op: "@",
                            right: {
                                kind: "Attribute",
                                value: {
                                    kind: "Identifier",
                                    name: "p",
                                    role: "var",
                                },
                                attr: {
                                    kind: "Identifier",
                                    name: "kw",
                                    role: "var",
                                    type: "Tensor[float][[h, d, n]]",
                                },
                            },
                        },
                    },
                    {
                        kind: "Assign",
                        target: {
                            kind: "Identifier",
                            name: "v",
                            role: "var",
                            type: "Tensor[float][[h, l, n]]",
                        },
                        value: {
                            kind: "BinOp",
                            left: {
                                kind: "Identifier",
                                name: "x",
                                role: "var",
                                type: "Tensor[float][[l, d]]",
                            },
                            op: "@",
                            right: {
                                kind: "Attribute",
                                value: {
                                    kind: "Identifier",
                                    name: "p",
                                    role: "var",
                                },
                                attr: {
                                    kind: "Identifier",
                                    name: "vw",
                                    role: "var",
                                    type: "Tensor[float][[h, d, n]]",
                                },
                            },
                        },
                    },
                    {
                        kind: "Assign",
                        target: {
                            kind: "Identifier",
                            name: "weights",
                            role: "var",
                            type: "Tensor[float][[h, l, l]]",
                        },
                        value: {
                            kind: "BinOp",
                            left: {
                                kind: "BinOp",
                                left: {
                                    kind: "Identifier",
                                    name: "q",
                                    role: "var",
                                    type: "Tensor[float][[h, l, n]]",
                                },
                                op: "@",
                                right: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Attribute",
                                        type: "Tensor[float][[h, n, l]]",
                                        value: {
                                            kind: "Identifier",
                                            name: "k",
                                            role: "var",
                                            type: "Tensor[float][[h, l, n]]",
                                        },
                                        attr: {
                                            kind: "Identifier",
                                            name: "permute",
                                            role: "plain",
                                            type: "Tensor[float][[h, n, l]]",
                                        },
                                    },
                                    args: [
                                        {
                                            kind: "Number",
                                            value: "0",
                                        },
                                        {
                                            kind: "Number",
                                            value: "2",
                                        },
                                        {
                                            kind: "Number",
                                            value: "1",
                                        },
                                    ],
                                },
                            },
                            op: "/",
                            right: {
                                kind: "Call",
                                callee: {
                                    kind: "Attribute",
                                    type: "float",
                                    value: {
                                        kind: "Identifier",
                                        name: "n",
                                        role: "var",
                                        type: "int",
                                    },
                                    attr: {
                                        kind: "Identifier",
                                        name: "sqrt",
                                        role: "plain",
                                        type: "float",
                                    },
                                },
                                args: [],
                            },
                        },
                    },
                    {
                        kind: "Assign",
                        target: {
                            kind: "Identifier",
                            name: "weights",
                            role: "var",
                            type: "Tensor[float][[h, l, l]]",
                        },
                        value: {
                            kind: "Call",
                            callee: {
                                kind: "Identifier",
                                name: "softmax",
                                role: "fn",
                                type: "Tensor[float][[h, l, l]]",
                            },
                            args: [
                                {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "causal_mask",
                                        role: "fn",
                                        type: "Tensor[float][[h, l, l]]",
                                    },
                                    args: [
                                        {
                                            kind: "Identifier",
                                            name: "weights",
                                            role: "var",
                                            type: "Tensor[float][[h, l, l]]",
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                    {
                        kind: "Assign",
                        target: {
                            kind: "Identifier",
                            name: "weights",
                            role: "var",
                            type: "Tensor[float][[h, l, n]]",
                        },
                        value: {
                            kind: "BinOp",
                            left: {
                                kind: "Identifier",
                                name: "weights",
                                role: "var",
                                type: "Tensor[float][[h, l, l]]",
                            },
                            op: "@",
                            right: {
                                kind: "Identifier",
                                name: "v",
                                role: "var",
                                type: "Tensor[float][[h, l, n]]",
                            },
                        },
                    },
                    {
                        kind: "Assign",
                        target: {
                            kind: "Identifier",
                            name: "merged",
                            role: "var",
                            type: "Tensor[float][[l, h * n]]",
                        },
                        value: {
                            kind: "Call",
                            callee: {
                                kind: "Attribute",
                                type: "Tensor[float][[l, h * n]]",
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Attribute",
                                        type: "Tensor[float][[l, h, n]]",
                                        value: {
                                            kind: "Identifier",
                                            name: "weights",
                                            role: "var",
                                            type: "Tensor[float][[h, l, n]]",
                                        },
                                        attr: {
                                            kind: "Identifier",
                                            name: "permute",
                                            role: "plain",
                                            type: "Tensor[float][[l, h, n]]",
                                        },
                                    },
                                    args: [
                                        {
                                            kind: "Number",
                                            value: "1",
                                        },
                                        {
                                            kind: "Number",
                                            value: "0",
                                        },
                                        {
                                            kind: "Number",
                                            value: "2",
                                        },
                                    ],
                                },
                                attr: {
                                    kind: "Identifier",
                                    name: "reshape",
                                    role: "plain",
                                    type: "Tensor[float][[l, h * n]]",
                                },
                            },
                            args: [
                                {
                                    kind: "List",
                                    elements: [
                                        intTypeParam("l"),
                                        {
                                            kind: "BinOp",
                                            left: intTypeParam("h"),
                                            op: "*",
                                            right: intTypeParam("n"),
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                    {
                        kind: "Return",
                        value: {
                            kind: "BinOp",
                            left: {
                                kind: "Identifier",
                                name: "merged",
                                role: "var",
                                type: "Tensor[float][[l, h * n]]",
                            },
                            op: "@",
                            right: {
                                kind: "Attribute",
                                value: {
                                    kind: "Identifier",
                                    name: "p",
                                    role: "var",
                                },
                                    attr: {
                                        kind: "Identifier",
                                        name: "proj",
                                        role: "var",
                                        type: "Tensor[float][[(h * n), d]]",
                                    },
                            },
                        },
                    },
                ],
            },
        ],
    };

    const feedForwardDefinitionBlock = {
        kind: "Block",
        body: [
            {
                kind: "ClassDef",
                name: {
                    kind: "Identifier",
                    name: "FeedForwardParams",
                    role: "type",
                },
                typeParams: intTypeParams("d"),
                body: [
                    {
                        kind: "AnnAssign",
                        target: {
                            kind: "Identifier",
                            name: "linear1",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "Identifier",
                                name: "LinearParams",
                                role: "type",
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "Identifier",
                                        name: "float",
                                        role: "type",
                                    },
                                    {
                                        kind: "BinOp",
                                        left: {
                                            kind: "Number",
                                            value: "4",
                                        },
                                        op: "*",
                                        right: intTypeParam("d"),
                                    },
                                    intTypeParam("d"),
                                ],
                            },
                        },
                    },
                    {
                        kind: "AnnAssign",
                        target: {
                            kind: "Identifier",
                            name: "linear2",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "Identifier",
                                name: "LinearParams",
                                role: "type",
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "Identifier",
                                        name: "float",
                                        role: "type",
                                    },
                                    intTypeParam("d"),
                                    {
                                        kind: "BinOp",
                                        left: {
                                            kind: "Number",
                                            value: "4",
                                        },
                                        op: "*",
                                        right: intTypeParam("d"),
                                    },
                                ],
                            },
                        },
                    },
                ],
            },
            {
                kind: "BlankLine",
            },
            {
                kind: "FunctionDef",
                name: {
                    kind: "Identifier",
                    name: "feed_forward",
                    role: "fn",
                },
                typeParams: intTypeParams("l", "d"),
                args: [
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "x",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "TypeSubscript",
                                base: {
                                    kind: "Identifier",
                                    name: "Tensor",
                                    role: "type",
                                },
                                index: {
                                    kind: "Identifier",
                                    name: "float",
                                    role: "type",
                                },
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "TypeList",
                                        items: [
                                            intTypeParam("l"),
                                            intTypeParam("d"),
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "p",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "Identifier",
                                name: "FeedForwardParams",
                                role: "type",
                            },
                            index: {
                                kind: "TypeList",
                                items: [intTypeParam("d")],
                            },
                        },
                    },
                ],
                returns: {
                    kind: "TypeSubscript",
                    base: {
                        kind: "TypeSubscript",
                        base: {
                            kind: "Identifier",
                            name: "Tensor",
                            role: "type",
                        },
                        index: {
                            kind: "Identifier",
                            name: "float",
                            role: "type",
                        },
                    },
                    index: {
                        kind: "TypeList",
                        items: [
                            {
                                kind: "TypeList",
                                items: [
                                    intTypeParam("l"),
                                    intTypeParam("d"),
                                ],
                            },
                        ],
                    },
                },
                decorator: {
                    kind: "Identifier",
                    name: "op",
                    role: "fn",
                },
                body: [
                    {
                        kind: "Assign",
                        target: {
                            kind: "Identifier",
                            name: "x",
                            role: "var",
                            type: "Tensor[float][[l, 4 * d]]",
                        },
                        value: {
                            kind: "Call",
                            callee: {
                                kind: "Identifier",
                                name: "larger",
                                role: "fn",
                                type: "Tensor[float][[l, 4 * d]]",
                            },
                            args: [
                                {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "linear",
                                        role: "fn",
                                        type: "Tensor[float][[l, 4 * d]]",
                                    },
                                    args: [
                                        {
                                            kind: "Identifier",
                                            name: "x",
                                            role: "var",
                                            type: "Tensor[float][[l, d]]",
                                        },
                                        {
                                            kind: "Attribute",
                                            value: {
                                                kind: "Identifier",
                                                name: "p",
                                                role: "var",
                                            },
                                            attr: {
                                                kind: "Identifier",
                                                name: "linear1",
                                                role: "var",
                                                type: "LinearParams[float, 4 * d, d]",
                                            },
                                        },
                                    ],
                                },
                                {
                                    kind: "Number",
                                    value: "0.0",
                                },
                            ],
                        },
                    },
                    {
                        kind: "Return",
                        value: {
                            kind: "Call",
                            callee: {
                                kind: "Identifier",
                                name: "linear",
                                role: "fn",
                                type: "Tensor[float][[l, d]]",
                            },
                            args: [
                                {
                                    kind: "Identifier",
                                    name: "x",
                                    role: "var",
                                    type: "Tensor[float][[l, 4 * d]]",
                                },
                                {
                                    kind: "Attribute",
                                    value: {
                                        kind: "Identifier",
                                        name: "p",
                                        role: "var",
                                    },
                                    attr: {
                                        kind: "Identifier",
                                        name: "linear2",
                                        role: "var",
                                        type: "LinearParams[float, d, 4 * d]",
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        ],
    };

    const blockDefinitionV1Block = {
        kind: "Block",
        body: [
            {
                kind: "ClassDef",
                name: {
                    kind: "Identifier",
                    name: "BlockParams",
                    role: "type",
                },
                typeParams: intTypeParams("n", "d", "h"),
                body: [
                    {
                        kind: "AnnAssign",
                        target: {
                            kind: "Identifier",
                            name: "multi_heads",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "Identifier",
                                name: "MultiHeadsAttentionParams",
                                role: "type",
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "Identifier",
                                        name: "float",
                                        role: "type",
                                    },
                                    intTypeParam("n"),
                                    intTypeParam("d"),
                                    intTypeParam("h"),
                                ],
                            },
                        },
                    },
                    {
                        kind: "AnnAssign",
                        target: {
                            kind: "Identifier",
                            name: "feed_forward",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "Identifier",
                                name: "FeedForwardParams",
                                role: "type",
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "Identifier",
                                        name: "float",
                                        role: "type",
                                    },
                                    intTypeParam("d"),
                                ],
                            },
                        },
                    },
                    {
                        kind: "ExprStmt",
                        value: {
                            kind: "Identifier",
                            name: "...",
                            role: "plain",
                        },
                    },
                ],
            },
            {
                kind: "BlankLine",
            },
            {
                kind: "FunctionDef",
                name: {
                    kind: "Identifier",
                    name: "block",
                    role: "fn",
                },
                typeParams: intTypeParams("l", "d", "h", "n"),
                args: [
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "x",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "TypeSubscript",
                                base: {
                                    kind: "Identifier",
                                    name: "Tensor",
                                    role: "type",
                                },
                                index: {
                                    kind: "Identifier",
                                    name: "float",
                                    role: "type",
                                },
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "TypeList",
                                        items: [
                                            intTypeParam("l"),
                                            intTypeParam("d"),
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "p",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "Identifier",
                                name: "BlockParams",
                                role: "type",
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    intTypeParam("n"),
                                    intTypeParam("d"),
                                    intTypeParam("h"),
                                ],
                            },
                        },
                    },
                ],
                returns: {
                    kind: "TypeSubscript",
                    base: {
                        kind: "TypeSubscript",
                        base: {
                            kind: "Identifier",
                            name: "Tensor",
                            role: "type",
                        },
                        index: {
                            kind: "Identifier",
                            name: "float",
                            role: "type",
                        },
                    },
                    index: {
                        kind: "TypeList",
                        items: [
                            {
                                kind: "TypeList",
                                items: [
                                    intTypeParam("l"),
                                    intTypeParam("d"),
                                ],
                            },
                        ],
                    },
                },
                decorator: {
                    kind: "Identifier",
                    name: "op",
                    role: "fn",
                },
                body: [
                    {
                        kind: "ExprStmt",
                        value: {
                            kind: "Identifier",
                            name: "...",
                            role: "plain",
                        },
                    },
                    {
                        kind: "Assign",
                        target: {
                            kind: "Identifier",
                            name: "x",
                            role: "var",
                            type: "Tensor[float][[l, d]]",
                        },
                        value: {
                            kind: "BinOp",
                            left: {
                                kind: "Identifier",
                                name: "x",
                                role: "var",
                                type: "Tensor[float][[l, d]]",
                            },
                            op: "+",
                            right: {
                                kind: "Call",
                                callee: {
                                    kind: "Identifier",
                                    name: "multi_heads_attention",
                                    role: "fn",
                                    type: "Tensor[float][[l, d]]",
                                },
                                args: [
                                    {
                                        kind: "Identifier",
                                        name: "x",
                                        role: "var",
                                        type: "Tensor[float][[l, d]]",
                                    },
                                    {
                                        kind: "Attribute",
                                        value: {
                                            kind: "Identifier",
                                            name: "p",
                                            role: "var",
                                        },
                                        attr: {
                                            kind: "Identifier",
                                            name: "multi_heads",
                                            role: "var",
                                            type: "MultiHeadsAttentionParams[float, n, d, h]",
                                        },
                                    },
                                ],
                            },
                        },
                    },
                    {
                        kind: "ExprStmt",
                        value: {
                            kind: "Identifier",
                            name: "...",
                            role: "plain",
                        },
                    },
                    {
                        kind: "Assign",
                        target: {
                            kind: "Identifier",
                            name: "x",
                            role: "var",
                            type: "Tensor[float][[l, d]]",
                        },
                        value: {
                            kind: "BinOp",
                            left: {
                                kind: "Identifier",
                                name: "x",
                                role: "var",
                                type: "Tensor[float][[l, d]]",
                            },
                            op: "+",
                            right: {
                                kind: "Call",
                                callee: {
                                    kind: "Identifier",
                                    name: "feed_forward",
                                    role: "fn",
                                    type: "Tensor[float][[l, d]]",
                                },
                                args: [
                                    {
                                        kind: "Identifier",
                                        name: "x",
                                        role: "var",
                                        type: "Tensor[float][[l, d]]",
                                    },
                                    {
                                        kind: "Attribute",
                                        value: {
                                            kind: "Identifier",
                                            name: "p",
                                            role: "var",
                                        },
                                        attr: {
                                            kind: "Identifier",
                                            name: "feed_forward",
                                            role: "var",
                                            type: "FeedForwardParams[float, d]",
                                        },
                                    },
                                ],
                            },
                        },
                    },
                    {
                        kind: "Return",
                        value: {
                            kind: "Identifier",
                            name: "x",
                            role: "var",
                            type: "Tensor[float][[l, d]]",
                        },
                    },
                ],
            },
        ],
    };

    const blockDefinitionV2Block = {
        kind: "Block",
        body: [
            {
                kind: "ClassDef",
                name: {
                    kind: "Identifier",
                    name: "BlockParams",
                    role: "type",
                },
                typeParams: intTypeParams("n", "d", "h"),
                body: [
                    {
                        kind: "AnnAssign",
                        target: {
                            kind: "Identifier",
                            name: "multi_heads",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "Identifier",
                                name: "MultiHeadsAttentionParams",
                                role: "type",
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "Identifier",
                                        name: "float",
                                        role: "type",
                                    },
                                    intTypeParam("n"),
                                    intTypeParam("d"),
                                    intTypeParam("h"),
                                ],
                            },
                        },
                    },
                    {
                        kind: "AnnAssign",
                        target: {
                            kind: "Identifier",
                            name: "feed_forward",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "Identifier",
                                name: "FeedForwardParams",
                                role: "type",
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "Identifier",
                                        name: "float",
                                        role: "type",
                                    },
                                    intTypeParam("d"),
                                ],
                            },
                        },
                    },
                    {
                        kind: "AnnAssign",
                        target: {
                            kind: "Identifier",
                            name: "layer_norm1",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "Identifier",
                                name: "LayerNormParams",
                                role: "type",
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "Identifier",
                                        name: "float",
                                        role: "type",
                                    },
                                    intTypeParam("d"),
                                ],
                            },
                        },
                    },
                    {
                        kind: "AnnAssign",
                        target: {
                            kind: "Identifier",
                            name: "layer_norm2",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "Identifier",
                                name: "LayerNormParams",
                                role: "type",
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "Identifier",
                                        name: "float",
                                        role: "type",
                                    },
                                    intTypeParam("d"),
                                ],
                            },
                        },
                    },
                ],
            },
            {
                kind: "BlankLine",
            },
            {
                kind: "FunctionDef",
                name: {
                    kind: "Identifier",
                    name: "block",
                    role: "fn",
                },
                typeParams: intTypeParams("l", "d", "h", "n"),
                args: [
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "x",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "TypeSubscript",
                                base: {
                                    kind: "Identifier",
                                    name: "Tensor",
                                    role: "type",
                                },
                                index: {
                                    kind: "Identifier",
                                    name: "float",
                                    role: "type",
                                },
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "TypeList",
                                        items: [
                                            intTypeParam("l"),
                                            intTypeParam("d"),
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "p",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "Identifier",
                                name: "BlockParams",
                                role: "type",
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    intTypeParam("n"),
                                    intTypeParam("d"),
                                    intTypeParam("h"),
                                ],
                            },
                        },
                    },
                ],
                returns: {
                    kind: "TypeSubscript",
                    base: {
                        kind: "TypeSubscript",
                        base: {
                            kind: "Identifier",
                            name: "Tensor",
                            role: "type",
                        },
                        index: {
                            kind: "Identifier",
                            name: "float",
                            role: "type",
                        },
                    },
                    index: {
                        kind: "TypeList",
                        items: [
                            {
                                kind: "TypeList",
                                items: [
                                    intTypeParam("l"),
                                    intTypeParam("d"),
                                ],
                            },
                        ],
                    },
                },
                decorator: {
                    kind: "Identifier",
                    name: "op",
                    role: "fn",
                },
                body: [
                    {
                        kind: "Assign",
                        target: {
                            kind: "Identifier",
                            name: "x",
                            role: "var",
                            type: "Tensor[float][[l, d]]",
                        },
                        value: {
                            kind: "Call",
                            callee: {
                                kind: "Identifier",
                                name: "layer_norm",
                                role: "fn",
                                type: "Tensor[float][[l, d]]",
                            },
                            args: [
                                {
                                    kind: "Identifier",
                                    name: "x",
                                    role: "var",
                                    type: "Tensor[float][[l, d]]",
                                },
                                {
                                    kind: "Attribute",
                                    value: {
                                        kind: "Identifier",
                                        name: "p",
                                        role: "var",
                                    },
                                    attr: {
                                        kind: "Identifier",
                                        name: "layer_norm1",
                                        role: "var",
                                        type: "LayerNormParams[float, d]",
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: "Assign",
                        target: {
                            kind: "Identifier",
                            name: "x",
                            role: "var",
                            type: "Tensor[float][[l, d]]",
                        },
                        value: {
                            kind: "BinOp",
                            left: {
                                kind: "Identifier",
                                name: "x",
                                role: "var",
                                type: "Tensor[float][[l, d]]",
                            },
                            op: "+",
                            right: {
                                kind: "Call",
                                callee: {
                                    kind: "Identifier",
                                    name: "multi_heads_attention",
                                    role: "fn",
                                    type: "Tensor[float][[l, d]]",
                                },
                                args: [
                                    {
                                        kind: "Identifier",
                                        name: "x",
                                        role: "var",
                                        type: "Tensor[float][[l, d]]",
                                    },
                                    {
                                        kind: "Attribute",
                                        value: {
                                            kind: "Identifier",
                                            name: "p",
                                            role: "var",
                                        },
                                        attr: {
                                            kind: "Identifier",
                                            name: "multi_heads",
                                            role: "var",
                                            type: "MultiHeadsAttentionParams[float, n, d, h]",
                                        },
                                    },
                                ],
                            },
                        },
                    },
                    {
                        kind: "Assign",
                        target: {
                            kind: "Identifier",
                            name: "x",
                            role: "var",
                            type: "Tensor[float][[l, d]]",
                        },
                        value: {
                            kind: "Call",
                            callee: {
                                kind: "Identifier",
                                name: "layer_norm",
                                role: "fn",
                                type: "Tensor[float][[l, d]]",
                            },
                            args: [
                                {
                                    kind: "Identifier",
                                    name: "x",
                                    role: "var",
                                    type: "Tensor[float][[l, d]]",
                                },
                                {
                                    kind: "Attribute",
                                    value: {
                                        kind: "Identifier",
                                        name: "p",
                                        role: "var",
                                    },
                                    attr: {
                                        kind: "Identifier",
                                        name: "layer_norm2",
                                        role: "var",
                                        type: "LayerNormParams[float, d]",
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: "Assign",
                        target: {
                            kind: "Identifier",
                            name: "x",
                            role: "var",
                            type: "Tensor[float][[l, d]]",
                        },
                        value: {
                            kind: "BinOp",
                            left: {
                                kind: "Identifier",
                                name: "x",
                                role: "var",
                                type: "Tensor[float][[l, d]]",
                            },
                            op: "+",
                            right: {
                                kind: "Call",
                                callee: {
                                    kind: "Identifier",
                                    name: "feed_forward",
                                    role: "fn",
                                    type: "Tensor[float][[l, d]]",
                                },
                                args: [
                                    {
                                        kind: "Identifier",
                                        name: "x",
                                        role: "var",
                                        type: "Tensor[float][[l, d]]",
                                    },
                                    {
                                        kind: "Attribute",
                                        value: {
                                            kind: "Identifier",
                                            name: "p",
                                            role: "var",
                                        },
                                        attr: {
                                            kind: "Identifier",
                                            name: "feed_forward",
                                            role: "var",
                                            type: "FeedForwardParams[float, d]",
                                        },
                                    },
                                ],
                            },
                        },
                    },
                    {
                        kind: "Return",
                        value: {
                            kind: "Identifier",
                            name: "x",
                            role: "var",
                            type: "Tensor[float][[l, d]]",
                        },
                    },
                ],
            },
        ],
    };

    const littleTransformerClassBlock = {
        kind: "Block",
        body: [
            {
                kind: "Assign",
                target: {
                    kind: "Identifier",
                    name: "vocab_size",
                    role: "var",
                },
                value: {
                    kind: "Number",
                    value: "65",
                },
            },
            {
                kind: "Assign",
                target: {
                    kind: "Identifier",
                    name: "dim",
                    role: "var",
                },
                value: {
                    kind: "Number",
                    value: "32",
                },
            },
            {
                kind: "BlankLine",
            },
            {
                kind: "ClassDef",
                name: {
                    kind: "Identifier",
                    name: "ModelParams",
                    role: "type",
                },
                typeParams: intTypeParams("l", "n", "h"),
                body: [
                    {
                        kind: "ExprStmt",
                        value: {
                            kind: "Identifier",
                            name: "...",
                            role: "plain",
                        },
                    },
                    {
                        kind: "AnnAssign",
                        target: {
                            kind: "Identifier",
                            name: "block1",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "Identifier",
                                name: "BlockParams",
                                role: "type",
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    intTypeParam("n"),
                                    {
                                        kind: "Identifier",
                                        name: "dim",
                                        role: "var",
                                    },
                                    intTypeParam("h"),
                                ],
                            },
                        },
                    },
                    {
                        kind: "AnnAssign",
                        target: {
                            kind: "Identifier",
                            name: "block2",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "Identifier",
                                name: "BlockParams",
                                role: "type",
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    intTypeParam("n"),
                                    {
                                        kind: "Identifier",
                                        name: "dim",
                                        role: "var",
                                    },
                                    intTypeParam("h"),
                                ],
                            },
                        },
                    },
                    {
                        kind: "AnnAssign",
                        target: {
                            kind: "Identifier",
                            name: "layer_norm",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "Identifier",
                                name: "LayerNormParams",
                                role: "type",
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "Identifier",
                                        name: "dim",
                                        role: "var",
                                    },
                                ],
                            },
                        },
                    },
                    {
                        kind: "AnnAssign",
                        target: {
                            kind: "Identifier",
                            name: "linear",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "Identifier",
                                name: "LinearParams",
                                role: "type",
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "Identifier",
                                        name: "vocab_size",
                                        role: "var",
                                    },
                                    {
                                        kind: "Identifier",
                                        name: "dim",
                                        role: "var",
                                    },
                                ],
                            },
                        },
                    },
                ],
            },
            {
                kind: "BlankLine",
            },
            {
                kind: "ClassDef",
                name: {
                    kind: "Identifier",
                    name: "LittleTransformer",
                    role: "type",
                },
                bases: [
                    {
                        kind: "Identifier",
                        name: "Model",
                        role: "type",
                    },
                ],
                body: [
                    {
                        kind: "FunctionDef",
                        name: {
                            kind: "Identifier",
                            name: "predict",
                            role: "fn",
                        },
                        typeParams: intTypeParams("l", "n", "h"),
                        args: [
                            {
                                kind: "Arg",
                                name: {
                                    kind: "Identifier",
                                    name: "indices",
                                    role: "var",
                                },
                                annotation: {
                                    kind: "TypeSubscript",
                                    base: {
                                        kind: "TypeSubscript",
                                        base: {
                                            kind: "Identifier",
                                            name: "Tensor",
                                            role: "type",
                                        },
                                        index: {
                                            kind: "Identifier",
                                            name: "int",
                                            role: "type",
                                        },
                                    },
                                    index: {
                                        kind: "TypeList",
                                        items: [
                                            {
                                                kind: "TypeList",
                                                items: [intTypeParam("l")],
                                            },
                                        ],
                                    },
                                },
                            },
                            {
                                kind: "Arg",
                                name: {
                                    kind: "Identifier",
                                    name: "p",
                                    role: "var",
                                },
                                annotation: {
                                    kind: "TypeSubscript",
                                    base: {
                                        kind: "Identifier",
                                        name: "ModelParams",
                                        role: "type",
                                    },
                                    index: {
                                        kind: "TypeList",
                                        items: [
                                            intTypeParam("l"),
                                            intTypeParam("n"),
                                            intTypeParam("h"),
                                        ],
                                    },
                                },
                            },
                        ],
                        returns: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "TypeSubscript",
                                base: {
                                    kind: "Identifier",
                                    name: "Tensor",
                                    role: "type",
                                },
                                index: {
                                    kind: "Identifier",
                                    name: "float",
                                    role: "type",
                                },
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "TypeList",
                                        items: [
                                            intTypeParam("l"),
                                            {
                                                kind: "Identifier",
                                                name: "vocab_size",
                                                role: "var",
                                            },
                                        ],
                                    },
                                ],
                            },
                        },
                        body: [
                            {
                                kind: "ExprStmt",
                                value: {
                                    kind: "Identifier",
                                    name: "...",
                                    role: "plain",
                                },
                            },
                            {
                                kind: "Assign",
                                target: {
                                    kind: "Identifier",
                                    name: "x",
                                    role: "var",
                                    type: "Tensor[float][[l, dim]]",
                                },
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "block",
                                        role: "fn",
                                        type: "Tensor[float][[l, dim]]",
                                    },
                                    args: [
                                        {
                                            kind: "Identifier",
                                            name: "x",
                                            role: "var",
                                            type: "Tensor[float][[l, dim]]",
                                        },
                                        {
                                            kind: "Attribute",
                                            value: {
                                                kind: "Identifier",
                                                name: "p",
                                                role: "var",
                                            },
                                            attr: {
                                                kind: "Identifier",
                                                name: "block1",
                                                role: "var",
                                                type: "BlockParams[float, n, dim, h]",
                                            },
                                        },
                                    ],
                                },
                            },
                            {
                                kind: "Assign",
                        target: {
                            kind: "Identifier",
                            name: "x",
                            role: "var",
                            type: "Tensor[float][[l, dim]]",
                        },
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "block",
                                        role: "fn",
                                        type: "Tensor[float][[l, dim]]",
                                    },
                                    args: [
                                        {
                                            kind: "Identifier",
                                            name: "x",
                                            role: "var",
                                            type: "Tensor[float][[l, dim]]",
                                        },
                                        {
                                            kind: "Attribute",
                                            value: {
                                                kind: "Identifier",
                                                name: "p",
                                                role: "var",
                                            },
                                            attr: {
                                                kind: "Identifier",
                                                name: "block2",
                                                role: "var",
                                                type: "BlockParams[float, n, dim, h]",
                                            },
                                        },
                                    ],
                                },
                            },
                            {
                                kind: "Assign",
                                target: {
                                    kind: "Identifier",
                                    name: "x",
                                    role: "var",
                                    type: "Tensor[float][[l, dim]]",
                                },
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "layer_norm",
                                        role: "fn",
                                        type: "Tensor[float][[l, dim]]",
                                    },
                                    args: [
                                        {
                                            kind: "Identifier",
                                            name: "x",
                                            role: "var",
                                            type: "Tensor[float][[l, dim]]",
                                        },
                                        {
                                            kind: "Attribute",
                                            value: {
                                                kind: "Identifier",
                                                name: "p",
                                                role: "var",
                                            },
                                            attr: {
                                                kind: "Identifier",
                                                name: "layer_norm",
                                                role: "var",
                                                type: "LayerNormParams[float, dim]",
                                            },
                                        },
                                    ],
                                },
                            },
                            {
                                kind: "Assign",
                                target: {
                                    kind: "Identifier",
                                    name: "logits",
                                    role: "var",
                                    type: "Tensor[float][[l, vocab_size]]",
                                },
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "linear",
                                        role: "fn",
                                        type: "Tensor[float][[l, vocab_size]]",
                                    },
                                    args: [
                                        {
                                            kind: "Identifier",
                                            name: "x",
                                            role: "var",
                                            type: "Tensor[float][[l, dim]]",
                                        },
                                        {
                                            kind: "Attribute",
                                            value: {
                                                kind: "Identifier",
                                                name: "p",
                                                role: "var",
                                            },
                                            attr: {
                                                kind: "Identifier",
                                                name: "linear",
                                                role: "var",
                                                type: "LinearParams[float, vocab_size, dim]",
                                            },
                                        },
                                    ],
                                },
                            },
                            {
                                kind: "Return",
                                value: {
                                    kind: "Identifier",
                                    name: "logits",
                                    role: "var",
                                },
                            },
                        ],
                    },
                    {
                        kind: "ExprStmt",
                        value: {
                            kind: "Identifier",
                            name: "...",
                            role: "plain",
                        },
                    },
                ],
            },
        ],
    };

    const embDefinitionBlock = {
        kind: "Block",
        body: [
            {
                kind: "FunctionDef",
                name: {
                    kind: "Identifier",
                    name: "emb",
                    role: "fn",
                },
                typeParams: intTypeParams("n", "v", "d"),
                args: [
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "indices",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "TypeSubscript",
                                base: {
                                    kind: "Identifier",
                                    name: "Tensor",
                                    role: "type",
                                },
                                index: {
                                    kind: "Identifier",
                                    name: "int",
                                    role: "type",
                                },
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "TypeList",
                                        items: [intTypeParam("n")],
                                    },
                                ],
                            },
                        },
                    },
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "embedding",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "TypeSubscript",
                                base: {
                                    kind: "Identifier",
                                    name: "Tensor",
                                    role: "type",
                                },
                                index: {
                                    kind: "Identifier",
                                    name: "float",
                                    role: "type",
                                },
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "TypeList",
                                        items: [
                                            intTypeParam("v"),
                                            intTypeParam("d"),
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                ],
                returns: {
                    kind: "TypeSubscript",
                    base: {
                        kind: "TypeSubscript",
                        base: {
                            kind: "Identifier",
                            name: "Tensor",
                            role: "type",
                        },
                        index: {
                            kind: "Identifier",
                            name: "float",
                            role: "type",
                        },
                    },
                    index: {
                        kind: "TypeList",
                        items: [
                            {
                                kind: "TypeList",
                                items: [
                                    intTypeParam("n"),
                                    intTypeParam("d"),
                                ],
                            },
                        ],
                    },
                },
                decorator: {
                    kind: "Identifier",
                    name: "op",
                    role: "fn",
                },
                body: [
                    {
                        kind: "Return",
                        value: {
                            kind: "ListComp",
                            elt: {
                                kind: "Subscript",
                                value: {
                                    kind: "Identifier",
                                    name: "embedding",
                                    role: "var",
                                    type: "Tensor[float][[v, d]]",
                                },
                                index: {
                                    kind: "Identifier",
                                    name: "idx",
                                    role: "var",
                                    type: "int",
                                },
                            },
                            target: [
                                {
                                    kind: "Identifier",
                                    name: "idx",
                                    role: "var",
                                    type: "int",
                                },
                            ],
                            iter: {
                                kind: "Identifier",
                                name: "indices",
                                role: "var",
                                type: "Tensor[int][[n]]",
                            },
                        },
                    },
                ],
            },
        ],
    };

    const littleTransformerCompletePredictBlock = {
        kind: "Block",
        body: [
            {
                kind: "ClassDef",
                name: {
                    kind: "Identifier",
                    name: "ModelParams",
                    role: "type",
                },
                typeParams: intTypeParams("l", "n", "h"),
                body: [
                    {
                        kind: "AnnAssign",
                        target: {
                            kind: "Identifier",
                            name: "token_emb",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "TypeSubscript",
                                base: {
                                    kind: "Identifier",
                                    name: "Tensor",
                                    role: "type",
                                },
                                index: {
                                    kind: "Identifier",
                                    name: "float",
                                    role: "type",
                                },
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "TypeList",
                                        items: [
                                            {
                                                kind: "Identifier",
                                                name: "vocab_size",
                                                role: "var",
                                            },
                                            {
                                                kind: "Identifier",
                                                name: "dim",
                                                role: "var",
                                            },
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                    {
                        kind: "AnnAssign",
                        target: {
                            kind: "Identifier",
                            name: "position_emb",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "TypeSubscript",
                                base: {
                                    kind: "Identifier",
                                    name: "Tensor",
                                    role: "type",
                                },
                                index: {
                                    kind: "Identifier",
                                    name: "float",
                                    role: "type",
                                },
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "TypeList",
                                        items: [
                                            intTypeParam("l"),
                                            {
                                                kind: "Identifier",
                                                name: "dim",
                                                role: "var",
                                            },
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                    {
                        kind: "AnnAssign",
                        target: {
                            kind: "Identifier",
                            name: "block1",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "Identifier",
                                name: "BlockParams",
                                role: "type",
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "Identifier",
                                        name: "float",
                                        role: "type",
                                    },
                                    intTypeParam("n"),
                                    {
                                        kind: "Identifier",
                                        name: "dim",
                                        role: "var",
                                    },
                                    intTypeParam("h"),
                                ],
                            },
                        },
                    },
                    {
                        kind: "AnnAssign",
                        target: {
                            kind: "Identifier",
                            name: "block2",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "Identifier",
                                name: "BlockParams",
                                role: "type",
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "Identifier",
                                        name: "float",
                                        role: "type",
                                    },
                                    intTypeParam("n"),
                                    {
                                        kind: "Identifier",
                                        name: "dim",
                                        role: "var",
                                    },
                                    intTypeParam("h"),
                                ],
                            },
                        },
                    },
                    {
                        kind: "AnnAssign",
                        target: {
                            kind: "Identifier",
                            name: "layer_norm",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "Identifier",
                                name: "LayerNormParams",
                                role: "type",
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "Identifier",
                                        name: "float",
                                        role: "type",
                                    },
                                    {
                                        kind: "Identifier",
                                        name: "dim",
                                        role: "var",
                                    },
                                ],
                            },
                        },
                    },
                    {
                        kind: "AnnAssign",
                        target: {
                            kind: "Identifier",
                            name: "linear",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "Identifier",
                                name: "LinearParams",
                                role: "type",
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "Identifier",
                                        name: "float",
                                        role: "type",
                                    },
                                    {
                                        kind: "Identifier",
                                        name: "vocab_size",
                                        role: "var",
                                    },
                                    {
                                        kind: "Identifier",
                                        name: "dim",
                                        role: "var",
                                    },
                                ],
                            },
                        },
                    },
                ],
            },
            {
                kind: "BlankLine",
            },
            {
                kind: "ClassDef",
                name: {
                    kind: "Identifier",
                    name: "LittleTransformer",
                    role: "type",
                },
                bases: [
                    {
                        kind: "Identifier",
                        name: "Model",
                        role: "type",
                    },
                ],
                body: [
                    {
                        kind: "FunctionDef",
                        name: {
                            kind: "Identifier",
                            name: "predict",
                            role: "fn",
                        },
                        typeParams: intTypeParams("l", "n", "h"),
                        args: [
                            {
                                kind: "Arg",
                                name: {
                                    kind: "Identifier",
                                    name: "indices",
                                    role: "var",
                                },
                                annotation: {
                                    kind: "TypeSubscript",
                                    base: {
                                        kind: "TypeSubscript",
                                        base: {
                                            kind: "Identifier",
                                            name: "Tensor",
                                            role: "type",
                                        },
                                        index: {
                                            kind: "Identifier",
                                            name: "int",
                                            role: "type",
                                        },
                                    },
                                    index: {
                                        kind: "TypeList",
                                        items: [
                                            {
                                                kind: "TypeList",
                                                items: [intTypeParam("l")],
                                            },
                                        ],
                                    },
                                },
                            },
                            {
                                kind: "Arg",
                                name: {
                                    kind: "Identifier",
                                    name: "p",
                                    role: "var",
                                },
                                annotation: {
                                    kind: "TypeSubscript",
                                    base: {
                                        kind: "Identifier",
                                        name: "ModelParams",
                                        role: "type",
                                    },
                                    index: {
                                        kind: "TypeList",
                                        items: [
                                            intTypeParam("l"),
                                            intTypeParam("n"),
                                            intTypeParam("h"),
                                        ],
                                    },
                                },
                            },
                        ],
                        returns: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "TypeSubscript",
                                base: {
                                    kind: "Identifier",
                                    name: "Tensor",
                                    role: "type",
                                },
                                index: {
                                    kind: "Identifier",
                                    name: "float",
                                    role: "type",
                                },
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "TypeList",
                                        items: [
                                            intTypeParam("l"),
                                            {
                                                kind: "Identifier",
                                                name: "vocab_size",
                                                role: "var",
                                            },
                                        ],
                                    },
                                ],
                            },
                        },
                        body: [
                            {
                                kind: "Assign",
                                target: {
                                    kind: "Identifier",
                                    name: "token_emb",
                                    role: "var",
                                    type: "Tensor[float][[l, dim]]",
                                },
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "emb",
                                        role: "fn",
                                        type: "Tensor[float][[l, dim]]",
                                    },
                                    args: [
                                        {
                                            kind: "Identifier",
                                            name: "indices",
                                            role: "var",
                                            type: "Tensor[int][[l]]",
                                        },
                                        {
                                            kind: "Attribute",
                                            value: {
                                                kind: "Identifier",
                                                name: "p",
                                                role: "var",
                                            },
                                            attr: {
                                                kind: "Identifier",
                                                name: "token_emb",
                                                role: "var",
                                                type: "Tensor[float][[vocab_size, dim]]",
                                            },
                                        },
                                    ],
                                },
                            },
                            {
                                kind: "Assign",
                                target: {
                                    kind: "Identifier",
                                    name: "position_emb",
                                    role: "var",
                                    type: "Tensor[float][[l, dim]]",
                                },
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "emb",
                                        role: "fn",
                                        type: "Tensor[float][[l, dim]]",
                                    },
                                    args: [
                                        {
                                            kind: "Call",
	                                callee: {
	                                    kind: "Identifier",
	                                    name: "iota",
	                                    role: "fn",
	                                    type: "Tensor[int][[l]]",
	                                },
                                            args: [intTypeParam("l")],
                                        },
                                        {
                                            kind: "Attribute",
                                            value: {
                                                kind: "Identifier",
                                                name: "p",
                                                role: "var",
                                            },
                                            attr: {
                                                kind: "Identifier",
                                                name: "position_emb",
                                                role: "var",
                                                type: "Tensor[float][[l, dim]]",
                                            },
                                        },
                                    ],
                                },
                            },
                            {
                                kind: "Assign",
                        target: {
                            kind: "Identifier",
                            name: "x",
                            role: "var",
                            type: "Tensor[float][[l, dim]]",
                        },
                                value: {
                                    kind: "BinOp",
                                    left: {
                                        kind: "Identifier",
                                        name: "token_emb",
                                        role: "var",
                                        type: "Tensor[float][[l, dim]]",
                                    },
                                    op: "+",
                                    right: {
                                        kind: "Identifier",
                                        name: "position_emb",
                                        role: "var",
                                        type: "Tensor[float][[l, dim]]",
                                    },
                                },
                            },
                            {
                                kind: "Assign",
                                target: {
                                    kind: "Identifier",
                                    name: "x",
                                    role: "var",
                                    type: "Tensor[float][[l, dim]]",
                                },
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "block",
                                        role: "fn",
                                        type: "Tensor[float][[l, dim]]",
                                    },
                                    args: [
                                        {
                                            kind: "Identifier",
                                            name: "x",
                                            role: "var",
                                            type: "Tensor[float][[l, dim]]",
                                        },
                                        {
                                            kind: "Attribute",
                                            value: {
                                                kind: "Identifier",
                                                name: "p",
                                                role: "var",
                                            },
                                            attr: {
                                                kind: "Identifier",
                                                name: "block1",
                                                role: "var",
                                                type: "BlockParams[float, n, dim, h]",
                                            },
                                        },
                                    ],
                                },
                            },
                            {
                                kind: "Assign",
                        target: {
                            kind: "Identifier",
                            name: "x",
                            role: "var",
                            type: "Tensor[float][[l, dim]]",
                        },
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "block",
                                        role: "fn",
                                        type: "Tensor[float][[l, dim]]",
                                    },
                                    args: [
                                        {
                                            kind: "Identifier",
                                            name: "x",
                                            role: "var",
                                            type: "Tensor[float][[l, dim]]",
                                        },
                                        {
                                            kind: "Attribute",
                                            value: {
                                                kind: "Identifier",
                                                name: "p",
                                                role: "var",
                                            },
                                            attr: {
                                                kind: "Identifier",
                                                name: "block2",
                                                role: "var",
                                                type: "BlockParams[float, n, dim, h]",
                                            },
                                        },
                                    ],
                                },
                            },
                            {
                                kind: "Assign",
                                target: {
                                    kind: "Identifier",
                                    name: "x",
                                    role: "var",
                                },
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "layer_norm",
                                        role: "fn",
                                        type: "Tensor[float][[l, dim]]",
                                    },
                                    args: [
                                        {
                                            kind: "Identifier",
                                            name: "x",
                                            role: "var",
                                            type: "Tensor[float][[l, dim]]",
                                        },
                                        {
                                            kind: "Attribute",
                                            value: {
                                                kind: "Identifier",
                                                name: "p",
                                                role: "var",
                                            },
                                            attr: {
                                                kind: "Identifier",
                                                name: "layer_norm",
                                                role: "var",
                                                type: "LayerNormParams[float, dim]",
                                            },
                                        },
                                    ],
                                },
                            },
                            {
                                kind: "Assign",
                        target: {
                            kind: "Identifier",
                            name: "logits",
                            role: "var",
                            type: "Tensor[float][[l, vocab_size]]",
                        },
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "linear",
                                        role: "fn",
                                        type: "Tensor[float][[l, vocab_size]]",
                                    },
                                    args: [
                                        {
                                            kind: "Identifier",
                                            name: "x",
                                            role: "var",
                                            type: "Tensor[float][[l, dim]]",
                                        },
                                        {
                                            kind: "Attribute",
                                            value: {
                                                kind: "Identifier",
                                                name: "p",
                                                role: "var",
                                            },
                                            attr: {
                                                kind: "Identifier",
                                                name: "linear",
                                                role: "var",
                                                type: "LinearParams[float, vocab_size, dim]",
                                            },
                                        },
                                    ],
                                },
                            },
                            {
                                kind: "Return",
                                value: {
                                    kind: "Identifier",
                                    name: "logits",
                                    role: "var",
                                    type: "Tensor[float][[l, vocab_size]]",
                                },
                            },
                        ],
                    },
                    {
                        kind: "ExprStmt",
                        value: {
                            kind: "Identifier",
                            name: "...",
                            role: "plain",
                        },
                    },
                ],
            },
        ],
    };

    const littleTransformerFullClassBlock = {
        kind: "Block",
        body: [
            {
                kind: "ClassDef",
                name: {
                    kind: "Identifier",
                    name: "LittleTransformer",
                    role: "type",
                },
                bases: [
                    {
                        kind: "Identifier",
                        name: "Model",
                        role: "type",
                    },
                ],
                body: [
                    {
                        kind: "FunctionDef",
                        name: {
                            kind: "Identifier",
                            name: "predict",
                            role: "fn",
                        },
                        typeParams: intTypeParams("l", "n", "h"),
                        args: [
                            {
                                kind: "Arg",
                                name: {
                                    kind: "Identifier",
                                    name: "indices",
                                    role: "var",
                                },
                                annotation: {
                                    kind: "TypeSubscript",
                                    base: {
                                        kind: "TypeSubscript",
                                        base: {
                                            kind: "Identifier",
                                            name: "Tensor",
                                            role: "type",
                                        },
                                        index: {
                                            kind: "Identifier",
                                            name: "float",
                                            role: "type",
                                        },
                                    },
                                    index: {
                                        kind: "TypeList",
                                        items: [
                                            {
                                                kind: "TypeList",
                                                items: [intTypeParam("l")],
                                            },
                                        ],
                                    },
                                },
                            },
                            {
                                kind: "Arg",
                                name: {
                                    kind: "Identifier",
                                    name: "p",
                                    role: "var",
                                },
                                annotation: {
                                    kind: "TypeSubscript",
                                    base: {
                                        kind: "Identifier",
                                        name: "ModelParams",
                                        role: "type",
                                    },
                                    index: {
                                        kind: "TypeList",
                                        items: [
                                            intTypeParam("l"),
                                            intTypeParam("n"),
                                            intTypeParam("h"),
                                        ],
                                    },
                                },
                            },
                        ],
                        returns: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "TypeSubscript",
                                base: {
                                    kind: "Identifier",
                                    name: "Tensor",
                                    role: "type",
                                },
                                index: {
                                    kind: "Identifier",
                                    name: "float",
                                    role: "type",
                                },
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "TypeList",
                                        items: [
                                            intTypeParam("l"),
                                            {
                                                kind: "Identifier",
                                                name: "vocab_size",
                                                role: "var",
                                            },
                                        ],
                                    },
                                ],
                            },
                        },
                        body: [
                            {
                                kind: "Assign",
                                target: {
                                    kind: "Identifier",
                                    name: "token_emb",
                                    role: "var",
                                    type: "Tensor[float][[l, dim]]",
                                },
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "emb",
                                        role: "fn",
                                        type: "Tensor[float][[l, dim]]",
                                    },
                                    args: [
                                        {
                                            kind: "Identifier",
                                            name: "indices",
                                            role: "var",
                                            type: "Tensor[int][[l]]",
                                        },
                                        {
                                            kind: "Attribute",
                                            value: {
                                                kind: "Identifier",
                                                name: "p",
                                                role: "var",
                                            },
                                            attr: {
                                                kind: "Identifier",
                                                name: "token_emb",
                                                role: "var",
                                                type: "Tensor[float][[vocab_size, dim]]",
                                            },
                                        },
                                    ],
                                },
                            },
                            {
                                kind: "Assign",
                                target: {
                                    kind: "Identifier",
                                    name: "position_emb",
                                    role: "var",
                                    type: "Tensor[float][[l, dim]]",
                                },
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "emb",
                                        role: "fn",
                                        type: "Tensor[float][[l, dim]]",
                                    },
                                    args: [
                                        {
                                            kind: "Call",
                                            callee: {
                                                kind: "Identifier",
                                                name: "iota",
                                                role: "fn",
                                                type: "Tensor[int][[l]]",
                                            },
                                            args: [intTypeParam("l")],
                                        },
                                        {
                                            kind: "Attribute",
                                            value: {
                                                kind: "Identifier",
                                                name: "p",
                                                role: "var",
                                            },
                                            attr: {
                                                kind: "Identifier",
                                                name: "position_emb",
                                                role: "var",
                                                type: "Tensor[float][[l, dim]]",
                                            },
                                        },
                                    ],
                                },
                            },
                            {
                                kind: "Assign",
                                target: {
                                    kind: "Identifier",
                                    name: "x",
                                    role: "var",
                                    type: "Tensor[float][[l, dim]]",
                                },
                                value: {
                                    kind: "BinOp",
                                    left: {
                                        kind: "Identifier",
                                        name: "token_emb",
                                        role: "var",
                                        type: "Tensor[float][[l, dim]]",
                                    },
                                    op: "+",
                                    right: {
                                        kind: "Identifier",
                                        name: "position_emb",
                                        role: "var",
                                        type: "Tensor[float][[l, dim]]",
                                    },
                                },
                            },
                            {
                                kind: "Assign",
                                target: {
                                    kind: "Identifier",
                                    name: "x",
                                    role: "var",
                                    type: "Tensor[float][[l, dim]]",
                                },
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "block",
                                        role: "fn",
                                        type: "Tensor[float][[l, dim]]",
                                    },
                                    args: [
                                        {
                                            kind: "Identifier",
                                            name: "x",
                                            role: "var",
                                            type: "Tensor[float][[l, dim]]",
                                        },
                                        {
                                            kind: "Attribute",
                                            value: {
                                                kind: "Identifier",
                                                name: "p",
                                                role: "var",
                                            },
                                            attr: {
                                                kind: "Identifier",
                                                name: "block1",
                                                role: "var",
                                                type: "BlockParams[float, n, dim, h]",
                                            },
                                        },
                                    ],
                                },
                            },
                            {
                                kind: "Assign",
                                target: {
                                    kind: "Identifier",
                                    name: "x",
                                    role: "var",
                                    type: "Tensor[float][[l, dim]]",
                                },
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "block",
                                        role: "fn",
                                        type: "Tensor[float][[l, dim]]",
                                    },
                                    args: [
                                        {
                                            kind: "Identifier",
                                            name: "x",
                                            role: "var",
                                            type: "Tensor[float][[l, dim]]",
                                        },
                                        {
                                            kind: "Attribute",
                                            value: {
                                                kind: "Identifier",
                                                name: "p",
                                                role: "var",
                                            },
                                            attr: {
                                                kind: "Identifier",
                                                name: "block2",
                                                role: "var",
                                                type: "BlockParams[float, n, dim, h]",
                                            },
                                        },
                                    ],
                                },
                            },
                            {
                                kind: "Assign",
                                target: {
                                    kind: "Identifier",
                                    name: "x",
                                    role: "var",
                                    type: "Tensor[float][[l, dim]]",
                                },
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "layer_norm",
                                        role: "fn",
                                        type: "Tensor[float][[l, dim]]",
                                    },
                                    args: [
                                        {
                                            kind: "Identifier",
                                            name: "x",
                                            role: "var",
                                            type: "Tensor[float][[l, dim]]",
                                        },
                                        {
                                            kind: "Attribute",
                                            value: {
                                                kind: "Identifier",
                                                name: "p",
                                                role: "var",
                                            },
                                            attr: {
                                                kind: "Identifier",
                                                name: "layer_norm",
                                                role: "var",
                                                type: "LayerNormParams[float, dim]",
                                            },
                                        },
                                    ],
                                },
                            },
                            {
                                kind: "Assign",
                                target: {
                                    kind: "Identifier",
                                    name: "logits",
                                    role: "var",
                                    type: "Tensor[float][[l, vocab_size]]",
                                },
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "linear",
                                        role: "fn",
                                        type: "Tensor[float][[l, vocab_size]]",
                                    },
                                    args: [
                                        {
                                            kind: "Identifier",
                                            name: "x",
                                            role: "var",
                                            type: "Tensor[float][[l, dim]]",
                                        },
                                        {
                                            kind: "Attribute",
                                            value: {
                                                kind: "Identifier",
                                                name: "p",
                                                role: "var",
                                            },
                                            attr: {
                                                kind: "Identifier",
                                                name: "linear",
                                                role: "var",
                                                type: "LinearParams[float, vocab_size, dim]",
                                            },
                                        },
                                    ],
                                },
                            },
                            {
                                kind: "Return",
                                value: {
                                    kind: "Identifier",
                                    name: "logits",
                                    role: "var",
                                    type: "Tensor[float][[l, vocab_size]]",
                                },
                            },
                        ],
                    },
                    {
                        kind: "BlankLine",
                    },
                    {
                        kind: "FunctionDef",
                        name: {
                            kind: "Identifier",
                            name: "loss",
                            role: "fn",
                        },
                        typeParams: intTypeParams("b", "l"),
                        args: [
                            {
                                kind: "Arg",
                                name: {
                                    kind: "Identifier",
                                    name: "ys_pred",
                                    role: "var",
                                },
                                annotation: {
                                    kind: "TypeSubscript",
                                    base: {
                                        kind: "TypeSubscript",
                                        base: {
                                            kind: "Identifier",
                                            name: "Tensor",
                                            role: "type",
                                        },
                                        index: {
                                            kind: "Identifier",
                                            name: "float",
                                            role: "type",
                                        },
                                    },
                                    index: {
                                        kind: "TypeList",
                                        items: [
                                            {
                                                kind: "TypeList",
                                                items: [
                                                    intTypeParam("b"),
                                                    intTypeParam("l"),
                                                    {
                                                        kind: "Identifier",
                                                        name: "vocab_size",
                                                        role: "var",
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                },
                            },
                            {
                                kind: "Arg",
                                name: {
                                    kind: "Identifier",
                                    name: "ys",
                                    role: "var",
                                },
                                annotation: {
                                    kind: "TypeSubscript",
                                    base: {
                                        kind: "TypeSubscript",
                                        base: {
                                            kind: "Identifier",
                                            name: "Tensor",
                                            role: "type",
                                        },
                                        index: {
                                            kind: "Identifier",
                                            name: "int",
                                            role: "type",
                                        },
                                    },
                                    index: {
                                        kind: "TypeList",
                                        items: [
                                            {
                                                kind: "TypeList",
                                                items: [
                                                    intTypeParam("b"),
                                                    intTypeParam("l"),
                                                ],
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                        returns: {
                            kind: "Identifier",
                            name: "float",
                            role: "type",
                        },
                        body: [
                            {
                                kind: "Assign",
                                target: {
                                    kind: "Identifier",
                                    name: "ys_pred",
                                    role: "var",
                                    type: "Tensor[float][[b * l, vocab_size]]",
                                },
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Attribute",
                                        type: "Tensor[float][[b * l, vocab_size]]",
                                        value: {
                                            kind: "Identifier",
                                            name: "ys_pred",
                                            role: "var",
                                            type: "Tensor[float][[b, l, vocab_size]]",
                                        },
                                        attr: {
                                            kind: "Identifier",
                                            name: "reshape",
                                            role: "plain",
                                            type: "Tensor[float][[b * l, vocab_size]]",
                                        },
                                    },
                                    args: [
                                        {
                                            kind: "List",
                                            elements: [
                                                {
                                                    kind: "BinOp",
                                                    left: intTypeParam("b"),
                                                    op: "*",
                                                    right: intTypeParam("l"),
                                                },
                                                {
                                                    kind: "Identifier",
                                                    name: "vocab_size",
                                                    role: "var",
                                                },
                                            ],
                                        },
                                    ],
                                },
                            },
                            {
                                kind: "Assign",
                                target: {
                                    kind: "Identifier",
                                    name: "ys",
                                    role: "var",
                                    type: "Tensor[int][[b * l]]",
                                },
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Attribute",
                                        type: "Tensor[int][[b * l]]",
                                        value: {
                                            kind: "Identifier",
                                            name: "ys",
                                            role: "var",
                                            type: "Tensor[int][[b, l]]",
                                        },
                                        attr: {
                                            kind: "Identifier",
                                            name: "reshape",
                                            role: "plain",
                                            type: "Tensor[int][[b * l]]",
                                        },
                                    },
                                    args: [
                                        {
                                            kind: "List",
                                            elements: [
                                                {
                                                    kind: "BinOp",
                                                    left: intTypeParam("b"),
                                                    op: "*",
                                                    right: intTypeParam("l"),
                                                },
                                            ],
                                        },
                                    ],
                                },
                            },
                            {
                                kind: "Return",
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "cross_entropy",
                                        role: "fn",
                                        type: "float",
                                    },
                                    args: [
                                        {
                                            kind: "Identifier",
                                            name: "ys_pred",
                                            role: "var",
                                            type: "Tensor[float][[b * l, vocab_size]]",
                                        },
                                        {
                                            kind: "Identifier",
                                            name: "ys",
                                            role: "var",
                                            type: "Tensor[int][[b * l]]",
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                    {
                        kind: "BlankLine",
                    },
                    {
                        kind: "FunctionDef",
                        name: {
                            kind: "Identifier",
                            name: "update",
                            role: "fn",
                        },
                        args: [
                            {
                                kind: "Arg",
                                name: {
                                    kind: "Identifier",
                                    name: "self",
                                    role: "var",
                                },
                            },
                            {
                                kind: "Arg",
                                name: {
                                    kind: "Identifier",
                                    name: "P",
                                    role: "var",
                                },
                                annotation: {
                                    kind: "TypeSubscript",
                                    base: {
                                        kind: "Identifier",
                                        name: "Tuple",
                                        role: "type",
                                    },
                                    index: {
                                        kind: "TypeList",
                                        items: [
                                            {
                                                kind: "Identifier",
                                                name: "float",
                                                role: "type",
                                            },
                                            {
                                                kind: "Identifier",
                                                name: "float",
                                                role: "type",
                                            },
                                            {
                                                kind: "Identifier",
                                                name: "float",
                                                role: "type",
                                            },
                                        ],
                                    },
                                },
                            },
                            {
                                kind: "Arg",
                                name: {
                                    kind: "Identifier",
                                    name: "g",
                                    role: "var",
                                    type: "float",
                                },
                                annotation: {
                                    kind: "Identifier",
                                    name: "float",
                                    role: "type",
                                },
                            },
                        ],
                        returns: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "Identifier",
                                name: "Tuple",
                                role: "type",
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "Identifier",
                                        name: "float",
                                        role: "type",
                                    },
                                    {
                                        kind: "Identifier",
                                        name: "float",
                                        role: "type",
                                    },
                                    {
                                        kind: "Identifier",
                                        name: "float",
                                        role: "type",
                                    },
                                ],
                            },
                        },
                        body: [
                            {
                                kind: "Assign",
                                target: {
                                    kind: "Identifier",
                                    name: "r",
                                    role: "var",
                                    type: "float",
                                },
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "smooth",
                                        role: "fn",
                                        type: "float",
                                    },
                                    args: [
                                        {
                                            kind: "Identifier",
                                            name: "beta",
                                            role: "var",
                                            type: "float",
                                        },
                                        {
                                            kind: "Subscript",
                                            value: {
                                                kind: "Identifier",
                                                name: "P",
                                                role: "var",
                                                type: "Tuple[float, float, float]",
                                            },
                                            index: {
                                                kind: "Number",
                                                value: "2",
                                            },
                                        },
                                        {
                                            kind: "BinOp",
                                            left: {
                                                kind: "Identifier",
                                                name: "g",
                                                role: "var",
                                                type: "float",
                                            },
                                            op: "**",
                                            right: {
                                                kind: "Number",
                                                value: "2.0",
                                            },
                                        },
                                    ],
                                },
                            },
                            {
                                kind: "Assign",
                                target: {
                                    kind: "Identifier",
                                    name: "alpha1",
                                    role: "var",
                                    type: "float",
                                },
                                value: {
                                    kind: "BinOp",
                                    left: {
                                        kind: "Number",
                                        value: "0.01",
                                    },
                                    op: "/",
                                    right: {
                                        kind: "Parenthesized",
                                        value: {
                                            kind: "BinOp",
                                            left: {
                                                kind: "Call",
                                                callee: {
                                                    kind: "Identifier",
                                                    name: "sqrt",
                                                    role: "fn",
                                                    type: "float",
                                                },
                                                args: [
                                                    {
                                                        kind: "Identifier",
                                                        name: "r",
                                                        role: "var",
                                                        type: "float",
                                                    },
                                                ],
                                            },
                                            op: "+",
                                            right: {
                                                kind: "Identifier",
                                                name: "epsilon",
                                                role: "var",
                                                type: "float",
                                            },
                                        },
                                    },
                                },
                            },
                            {
                                kind: "Assign",
                                target: {
                                    kind: "Identifier",
                                    name: "v",
                                    role: "var",
                                    type: "float",
                                },
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "smooth",
                                        role: "fn",
                                        type: "float",
                                    },
                                    args: [
                                        {
                                            kind: "Identifier",
                                            name: "mu",
                                            role: "var",
                                            type: "float",
                                        },
                                        {
                                            kind: "Subscript",
                                            value: {
                                                kind: "Identifier",
                                                name: "P",
                                                role: "var",
                                                type: "Tuple[float, float, float]",
                                            },
                                            index: {
                                                kind: "Number",
                                                value: "1",
                                            },
                                        },
                                        {
                                            kind: "Identifier",
                                            name: "g",
                                            role: "var",
                                            type: "float",
                                        },
                                    ],
                                },
                            },
                            {
                                kind: "Return",
                                value: {
                                    kind: "Tuple",
                                    elements: [
                                        {
                                            kind: "BinOp",
                                            left: {
                                                kind: "Subscript",
                                                value: {
                                                    kind: "Identifier",
                                                    name: "P",
                                                    role: "var",
                                                    type: "Tuple[float, float, float]",
                                                },
                                                index: {
                                                    kind: "Number",
                                                    value: "0",
                                                },
                                            },
                                            op: "-",
                                            right: {
                                                kind: "Parenthesized",
                                                value: {
                                                    kind: "BinOp",
                                                    left: {
                                                        kind: "Identifier",
                                                        name: "alpha1",
                                                        role: "var",
                                                        type: "float",
                                                    },
                                                    op: "*",
                                                    right: {
                                                        kind: "Identifier",
                                                        name: "v",
                                                        role: "var",
                                                        type: "float",
                                                    },
                                                },
                                            },
                                        },
                                        {
                                            kind: "Identifier",
                                            name: "v",
                                            role: "var",
                                            type: "float",
                                        },
                                        {
                                            kind: "Identifier",
                                            name: "r",
                                            role: "var",
                                            type: "float",
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                    {
                        kind: "BlankLine",
                    },
                    {
                        kind: "FunctionDef",
                        name: {
                            kind: "Identifier",
                            name: "inflate",
                            role: "fn",
                        },
                        args: [
                            {
                                kind: "Arg",
                                name: {
                                    kind: "Identifier",
                                    name: "self",
                                    role: "var",
                                },
                            },
                            {
                                kind: "Arg",
                                name: {
                                    kind: "Identifier",
                                    name: "p",
                                    role: "var",
                                    type: "float",
                                },
                                annotation: {
                                    kind: "Identifier",
                                    name: "float",
                                    role: "type",
                                },
                            },
                        ],
                        returns: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "Identifier",
                                name: "Tuple",
                                role: "type",
                            },
                            index: {
                                kind: "TypeList",
                                items: [
                                    {
                                        kind: "Identifier",
                                        name: "float",
                                        role: "type",
                                    },
                                    {
                                        kind: "Identifier",
                                        name: "float",
                                        role: "type",
                                    },
                                    {
                                        kind: "Identifier",
                                        name: "float",
                                        role: "type",
                                    },
                                ],
                            },
                        },
                        body: [
                            {
                                kind: "Return",
                                value: {
                                    kind: "Tuple",
                                    elements: [
                                        {
                                            kind: "Identifier",
                                            name: "p",
                                            role: "var",
                                            type: "float",
                                        },
                                        {
                                            kind: "Number",
                                            value: "0.0",
                                        },
                                        {
                                            kind: "Number",
                                            value: "0.0",
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                    {
                        kind: "BlankLine",
                    },
                    {
                        kind: "FunctionDef",
                        name: {
                            kind: "Identifier",
                            name: "deflate",
                            role: "fn",
                        },
                        args: [
                            {
                                kind: "Arg",
                                name: {
                                    kind: "Identifier",
                                    name: "self",
                                    role: "var",
                                },
                            },
                            {
                                kind: "Arg",
                                name: {
                                    kind: "Identifier",
                                    name: "P",
                                    role: "var",
                                },
                                annotation: {
                                    kind: "TypeSubscript",
                                    base: {
                                        kind: "Identifier",
                                        name: "Tuple",
                                        role: "type",
                                    },
                                    index: {
                                        kind: "TypeList",
                                        items: [
                                            {
                                                kind: "Identifier",
                                                name: "float",
                                                role: "type",
                                            },
                                            {
                                                kind: "Identifier",
                                                name: "float",
                                                role: "type",
                                            },
                                            {
                                                kind: "Identifier",
                                                name: "float",
                                                role: "type",
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                        returns: {
                            kind: "Identifier",
                            name: "float",
                            role: "type",
                        },
                        body: [
                            {
                                kind: "Return",
                                value: {
                                    kind: "Subscript",
                                    value: {
                                        kind: "Identifier",
                                        name: "P",
                                        role: "var",
                                        type: "Tuple[float, float, float]",
                                    },
                                    index: {
                                        kind: "Number",
                                        value: "0",
                                    },
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    };

    const littleTransformerLossBlock = {
        kind: "Block",
        body: [
            {
                kind: "ClassDef",
                name: {
                    kind: "Identifier",
                    name: "LittleTransformer",
                    role: "type",
                },
                bases: [
                    {
                        kind: "Identifier",
                        name: "Model",
                        role: "type",
                    },
                ],
                body: [
                    {
                        kind: "ExprStmt",
                        value: {
                            kind: "Identifier",
                            name: "...",
                            role: "plain",
                        },
                    },
                    {
                        kind: "FunctionDef",
                        name: {
                            kind: "Identifier",
                            name: "loss",
                            role: "fn",
                        },
                        typeParams: intTypeParams("b", "l"),
                        args: [
                            {
                                kind: "Arg",
                                name: {
                                    kind: "Identifier",
                                    name: "ys_pred",
                                    role: "var",
                                },
                                annotation: {
                                    kind: "TypeSubscript",
                                    base: {
                                        kind: "TypeSubscript",
                                        base: {
                                            kind: "Identifier",
                                            name: "Tensor",
                                            role: "type",
                                        },
                                        index: {
                                            kind: "Identifier",
                                            name: "float",
                                            role: "type",
                                        },
                                    },
                                    index: {
                                        kind: "TypeList",
                                        items: [
                                            {
                                                kind: "TypeList",
                                                items: [
                                                    intTypeParam("b"),
                                                    intTypeParam("l"),
                                                    {
                                                        kind: "Identifier",
                                                        name: "vocab_size",
                                                        role: "var",
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                },
                            },
                            {
                                kind: "Arg",
                                name: {
                                    kind: "Identifier",
                                    name: "ys",
                                    role: "var",
                                },
                                annotation: {
                                    kind: "TypeSubscript",
                                    base: {
                                        kind: "TypeSubscript",
                                        base: {
                                            kind: "Identifier",
                                            name: "Tensor",
                                            role: "type",
                                        },
                                        index: {
                                            kind: "Identifier",
                                            name: "int",
                                            role: "type",
                                        },
                                    },
                                    index: {
                                        kind: "TypeList",
                                        items: [
                                            {
                                                kind: "TypeList",
                                                items: [
                                                    intTypeParam("b"),
                                                    intTypeParam("l"),
                                                ],
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                        returns: {
                            kind: "Identifier",
                            name: "float",
                            role: "type",
                        },
                        body: [
                            {
                                kind: "Assign",
                                target: {
                                    kind: "Identifier",
                                    name: "ys_pred",
                                    role: "var",
                                    type: "Tensor[float][[b * l, vocab_size]]",
                                },
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Attribute",
                                        type: "Tensor[float][[b * l, vocab_size]]",
                                        value: {
                                            kind: "Identifier",
                                            name: "ys_pred",
                                            role: "var",
                                            type: "Tensor[float][[b, l, vocab_size]]",
                                        },
                                        attr: {
                                            kind: "Identifier",
                                            name: "reshape",
                                            role: "plain",
                                            type: "Tensor[float][[b * l, vocab_size]]",
                                        },
                                    },
                                    args: [
                                        {
                                            kind: "List",
                                            elements: [
                                                {
                                                    kind: "BinOp",
                                                    left: intTypeParam("b"),
                                                    op: "*",
                                                    right: intTypeParam("l"),
                                                },
                                                {
                                                    kind: "Identifier",
                                                    name: "vocab_size",
                                                    role: "var",
                                                },
                                            ],
                                        },
                                    ],
                                },
                            },
                            {
                                kind: "Assign",
                                target: {
                                    kind: "Identifier",
                                    name: "ys",
                                    role: "var",
                                    type: "Tensor[int][[b * l]]",
                                },
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Attribute",
                                        type: "Tensor[int][[b * l]]",
                                        value: {
                                            kind: "Identifier",
                                            name: "ys",
                                            role: "var",
                                            type: "Tensor[int][[b, l]]",
                                        },
                                        attr: {
                                            kind: "Identifier",
                                            name: "reshape",
                                            role: "plain",
                                            type: "Tensor[int][[b * l]]",
                                        },
                                    },
                                    args: [
                                        {
                                            kind: "List",
                                            elements: [
                                                {
                                                    kind: "BinOp",
                                                    left: intTypeParam("b"),
                                                    op: "*",
                                                    right: intTypeParam("l"),
                                                },
                                            ],
                                        },
                                    ],
                                },
                            },
                            {
                                kind: "Return",
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "cross_entropy",
                                        role: "fn",
                                        type: "float",
                                    },
                                    args: [
                                        {
                                            kind: "Identifier",
                                            name: "ys_pred",
                                            role: "var",
                                            type: "Tensor[float][[b * l, vocab_size]]",
                                        },
                                        {
                                            kind: "Identifier",
                                            name: "ys",
                                            role: "var",
                                            type: "Tensor[int][[b * l]]",
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                    {
                        kind: "ExprStmt",
                        value: {
                            kind: "Identifier",
                            name: "...",
                            role: "plain",
                        },
                    },
                ],
            },
        ],
    };

    render({
        id: "prelude",
        dialog: [
            message(
                "D",
                "LeNet works like a detective who is specialized in pictures. " +
                "It collects clues using corr2d layers, and then makes decisions using linear layers.\n" +
                "Now we build another detective, this time specialized in text."
            ),
            message(
                "W",
                "What's the name of our new detective?"
            ),
            message(
                "D",
                "Let's call it the LittleTransformer.\n" +
                "It follows a similar process: collecting clues first and making decisions later.\n" +
                "Its new clue-collecting technique is called !!attention!!."
            ),
            message(
                "W",
                "Attention sounds like the model is looking around before making up its mind."
            ),
            message(
                "D",
                "Suppose we are reading the sentence\n" +
                "`the animal didn't cross the street because it was too tired`.\n" +
                "When we read `it`, we want to know which earlier word it refers to.\n" +
                "Attention computes a score for every earlier word. " +
                "A high score means: this one looks relevant. " +
                "A low score means: probably ignore it."
            ),
            message(
                "W",
                "Let's define a function to compute scores!"
            ),
            message(
                "D",
                "To compare tokens, we first turn each one into a vector of numbers called an !!embedding!!.\n" +
                "We write one embedding as `Tensor[float][[d]]`.\n" +
                "`d` is the length of that vector: a larger `d` gives each token more room to carry information."
            ),
            message(
                "W",
                "You just said `token`.\n" +
                "Is a token the same thing as a word?"
            ),
            message(
                "D",
                "A token is one unit that the model reads.\n" +
                "Sometimes one token is a whole word, and sometimes it is part of a word or a piece of punctuation.\n" +
                "Different tokens may learn similar embeddings, if these tokens share similar roles."
            ),
            message(
                "W",
                "Then, attention is a function that takes in embeddings and generates scores?"
            ),
            {
                ...message(
                    "D",
                    "Yes.\n" +
                    "Each embedding prepares three views of itself: query, key, and value.\n" +
                    "Query expresses what this position is looking for.\n" +
                    "Key expresses what this position offers.\n" +
                    "Value carries the information that can be passed along.\n" +
                    "Attention compares queries with keys, then uses the scores to mix the values."
                ),
                codeLabel: "`SelfAttentionParams` and `attention` definitions",
                buildCodeBlock: (_ast: AstApi) => selfAttentionDefinitionBlock,
                textAfterCode:
                    "`k.permute(1, 0)` swaps the two dimensions of `k`.\n" +
                    "Then `q @ k.permute(1, 0)` computes one dot product for each query-key pair, giving the raw attention scores.\n" +
                    "We keep the weights stable by dividing it with the square root of `n`.\n" +
                    "`softmax` turns these scores into non-negative weights that add up to `1.0`, so we can use them to mix the values.",
            },
            message(
                "W",
                "Hmm... `d` is like the input channels of LeNet and `n` is like the output channels?\n" +
                "Why is `attention` still missing a line?"
            ),
            {
                ...message(
                    "D",
                    "Channels are a useful analogy, and we will return to it soon.\n"+
                    "For language generation, each position should focus on earlier words.\n" +
                    "So we add `causal_mask` to guide attention toward the left side of the sequence."
                ),
                codeLabel: "`causal_mask` definition",
                buildCodeBlock: (_ast: AstApi) => causalMaskDefinitionBlock,
                textAfterCode:
                    "`causal_mask` keeps the past and replaces the future with small numbers.\n" +
                    "Then `softmax` gives almost zero weight to those future positions." 
            },
            {
                ...message(
                    "W",
                    "Then the complete `attention` should look like this."
                ),
                codeLabel: "complete `attention`",
                buildCodeBlock: (_ast: AstApi) => selfAttentionCompleteBlock,
            },
            message(
                "D",
                "Now we revisit the analogy of channels.\nThere are many kinds of attentions, just like many kinds of patterns in pictures. " +
                "Some tracks the grammatical structure, some focuses on subject-verb agreement, and some pays attention to nearby conext.\n" +
                "A model is more effective is we track different kinds seperately, just like LeNet's output channels learn different patterns."
            ),
            message(
                "W",
                "I see! Can we simply add an extra dimension for `q`, `k`, and `v`?"
            ),
            {
                ...message(
                    "D",
                    "Exactly. This extra dimension is `h`, for multi-heads attention.\n" +
                    "For each head, we store one set of query, key, and value weights, then merge all head outputs back together."
                ),
                codeLabel: "`MultiHeadsAttentionParams` and `multi_heads_attention` definitions",
                buildCodeBlock: (_ast: AstApi) => multiHeadsAttentionDefinitionBlock,
            },
            message(
                "W",
                "Now we have the clue-collector, how about the decision-maker?"
            ),
            {
                ...message(
                    "D",
                    "The decision-maker is called `feed_forward`. It consists of two linear layers."
                ),
                codeLabel: "`FeedForwardParams` and `feed_forward` definitions",
                buildCodeBlock: (_ast: AstApi) => feedForwardDefinitionBlock,
                textAfterCode: "The first layer expands the parameters, give more space to untangle complex data. " +
                "Then the second layer compresses the learned information to the original size."
            },
            message(
                "W",
                "Why expanding by `4`? Is it another alchemy number?"
            ),
            {...message(
                "D",
                "Yes, `4` works well in practice.\n" +
                "Now we combine the clue-collector and the decision-maker into one `block`."
            ),
                codeLabel: "`BlockParams` and `block` definitions, abbreviated",
                buildCodeBlock: (_ast: AstApi) => blockDefinitionV1Block,
            },
            message(
                "W",
                "The `block` adds the attention back to `x`. So it keeps refining what it has learned.\n" +
                "I see `block` is not complete--what else do we need?"
            ),
            {
                ...message(
                    "D",
                    "We also want `x` to stay well scaled, since practical models often stack many blocks in sequence.\n"
                ),
                codeLabel: "`LayerNormParams` and `layer_norm` definitions",
                buildCodeBlock: (_ast: AstApi) => layerNormDefinitionBlock,
                textAfterCode: "`layer_norm` stablizes `x`. Let's insert it before collecting clues or making decisions."
            },
            {
                ...message(
                    "W",
                    "Here is the complete version with layer norms filled in."
                ),
                codeLabel: "complete `BlockParams` and `block`",
                buildCodeBlock: (_ast: AstApi) => blockDefinitionV2Block,
            },
            {
                ...message(
                    "D",
                    "Good. Now we can draft `predict`.\n" +
                    "Our LittleTransformer speaks 65 distinct tokens, and each embedding has length 32.\n" +
                    "The input is a sequence of token IDs.\n" +
                    "The output is a table of scores, one row per position and one column per token in the vocabulary."
                ),
                codeLabel: "`LittleTransformer` with `predict`",
                buildCodeBlock: (_ast: AstApi) => littleTransformerClassBlock,
            },
            message(
                "W",
                "There is a little gap: the inputs are tokens, but `block` needs their embeddings."
            ),
            {
                ...message(
                    "D",
                    "Exactly. The next step is to turn token IDs into embeddings with `emb`.\n" +
                    "Each entry in `indices` points to one row of the embedding table.\n" +
                    "`emb` gathers the embeddings stored in the corresponding indices."
                ),
                codeLabel: "`emb` definition",
                buildCodeBlock: (_ast: AstApi) => embDefinitionBlock,
                textAfterCode:
                    "Next we give two embeddings to `predict`."
            },
            message(
                "W",
                "Which two?"
            ),
            {
                ...message(
                    "D",
                    "One for meanings and one for positions. These two embeddings are complementary. Here we simply add them together.", 
                ),
                codeLabel: "`LittleTransformer` with complete `predict`",
                buildCodeBlock: (_ast: AstApi) => littleTransformerCompletePredictBlock,
                textAfterCode: "Now `predict` is complete. Let's define `loss`. What's the type of `ys_pred`?"
            },
            message(
                "W",
                "`loss` takes in a batch of predictions. So `ys_pred` should be some `Tensor[float][[b, l, vocab_size]]`."
            ),
            {
                ...message(
                    "D",
                    "Right, here's our definition of `loss`. For each input, `ys_pred` contains the scores for all tokens, " +
                    "while `ys` has the index of the correct one. Then `cross_entropy` tells how wrong the predictions are."
                ),
                codeLabel: "`LittleTransformer.loss`",
                buildCodeBlock: (_ast: AstApi) => littleTransformerLossBlock,
            },
            message(
                "W",
                "We have `predict` and `loss`. How about `update`?"
            ),
            {
                ...message(
                    "D",
                    "We use our old RMS `update` to stablize gradients. Now the LittleTransformer is complete!**"
                ),
                codeLabel: "full `LittleTransformer`",
                buildCodeBlock: (_ast: AstApi) => littleTransformerFullClassBlock,
            }
        ],
        notes: "* Of course, there are other transformers that are designed to peek into the future.\n" +
        "** The code is available at [PyPie's Github repository](https://github.com/pypie-lang/pypie-examples/blob/main/models/transformer.py)."
    });
})();
