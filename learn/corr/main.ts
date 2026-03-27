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

    const intTypeParams = (...names: string[]) => names.map((name) => intTypeParam(name));

    const dotDefinitionBlock = {
        kind: "Block",
        body: [
            {
                kind: "ImportFrom",
                module: {
                    kind: "Identifier",
                    name: "pypie",
                    role: "plain",
                },
                names: [
                    {
                        kind: "Identifier",
                        name: "op",
                        role: "fn",
                    },
                    {
                        kind: "Identifier",
                        name: "Tensor",
                        role: "type",
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
                    name: "dot",
                    role: "fn",
                },
                typeParams: intTypeParams("n"),
                args: [
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "s",
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
                                                name: "n",
                                                role: "var",
                                                type: "int",
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
                            name: "p",
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
                                                name: "n",
                                                role: "var",
                                                type: "int",
                                            },
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
                decorator: {
                    kind: "Identifier",
                    name: "op",
                    role: "fn",
                },
                body: [
                    {
                        kind: "Return",
                        value: {
                            kind: "Call",
                            callee: {
                                kind: "Attribute",
                                value: {
                                    kind: "BinOp",
                                    left: {
                                        kind: "Identifier",
                                        name: "p",
                                        role: "var",
                                        type: "Tensor[float][[n]]",
                                    },
                                    op: "*",
                                    right: {
                                        kind: "Identifier",
                                        name: "s",
                                        role: "var",
                                        type: "Tensor[float][[n]]",
                                    },
                                },
                                attr: {
                                    kind: "Identifier",
                                    name: "sum",
                                    role: "plain",
                                    type: "float",
                                },
                            },
                            args: [
                                {
                                    kind: "Number",
                                    value: "0",
                                },
                            ],
                        },
                    },
                ],
            },
        ],
    };

    const corr1dDefinitionBlock = {
        kind: "Block",
        body: [
            {
                kind: "ImportFrom",
                module: {
                    kind: "Identifier",
                    name: "pypie",
                    role: "plain",
                },
                names: [
                    {
                        kind: "Identifier",
                        name: "iota",
                        role: "fn",
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
                    name: "corr1d",
                    role: "fn",
                },
                typeParams: intTypeParams("w", "n"),
                args: [
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "s",
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
                                                name: "w",
                                                role: "var",
                                                type: "int",
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
                            name: "p",
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
                                                name: "n",
                                                role: "var",
                                                type: "int",
                                            },
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
                                    {
                                        kind: "BinOp",
                                        left: {
                                            kind: "BinOp",
                                            left: {
                                                kind: "Identifier",
                                                name: "w",
                                                role: "var",
                                                type: "int",
                                            },
                                            op: "-",
                                            right: {
                                                kind: "Identifier",
                                                name: "n",
                                                role: "var",
                                                type: "int",
                                            },
                                        },
                                        op: "+",
                                        right: {
                                            kind: "Number",
                                            value: "1",
                                        },
                                    },
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
                                kind: "Call",
                                callee: {
                                    kind: "Identifier",
                                    name: "dot",
                                    role: "fn",
                                    type: "float",
                                },
                                args: [
                                    {
                                        kind: "Subscript",
                                        value: {
                                            kind: "Identifier",
                                            name: "s",
                                            role: "var",
                                            type: "Tensor[float][[w]]",
                                        },
                                        index: {
                                            kind: "Slice",
                                            start: {
                                                kind: "Identifier",
                                                name: "idx",
                                                role: "var",
                                                type: "int",
                                            },
                                            end: {
                                                kind: "BinOp",
                                                left: {
                                                    kind: "Identifier",
                                                    name: "idx",
                                                    role: "var",
                                                    type: "int",
                                                },
                                                op: "+",
                                                right: {
                                                    kind: "Identifier",
                                                    name: "n",
                                                    role: "var",
                                                    type: "int",
                                                },
                                            },
                                        },
                                    },
                                    {
                                        kind: "Identifier",
                                        name: "p",
                                        role: "var",
                                        type: "Tensor[float][[n]]",
                                    },
                                ],
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
                                kind: "Call",
                                callee: {
                                    kind: "Identifier",
                                    name: "iota",
                                    role: "fn",
                                    type: "Tensor[int][[w - n + 1]]",
                                },
                                args: [
                                    {
                                        kind: "BinOp",
                                        left: {
                                            kind: "BinOp",
                                            left: {
                                                kind: "Identifier",
                                                name: "w",
                                                role: "var",
                                                type: "int",
                                            },
                                            op: "-",
                                            right: {
                                                kind: "Identifier",
                                                name: "n",
                                                role: "var",
                                                type: "int",
                                            },
                                        },
                                        op: "+",
                                        right: {
                                            kind: "Number",
                                            value: "1",
                                        },
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
        ],
    };

    const pad1dDefinitionBlock = {
        kind: "Block",
        body: [
            {
                kind: "FunctionDef",
                name: {
                    kind: "Identifier",
                    name: "pad1d",
                    role: "fn",
                },
                typeParams: intTypeParams("n"),
                args: [
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "xs",
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
                                                name: "n",
                                                role: "var",
                                                type: "int",
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
                            name: "padding",
                            role: "var",
                            type: "int",
                        },
                        annotation: {
                            kind: "Identifier",
                            name: "int",
                            role: "type",
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
                                    {
                                        kind: "BinOp",
                                        left: {
                                            kind: "Identifier",
                                            name: "n",
                                            role: "var",
                                            type: "int",
                                        },
                                        op: "+",
                                        right: {
                                            kind: "BinOp",
                                            left: {
                                                kind: "Number",
                                                value: "2",
                                            },
                                            op: "*",
                                            right: {
                                                kind: "Identifier",
                                                name: "padding",
                                                role: "var",
                                                type: "int",
                                            },
                                        },
                                    },
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
                                kind: "IfExpr",
                                body: {
                                    kind: "Subscript",
                                    value: {
                                        kind: "Identifier",
                                        name: "xs",
                                        role: "var",
                                        type: "Tensor[float][[n]]",
                                    },
                                    index: {
                                        kind: "BinOp",
                                        left: {
                                            kind: "Identifier",
                                            name: "i",
                                            role: "var",
                                            type: "int",
                                        },
                                        op: "-",
                                        right: {
                                            kind: "Identifier",
                                            name: "padding",
                                            role: "var",
                                            type: "int",
                                        },
                                    },
                                },
                                test: {
                                    kind: "BoolOp",
                                    op: "and",
                                    values: [
                                        {
                                            kind: "Compare",
                                            left: {
                                                kind: "Identifier",
                                                name: "padding",
                                                role: "var",
                                                type: "int",
                                            },
                                            op: "<=",
                                            right: {
                                                kind: "Identifier",
                                                name: "i",
                                                role: "var",
                                                type: "int",
                                            },
                                        },
                                        {
                                            kind: "Compare",
                                            left: {
                                                kind: "Identifier",
                                                name: "i",
                                                role: "var",
                                                type: "int",
                                            },
                                            op: "<",
                                            right: {
                                                kind: "BinOp",
                                                left: {
                                                    kind: "Identifier",
                                                    name: "n",
                                                    role: "var",
                                                    type: "int",
                                                },
                                                op: "+",
                                                right: {
                                                    kind: "Identifier",
                                                    name: "padding",
                                                    role: "var",
                                                    type: "int",
                                                },
                                            },
                                        },
                                    ],
                                },
                                orelse: {
                                    kind: "Number",
                                    value: "0.0",
                                },
                            },
                            target: [
                                {
                                    kind: "Identifier",
                                    name: "i",
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
                                    type: "Tensor[int][[n + 2 * padding]]",
                                },
                                args: [
                                    {
                                        kind: "BinOp",
                                        left: {
                                            kind: "Identifier",
                                            name: "n",
                                            role: "var",
                                            type: "int",
                                        },
                                        op: "+",
                                        right: {
                                            kind: "BinOp",
                                            left: {
                                                kind: "Number",
                                                value: "2",
                                            },
                                            op: "*",
                                            right: {
                                                kind: "Identifier",
                                                name: "padding",
                                                role: "var",
                                                type: "int",
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                ],
            },
        ],
    };

    const corr1dPaddedDefinitionBlock = {
        kind: "Block",
        body: [
            {
                kind: "FunctionDef",
                name: {
                    kind: "Identifier",
                    name: "corr1d_padded",
                    role: "fn",
                },
                typeParams: intTypeParams("w", "n"),
                args: [
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "s",
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
                                                name: "w",
                                                role: "var",
                                                type: "int",
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
                            name: "p",
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
                                                name: "n",
                                                role: "var",
                                                type: "int",
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
                            name: "padding",
                            role: "var",
                            type: "int",
                        },
                        annotation: {
                            kind: "Identifier",
                            name: "int",
                            role: "type",
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
                                    {
                                        kind: "BinOp",
                                        left: {
                                            kind: "BinOp",
                                            left: {
                                                kind: "BinOp",
                                                left: {
                                                    kind: "Identifier",
                                                    name: "w",
                                                    role: "var",
                                                    type: "int",
                                                },
                                                op: "+",
                                                right: {
                                                    kind: "BinOp",
                                                    left: {
                                                        kind: "Number",
                                                        value: "2",
                                                    },
                                                    op: "*",
                                                    right: {
                                                        kind: "Identifier",
                                                        name: "padding",
                                                        role: "var",
                                                        type: "int",
                                                    },
                                                },
                                            },
                                            op: "-",
                                            right: {
                                                kind: "Identifier",
                                                name: "n",
                                                role: "var",
                                                type: "int",
                                            },
                                        },
                                        op: "+",
                                        right: {
                                            kind: "Number",
                                            value: "1",
                                        },
                                    },
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
                            kind: "Call",
                            callee: {
                                kind: "Identifier",
                                name: "corr1d",
                                role: "fn",
                                type: "Tensor[float][[w + 2 * padding - n + 1]]",
                            },
                            args: [
                                {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "pad1d",
                                        role: "fn",
                                        type: "Tensor[float][[w + 2 * padding]]",
                                    },
                                    args: [
                                        {
                                            kind: "Identifier",
                                            name: "s",
                                            role: "var",
                                            type: "Tensor[float][[w]]",
                                        },
                                        {
                                            kind: "Identifier",
                                            name: "padding",
                                            role: "var",
                                        },
                                    ],
                                },
                                {
                                    kind: "Identifier",
                                    name: "p",
                                    role: "var",
                                    type: "Tensor[float][[n]]",
                                },
                            ],
                        },
                    },
                ],
            },
        ],
    };

    const seqDefinitionBlock = {
        kind: "Block",
        body: [
            {
                kind: "FunctionDef",
                name: {
                    kind: "Identifier",
                    name: "seq",
                    role: "fn",
                },
                args: [
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "start",
                            role: "var",
                            type: "int",
                        },
                        annotation: {
                            kind: "Identifier",
                            name: "int",
                            role: "type",
                        },
                    },
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "end",
                            role: "var",
                            type: "int",
                        },
                        annotation: {
                            kind: "Identifier",
                            name: "int",
                            role: "type",
                        },
                    },
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "stride",
                            role: "var",
                            type: "int",
                        },
                        annotation: {
                            kind: "Identifier",
                            name: "int",
                            role: "type",
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
                                    {
                                        kind: "BinOp",
                                        left: {
                                            kind: "BinOp",
                                            left: {
                                                kind: "Identifier",
                                                name: "end",
                                                role: "var",
                                                type: "int",
                                            },
                                            op: "-",
                                            right: {
                                                kind: "Identifier",
                                                name: "start",
                                                role: "var",
                                                type: "int",
                                            },
                                        },
                                        op: "/",
                                        right: {
                                            kind: "Identifier",
                                            name: "stride",
                                            role: "var",
                                            type: "int",
                                        },
                                    },
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
                            name: "size",
                            role: "var",
                            type: "int",
                        },
                        value: {
                            kind: "BinOp",
                            left: {
                                kind: "BinOp",
                                left: {
                                    kind: "Identifier",
                                    name: "end",
                                    role: "var",
                                    type: "int",
                                },
                                op: "-",
                                right: {
                                    kind: "Identifier",
                                    name: "start",
                                    role: "var",
                                    type: "int",
                                },
                            },
                            op: "/",
                            right: {
                                kind: "Identifier",
                                name: "stride",
                                role: "var",
                                type: "int",
                            },
                        },
                    },
                    {
                        kind: "Return",
                        value: {
                            kind: "BinOp",
                            left: {
                                kind: "BinOp",
                                left: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "iota",
                                        role: "fn",
                                        type: "Tensor[int][[size]]",
                                    },
                                    args: [
                                        {
                                            kind: "Identifier",
                                            name: "size",
                                            role: "var",
                                            type: "int",
                                        },
                                    ],
                                },
                                op: "*",
                                right: {
                                    kind: "Identifier",
                                    name: "stride",
                                    role: "var",
                                    type: "int",
                                },
                            },
                            op: "+",
                            right: {
                                kind: "Identifier",
                                name: "start",
                                role: "var",
                                type: "int",
                            },
                        },
                    },
                ],
            },
        ],
    };

    const corr1dStrideDefinitionBlock = {
        kind: "Block",
        body: [
            {
                kind: "FunctionDef",
                name: {
                    kind: "Identifier",
                    name: "corr1d_stride",
                    role: "fn",
                },
                typeParams: intTypeParams("w", "n"),
                args: [
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "s",
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
                                                name: "w",
                                                role: "var",
                                                type: "int",
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
                            name: "p",
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
                                                name: "n",
                                                role: "var",
                                                type: "int",
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
                            name: "stride",
                            role: "var",
                            type: "int",
                        },
                        annotation: {
                            kind: "Identifier",
                            name: "int",
                            role: "type",
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
                                    {
                                        kind: "BinOp",
                                        left: {
                                            kind: "BinOp",
                                            left: {
                                                kind: "BinOp",
                                                left: {
                                                    kind: "Identifier",
                                                    name: "w",
                                                    role: "var",
                                                    type: "int",
                                                },
                                                op: "-",
                                                right: {
                                                    kind: "Identifier",
                                                    name: "n",
                                                    role: "var",
                                                    type: "int",
                                                },
                                            },
                                            op: "+",
                                            right: {
                                                kind: "Identifier",
                                                name: "stride",
                                                role: "var",
                                                type: "int",
                                            },
                                        },
                                        op: "/",
                                        right: {
                                            kind: "Identifier",
                                            name: "stride",
                                            role: "var",
                                            type: "int",
                                        },
                                    },
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
                                kind: "Call",
                                callee: {
                                    kind: "Identifier",
                                    name: "dot",
                                    role: "fn",
                                    type: "float",
                                },
                                args: [
                                    {
                                        kind: "Subscript",
                                        value: {
                                            kind: "Identifier",
                                            name: "s",
                                            role: "var",
                                            type: "Tensor[float][[w]]",
                                        },
                                        index: {
                                            kind: "Slice",
                                            start: {
                                                kind: "Identifier",
                                                name: "idx",
                                                role: "var",
                                                type: "int",
                                            },
                                            end: {
                                                kind: "BinOp",
                                                left: {
                                                    kind: "Identifier",
                                                    name: "idx",
                                                    role: "var",
                                                    type: "int",
                                                },
                                                op: "+",
                                                right: {
                                                    kind: "Identifier",
                                                    name: "n",
                                                    role: "var",
                                                    type: "int",
                                                },
                                            },
                                        },
                                    },
                                    {
                                        kind: "Identifier",
                                        name: "p",
                                        role: "var",
                                        type: "Tensor[float][[n]]",
                                    },
                                ],
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
                                kind: "Call",
                                callee: {
                                    kind: "Identifier",
                                    name: "seq",
                                    role: "fn",
                                    type: "Tensor[int][[((w - n + stride) / stride)]]",
                                },
                                args: [
                                    {
                                        kind: "Number",
                                        value: "0",
                                    },
                                    {
                                        kind: "BinOp",
                                        left: {
                                            kind: "BinOp",
                                            left: {
                                                kind: "Identifier",
                                                name: "w",
                                                role: "var",
                                                type: "int",
                                            },
                                            op: "-",
                                            right: {
                                                kind: "Identifier",
                                                name: "n",
                                                role: "var",
                                                type: "int",
                                            },
                                        },
                                        op: "+",
                                        right: {
                                            kind: "Identifier",
                                            name: "stride",
                                            role: "var",
                                            type: "int",
                                        },
                                    },
                                    {
                                        kind: "Identifier",
                                        name: "stride",
                                        role: "var",
                                        type: "int",
                                    },
                                ],
                            },
                        },
                    },
                ],
            },
        ],
    };

    const corr1dPaddedStrideDefinitionBlock = {
        kind: "Block",
        body: [
            {
                kind: "FunctionDef",
                name: {
                    kind: "Identifier",
                    name: "corr1d_padded_stride",
                    role: "fn",
                },
                typeParams: intTypeParams("w", "n"),
                args: [
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "s",
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
                                                name: "w",
                                                role: "var",
                                                type: "int",
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
                            name: "p",
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
                                                name: "n",
                                                role: "var",
                                                type: "int",
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
                            name: "padding",
                            role: "var",
                            type: "int",
                        },
                        annotation: {
                            kind: "Identifier",
                            name: "int",
                            role: "type",
                        },
                    },
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "stride",
                            role: "var",
                            type: "int",
                        },
                        annotation: {
                            kind: "Identifier",
                            name: "int",
                            role: "type",
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
                                    {
                                        kind: "BinOp",
                                        left: {
                                            kind: "BinOp",
                                            left: {
                                                kind: "BinOp",
                                                left: {
                                                    kind: "BinOp",
                                                    left: {
                                                        kind: "Identifier",
                                                        name: "w",
                                                        role: "var",
                                                        type: "int",
                                                    },
                                                    op: "+",
                                                    right: {
                                                        kind: "BinOp",
                                                        left: {
                                                            kind: "Number",
                                                            value: "2",
                                                        },
                                                        op: "*",
                                                        right: {
                                                            kind: "Identifier",
                                                            name: "padding",
                                                            role: "var",
                                                            type: "int",
                                                        },
                                                    },
                                                },
                                                op: "-",
                                                right: {
                                                    kind: "Identifier",
                                                    name: "n",
                                                    role: "var",
                                                    type: "int",
                                                },
                                            },
                                            op: "+",
                                            right: {
                                                kind: "Identifier",
                                                name: "stride",
                                                role: "var",
                                                type: "int",
                                            },
                                        },
                                        op: "/",
                                        right: {
                                            kind: "Identifier",
                                            name: "stride",
                                            role: "var",
                                            type: "int",
                                        },
                                    },
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
                            name: "padded",
                            role: "var",
                            type: "Tensor[float][[w + 2 * padding]]",
                        },
                        value: {
                            kind: "Call",
                            callee: {
                                kind: "Identifier",
                                name: "pad1d",
                                role: "fn",
                                type: "Tensor[float][[w + 2 * padding]]",
                            },
                            args: [
                                {
                                    kind: "Identifier",
                                    name: "s",
                                    role: "var",
                                    type: "Tensor[float][[w]]",
                                },
                                {
                                    kind: "Identifier",
                                    name: "padding",
                                    role: "var",
                                    type: "int",
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
                                name: "corr1d_stride",
                                role: "fn",
                                type: "Tensor[float][[((w + 2 * padding - n + stride) / stride)]]",
                            },
                            args: [
                                {
                                    kind: "Identifier",
                                    name: "padded",
                                    role: "var",
                                    type: "Tensor[float][[w + 2 * padding]]",
                                },
                                {
                                    kind: "Identifier",
                                    name: "p",
                                    role: "var",
                                    type: "Tensor[float][[n]]",
                                },
                                {
                                    kind: "Identifier",
                                    name: "stride",
                                    role: "var",
                                    type: "int",
                                },
                            ],
                        },
                    },
                ],
            },
        ],
    };

    const corr1dStridePairDefinitionBlock = {
        kind: "Block",
        body: [
            ...corr1dStrideDefinitionBlock.body,
            {
                kind: "BlankLine",
            },
            ...corr1dPaddedStrideDefinitionBlock.body,
        ],
    };

    const pad2dDefinitionBlock = {
        kind: "Block",
        body: [
            {
                kind: "FunctionDef",
                name: {
                    kind: "Identifier",
                    name: "pad2d",
                    role: "fn",
                },
                typeParams: intTypeParams("h", "w"),
                args: [
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "xs",
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
                                                name: "h",
                                                role: "var",
                                                type: "int",
                                            },
                                            {
                                                kind: "Identifier",
                                                name: "w",
                                                role: "var",
                                                type: "int",
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
                            name: "padding0",
                            role: "var",
                            type: "int",
                        },
                        annotation: {
                            kind: "Identifier",
                            name: "int",
                            role: "type",
                        },
                    },
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "padding1",
                            role: "var",
                            type: "int",
                        },
                        annotation: {
                            kind: "Identifier",
                            name: "int",
                            role: "type",
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
                                    {
                                        kind: "BinOp",
                                        left: {
                                            kind: "Identifier",
                                            name: "h",
                                            role: "var",
                                            type: "int",
                                        },
                                        op: "+",
                                        right: {
                                            kind: "BinOp",
                                            left: {
                                                kind: "Number",
                                                value: "2",
                                            },
                                            op: "*",
                                            right: {
                                                kind: "Identifier",
                                                name: "padding0",
                                                role: "var",
                                                type: "int",
                                            },
                                        },
                                    },
                                    {
                                        kind: "BinOp",
                                        left: {
                                            kind: "Identifier",
                                            name: "w",
                                            role: "var",
                                            type: "int",
                                        },
                                        op: "+",
                                        right: {
                                            kind: "BinOp",
                                            left: {
                                                kind: "Number",
                                                value: "2",
                                            },
                                            op: "*",
                                            right: {
                                                kind: "Identifier",
                                                name: "padding1",
                                                role: "var",
                                                type: "int",
                                            },
                                        },
                                    },
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
                                kind: "ListComp",
                                elt: {
                                    kind: "IfExpr",
                                    body: {
                                        kind: "Subscript",
                                        value: {
                                            kind: "Subscript",
                                            value: {
                                                kind: "Identifier",
                                                name: "xs",
                                                role: "var",
                                            },
                                            index: {
                                                kind: "BinOp",
                                                left: {
                                                    kind: "Identifier",
                                                    name: "j",
                                                    role: "var",
                                                    type: "int",
                                                },
                                                op: "-",
                                                right: {
                                                    kind: "Identifier",
                                                    name: "padding0",
                                                    role: "var",
                                                    type: "int",
                                                },
                                            },
                                        },
                                        index: {
                                            kind: "BinOp",
                                            left: {
                                                kind: "Identifier",
                                                name: "i",
                                                role: "var",
                                                type: "int",
                                            },
                                            op: "-",
                                            right: {
                                                kind: "Identifier",
                                                name: "padding1",
                                                role: "var",
                                                type: "int",
                                            },
                                        },
                                    },
                                    test: {
                                        kind: "BoolOp",
                                        op: "and",
                                        values: [
                                            {
                                                kind: "Compare",
                                                left: {
                                                    kind: "Identifier",
                                                    name: "padding1",
                                                    role: "var",
                                                    type: "int",
                                                },
                                                op: "<=",
                                                right: {
                                                    kind: "Identifier",
                                                    name: "i",
                                                    role: "var",
                                                    type: "int",
                                                },
                                            },
                                            {
                                                kind: "Compare",
                                                left: {
                                                    kind: "Identifier",
                                                    name: "i",
                                                    role: "var",
                                                    type: "int",
                                                },
                                                op: "<",
                                                right: {
                                                    kind: "BinOp",
                                                    left: {
                                                        kind: "Identifier",
                                                        name: "w",
                                                        role: "var",
                                                        type: "int",
                                                    },
                                                    op: "+",
                                                    right: {
                                                        kind: "Identifier",
                                                        name: "padding1",
                                                        role: "var",
                                                        type: "int",
                                                    },
                                                },
                                            },
                                            {
                                                kind: "Compare",
                                                left: {
                                                    kind: "Identifier",
                                                    name: "padding0",
                                                    role: "var",
                                                    type: "int",
                                                },
                                                op: "<=",
                                                right: {
                                                    kind: "Identifier",
                                                    name: "j",
                                                    role: "var",
                                                    type: "int",
                                                },
                                            },
                                            {
                                                kind: "Compare",
                                                left: {
                                                    kind: "Identifier",
                                                    name: "j",
                                                    role: "var",
                                                    type: "int",
                                                },
                                                op: "<",
                                                right: {
                                                    kind: "BinOp",
                                                    left: {
                                                        kind: "Identifier",
                                                        name: "h",
                                                        role: "var",
                                                        type: "int",
                                                    },
                                                    op: "+",
                                                    right: {
                                                        kind: "Identifier",
                                                        name: "padding0",
                                                        role: "var",
                                                        type: "int",
                                                    },
                                                },
                                            },
                                        ],
                                    },
                                    orelse: {
                                        kind: "Number",
                                        value: "0.0",
                                    },
                                },
                                target: [
                                    {
                                        kind: "Identifier",
                                        name: "i",
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
                                        type: "Tensor[int][[w + 2 * padding1]]",
                                    },
                                    args: [
                                        {
                                            kind: "BinOp",
                                            left: {
                                                kind: "Identifier",
                                                name: "w",
                                                role: "var",
                                                type: "int",
                                            },
                                            op: "+",
                                            right: {
                                                kind: "BinOp",
                                                left: {
                                                    kind: "Number",
                                                    value: "2",
                                                },
                                                op: "*",
                                                right: {
                                                    kind: "Identifier",
                                                    name: "padding1",
                                                    role: "var",
                                                    type: "int",
                                                },
                                            },
                                        },
                                    ],
                                },
                            },
                            target: [
                                {
                                    kind: "Identifier",
                                    name: "j",
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
                                    type: "Tensor[int][[h + 2 * padding0]]",
                                },
                                args: [
                                    {
                                        kind: "BinOp",
                                        left: {
                                            kind: "Identifier",
                                            name: "h",
                                            role: "var",
                                            type: "int",
                                        },
                                        op: "+",
                                        right: {
                                            kind: "BinOp",
                                            left: {
                                                kind: "Number",
                                                value: "2",
                                            },
                                            op: "*",
                                            right: {
                                                kind: "Identifier",
                                                name: "padding0",
                                                role: "var",
                                                type: "int",
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                ],
            },
        ],
    };

    const dot2dIncompleteDefinitionBlock = {
        kind: "Block",
        body: [
            {
                kind: "FunctionDef",
                name: {
                    kind: "Identifier",
                    name: "dot2d",
                    role: "fn",
                },
                typeParams: intTypeParams("h", "w", "m", "n"),
                args: [
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "s",
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
                                                name: "h",
                                                role: "var",
                                                type: "int",
                                            },
                                            {
                                                kind: "Identifier",
                                                name: "w",
                                                role: "var",
                                                type: "int",
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
                            name: "p",
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
                                                name: "m",
                                                role: "var",
                                                type: "int",
                                            },
                                            {
                                                kind: "Identifier",
                                                name: "n",
                                                role: "var",
                                                type: "int",
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
                            name: "s_j",
                            role: "var"
                        },
                        annotation: {
                            kind: "Identifier",
                            name: "int",
                            role: "type",
                        }
                    },
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "s_i",
                            role: "var"
                        },
                        annotation: {
                            kind: "Identifier",
                            name: "int",
                            role: "type",
                        }
                    }
                ],
                returns: {
                    kind: "Identifier",
                    name: "float",
                    role: "type",
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
                            kind: "Ellipsis",
                        },
                    },
                ],
            },
        ],
    };

    const dot2dDefinitionBlock = {
        kind: "Block",
        body: [
            {
                kind: "FunctionDef",
                name: {
                    kind: "Identifier",
                    name: "dot2d",
                    role: "fn",
                },
                typeParams: intTypeParams("h", "w", "m", "n"),
                args: [
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "s",
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
                                                name: "h",
                                                role: "var",
                                                type: "int",
                                            },
                                            {
                                                kind: "Identifier",
                                                name: "w",
                                                role: "var",
                                                type: "int",
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
                            name: "p",
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
                                                name: "m",
                                                role: "var",
                                                type: "int",
                                            },
                                            {
                                                kind: "Identifier",
                                                name: "n",
                                                role: "var",
                                                type: "int",
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
                            name: "s_j",
                            role: "var",
                            type: "int",
                        },
                        annotation: {
                            kind: "Identifier",
                            name: "int",
                            role: "type",
                        },
                    },
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "s_i",
                            role: "var",
                            type: "int",
                        },
                        annotation: {
                            kind: "Identifier",
                            name: "int",
                            role: "type",
                        },
                    },
                ],
                returns: {
                    kind: "Identifier",
                    name: "float",
                    role: "type",
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
                            kind: "Call",
                            callee: {
                                kind: "Attribute",
                                value: {
                                    kind: "ListComp",
                                    elt: {
                                        kind: "ListComp",
                                        elt: {
                                            kind: "BinOp",
                                            left: {
                                                kind: "Subscript",
                                                value: {
                                                    kind: "Subscript",
                                                    value: {
                                                        kind: "Identifier",
                                                        name: "s",
                                                        role: "var",
                                                    },
                                                    index: {
                                                        kind: "BinOp",
                                                        left: {
                                                            kind: "Identifier",
                                                            name: "s_j",
                                                            role: "var",
                                                            type: "int",
                                                        },
                                                        op: "+",
                                                        right: {
                                                            kind: "Identifier",
                                                            name: "j",
                                                            role: "var",
                                                            type: "int",
                                                        },
                                                    },
                                                },
                                                index: {
                                                    kind: "BinOp",
                                                    left: {
                                                        kind: "Identifier",
                                                        name: "s_i",
                                                        role: "var",
                                                        type: "int",
                                                    },
                                                    op: "+",
                                                    right: {
                                                        kind: "Identifier",
                                                        name: "i",
                                                        role: "var",
                                                        type: "int",
                                                    },
                                                },
                                            },
                                            op: "*",
                                            right: {
                                                kind: "Subscript",
                                                value: {
                                                    kind: "Subscript",
                                                    value: {
                                                        kind: "Identifier",
                                                        name: "p",
                                                        role: "var",
                                                    },
                                                    index: {
                                                        kind: "Identifier",
                                                        name: "j",
                                                        role: "var",
                                                        type: "int",
                                                    },
                                                },
                                                index: {
                                                    kind: "Identifier",
                                                    name: "i",
                                                    role: "var",
                                                    type: "int",
                                                },
                                            },
                                        },
                                        target: [
                                            {
                                                kind: "Identifier",
                                                name: "i",
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
                                            },
                                            args: [
                                                {
                                                    kind: "Identifier",
                                                    name: "n",
                                                    role: "var",
                                                    type: "int",
                                                },
                                            ],
                                        },
                                    },
                                    target: [
                                        {
                                            kind: "Identifier",
                                            name: "j",
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
                                        },
                                        args: [
                                            {
                                                kind: "Identifier",
                                                name: "m",
                                                role: "var",
                                                type: "int",
                                            },
                                        ],
                                    },
                                },
                                attr: {
                                    kind: "Identifier",
                                    name: "sum",
                                    role: "plain",
                                    type: "float",
                                },
                            },
                            args: [
                                {
                                    kind: "Number",
                                    value: "0",
                                },
                                {
                                    kind: "Number",
                                    value: "1",
                                },
                            ],
                        },
                    },
                ],
            },
        ],
    };

    const corr2dHeightSpanExpr = () => ({
        kind: "BinOp",
        left: {
            kind: "BinOp",
            left: {
                kind: "BinOp",
                left: {
                    kind: "BinOp",
                    left: {
                        kind: "Identifier",
                        name: "h",
                        role: "var",
                        type: "int",
                    },
                    op: "+",
                    right: {
                        kind: "BinOp",
                        left: {
                            kind: "Number",
                            value: "2",
                        },
                        op: "*",
                        right: {
                            kind: "Identifier",
                            name: "padding0",
                            role: "var",
                            type: "int",
                        },
                    },
                },
                op: "-",
                right: {
                    kind: "Identifier",
                    name: "m",
                    role: "var",
                    type: "int",
                },
            },
            op: "+",
            right: {
                kind: "Identifier",
                name: "stride0",
                role: "var",
                type: "int",
            },
        },
        op: "/",
        right: {
            kind: "Identifier",
            name: "stride0",
            role: "var",
            type: "int",
        },
    });

    const corr2dWidthSpanExpr = () => ({
        kind: "BinOp",
        left: {
            kind: "BinOp",
            left: {
                kind: "BinOp",
                left: {
                    kind: "BinOp",
                    left: {
                        kind: "Identifier",
                        name: "w",
                        role: "var",
                        type: "int",
                    },
                    op: "+",
                    right: {
                        kind: "BinOp",
                        left: {
                            kind: "Number",
                            value: "2",
                        },
                        op: "*",
                        right: {
                            kind: "Identifier",
                            name: "padding1",
                            role: "var",
                            type: "int",
                        },
                    },
                },
                op: "-",
                right: {
                    kind: "Identifier",
                    name: "n",
                    role: "var",
                    type: "int",
                },
            },
            op: "+",
            right: {
                kind: "Identifier",
                name: "stride1",
                role: "var",
                type: "int",
            },
        },
        op: "/",
        right: {
            kind: "Identifier",
            name: "stride1",
            role: "var",
            type: "int",
        },
    });

    const corr2dseqHeightEndExpr = () => ({
        kind: "BinOp",
        left: {
            kind: "BinOp",
            left: {
                kind: "BinOp",
                left: {
                    kind: "Identifier",
                    name: "h",
                    role: "var",
                    type: "int",
                },
                op: "+",
                right: {
                    kind: "BinOp",
                    left: {
                        kind: "Number",
                        value: "2",
                    },
                    op: "*",
                    right: {
                        kind: "Identifier",
                        name: "padding0",
                        role: "var",
                        type: "int",
                    },
                },
            },
            op: "-",
            right: {
                kind: "Identifier",
                name: "m",
                role: "var",
                type: "int",
            },
        },
        op: "+",
        right: {
            kind: "Identifier",
            name: "stride0",
            role: "var",
            type: "int",
        },
    });

    const corr2dseqWidthEndExpr = () => ({
        kind: "BinOp",
        left: {
            kind: "BinOp",
            left: {
                kind: "BinOp",
                left: {
                    kind: "Identifier",
                    name: "w",
                    role: "var",
                    type: "int",
                },
                op: "+",
                right: {
                    kind: "BinOp",
                    left: {
                        kind: "Number",
                        value: "2",
                    },
                    op: "*",
                    right: {
                        kind: "Identifier",
                        name: "padding1",
                        role: "var",
                        type: "int",
                    },
                },
            },
            op: "-",
            right: {
                kind: "Identifier",
                name: "n",
                role: "var",
                type: "int",
            },
        },
        op: "+",
        right: {
            kind: "Identifier",
            name: "stride1",
            role: "var",
            type: "int",
        },
    });

    const corr2dDefinitionBlock = {
        kind: "Block",
        body: [
            {
                kind: "FunctionDef",
                name: {
                    kind: "Identifier",
                    name: "corr2d",
                    role: "fn",
                },
                typeParams: intTypeParams("h", "w", "m", "n"),
                args: [
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "s",
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
                                                name: "h",
                                                role: "var",
                                                type: "int",
                                            },
                                            {
                                                kind: "Identifier",
                                                name: "w",
                                                role: "var",
                                                type: "int",
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
                            name: "p",
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
                                                name: "m",
                                                role: "var",
                                                type: "int",
                                            },
                                            {
                                                kind: "Identifier",
                                                name: "n",
                                                role: "var",
                                                type: "int",
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
                            name: "bias",
                            role: "var",
                        },
                        annotation: {
                            kind: "Identifier",
                            name: "float",
                            role: "type",
                        },
                    },
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "stride0",
                            role: "var",
                            type: "int",
                        },
                        annotation: {
                            kind: "Identifier",
                            name: "int",
                            role: "type",
                        },
                    },
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "stride1",
                            role: "var",
                            type: "int",
                        },
                        annotation: {
                            kind: "Identifier",
                            name: "int",
                            role: "type",
                        },
                    },
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "padding0",
                            role: "var",
                            type: "int",
                        },
                        annotation: {
                            kind: "Identifier",
                            name: "int",
                            role: "type",
                        },
                    },
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "padding1",
                            role: "var",
                            type: "int",
                        },
                        annotation: {
                            kind: "Identifier",
                            name: "int",
                            role: "type",
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
                                    corr2dHeightSpanExpr(),
                                    corr2dWidthSpanExpr(),
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
                            name: "padded",
                            role: "var",
                        },
                        value: {
                            kind: "Call",
                            callee: {
                                kind: "Identifier",
                                name: "pad2d",
                                role: "fn",
                                type: "Tensor[float][[h + 2 * padding0, w + 2 * padding1]]",
                            },
                            args: [
                                {
                                    kind: "Identifier",
                                    name: "s",
                                    role: "var",
                                },
                                {
                                    kind: "Identifier",
                                    name: "padding0",
                                    role: "var",
                                    type: "int",
                                },
                                {
                                    kind: "Identifier",
                                    name: "padding1",
                                    role: "var",
                                    type: "int",
                                },
                            ],
                        },
                    },
                    {
                        kind: "Return",
                        value: {
                            kind: "ListComp",
                            elt: {
                                kind: "ListComp",
                                elt: {
                                    kind: "BinOp",
                                    left: {
                                        kind: "Call",
                                        callee: {
                                            kind: "Identifier",
                                            name: "dot2d",
                                            role: "fn",
                                            type: "float",
                                        },
                                        args: [
                                            {
                                                kind: "Identifier",
                                                name: "padded",
                                                role: "var",
                                            },
                                            {
                                                kind: "Identifier",
                                                name: "p",
                                                role: "var",
                                            },
                                            {
                                                kind: "Identifier",
                                                name: "j",
                                                role: "var",
                                                type: "int",
                                            },
                                            {
                                                kind: "Identifier",
                                                name: "i",
                                                role: "var",
                                                type: "int",
                                            },
                                        ],
                                    },
                                    op: "+",
                                    right: {
                                        kind: "Identifier",
                                        name: "bias",
                                        role: "var",
                                    },
                                },
                                target: [
                                    {
                                        kind: "Identifier",
                                        name: "i",
                                        role: "var",
                                        type: "int",
                                    },
                                ],
                                iter: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "seq",
                                        role: "fn",
                                        type: "Tensor[int][[((w + 2 * padding1 - n + stride1) / stride1)]]",
                                    },
                                    args: [
                                        {
                                            kind: "Number",
                                            value: "0",
                                        },
                                        corr2dseqWidthEndExpr(),
                                        {
                                            kind: "Identifier",
                                            name: "stride1",
                                            role: "var",
                                            type: "int",
                                        },
                                    ],
                                },
                            },
                            target: [
                                {
                                    kind: "Identifier",
                                    name: "j",
                                    role: "var",
                                    type: "int",
                                },
                            ],
                            iter: {
                                kind: "Call",
                                callee: {
                                    kind: "Identifier",
                                    name: "seq",
                                    role: "fn",
                                    type: "Tensor[int][[((h + 2 * padding0 - m + stride0) / stride0)]]",
                                },
                                args: [
                                    {
                                        kind: "Number",
                                        value: "0",
                                    },
                                    corr2dseqHeightEndExpr(),
                                    {
                                        kind: "Identifier",
                                        name: "stride0",
                                        role: "var",
                                        type: "int",
                                    },
                                ],
                            },
                        },
                    },
                ],
            },
        ],
    };

    const corr2dMultiInDefinitionBlock = {
        kind: "Block",
        body: [
            {
                kind: "FunctionDef",
                name: {
                    kind: "Identifier",
                    name: "corr2d_multi_in",
                    role: "fn",
                },
                typeParams: intTypeParams("i", "h", "w", "m", "n"),
                args: [
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "s",
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
                                                name: "i",
                                                role: "var",
                                                type: "int",
                                            },
                                            {
                                                kind: "Identifier",
                                                name: "h",
                                                role: "var",
                                                type: "int",
                                            },
                                            {
                                                kind: "Identifier",
                                                name: "w",
                                                role: "var",
                                                type: "int",
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
                            name: "p",
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
                                                name: "i",
                                                role: "var",
                                                type: "int",
                                            },
                                            {
                                                kind: "Identifier",
                                                name: "m",
                                                role: "var",
                                                type: "int",
                                            },
                                            {
                                                kind: "Identifier",
                                                name: "n",
                                                role: "var",
                                                type: "int",
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
                            name: "bias",
                            role: "var",
                        },
                        annotation: {
                            kind: "Identifier",
                            name: "float",
                            role: "type",
                        },
                    },
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "stride0",
                            role: "var",
                            type: "int",
                        },
                        annotation: {
                            kind: "Identifier",
                            name: "int",
                            role: "type",
                        },
                    },
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "stride1",
                            role: "var",
                            type: "int",
                        },
                        annotation: {
                            kind: "Identifier",
                            name: "int",
                            role: "type",
                        },
                    },
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "padding0",
                            role: "var",
                            type: "int",
                        },
                        annotation: {
                            kind: "Identifier",
                            name: "int",
                            role: "type",
                        },
                    },
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "padding1",
                            role: "var",
                            type: "int",
                        },
                        annotation: {
                            kind: "Identifier",
                            name: "int",
                            role: "type",
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
                                    corr2dHeightSpanExpr(),
                                    corr2dWidthSpanExpr(),
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
                            kind: "Call",
                            callee: {
                                kind: "Attribute",
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "corr2d",
                                        role: "fn",
                                        type: "Tensor[float][[i, ((h + 2 * padding0 - m + stride0) / stride0), ((w + 2 * padding1 - n + stride1) / stride1)]]",
                                    },
                                    args: [
                                        {
                                            kind: "Identifier",
                                            name: "s",
                                            role: "var",
                                            type: "Tensor[float][[i, h, w]]",
                                        },
                                        {
                                            kind: "Identifier",
                                            name: "p",
                                            role: "var",
                                            type: "Tensor[float][[i, m, n]]",
                                        },
                                        {
                                            kind: "Identifier",
                                            name: "bias",
                                            role: "var",
                                            type: "float",
                                        },
                                        {
                                            kind: "Identifier",
                                            name: "stride0",
                                            role: "var",
                                            type: "int",
                                        },
                                        {
                                            kind: "Identifier",
                                            name: "stride1",
                                            role: "var",
                                            type: "int",
                                        },
                                        {
                                            kind: "Identifier",
                                            name: "padding0",
                                            role: "var",
                                            type: "int",
                                        },
                                        {
                                            kind: "Identifier",
                                            name: "padding1",
                                            role: "var",
                                            type: "int",
                                        },
                                    ],
                                },
                                attr: {
                                    kind: "Identifier",
                                    name: "sum",
                                    role: "plain",
                                    type: "Tensor[float][[((h + 2 * padding0 - m + stride0) / stride0), ((w + 2 * padding1 - n + stride1) / stride1)]]",
                                },
                            },
                            args: [
                                {
                                    kind: "Number",
                                    value: "0",
                                },
                            ],
                        },
                    },
                ],
            },
        ],
    };

    const corr2dMultiInReturnTypeBlock = {
        kind: "Block",
        body: [
            {
                kind: "ExprStmt",
                value: {
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
                                        name: "i",
                                        role: "var",
                                        type: "int",
                                    },
                                    corr2dHeightSpanExpr(),
                                    corr2dWidthSpanExpr(),
                                ],
                            },
                        ],
                    },
                },
            },
        ],
    };

    const corr2dMultiInOutDefinitionBlock = {
        kind: "Block",
        body: [
            {
                kind: "FunctionDef",
                name: {
                    kind: "Identifier",
                    name: "corr2d_multi_in_out",
                    role: "fn",
                },
                typeParams: intTypeParams("o", "i", "h", "w", "m", "n"),
                args: [
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "s",
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
                                                name: "i",
                                                role: "var",
                                                type: "int",
                                            },
                                            {
                                                kind: "Identifier",
                                                name: "h",
                                                role: "var",
                                                type: "int",
                                            },
                                            {
                                                kind: "Identifier",
                                                name: "w",
                                                role: "var",
                                                type: "int",
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
                            name: "p",
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
                                                name: "o",
                                                role: "var",
                                                type: "int",
                                            },
                                            {
                                                kind: "Identifier",
                                                name: "i",
                                                role: "var",
                                                type: "int",
                                            },
                                            {
                                                kind: "Identifier",
                                                name: "m",
                                                role: "var",
                                                type: "int",
                                            },
                                            {
                                                kind: "Identifier",
                                                name: "n",
                                                role: "var",
                                                type: "int",
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
                                        items: [
                                            {
                                                kind: "Identifier",
                                                name: "o",
                                                role: "var",
                                                type: "int",
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
                            name: "stride0",
                            role: "var",
                            type: "int",
                        },
                        annotation: {
                            kind: "Identifier",
                            name: "int",
                            role: "type",
                        },
                    },
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "stride1",
                            role: "var",
                            type: "int",
                        },
                        annotation: {
                            kind: "Identifier",
                            name: "int",
                            role: "type",
                        },
                    },
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "padding0",
                            role: "var",
                            type: "int",
                        },
                        annotation: {
                            kind: "Identifier",
                            name: "int",
                            role: "type",
                        },
                    },
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "padding1",
                            role: "var",
                            type: "int",
                        },
                        annotation: {
                            kind: "Identifier",
                            name: "int",
                            role: "type",
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
                                    {
                                        kind: "Identifier",
                                        name: "o",
                                        role: "var",
                                        type: "int",
                                    },
                                    corr2dHeightSpanExpr(),
                                    corr2dWidthSpanExpr(),
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
                            kind: "Call",
                            callee: {
                                kind: "Identifier",
                                name: "corr2d_multi_in",
                                role: "fn",
                                type: "Tensor[float][[o, ((h + 2 * padding0 - m + stride0) / stride0), ((w + 2 * padding1 - n + stride1) / stride1)]]",
                            },
                            args: [
                                {
                                    kind: "Identifier",
                                    name: "s",
                                    role: "var",
                                    type: "Tensor[float][[i, h, w]]",
                                },
                                {
                                    kind: "Identifier",
                                    name: "p",
                                    role: "var",
                                    type: "Tensor[float][[o, i, m, n]]",
                                },
                                {
                                    kind: "Identifier",
                                    name: "bias",
                                    role: "var",
                                    type: "Tensor[float][[o]]",
                                },
                                {
                                    kind: "Identifier",
                                    name: "stride0",
                                    role: "var",
                                    type: "int",
                                },
                                {
                                    kind: "Identifier",
                                    name: "stride1",
                                    role: "var",
                                    type: "int",
                                },
                                {
                                    kind: "Identifier",
                                    name: "padding0",
                                    role: "var",
                                    type: "int",
                                },
                                {
                                    kind: "Identifier",
                                    name: "padding1",
                                    role: "var",
                                    type: "int",
                                },
                            ],
                        },
                    },
                ],
            },
        ],
    };

    const pool2dHeightSpanExpr = () => ({
        kind: "BinOp",
        left: {
            kind: "BinOp",
            left: {
                kind: "BinOp",
                left: {
                    kind: "BinOp",
                    left: {
                        kind: "Identifier",
                        name: "m",
                        role: "var",
                        type: "int",
                    },
                    op: "+",
                    right: {
                        kind: "BinOp",
                        left: {
                            kind: "Number",
                            value: "2",
                        },
                        op: "*",
                        right: {
                            kind: "Identifier",
                            name: "padding0",
                            role: "var",
                            type: "int",
                        },
                    },
                },
                op: "-",
                right: {
                    kind: "Identifier",
                    name: "h",
                    role: "var",
                    type: "int",
                },
            },
            op: "+",
            right: {
                kind: "Identifier",
                name: "stride0",
                role: "var",
                type: "int",
            },
        },
        op: "/",
        right: {
            kind: "Identifier",
            name: "stride0",
            role: "var",
            type: "int",
        },
    });

    const pool2dWidthSpanExpr = () => ({
        kind: "BinOp",
        left: {
            kind: "BinOp",
            left: {
                kind: "BinOp",
                left: {
                    kind: "BinOp",
                    left: {
                        kind: "Identifier",
                        name: "n",
                        role: "var",
                        type: "int",
                    },
                    op: "+",
                    right: {
                        kind: "BinOp",
                        left: {
                            kind: "Number",
                            value: "2",
                        },
                        op: "*",
                        right: {
                            kind: "Identifier",
                            name: "padding1",
                            role: "var",
                            type: "int",
                        },
                    },
                },
                op: "-",
                right: {
                    kind: "Identifier",
                    name: "w",
                    role: "var",
                    type: "int",
                },
            },
            op: "+",
            right: {
                kind: "Identifier",
                name: "stride1",
                role: "var",
                type: "int",
            },
        },
        op: "/",
        right: {
            kind: "Identifier",
            name: "stride1",
            role: "var",
            type: "int",
        },
    });

    const pool2dseqHeightEndExpr = () => ({
        kind: "BinOp",
        left: {
            kind: "BinOp",
            left: {
                kind: "BinOp",
                left: {
                    kind: "Identifier",
                    name: "m",
                    role: "var",
                    type: "int",
                },
                op: "+",
                right: {
                    kind: "BinOp",
                    left: {
                        kind: "Number",
                        value: "2",
                    },
                    op: "*",
                    right: {
                        kind: "Identifier",
                        name: "padding0",
                        role: "var",
                        type: "int",
                    },
                },
            },
            op: "-",
            right: {
                kind: "Identifier",
                name: "h",
                role: "var",
                type: "int",
            },
        },
        op: "+",
        right: {
            kind: "Identifier",
            name: "stride0",
            role: "var",
            type: "int",
        },
    });

    const pool2dseqWidthEndExpr = () => ({
        kind: "BinOp",
        left: {
            kind: "BinOp",
            left: {
                kind: "BinOp",
                left: {
                    kind: "Identifier",
                    name: "n",
                    role: "var",
                    type: "int",
                },
                op: "+",
                right: {
                    kind: "BinOp",
                    left: {
                        kind: "Number",
                        value: "2",
                    },
                    op: "*",
                    right: {
                        kind: "Identifier",
                        name: "padding1",
                        role: "var",
                        type: "int",
                    },
                },
            },
            op: "-",
            right: {
                kind: "Identifier",
                name: "w",
                role: "var",
                type: "int",
            },
        },
        op: "+",
        right: {
            kind: "Identifier",
            name: "stride1",
            role: "var",
            type: "int",
        },
    });

    const poolingDefinitionBlock = {
        kind: "Block",
        body: [
            {
                kind: "FunctionDef",
                name: {
                    kind: "Identifier",
                    name: "mean2d",
                    role: "fn",
                },
                typeParams: intTypeParams("m", "n"),
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
                                            {
                                                kind: "Identifier",
                                                name: "m",
                                                role: "var",
                                                type: "int",
                                            },
                                            {
                                                kind: "Identifier",
                                                name: "n",
                                                role: "var",
                                                type: "int",
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
                            name: "h",
                            role: "var",
                            type: "int",
                        },
                        annotation: {
                            kind: "Identifier",
                            name: "int",
                            role: "type",
                        },
                    },
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "w",
                            role: "var",
                            type: "int",
                        },
                        annotation: {
                            kind: "Identifier",
                            name: "int",
                            role: "type",
                        },
                    },
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "x_j",
                            role: "var",
                            type: "int",
                        },
                        annotation: {
                            kind: "Identifier",
                            name: "int",
                            role: "type",
                        },
                    },
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "x_i",
                            role: "var",
                            type: "int",
                        },
                        annotation: {
                            kind: "Identifier",
                            name: "int",
                            role: "type",
                        },
                    },
                ],
                returns: {
                    kind: "Identifier",
                    name: "float",
                    role: "type",
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
                            kind: "Call",
                            callee: {
                                kind: "Attribute",
                                value: {
                                    kind: "ListComp",
                                    elt: {
                                        kind: "ListComp",
                                        elt: {
                                            kind: "Subscript",
                                            value: {
                                                kind: "Subscript",
                                                value: {
                                                    kind: "Identifier",
                                                    name: "x",
                                                    role: "var",
                                                },
                                                index: {
                                                    kind: "BinOp",
                                                    left: {
                                                        kind: "Identifier",
                                                        name: "j",
                                                        role: "var",
                                                        type: "int",
                                                    },
                                                    op: "+",
                                                    right: {
                                                        kind: "Identifier",
                                                        name: "x_j",
                                                        role: "var",
                                                        type: "int",
                                                    },
                                                },
                                            },
                                            index: {
                                                kind: "BinOp",
                                                left: {
                                                    kind: "Identifier",
                                                    name: "i",
                                                    role: "var",
                                                    type: "int",
                                                },
                                                op: "+",
                                                right: {
                                                    kind: "Identifier",
                                                    name: "x_i",
                                                    role: "var",
                                                    type: "int",
                                                },
                                            },
                                        },
                                        target: [
                                            {
                                                kind: "Identifier",
                                                name: "i",
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
                                                type: "Tensor[int][[w]]",
                                            },
                                            args: [
                                                {
                                                    kind: "Identifier",
                                                    name: "w",
                                                    role: "var",
                                                    type: "int",
                                                },
                                            ],
                                        },
                                    },
                                    target: [
                                        {
                                            kind: "Identifier",
                                            name: "j",
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
                                            type: "Tensor[int][[h]]",
                                        },
                                        args: [
                                            {
                                                kind: "Identifier",
                                                name: "h",
                                                role: "var",
                                                type: "int",
                                            },
                                        ],
                                    },
                                },
                                attr: {
                                    kind: "Identifier",
                                    name: "mean",
                                    role: "plain",
                                    type: "float",
                                },
                            },
                            args: [],
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
                    name: "pool2d",
                    role: "fn",
                },
                typeParams: intTypeParams("m", "n"),
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
                                            {
                                                kind: "Identifier",
                                                name: "m",
                                                role: "var",
                                                type: "int",
                                            },
                                            {
                                                kind: "Identifier",
                                                name: "n",
                                                role: "var",
                                                type: "int",
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
                            name: "h",
                            role: "var",
                            type: "int",
                        },
                        annotation: {
                            kind: "Identifier",
                            name: "int",
                            role: "type",
                        },
                    },
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "w",
                            role: "var",
                            type: "int",
                        },
                        annotation: {
                            kind: "Identifier",
                            name: "int",
                            role: "type",
                        },
                    },
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "stride0",
                            role: "var",
                            type: "int",
                        },
                        annotation: {
                            kind: "Identifier",
                            name: "int",
                            role: "type",
                        },
                    },
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "stride1",
                            role: "var",
                            type: "int",
                        },
                        annotation: {
                            kind: "Identifier",
                            name: "int",
                            role: "type",
                        },
                    },
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "padding0",
                            role: "var",
                            type: "int",
                        },
                        annotation: {
                            kind: "Identifier",
                            name: "int",
                            role: "type",
                        },
                    },
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "padding1",
                            role: "var",
                            type: "int",
                        },
                        annotation: {
                            kind: "Identifier",
                            name: "int",
                            role: "type",
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
                                    pool2dHeightSpanExpr(),
                                    pool2dWidthSpanExpr(),
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
                            name: "padded",
                            role: "var",
                        },
                        value: {
                            kind: "Call",
                            callee: {
                                kind: "Identifier",
                                name: "pad2d",
                                role: "fn",
                                type: "Tensor[float][[m + 2 * padding0, n + 2 * padding1]]",
                            },
                            args: [
                                {
                                    kind: "Identifier",
                                    name: "x",
                                    role: "var",
                                },
                                {
                                    kind: "Identifier",
                                    name: "padding0",
                                    role: "var",
                                    type: "int",
                                },
                                {
                                    kind: "Identifier",
                                    name: "padding1",
                                    role: "var",
                                    type: "int",
                                },
                            ],
                        },
                    },
                    {
                        kind: "Return",
                        value: {
                            kind: "ListComp",
                            elt: {
                                kind: "ListComp",
                                elt: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "mean2d",
                                        role: "fn",
                                        type: "float",
                                    },
                                    args: [
                                        {
                                            kind: "Identifier",
                                            name: "padded",
                                            role: "var",
                                        },
                                        {
                                            kind: "Identifier",
                                            name: "h",
                                            role: "var",
                                            type: "int",
                                        },
                                        {
                                            kind: "Identifier",
                                            name: "w",
                                            role: "var",
                                            type: "int",
                                        },
                                        {
                                            kind: "Identifier",
                                            name: "j",
                                            role: "var",
                                            type: "int",
                                        },
                                        {
                                            kind: "Identifier",
                                            name: "i",
                                            role: "var",
                                            type: "int",
                                        },
                                    ],
                                },
                                target: [
                                    {
                                        kind: "Identifier",
                                        name: "i",
                                        role: "var",
                                        type: "int",
                                    },
                                ],
                                iter: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "seq",
                                        role: "fn",
                                        type: "Tensor[int][[((w + 2 * padding1 - n + stride1) / stride1)]]",
                                    },
                                    args: [
                                        {
                                            kind: "Number",
                                            value: "0",
                                        },
                                        pool2dseqWidthEndExpr(),
                                        {
                                            kind: "Identifier",
                                            name: "stride1",
                                            role: "var",
                                            type: "int",
                                        },
                                    ],
                                },
                            },
                            target: [
                                {
                                    kind: "Identifier",
                                    name: "j",
                                    role: "var",
                                    type: "int",
                                },
                            ],
                            iter: {
                                kind: "Call",
                                callee: {
                                    kind: "Identifier",
                                    name: "seq",
                                    role: "fn",
                                    type: "Tensor[int][[((h + 2 * padding0 - m + stride0) / stride0)]]",
                                },
                                args: [
                                    {
                                        kind: "Number",
                                        value: "0",
                                    },
                                    pool2dseqHeightEndExpr(),
                                    {
                                        kind: "Identifier",
                                        name: "stride0",
                                        role: "var",
                                        type: "int",
                                    },
                                ],
                            },
                        },
                    },
                ],
            },
        ],
    };

    const lenetDefinitionBlock = {
        kind: "Block",
        body: [
            {
                kind: "ImportFrom",
                module: {
                    kind: "Identifier",
                    name: "pypie",
                    role: "plain",
                },
                names: [
                    {
                        kind: "Identifier",
                        name: "larger",
                        role: "fn",
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
                    name: "LeNet",
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
                        typeParams: intTypeParams("h", "w"),
                        args: [
                            {
                                kind: "Arg",
                                name: {
                                    kind: "Identifier",
                                    name: "x",
                                    role: "var",
                                    type: "Tensor[float][[1, 28, 28]]",
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
                                                        kind: "Number",
                                                        value: "1",
                                                    },
                                                    {
                                                        kind: "Identifier",
                                                        name: "h",
                                                        role: "var",
                                                        type: "int",
                                                    },
                                                    {
                                                        kind: "Identifier",
                                                        name: "w",
                                                        role: "var",
                                                        type: "int",
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
                                    name: "params",
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
                                                                    kind: "Number",
                                                                    value: "6",
                                                                },
                                                                {
                                                                    kind: "Number",
                                                                    value: "1",
                                                                },
                                                                {
                                                                    kind: "Number",
                                                                    value: "5",
                                                                },
                                                                {
                                                                    kind: "Number",
                                                                    value: "5",
                                                                },
                                                            ],
                                                        },
                                                    ],
                                                },
                                            },
                                            {
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
                                                                    kind: "Number",
                                                                    value: "6",
                                                                },
                                                            ],
                                                        },
                                                    ],
                                                },
                                            },
                                            {
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
                                                                    kind: "Number",
                                                                    value: "16",
                                                                },
                                                                {
                                                                    kind: "Number",
                                                                    value: "6",
                                                                },
                                                                {
                                                                    kind: "Number",
                                                                    value: "5",
                                                                },
                                                                {
                                                                    kind: "Number",
                                                                    value: "5",
                                                                },
                                                            ],
                                                        },
                                                    ],
                                                },
                                            },
                                            {
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
                                                                    kind: "Number",
                                                                    value: "16",
                                                                },
                                                            ],
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: "Ellipsis",
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
                                            {
                                                kind: "Number",
                                                value: "10",
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
                                    kind: "Tuple",
                                    elements: [
                                        {
                                            kind: "Identifier",
                                            name: "p1",
                                            role: "var",
                                            type: "Tensor[float][[6, 1, 5, 5]]",
                                        },
                                        {
                                            kind: "Identifier",
                                            name: "b1",
                                            role: "var",
                                            type: "Tensor[float][[6]]",
                                        },
                                        {
                                            kind: "Identifier",
                                            name: "p2",
                                            role: "var",
                                            type: "Tensor[float][[16, 6, 5, 5]]",
                                        },
                                        {
                                            kind: "Identifier",
                                            name: "b2",
                                            role: "var",
                                            type: "Tensor[float][[16]]",
                                        },
                                        {
                                            kind: "Ellipsis",
                                        },
                                    ],
                                },
                                value: {
                                    kind: "Identifier",
                                    name: "params",
                                    role: "var",
                                },
                            },
                            {
                                kind: "Assign",
                                target: {
                                    kind: "Identifier",
                                    name: "layer1",
                                    role: "var",
                                    type: "Tensor[float][[6, 28, 28]]",
                                },
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "larger",
                                        role: "fn",
                                        type: "Tensor[float][[6, 28, 28]]",
                                    },
                                    args: [
                                        {
                                            kind: "Call",
                                            callee: {
                                                kind: "Identifier",
                                                name: "corr2d_multi_in_out",
                                                role: "fn",
                                                type: "Tensor[float][[6, 28, 28]]",
                                            },
                                            args: [
                                                {
                                                    kind: "Identifier",
                                                    name: "x",
                                                    role: "var",
                                                    type: "Tensor[float][[1, 28, 28]]",
                                                },
                                                {
                                                    kind: "Identifier",
                                                    name: "p1",
                                                    role: "var",
                                                    type: "Tensor[float][[6, 1, 5, 5]]",
                                                },
                                                {
                                                    kind: "Identifier",
                                                    name: "b1",
                                                    role: "var",
                                                    type: "Tensor[float][[6]]",
                                                },
                                                {
                                                    kind: "Number",
                                                    value: "1",
                                                },
                                                {
                                                    kind: "Number",
                                                    value: "1",
                                                },
                                                {
                                                    kind: "Number",
                                                    value: "2",
                                                },
                                                {
                                                    kind: "Number",
                                                    value: "2",
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
                                kind: "Assign",
                                target: {
                                    kind: "Identifier",
                                    name: "layer2",
                                    role: "var",
                                    type: "Tensor[float][[6, 14, 14]]",
                                },
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "pool2d",
                                        role: "fn",
                                        type: "Tensor[float][[6, 14, 14]]",
                                    },
                                    args: [
                                        {
                                            kind: "Identifier",
                                            name: "layer1",
                                            role: "var",
                                            type: "Tensor[float][[6, 28, 28]]",
                                        },
                                        {
                                            kind: "Number",
                                            value: "2",
                                        },
                                        {
                                            kind: "Number",
                                            value: "2",
                                        },
                                        {
                                            kind: "Number",
                                            value: "2",
                                        },
                                        {
                                            kind: "Number",
                                            value: "2",
                                        },
                                        {
                                            kind: "Number",
                                            value: "0",
                                        },
                                        {
                                            kind: "Number",
                                            value: "0",
                                        },
                                    ],
                                },
                            },
                            {
                                kind: "Assign",
                                target: {
                                    kind: "Identifier",
                                    name: "layer3",
                                    role: "var",
                                    type: "Tensor[float][[16, 10, 10]]",
                                },
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "larger",
                                        role: "fn",
                                        type: "Tensor[float][[16, 10, 10]]",
                                    },
                                    args: [
                                        {
                                            kind: "Call",
                                            callee: {
                                                kind: "Identifier",
                                                name: "corr2d_multi_in_out",
                                                role: "fn",
                                                type: "Tensor[float][[16, 10, 10]]",
                                            },
                                            args: [
                                                {
                                                    kind: "Identifier",
                                                    name: "layer2",
                                                    role: "var",
                                                    type: "Tensor[float][[6, 14, 14]]",
                                                },
                                                {
                                                    kind: "Identifier",
                                                    name: "p2",
                                                    role: "var",
                                                    type: "Tensor[float][[16, 6, 5, 5]]",
                                                },
                                                {
                                                    kind: "Identifier",
                                                    name: "b2",
                                                    role: "var",
                                                    type: "Tensor[float][[16]]",
                                                },
                                                {
                                                    kind: "Number",
                                                    value: "1",
                                                },
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
                                                    value: "0",
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
                                kind: "Assign",
                                target: {
                                    kind: "Identifier",
                                    name: "layer4",
                                    role: "var",
                                    type: "Tensor[float][[16, 5, 5]]",
                                },
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "pool2d",
                                        role: "fn",
                                        type: "Tensor[float][[16, 5, 5]]",
                                    },
                                    args: [
                                        {
                                            kind: "Identifier",
                                            name: "layer3",
                                            role: "var",
                                            type: "Tensor[float][[16, 10, 10]]",
                                        },
                                        {
                                            kind: "Number",
                                            value: "2",
                                        },
                                        {
                                            kind: "Number",
                                            value: "2",
                                        },
                                        {
                                            kind: "Number",
                                            value: "2",
                                        },
                                        {
                                            kind: "Number",
                                            value: "2",
                                        },
                                        {
                                            kind: "Number",
                                            value: "0",
                                        },
                                        {
                                            kind: "Number",
                                            value: "0",
                                        },
                                    ],
                                },
                            },
                            {
                                kind: "ExprStmt",
                                value: {
                                    kind: "Ellipsis",
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    };

    const corr2dIncompleteDefinitionBlock = {
        kind: "Block",
        body: [
            {
                ...corr2dDefinitionBlock.body[0],
                body: [
                    {
                        kind: "ExprStmt",
                        value: {
                            kind: "Ellipsis",
                        },
                    },
                    {
                        kind: "Return",
                        value: {
                            kind: "ListComp",
                            elt: {
                                kind: "ListComp",
                                elt: {
                                    kind: "Ellipsis",
                                },
                                target: [
                                    {
                                        kind: "Identifier",
                                        name: "i",
                                        role: "var",
                                        type: "int",
                                    },
                                ],
                                iter: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "seq",
                                        role: "fn",
                                        type: "Tensor[int][[((w + 2 * padding1 - n + stride1) / stride1)]]",
                                    },
                                    args: [
                                        {
                                            kind: "Number",
                                            value: "0",
                                        },
                                        corr2dseqWidthEndExpr(),
                                        {
                                            kind: "Identifier",
                                            name: "stride1",
                                            role: "var",
                                            type: "int",
                                        },
                                    ],
                                },
                            },
                            target: [
                                {
                                    kind: "Identifier",
                                    name: "j",
                                    role: "var",
                                    type: "int",
                                },
                            ],
                            iter: {
                                kind: "Call",
                                callee: {
                                    kind: "Identifier",
                                    name: "seq",
                                    role: "fn",
                                    type: "Tensor[int][[((h + 2 * padding0 - m + stride0) / stride0)]]",
                                },
                                args: [
                                    {
                                        kind: "Number",
                                        value: "0",
                                    },
                                    corr2dseqHeightEndExpr(),
                                    {
                                        kind: "Identifier",
                                        name: "stride0",
                                        role: "var",
                                        type: "int",
                                    },
                                ],
                            },
                        },
                    },
                ],
            },
        ],
    };

    const corr1dRunBlock = {
        kind: "Block",
        body: [
            {
                kind: "Assign",
                target: {
                    kind: "Identifier",
                    name: "pattern",
                    role: "var",
                    type: "Tensor[float][[3]]",
                },
                value: {
                    kind: "Call",
                    callee: {
                        kind: "Identifier",
                        name: "Tensor",
                        role: "type",
                        type: "Tensor[float][[3]]",
                    },
                    args: [
                        {
                            kind: "List",
                            elements: [
                                {
                                    kind: "Number",
                                    value: "0.0",
                                },
                                {
                                    kind: "Number",
                                    value: "1.0",
                                },
                                {
                                    kind: "Number",
                                    value: "0.0",
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
                    name: "signal",
                    role: "var",
                    type: "Tensor[float][[5]]",
                },
                value: {
                    kind: "Call",
                    callee: {
                        kind: "Identifier",
                        name: "Tensor",
                        role: "type",
                        type: "Tensor[float][[5]]",
                    },
                    args: [
                        {
                            kind: "List",
                            elements: [
                                {
                                    kind: "Number",
                                    value: "0.0",
                                },
                                {
                                    kind: "Number",
                                    value: "1.0",
                                },
                                {
                                    kind: "Number",
                                    value: "0.0",
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
                    ],
                },
            },
            {
                kind: "ExprStmt",
                value: {
                    kind: "Call",
                    callee: {
                        kind: "Identifier",
                        name: "print",
                        role: "plain",
                        type: "None",
                    },
                    args: [
                        {
                            kind: "Call",
                            callee: {
                                kind: "Identifier",
                                name: "corr1d",
                                role: "fn",
                                type: "Tensor[float][[3]]",
                            },
                            args: [
                                {
                                    kind: "Identifier",
                                    name: "signal",
                                    role: "var",
                                    type: "Tensor[float][[5]]",
                                },
                                {
                                    kind: "Identifier",
                                    name: "pattern",
                                    role: "var",
                                    type: "Tensor[float][[3]]",
                                },
                            ],
                        },
                    ],
                },
            },
        ],
    };

    render({
        id: "prelude",
        dialog: [
            message(
                "D",
                "Our next model handles images. We will use it on the Fashion-MNIST dataset. " +
                "The dataset contains 70,000 images, each showing one item: a T-shirt, a dress, a coat, etc."
            ),
            message(
                "W",
                "So our model predicts the item in each image?\nLet's get started!"
            ),
            message(
                "D",
                "We begin with a baby step, detecting signals in rank-1 tensors.\n" +
                "Here's a signal:\n`Tensor([0.0, 1.0, 0.0, 0.0, 0.0])`.\nLet's check if it contains the pattern\n`Tensor([0.0, 1.0, 0.0])`.\n" +
                "We align the pattern with the left end of the signal, and slide the pattern all the way to the right. " +
                "For each segment in the signal, we compute a score of how well it matches the pattern."
            ),
            message(
                "W",
                "Let's define a function to compute this score!"
            ),
            {
                ...message(
                    "D",
                    "The score is the dot product between the pattern and the segment, which must have the same shape."
                ),
                codeLabel: "`dot` definition",
                buildCodeBlock: (_ast: AstApi) => dotDefinitionBlock,
                textAfterCode: "The `[n: int]` on `dot` says both tensors share the same length."
            },
            message(
                "W",
                "In our case, `n` is `3`, the length of the pattern. For the first segment of the signal, we have `dot(Tensor([0.0, 1.0, 0.0]), Tensor([0.0, 1.0, 0.0]))`, which is `1.0`."
            ),
            {
                ...message(
                    "D",
                    "Next, we slide the pattern and compute `dot` on every segment. This function is called `corr1d`, short for rank-1 !!correlation!!.\n"
                ),
                codeLabel: "`corr1d` definition",
                buildCodeBlock: (_ast: AstApi) => corr1dDefinitionBlock,
                textAfterCode: "It's a long function. Let's start with its type."
            },
            message(
                "W",
                "The signal `s` and the pattern `p` are rank-1 tensors, but they have different shapes. " +
                "The result is also rank-1, with `w - n + 1` elements, since there are `w - n + 1` segments.\n" +
                "Does `corr1d` return a tensor?"
            ),
            message(
                "D",
                "It does. `[... for ... in ...]` is a !!tensor comprehension!!.\n" +
                "Here's how `corr1d` slides across the signal:\n" +
                "`iota` gives us a `Tensor[int][[w - n + 1]]`: from `0` to `w - n`. We use these `int`s as the starting indices of the segments;\n" +
                "for each index, we take `n` elements from the signal to compute the dot product.\n" +
                "Let's run our example."
            ),
            {
                ...message(
                    "W",
                    "Of course."
                ),
                codeLabel: "`corr.py` lines 22-24",
                buildCodeBlock: (_ast: AstApi) => corr1dRunBlock,
                textAfterCode: "It prints `Tensor([1.0, 0.0, 0.0])`--three `dot`s for three segments."
            },
            message(
                "D",
                "Now let's improve the coverage."
            ),
            message(
                "W",
                "Coverage of what?"
            ),
            {
                ...message(
                    "D",
                    "The coverage of the elements at the beginning and end of the signal.\n" +
                    "Our `corr1d` underutilizes the first and last elements of the signal--" +
                    "each is used only once, while the middle element is used three times.\n" +
                    "To use elements more evenly, we can pad the signal before computing `corr1d` by appending `0.0`s to both ends."
                ),
                codeLabel: "`pad1d` definition",
                buildCodeBlock: (_ast: AstApi) => pad1dDefinitionBlock,
                textAfterCode: "Define `corr1d_padded` that extends `corr1d` with !!padding!!. How many elements does it return?"
            },
            {
                ...message(
                    "W",
                    "It returns `2 * padding` additional elements compared to vanilla `corr1d`."
                ),
                codeLabel: "`corr1d_padded` definition",
                buildCodeBlock: (_ast: AstApi) => corr1dPaddedDefinitionBlock,
                textAfterCode: "Running `corr1d_padded(signal, pattern, 1)` gives\n" +
                    "`Tensor([0.0, 1.0, 0.0, 0.0, 0.0])`;\n" +
                    "and `corr1d_padded(signal, pattern, 2)` gives\n" +
                    "`Tensor([0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0])`.\n" +
                    "The first and last elements are now used more frequently!"
            },
            {
                ...message(
                    "D",
                    "Next, let's make `corr1d` more flexible.\n" +
                    "In our example, `corr1d` advances one element at a time.\n" +
                    "In some cases, we might want to advance by two or three elements at a time.\n" +
                    "To do that, we need a new function to generate indices."
                ),
                codeLabel: "`seq` definition",
                buildCodeBlock: (_ast: AstApi) => seqDefinitionBlock,
                textAfterCode: "For example, `seq(0, 10, 2)` gives `Tensor([0, 2, 4, 6, 8])`.\n" +
                    "Create a new version of `corr1d` to use indices with flexible !!strides!!. How many elements does it return?"
            },
            {
                ...message(
                    "W",
                    "`corr1d_stride` should return `(w - n + stride) / stride` elements."
                ),
                codeLabel: "`corr1d_stride` and `corr1d_padded_stride` definitions",
                buildCodeBlock: (_ast: AstApi) => corr1dStridePairDefinitionBlock,
            },
            {
                ...message(
                    "D",
                    "Excellent! We are ready to detect patterns in images.\n" +
                    "Here's the template for `corr2d`."
                ),
                codeLabel: "`corr2d` definition (incomplete)",
                buildCodeBlock: (_ast: AstApi) => corr2dIncompleteDefinitionBlock,
                textAfterCode: "`j` is the index along `h`, sliding from top to bottom. `i` is the index along `w`, sliding from left to right.\n" +
                    "We also give `corr2d` a `bias`, which is added to each dot product.\n" +
                    "We need functions for padding and dot products for rank-2 tensors. " +
                    "Define `pad2d` first. It should be very similar to its rank-1 counterpart."
            },
            {
                ...message(
                    "W",
                    "How about this? It pads `0.0`s to the top, bottom, left, and right."
                ),
                codeLabel: "`pad2d` definition",
                buildCodeBlock: (_ast: AstApi) => pad2dDefinitionBlock,
            },
            {
                ...message(
                    "D",
                    "Very well.\n" +
                    "Here's the next helper: `dot2d`."
                ),
                codeLabel: "incomplete `dot2d`",
                buildCodeBlock: (_ast: AstApi) => dot2dIncompleteDefinitionBlock,
                textAfterCode: "It takes in the entire `s`. `s_j` and `s_i` tell us where `p` is currently positioned.* They are the starting indices in `s` for the dot product.\n" +
                "Complete `dot2d`."
            },
            {
                ...message(
                    "W",
                    "Like this?"
                ),
                codeLabel: "`dot2d` definition",
                buildCodeBlock: (_ast: AstApi) => dot2dDefinitionBlock,
                textAfterCode: "We need to multiply `m * n` pairs of elements from the two tensors and sum them. We use `s_j` and `s_i` as offsets to find each element in `s`.\n" +
                "Then we get a two dimensional tensor and collapse both dimensions with `sum(0, 1)`."
            },
            {
                ...message(
                    "D",
                    "Exactly. Now we have `corr2d`."
                ),
                codeLabel: "`corr2d` definition",
                buildCodeBlock: (_ast: AstApi) => corr2dDefinitionBlock,
            },
            message(
                "W",
                "Great! Is it ready to detect patterns in images?"
            ),
            message(
                "D",
                "It needs two more pieces:\ninput channels and output channels."
            ),
            message(
                "W",
                "What are the channels for?"
            ),
            message(
                "D",
                "Sometimes our inputs have a rank higher than 2. " +
                "For example, RGB images are `Tensor[float][[3, h, w]]`, where each `Tensor[float][[h, w]]` stores the intensity of red, green, or blue.\n" +
                "Sometimes our outputs need a combination of patterns: rising edges, falling edges, and maybe curves.\n"
            ),
            message(
                "W",
                "Interesting. Could we see the functions?"
            ),
            {
                ...message(
                    "D",
                    "`corr2d_multi_in` expects rank-3 tensors for `s` and `p`--one pattern for each input channel."
                ),
                codeLabel: "`corr2d_multi_in` definition",
                buildCodeBlock: (_ast: AstApi) => corr2dMultiInDefinitionBlock,
                textAfterCode: "In the returned value, what's the type of calling `corr2d`?"
            },
            {
                ...message(
                    "W",
                    "Calling `corr2d` on rank-3 tensors generates a rank-3 tensor."
                ),
                codeLabel: "`corr2d` return type",
                buildCodeBlock: (_ast: AstApi) => corr2dMultiInReturnTypeBlock,
                textAfterCode: "But the returned value should be rank-2--does `sum(0)` remove `i`?"
            },
            message(
                "D",
                "Yes. We can specify dimensions for `sum`. Here, `sum` collapses the first dimension, `i`, producing the expected rank-2 tensor."
            ),
            message(
                "W",
                "That is very handy!"
            ),
            {
                ...message(
                    "D",
                    "Next, for multiple output channels, we use `corr2d_multi_in_out`."
                ),
                codeLabel: "`corr2d_multi_in_out` definition",
                buildCodeBlock: (_ast: AstApi) => corr2dMultiInOutDefinitionBlock,
            },
            message(
                "W",
                "I see. Each input now corresponds to `o` patterns; each pattern has its own `bias`.\n" +
                "And we can directly reuse `corr2d_multi_in` thanks to rank polymorphism."
            ),
            message(
                "D",
                "`corr2d_multi_in_out` detects patterns at pixel-level granularity.\n" +
                "The same patterns, however, do not necessarily occur in the same position in all images. " +
                "For example, although all T-shirt images should have a rising edge near the top-left area, " +
                "one image might have the edge at `(0, 1)`, and another may have it at `(1, 2)`."
            ),
            message(
                "W",
                "How do we reduce the impact of exact locations?"
            ),
            {
                ...message(
                    "D",
                    "We shrink the image with !!pooling!!."
                ),
                codeLabel: "`mean2d` and `pool2d` definitions",
                buildCodeBlock: (_ast: AstApi) => poolingDefinitionBlock,
                textAfterCode: "Here, we reduce each `h * w` block to one value by taking the average of all elements in the block."
            },
            message(
                "W",
                "So the precise locations matter less!"
            ),
            {
                ...message(
                    "D",
                    "We now have most of the ingredients for the famous LeNet.\n" +
                    "It takes images of size `28 * 28`, with `1` input channel,\n" +
                    "and generates likelihood scores for `10` items."
                ),
                codeLabel: "`LeNet` definition",
                buildCodeBlock: (_ast: AstApi) => lenetDefinitionBlock,
                textAfterCode: "`p1` is the pattern for the first round of correlation: it has `1` input channel to match `x`, and `6` output channels.\n" +
                "`p2` is the pattern for the second round: it has `6` input channels to match `p1`, and `16` output channels.\n"
            },
            message(
                "W",
                "Does `larger(x, y)` pick the larger number between `x` and `y`? Why do we need these comparisons?"
            ),
            message(
                "D",
                "`larger` is an !!activation function!!. " +
                "Activation functions add non-linearity so each layer remains expressive. " +
                "Otherwise, two consecutive linear layers would collapse into a single linear layer.\n" +
                "Here, we achieve non-linearity by simply replacing negative values with `0.0`."
            ),
            message(
                "W",
                "Got it.\n" +
                "`layer1` is a `Tensor[float][[6, 28, 28]]`,\n" +
                "`layer2` is a `Tensor[float][[6, 14, 14]]`,\n" +
                "`layer3` is a `Tensor[float][[16, 10, 10]]`,\n" +
                "`layer4` is a `Tensor[float][[16, 5, 5]]`.\n" +
                "We don't have a `Tensor[float][[10]]` yet."
            ),
            message(
                "D",
                "Right. Our model can only detect patterns--it does not reason about them yet.\n" +
                "We will complete LeNet in the next chapter, and run it on Fashion-MNIST!"
            ),
            message(
                "W",
                "This is getting exciting!"
            )
        ],
        notes: "* It is mathematically correct to pass only the slice of `s` that `p` is sliding over, just like in the rank-1 version. " +
        "But with PyPie's current implementation, calculating gradients on slices is less efficient."
    });
})();
