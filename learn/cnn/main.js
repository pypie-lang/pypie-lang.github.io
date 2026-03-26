(() => {
    const render = window.PYPIE_LEARN_RENDER;
    if (typeof render !== "function") {
        return;
    }
    const message = (speaker, text) => ({
        side: speaker === "W" ? "right" : "left",
        speaker,
        text,
    });
    const intTypeParam = (name) => ({
        kind: "Identifier",
        name,
        role: "var",
        type: "int",
    });
    const intTypeParams = (...names) => names.map((name) => intTypeParam(name));
    const linearDefinitionBlock = {
        kind: "Block",
        body: [
            {
                kind: "FunctionDef",
                name: {
                    kind: "Identifier",
                    name: "linear",
                    role: "fn",
                },
                typeParams: intTypeParams("o", "i"),
                args: [
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "x",
                            role: "var",
                            type: "Tensor[float][[i]]",
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
                            name: "A",
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
                            name: "b",
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
                            kind: "BinOp",
                            left: {
                                kind: "Call",
                                callee: {
                                    kind: "Attribute",
                                    value: {
                                        kind: "BinOp",
                                        left: {
                                            kind: "Identifier",
                                            name: "x",
                                            role: "var",
                                            type: "Tensor[float][[i]]",
                                        },
                                        op: "*",
                                        right: {
                                            kind: "Identifier",
                                            name: "A",
                                            role: "var",
                                            type: "Tensor[float][[o, i]]",
                                        },
                                    },
                                    attr: {
                                        kind: "Identifier",
                                        name: "sum",
                                        role: "plain",
                                        type: "Tensor[float][[o]]",
                                    },
                                },
                                args: [
                                    {
                                        kind: "Number",
                                        value: "1",
                                    },
                                ],
                            },
                            op: "+",
                            right: {
                                kind: "Identifier",
                                name: "b",
                                role: "var",
                                type: "Tensor[float][[o]]",
                            },
                        },
                    },
                ],
            },
        ],
    };
    const linearWithParamsDefinitionBlock = {
        kind: "Block",
        body: [
            {
                kind: "ClassDef",
                name: {
                    kind: "Identifier",
                    name: "LinearParams",
                    role: "type",
                },
                typeParams: [...intTypeParams("o", "i")],
                body: [
                    {
                        kind: "AnnAssign",
                        target: {
                            kind: "Identifier",
                            name: "A",
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
                            name: "b",
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
                ],
            },
            {
                kind: "BlankLine",
            },
            {
                kind: "FunctionDef",
                name: {
                    kind: "Identifier",
                    name: "linear",
                    role: "fn",
                },
                typeParams: intTypeParams("i", "o"),
                args: [
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "x",
                            role: "var",
                            type: "Tensor[float][[i]]",
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
                decorator: {
                    kind: "Identifier",
                    name: "op",
                    role: "fn",
                },
                body: [
                    {
                        kind: "Return",
                        value: {
                            kind: "BinOp",
                            left: {
                                kind: "Call",
                                callee: {
                                    kind: "Attribute",
                                    value: {
                                        kind: "BinOp",
                                        left: {
                                            kind: "Identifier",
                                            name: "x",
                                            role: "var",
                                            type: "Tensor[float][[i]]",
                                        },
                                        op: "*",
                                        right: {
                                            kind: "Attribute",
                                            value: {
                                                kind: "Identifier",
                                                name: "p",
                                                role: "var",
                                                type: "LinearParams[float, o, i]",
                                            },
                                            attr: {
                                                kind: "Identifier",
                                                name: "A",
                                                role: "plain",
                                                type: "Tensor[float][[o, i]]",
                                            },
                                        },
                                    },
                                    attr: {
                                        kind: "Identifier",
                                        name: "sum",
                                        role: "plain",
                                        type: "Tensor[float][[o]]",
                                    },
                                },
                                args: [
                                    {
                                        kind: "Number",
                                        value: "1",
                                    },
                                ],
                            },
                            op: "+",
                            right: {
                                kind: "Attribute",
                                value: {
                                    kind: "Identifier",
                                    name: "p",
                                    role: "var",
                                    type: "LinearParams[float, o, i]",
                                },
                                attr: {
                                    kind: "Identifier",
                                    name: "b",
                                    role: "plain",
                                    type: "Tensor[float][[o]]",
                                },
                            },
                        },
                    },
                ],
            },
        ],
    };
    const corr2dWithParamsDefinitionBlock = {
        kind: "Block",
        body: [
            {
                kind: "ClassDef",
                name: {
                    kind: "Identifier",
                    name: "Corr2dParams",
                    role: "type",
                },
                typeParams: intTypeParams("o", "i", "m", "n"),
                body: [
                    {
                        kind: "AnnAssign",
                        target: {
                            kind: "Identifier",
                            name: "w",
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
                        kind: "AnnAssign",
                        target: {
                            kind: "Identifier",
                            name: "b",
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
                ],
            },
            {
                kind: "BlankLine",
            },
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
                                kind: "Identifier",
                                name: "Corr2dParams",
                                role: "type",
                            },
                            index: {
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
                                    },
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
                                    kind: "Attribute",
                                    value: {
                                        kind: "Identifier",
                                        name: "p",
                                        role: "var",
                                        type: "Corr2dParams[o, i, m, n]",
                                    },
                                    attr: {
                                        kind: "Identifier",
                                        name: "w",
                                        role: "plain",
                                        type: "Tensor[float][[o, i, m, n]]",
                                    },
                                },
                                {
                                    kind: "Attribute",
                                    value: {
                                        kind: "Identifier",
                                        name: "p",
                                        role: "var",
                                        type: "Corr2dParams[o, i, m, n]",
                                    },
                                    attr: {
                                        kind: "Identifier",
                                        name: "b",
                                        role: "plain",
                                        type: "Tensor[float][[o]]",
                                    },
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
    const lenetParamsDefinitionBlock = {
        kind: "Block",
        body: [
            {
                kind: "ClassDef",
                name: {
                    kind: "Identifier",
                    name: "LeNetParams",
                    role: "type",
                },
                body: [
                    {
                        kind: "AnnAssign",
                        target: {
                            kind: "Identifier",
                            name: "corr1",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "Identifier",
                                name: "Corr2dParams",
                                role: "type",
                            },
                            index: {
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
                        },
                    },
                    {
                        kind: "AnnAssign",
                        target: {
                            kind: "Identifier",
                            name: "corr2",
                            role: "var",
                        },
                        annotation: {
                            kind: "TypeSubscript",
                            base: {
                                kind: "Identifier",
                                name: "Corr2dParams",
                                role: "type",
                            },
                            index: {
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
                        },
                    },
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
                                        kind: "Number",
                                        value: "120",
                                    },
                                    {
                                        kind: "Number",
                                        value: "400",
                                    },
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
                                    {
                                        kind: "Number",
                                        value: "84",
                                    },
                                    {
                                        kind: "Number",
                                        value: "120",
                                    },
                                ],
                            },
                        },
                    },
                    {
                        kind: "AnnAssign",
                        target: {
                            kind: "Identifier",
                            name: "linear3",
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
                                        kind: "Number",
                                        value: "10",
                                    },
                                    {
                                        kind: "Number",
                                        value: "84",
                                    },
                                ],
                            },
                        },
                    },
                ],
            },
        ],
    };
    const lenetClassDefinitionBlock = {
        kind: "Block",
        body: [
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
                                                        kind: "Number",
                                                        value: "28",
                                                    },
                                                    {
                                                        kind: "Number",
                                                        value: "28",
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
                                    type: "LeNetParams",
                                },
                                annotation: {
                                    kind: "Identifier",
                                    name: "LeNetParams",
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
                                                    kind: "Attribute",
                                                    value: {
                                                        kind: "Identifier",
                                                        name: "p",
                                                        role: "var",
                                                        type: "LeNetParams",
                                                    },
                                                    attr: {
                                                        kind: "Identifier",
                                                        name: "corr1",
                                                        role: "plain",
                                                        type: "Corr2dParams[6, 1, 5, 5]",
                                                    },
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
                                    name: "layer1",
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
                                    name: "layer2",
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
                                                    name: "layer1",
                                                    role: "var",
                                                    type: "Tensor[float][[6, 14, 14]]",
                                                },
                                                {
                                                    kind: "Attribute",
                                                    value: {
                                                        kind: "Identifier",
                                                        name: "p",
                                                        role: "var",
                                                        type: "LeNetParams",
                                                    },
                                                    attr: {
                                                        kind: "Identifier",
                                                        name: "corr2",
                                                        role: "plain",
                                                        type: "Corr2dParams[16, 6, 5, 5]",
                                                    },
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
                                    name: "layer2",
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
                                            name: "layer2",
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
                                kind: "Assign",
                                target: {
                                    kind: "Identifier",
                                    name: "flat",
                                    role: "var",
                                    type: "Tensor[float][[400]]",
                                },
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Attribute",
                                        value: {
                                            kind: "Identifier",
                                            name: "layer2",
                                            role: "var",
                                            type: "Tensor[float][[16, 5, 5]]",
                                        },
                                        attr: {
                                            kind: "Identifier",
                                            name: "reshape",
                                            role: "plain",
                                            type: "Tensor[float][[400]]",
                                        },
                                    },
                                    args: [
                                        {
                                            kind: "List",
                                            elements: [
                                                {
                                                    kind: "BinOp",
                                                    left: {
                                                        kind: "BinOp",
                                                        left: {
                                                            kind: "Number",
                                                            value: "16",
                                                        },
                                                        op: "*",
                                                        right: {
                                                            kind: "Number",
                                                            value: "5",
                                                        },
                                                    },
                                                    op: "*",
                                                    right: {
                                                        kind: "Number",
                                                        value: "5",
                                                    },
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
                                    name: "layer3",
                                    role: "var",
                                    type: "Tensor[float][[120]]",
                                },
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "larger",
                                        role: "fn",
                                        type: "Tensor[float][[120]]",
                                    },
                                    args: [
                                        {
                                            kind: "Call",
                                            callee: {
                                                kind: "Identifier",
                                                name: "linear",
                                                role: "fn",
                                                type: "Tensor[float][[120]]",
                                            },
                                            args: [
                                                {
                                                    kind: "Identifier",
                                                    name: "flat",
                                                    role: "var",
                                                    type: "Tensor[float][[400]]",
                                                },
                                                {
                                                    kind: "Attribute",
                                                    value: {
                                                        kind: "Identifier",
                                                        name: "p",
                                                        role: "var",
                                                        type: "LeNetParams",
                                                    },
                                                    attr: {
                                                        kind: "Identifier",
                                                        name: "linear1",
                                                        role: "plain",
                                                        type: "LinearParams[float, 120, 400]",
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
                                kind: "Assign",
                                target: {
                                    kind: "Identifier",
                                    name: "layer4",
                                    role: "var",
                                    type: "Tensor[float][[84]]",
                                },
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "larger",
                                        role: "fn",
                                        type: "Tensor[float][[84]]",
                                    },
                                    args: [
                                        {
                                            kind: "Call",
                                            callee: {
                                                kind: "Identifier",
                                                name: "linear",
                                                role: "fn",
                                                type: "Tensor[float][[84]]",
                                            },
                                            args: [
                                                {
                                                    kind: "Identifier",
                                                    name: "layer3",
                                                    role: "var",
                                                    type: "Tensor[float][[120]]",
                                                },
                                                {
                                                    kind: "Attribute",
                                                    value: {
                                                        kind: "Identifier",
                                                        name: "p",
                                                        role: "var",
                                                        type: "LeNetParams",
                                                    },
                                                    attr: {
                                                        kind: "Identifier",
                                                        name: "linear2",
                                                        role: "plain",
                                                        type: "LinearParams[float, 84, 120]",
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
                                kind: "Assign",
                                target: {
                                    kind: "Identifier",
                                    name: "layer5",
                                    role: "var",
                                    type: "Tensor[float][[10]]",
                                },
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "linear",
                                        role: "fn",
                                        type: "Tensor[float][[10]]",
                                    },
                                    args: [
                                        {
                                            kind: "Identifier",
                                            name: "layer4",
                                            role: "var",
                                            type: "Tensor[float][[84]]",
                                        },
                                        {
                                            kind: "Attribute",
                                            value: {
                                                kind: "Identifier",
                                                name: "p",
                                                role: "var",
                                                type: "LeNetParams",
                                            },
                                            attr: {
                                                kind: "Identifier",
                                                name: "linear3",
                                                role: "plain",
                                                type: "LinearParams[float, 10, 84]",
                                            },
                                        },
                                    ],
                                },
                            },
                            {
                                kind: "Return",
                                value: {
                                    kind: "Identifier",
                                    name: "layer5",
                                    role: "var",
                                    type: "Tensor[float][[10]]",
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
                        typeParams: intTypeParams("n"),
                        args: [
                            {
                                kind: "Arg",
                                name: {
                                    kind: "Identifier",
                                    name: "ys_pred",
                                    role: "var",
                                    type: "Tensor[float][[n, 10]]",
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
                                                    {
                                                        kind: "Number",
                                                        value: "10",
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
                                    type: "Tensor[int][[n]]",
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
                        body: [
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
                                            type: "Tensor[float][[n, 10]]",
                                        },
                                        {
                                            kind: "Identifier",
                                            name: "ys",
                                            role: "var",
                                            type: "Tensor[int][[n]]",
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
                            kind: "Identifier",
                            name: "float",
                            role: "type",
                        },
                        body: [
                            {
                                kind: "Return",
                                value: {
                                    kind: "BinOp",
                                    left: {
                                        kind: "Identifier",
                                        name: "p",
                                        role: "var",
                                        type: "float",
                                    },
                                    op: "-",
                                    right: {
                                        kind: "BinOp",
                                        left: {
                                            kind: "Identifier",
                                            name: "lr",
                                            role: "var",
                                            type: "float",
                                        },
                                        op: "*",
                                        right: {
                                            kind: "Identifier",
                                            name: "g",
                                            role: "var",
                                            type: "float",
                                        },
                                    },
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    };
    const lenetPredictBlock = {
        kind: "Block",
        body: [
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
                                                        kind: "Number",
                                                        value: "28",
                                                    },
                                                    {
                                                        kind: "Number",
                                                        value: "28",
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
                                                                    value: "120",
                                                                },
                                                                {
                                                                    kind: "BinOp",
                                                                    left: {
                                                                        kind: "BinOp",
                                                                        left: {
                                                                            kind: "Number",
                                                                            value: "16",
                                                                        },
                                                                        op: "*",
                                                                        right: {
                                                                            kind: "Number",
                                                                            value: "5",
                                                                        },
                                                                    },
                                                                    op: "*",
                                                                    right: {
                                                                        kind: "Number",
                                                                        value: "5",
                                                                    },
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
                                                                    value: "120",
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
                                                                    value: "84",
                                                                },
                                                                {
                                                                    kind: "Number",
                                                                    value: "120",
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
                                                                    value: "84",
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
                                                                    value: "10",
                                                                },
                                                                {
                                                                    kind: "Number",
                                                                    value: "84",
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
                                                                    value: "10",
                                                                },
                                                            ],
                                                        },
                                                    ],
                                                },
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
                                            kind: "Identifier",
                                            name: "lA1",
                                            role: "var",
                                            type: "Tensor[float][[120, 400]]",
                                        },
                                        {
                                            kind: "Identifier",
                                            name: "lb1",
                                            role: "var",
                                            type: "Tensor[float][[120]]",
                                        },
                                        {
                                            kind: "Identifier",
                                            name: "lA2",
                                            role: "var",
                                            type: "Tensor[float][[84, 120]]",
                                        },
                                        {
                                            kind: "Identifier",
                                            name: "lb2",
                                            role: "var",
                                            type: "Tensor[float][[84]]",
                                        },
                                        {
                                            kind: "Identifier",
                                            name: "lA3",
                                            role: "var",
                                            type: "Tensor[float][[10, 84]]",
                                        },
                                        {
                                            kind: "Identifier",
                                            name: "lb3",
                                            role: "var",
                                            type: "Tensor[float][[10]]",
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
                                    name: "layer1",
                                    role: "var",
                                    type: "Tensor[float][[6, 14, 14]]",
                                },
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "pool2d_avg",
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
                                    name: "layer2",
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
                                                    name: "layer1",
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
                                    name: "layer2",
                                    role: "var",
                                    type: "Tensor[float][[16, 5, 5]]",
                                },
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "pool2d_avg",
                                        role: "fn",
                                        type: "Tensor[float][[16, 5, 5]]",
                                    },
                                    args: [
                                        {
                                            kind: "Identifier",
                                            name: "layer2",
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
                                kind: "Assign",
                                target: {
                                    kind: "Identifier",
                                    name: "flat",
                                    role: "var",
                                    type: "Tensor[float][[400]]",
                                },
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Attribute",
                                        value: {
                                            kind: "Identifier",
                                            name: "layer2",
                                            role: "var",
                                            type: "Tensor[float][[16, 5, 5]]",
                                        },
                                        attr: {
                                            kind: "Identifier",
                                            name: "reshape",
                                            role: "plain",
                                            type: "Tensor[float][[400]]",
                                        },
                                    },
                                    args: [
                                        {
                                            kind: "List",
                                            elements: [
                                                {
                                                    kind: "BinOp",
                                                    left: {
                                                        kind: "BinOp",
                                                        left: {
                                                            kind: "Number",
                                                            value: "16",
                                                        },
                                                        op: "*",
                                                        right: {
                                                            kind: "Number",
                                                            value: "5",
                                                        },
                                                    },
                                                    op: "*",
                                                    right: {
                                                        kind: "Number",
                                                        value: "5",
                                                    },
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
                                    name: "layer3",
                                    role: "var",
                                    type: "Tensor[float][[120]]",
                                },
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "larger",
                                        role: "fn",
                                        type: "Tensor[float][[120]]",
                                    },
                                    args: [
                                        {
                                            kind: "Call",
                                            callee: {
                                                kind: "Identifier",
                                                name: "linear",
                                                role: "fn",
                                                type: "Tensor[float][[120]]",
                                            },
                                            args: [
                                                {
                                                    kind: "Identifier",
                                                    name: "flat",
                                                    role: "var",
                                                    type: "Tensor[float][[400]]",
                                                },
                                                {
                                                    kind: "Identifier",
                                                    name: "lA1",
                                                    role: "var",
                                                    type: "Tensor[float][[120, 400]]",
                                                },
                                                {
                                                    kind: "Identifier",
                                                    name: "lb1",
                                                    role: "var",
                                                    type: "Tensor[float][[120]]",
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
                                    type: "Tensor[float][[84]]",
                                },
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "larger",
                                        role: "fn",
                                        type: "Tensor[float][[84]]",
                                    },
                                    args: [
                                        {
                                            kind: "Call",
                                            callee: {
                                                kind: "Identifier",
                                                name: "linear",
                                                role: "fn",
                                                type: "Tensor[float][[84]]",
                                            },
                                            args: [
                                                {
                                                    kind: "Identifier",
                                                    name: "layer3",
                                                    role: "var",
                                                    type: "Tensor[float][[120]]",
                                                },
                                                {
                                                    kind: "Identifier",
                                                    name: "lA2",
                                                    role: "var",
                                                    type: "Tensor[float][[84, 120]]",
                                                },
                                                {
                                                    kind: "Identifier",
                                                    name: "lb2",
                                                    role: "var",
                                                    type: "Tensor[float][[84]]",
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
                                    name: "layer5",
                                    role: "var",
                                    type: "Tensor[float][[10]]",
                                },
                                value: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "linear",
                                        role: "fn",
                                        type: "Tensor[float][[10]]",
                                    },
                                    args: [
                                        {
                                            kind: "Identifier",
                                            name: "layer4",
                                            role: "var",
                                            type: "Tensor[float][[84]]",
                                        },
                                        {
                                            kind: "Identifier",
                                            name: "lA3",
                                            role: "var",
                                            type: "Tensor[float][[10, 84]]",
                                        },
                                        {
                                            kind: "Identifier",
                                            name: "lb3",
                                            role: "var",
                                            type: "Tensor[float][[10]]",
                                        },
                                    ],
                                },
                            },
                            {
                                kind: "Return",
                                value: {
                                    kind: "Identifier",
                                    name: "layer5",
                                    role: "var",
                                    type: "Tensor[float][[10]]",
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    };
    const lenetWithLrDefinitionBlock = {
        kind: "Block",
        body: [
            {
                kind: "Assign",
                target: {
                    kind: "Identifier",
                    name: "learning_rate",
                    role: "var",
                    type: "float",
                },
                value: {
                    kind: "Number",
                    value: "0.1",
                },
            },
            {
                kind: "BlankLine",
            },
            {
                ...lenetPredictBlock.body[0],
                body: [
                    ...lenetPredictBlock.body[0].body,
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
                        typeParams: intTypeParams("m"),
                        args: [
                            {
                                kind: "Arg",
                                name: {
                                    kind: "Identifier",
                                    name: "ys_pred",
                                    role: "var",
                                    type: "Tensor[float][[m, 10]]",
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
                                                        kind: "Number",
                                                        value: "10",
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
                                    type: "Tensor[int][[m]]",
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
                                                    {
                                                        kind: "Identifier",
                                                        name: "m",
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
                        body: [
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
                                            type: "Tensor[float][[m, 10]]",
                                        },
                                        {
                                            kind: "Identifier",
                                            name: "ys",
                                            role: "var",
                                            type: "Tensor[int][[m]]",
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
                            kind: "Identifier",
                            name: "float",
                            role: "type",
                        },
                        body: [
                            {
                                kind: "Return",
                                value: {
                                    kind: "BinOp",
                                    left: {
                                        kind: "Identifier",
                                        name: "p",
                                        role: "var",
                                        type: "float",
                                    },
                                    op: "-",
                                    right: {
                                        kind: "BinOp",
                                        left: {
                                            kind: "Identifier",
                                            name: "learning_rate",
                                            role: "var",
                                            type: "float",
                                        },
                                        op: "*",
                                        right: {
                                            kind: "Identifier",
                                            name: "g",
                                            role: "var",
                                            type: "float",
                                        },
                                    },
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    };
    const softmaxDefinitionBlock = {
        kind: "Block",
        body: [
            {
                kind: "FunctionDef",
                name: {
                    kind: "Identifier",
                    name: "softmax",
                    role: "fn",
                },
                typeParams: intTypeParams("n"),
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
                            name: "x_exp",
                            role: "var",
                            type: "Tensor[float][[n]]",
                        },
                        value: {
                            kind: "Call",
                            callee: {
                                kind: "Attribute",
                                value: {
                                    kind: "Identifier",
                                    name: "x",
                                    role: "var",
                                    type: "Tensor[float][[n]]",
                                },
                                attr: {
                                    kind: "Identifier",
                                    name: "exp",
                                    role: "plain",
                                    type: "Tensor[float][[n]]",
                                },
                            },
                            args: [],
                        },
                    },
                    {
                        kind: "Return",
                        value: {
                            kind: "BinOp",
                            left: {
                                kind: "Identifier",
                                name: "x_exp",
                                role: "var",
                                type: "Tensor[float][[n]]",
                            },
                            op: "/",
                            right: {
                                kind: "Call",
                                callee: {
                                    kind: "Attribute",
                                    value: {
                                        kind: "Identifier",
                                        name: "x_exp",
                                        role: "var",
                                        type: "Tensor[float][[n]]",
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
                    },
                ],
            },
        ],
    };
    const softmaxRunBlock = {
        kind: "Block",
        body: [
            {
                kind: "ExprStmt",
                value: {
                    kind: "Call",
                    callee: {
                        kind: "Identifier",
                        name: "print",
                        role: "fn",
                        type: "None",
                    },
                    args: [
                        {
                            kind: "Call",
                            callee: {
                                kind: "Identifier",
                                name: "softmax",
                                role: "fn",
                                type: "Tensor[float][[3]]",
                            },
                            args: [
                                {
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
                                                    value: "1.0",
                                                },
                                                {
                                                    kind: "Number",
                                                    value: "-2.0",
                                                },
                                                {
                                                    kind: "Number",
                                                    value: "3.0",
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            },
        ],
    };
    const crossEntropyDefinitionBlock = {
        kind: "Block",
        body: [
            {
                kind: "FunctionDef",
                name: {
                    kind: "Identifier",
                    name: "cross_entropy",
                    role: "fn",
                },
                typeParams: intTypeParams("m", "n"),
                args: [
                    {
                        kind: "Arg",
                        name: {
                            kind: "Identifier",
                            name: "ys_pred",
                            role: "var",
                            type: "Tensor[float][[m, n]]",
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
                            name: "ys",
                            role: "var",
                            type: "Tensor[int][[m]]",
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
                                            {
                                                kind: "Identifier",
                                                name: "m",
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
                        kind: "Assign",
                        target: {
                            kind: "Identifier",
                            name: "target_probs",
                            role: "var",
                            type: "Tensor[float][[m]]",
                        },
                        value: {
                            kind: "ListComp",
                            elt: {
                                kind: "Subscript",
                                value: {
                                    kind: "Identifier",
                                    name: "probs",
                                    role: "var",
                                    type: "Tensor[float][[n]]",
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
                                    kind: "Tuple",
                                    elements: [
                                        {
                                            kind: "Identifier",
                                            name: "probs",
                                            role: "var",
                                            type: "Tensor[float][[n]]",
                                        },
                                        {
                                            kind: "Identifier",
                                            name: "idx",
                                            role: "var",
                                            type: "int",
                                        },
                                    ],
                                },
                            ],
                            iter: {
                                kind: "Call",
                                callee: {
                                    kind: "Identifier",
                                    name: "zip",
                                    role: "plain",
                                    type: "Tensor[float][[m]]",
                                },
                                args: [
                                    {
                                        kind: "Call",
                                        callee: {
                                            kind: "Identifier",
                                            name: "softmax",
                                            role: "fn",
                                            type: "Tensor[float][[m, n]]",
                                        },
                                        args: [
                                            {
                                                kind: "Identifier",
                                                name: "ys_pred",
                                                role: "var",
                                                type: "Tensor[float][[m, n]]",
                                            },
                                        ],
                                    },
                                    {
                                        kind: "Identifier",
                                        name: "ys",
                                        role: "var",
                                        type: "Tensor[int][[m]]",
                                    },
                                ],
                            },
                        },
                    },
                    {
                        kind: "Return",
                        value: {
                            kind: "UnaryOp",
                            op: "-",
                            operand: {
                                kind: "Call",
                                callee: {
                                    kind: "Attribute",
                                    value: {
                                        kind: "Call",
                                        callee: {
                                            kind: "Attribute",
                                            value: {
                                                kind: "Identifier",
                                                name: "target_probs",
                                                role: "var",
                                                type: "Tensor[float][[m]]",
                                            },
                                            attr: {
                                                kind: "Identifier",
                                                name: "log",
                                                role: "plain",
                                                type: "Tensor[float][[m]]",
                                            },
                                        },
                                        args: [],
                                    },
                                    attr: {
                                        kind: "Identifier",
                                        name: "avg",
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
                    },
                ],
            },
        ],
    };
    const crossEntropyRunBlock = {
        kind: "Block",
        body: [
            {
                kind: "Assign",
                target: {
                    kind: "Identifier",
                    name: "pred",
                    role: "var",
                    type: "Tensor[float][[2, 3]]",
                },
                value: {
                    kind: "Call",
                    callee: {
                        kind: "Identifier",
                        name: "Tensor",
                        role: "type",
                        type: "Tensor[float][[2, 3]]",
                    },
                    args: [
                        {
                            kind: "List",
                            elements: [
                                {
                                    kind: "List",
                                    elements: [
                                        {
                                            kind: "Number",
                                            value: "2.0",
                                        },
                                        {
                                            kind: "Number",
                                            value: "5.0",
                                        },
                                        {
                                            kind: "Number",
                                            value: "-6.0",
                                        },
                                    ],
                                },
                                {
                                    kind: "List",
                                    elements: [
                                        {
                                            kind: "Number",
                                            value: "1.0",
                                        },
                                        {
                                            kind: "Number",
                                            value: "3.0",
                                        },
                                        {
                                            kind: "Number",
                                            value: "5.1",
                                        },
                                    ],
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
                    name: "indices",
                    role: "var",
                    type: "Tensor[int][[2]]",
                },
                value: {
                    kind: "Call",
                    callee: {
                        kind: "Identifier",
                        name: "Tensor",
                        role: "type",
                        type: "Tensor[int][[2]]",
                    },
                    args: [
                        {
                            kind: "List",
                            elements: [
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
                        role: "fn",
                        type: "None",
                    },
                    args: [
                        {
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
                                    name: "pred",
                                    role: "var",
                                    type: "Tensor[float][[2, 3]]",
                                },
                                {
                                    kind: "Identifier",
                                    name: "indices",
                                    role: "var",
                                    type: "Tensor[int][[2]]",
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
            {
                ...message("D", "With `corr2d_multi_in_out`, our model is able to find a bunch of clues in an image.\n" +
                    "Now we give it the ability to make decisions using these clues.\n" +
                    "The decision making is through the !!`linear`!! function."),
                codeLabel: "`linear` definition",
                buildCodeBlock: (_ast) => linearDefinitionBlock,
            },
            message("W", "So `linear` converts a `Tensor[float][[i]]` to a `Tensor[float][[o]]`?\n" +
                "Seems to be helpful: we need to convert a `Tensor[float][[16, 5, 5]]` to a `Tensor[float][[10]]` in the last chapter."),
            {
                ...message("D", "We do it using three layers of `linear`. Here's the complete `predict` of LeNet."),
                codeLabel: "`LeNet.predict` definition",
                buildCodeBlock: (_ast) => lenetPredictBlock,
                textAfterCode: "After `layer4`, we use !!`reshape`!! to flatten the rank-3 tensor to rank-1."
            },
            message("W", "A model needs `predict`, `loss`, and `update`. " +
                "One down, two to go!"),
            message("D", "`loss` starts with the output of `predict`. " +
                "What are the desired properties of this `Tensor[float][[10]]`?"),
            message("W", "How about a list of probabilities?\n" +
                "Like: 70% this is a T-shirt, 20% for a dress, 2% for a sneaker ..."),
            {
                ...message("D", "Good. We need a list of probabilities that add up to 1, and each should be non-negative.\n" +
                    "Here's our first function."),
                codeLabel: "`softmax` definition",
                buildCodeBlock: (_ast) => softmaxDefinitionBlock,
                textAfterCode: "We raise Euler's number to the power of each score, ensuring positivity,\n" +
                    "and then divide these positive numbers by their sum."
            },
            message("W", "Why Euler's number? How about 2 or 3?"),
            message("D", "Any positive base works, but Euler's number is usually more convenient.\n" +
                "The gradient of `x.exp()` is itself. So learning can be made more efficient.\n" +
                "Let's run an example."),
            {
                ...message("W", "Like this?"),
                codeLabel: "run `softmax`",
                buildCodeBlock: (_ast) => softmaxRunBlock,
                textAfterCode: "It prints `Tensor([0.1184, 0.0058, 0.8756])`.\nThe highest score becomes the highest probability."
            },
            {
                ...message("D", "With `softmax`, we may define our loss function: `cross_entropy`.\n" +
                    "There are `n` possible items and `m` inputs. For each input, `ys_pred` stores predicted scores for all items. " +
                    "`ys` contains the indices of the actual items, such as `0` for T-shirt, `1` for dress, and `2` for sneaker.\n"),
                codeLabel: "`cross_entropy` definition",
                buildCodeBlock: (_ast) => crossEntropyDefinitionBlock,
            },
            message("W", "Then `softmax` turns predicted scores into probabilities.\n" +
                "`target_probs` is a `Tensor[float][[m]]`, where each element is the probability of the actual item.\n" +
                "We collapse the `Tensor[float][[m]]` into a `float` using `mean`.\n" +
                "But why do we need `log`?"),
            message("D", "It amplifies the loss when our model is confidently wrong.\n" +
                "If a picture is a dress but our probability is `0.00001`, then the logged loss is `9.21`, much larger than a linear penalty."),
            {
                ...message("W", "An example would be helpful."),
                codeLabel: "run `cross_entropy`",
                buildCodeBlock: (_ast) => crossEntropyRunBlock,
                textAfterCode: "It prints `1.589`--the loss for this prediction."
            },
            {
                ...message("D", "Our LeNet is complete!"),
                codeLabel: "`lr` and `LeNet` definition",
                buildCodeBlock: (_ast) => lenetWithLrDefinitionBlock,
                textAfterCode: "`learning_rate` is a hyperparameter. We may tune it for better learning results."
            },
            message("W", "LeNet has a lot of parameters. Is there an easier way to track them?"),
            {
                ...message("D", "Our upcoming model has even more parameters. So yes, we need a better way to organize the parameters.\n" +
                    "Let's start with revamping `linear`."),
                codeLabel: "`LinearParams` and `linear` definition",
                buildCodeBlock: (_ast) => linearWithParamsDefinitionBlock,
                textAfterCode: "Now it's your turn. Revamp `corr2d_multi_in_out`."
            },
            {
                ...message("W", "I see. We are using `class` to pack and hide parameters."),
                codeLabel: "`Corr2dParams` and `corr2d_multi_in_out` definition",
                buildCodeBlock: (_ast) => corr2dWithParamsDefinitionBlock,
                textAfterCode: "Here's the new `corr2d_multi_in_out`."
            },
            message("D", "Next we create a class for LeNet parameters. How many corr2d layers and linears layers are there?"),
            message("W", "Our LeNet has two layers of corr2d and three layers of linear."),
            {
                ...message("D", "So, here are the parameters for LeNet."),
                codeLabel: "`LeNetParams` definition",
                buildCodeBlock: (_ast) => lenetParamsDefinitionBlock,
                textAfterCode: "We pack two parameters for two corr2d layers, and three parameters for three linear layers. " +
                    "We also instantiate the `o`s and `i`s with concrete numbers."
            },
            message("W", "Now we can rework LeNet!"),
            {
                ...message("D", "Yes, here's our final LeNet, with parameters properly organized.*"),
                codeLabel: "`LeNet` definition",
                buildCodeBlock: (_ast) => lenetClassDefinitionBlock,
                textAfterCode: "Now it's time to take a break. In the next chapter, we will build a transformer."
            },
            message("W", "We are here! We are waiting!")
        ],
        notes: "*The code is available at [PyPie's GitHub repository](https://github.com/pypie-lang/pypie-examples/blob/main/models/lenet.py)."
    });
})();
