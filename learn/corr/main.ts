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

    const identifier = (
        name: string,
        role: "fn" | "plain" | "type" | "var",
        type?: string
    ) => ({
        kind: "Identifier",
        name,
        role,
        ...(type === undefined ? {} : { type }),
    });

    const varIdentifier = (name: string, type?: string) => identifier(name, "var", type);
    const intIdentifier = (name: string) => varIdentifier(name, "int");
    const int64Identifier = (name: string) => varIdentifier(name, "int64");
    const fnIdentifier = (name: string, type?: string) => identifier(name, "fn", type);
    const typeIdentifier = (name: string) => identifier(name, "type");
    const numberLiteral = (value: string | number) => ({
        kind: "Number",
        value: String(value),
    });
    const binOp = (left: unknown, op: string, right: unknown) => ({
        kind: "BinOp",
        left,
        op,
        right,
    });
    const callExpr = (callee: unknown, args: unknown[]) => ({
        kind: "Call",
        callee,
        args,
    });
    const listCompExpr = (elt: unknown, target: unknown[], iter: unknown) => ({
        kind: "ListComp",
        elt,
        target,
        iter,
    });
    const assignStmt = (target: unknown, value: unknown) => ({
        kind: "Assign",
        target,
        value,
    });
    const returnStmt = (value: unknown) => ({ kind: "Return", value });
    const argNode = (name: string, annotation: unknown, type?: string) => ({
        kind: "Arg",
        name: varIdentifier(name, type),
        annotation,
    });
    const tensorType = (scalarType: unknown, shapeItems: unknown[]) => ({
        kind: "TypeSubscript",
        base: {
            kind: "TypeSubscript",
            base: typeIdentifier("Tensor"),
            index: scalarType,
        },
        index: {
            kind: "TypeList",
            items: [
                {
                    kind: "TypeList",
                    items: shapeItems,
                },
            ],
        },
    });
    const floatTensorType = (shapeItems: unknown[]) =>
        tensorType(typeIdentifier("float"), shapeItems);
    const functionDef = (
        name: string,
        typeParams: unknown[],
        args: unknown[],
        returns: unknown,
        body: unknown[]
    ) => ({
        kind: "FunctionDef",
        name: fnIdentifier(name),
        typeParams,
        args,
        returns,
        decorator: fnIdentifier("op"),
        body,
    });
    const codeBlock = (body: unknown[]) => ({ kind: "Block", body });
    const classDef = (
        name: string,
        typeParams: unknown[],
        body: unknown[],
        decorator?: unknown
    ) => ({
        kind: "ClassDef",
        name: typeIdentifier(name),
        typeParams,
        body,
        ...(decorator === undefined ? {} : { decorator }),
    });
    const annAssign = (target: unknown, annotation: unknown) => ({
        kind: "AnnAssign",
        target,
        annotation,
    });
    const attrExpr = (value: unknown, name: string, type?: string) => ({
        kind: "Attribute",
        value,
        attr: identifier(name, "plain", type),
    });
    const subscriptExpr = (value: unknown, index: unknown) => ({
        kind: "Subscript",
        value,
        index,
    });
    const sliceExpr = (start: unknown, end: unknown, step?: unknown) => ({
        kind: "Slice",
        start,
        end,
        ...(step === undefined ? {} : { step }),
    });
    const tupleExpr = (elements: unknown[]) => ({ kind: "Tuple", elements });
    const ellipsisExpr = () => ({ kind: "Ellipsis" });
    const exprStmt = (value: unknown) => ({ kind: "ExprStmt", value });
    const genericType = (name: string, args: unknown[]) => ({
        kind: "TypeSubscript",
        base: typeIdentifier(name),
        index: {
            kind: "TypeList",
            items: args,
        },
    });

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

    const pad1dLengthExpr = () =>
        binOp(
            binOp(numberLiteral(2), "*", varIdentifier("padding", "int")),
            "+",
            varIdentifier("w", "int")
        );

    const pad1dDefinitionBlock = codeBlock([
        functionDef(
            "pad1d",
            [typeIdentifier("T"), ...intTypeParams("w")],
            [
                argNode(
                    "xs",
                    tensorType(typeIdentifier("T"), [varIdentifier("w", "int")]),
                    "Tensor[T][[w]]"
                ),
                argNode("padding", typeIdentifier("int"), "int"),
            ],
            tensorType(typeIdentifier("T"), [pad1dLengthExpr()]),
            [
                assignStmt(
                    varIdentifier("side_padding", "Tensor[T][[padding]]"),
                    callExpr(fnIdentifier("replicate", "Tensor[T][[padding]]"), [
                        varIdentifier("padding", "int"),
                        numberLiteral(0),
                    ])
                ),
                returnStmt(
                    callExpr(
                        fnIdentifier("concat", "Tensor[T][[2 * padding + w]]"),
                        [
                            callExpr(
                                fnIdentifier("concat", "Tensor[T][[padding + w]]"),
                                [
                                    varIdentifier("side_padding", "Tensor[T][[padding]]"),
                                    varIdentifier("xs", "Tensor[T][[w]]"),
                                ]
                            ),
                            varIdentifier("side_padding", "Tensor[T][[padding]]"),
                        ]
                    )
                ),
            ]
        ),
    ]);

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

    const pad2dHeightExpr = () =>
        binOp(
            binOp(numberLiteral(2), "*", varIdentifier("padding0", "int")),
            "+",
            varIdentifier("h", "int")
        );

    const pad2dWidthExpr = () =>
        binOp(
            varIdentifier("w", "int"),
            "+",
            binOp(numberLiteral(2), "*", varIdentifier("padding1", "int"))
        );

    const pad2dDefinitionBlock = codeBlock([
        functionDef(
            "pad2d",
            [typeIdentifier("T"), ...intTypeParams("h", "w")],
            [
                argNode(
                    "xs",
                    tensorType(typeIdentifier("T"), [
                        varIdentifier("h", "int"),
                        varIdentifier("w", "int"),
                    ]),
                    "Tensor[T][[h, w]]"
                ),
                argNode("padding0", typeIdentifier("int"), "int"),
                argNode("padding1", typeIdentifier("int"), "int"),
            ],
            tensorType(typeIdentifier("T"), [pad2dHeightExpr(), pad2dWidthExpr()]),
            [
                assignStmt(
                    varIdentifier(
                        "padded_rows",
                        "Tensor[T][[h, w + 2 * padding1]]"
                    ),
                    listCompExpr(
                        callExpr(
                            fnIdentifier("pad1d", "Tensor[T][[w + 2 * padding1]]"),
                            [
                                varIdentifier("row", "Tensor[T][[w]]"),
                                varIdentifier("padding1", "int"),
                            ]
                        ),
                        [varIdentifier("row", "Tensor[T][[w]]")],
                        varIdentifier("xs", "Tensor[T][[h, w]]")
                    )
                ),
                assignStmt(
                    varIdentifier("zero_row", "Tensor[T][[w + 2 * padding1]]"),
                    callExpr(
                        fnIdentifier("replicate", "Tensor[T][[w + 2 * padding1]]"),
                        [pad2dWidthExpr(), numberLiteral(0)]
                    )
                ),
                assignStmt(
                    varIdentifier(
                        "top_bottom",
                        "Tensor[T][[padding0, w + 2 * padding1]]"
                    ),
                    callExpr(
                        fnIdentifier(
                            "replicate",
                            "Tensor[T][[padding0, w + 2 * padding1]]"
                        ),
                        [
                            varIdentifier("padding0", "int"),
                            varIdentifier(
                                "zero_row",
                                "Tensor[T][[w + 2 * padding1]]"
                            ),
                        ]
                    )
                ),
                returnStmt(
                    callExpr(
                        fnIdentifier(
                            "concat",
                            "Tensor[T][[2 * padding0 + h, w + 2 * padding1]]"
                        ),
                        [
                            callExpr(
                                fnIdentifier(
                                    "concat",
                                    "Tensor[T][[padding0 + h, w + 2 * padding1]]"
                                ),
                                [
                                    varIdentifier(
                                        "top_bottom",
                                        "Tensor[T][[padding0, w + 2 * padding1]]"
                                    ),
                                    varIdentifier(
                                        "padded_rows",
                                        "Tensor[T][[h, w + 2 * padding1]]"
                                    ),
                                ]
                            ),
                            varIdentifier(
                                "top_bottom",
                                "Tensor[T][[padding0, w + 2 * padding1]]"
                            ),
                        ]
                    )
                ),
            ]
        ),
    ]);

    const dot2dArgs = () => [
        argNode(
            "s",
            floatTensorType([intIdentifier("m"), intIdentifier("n")]),
            "Tensor[float][[m, n]]"
        ),
        argNode(
            "p",
            floatTensorType([intIdentifier("m"), intIdentifier("n")]),
            "Tensor[float][[m, n]]"
        ),
    ];

    const dot2dIncompleteDefinitionBlock = codeBlock([
        functionDef(
            "dot2d",
            intTypeParams("m", "n"),
            dot2dArgs(),
            typeIdentifier("float"),
            [exprStmt(ellipsisExpr())]
        ),
    ]);

    const dot2dDefinitionBlock = codeBlock([
        functionDef(
            "dot2d",
            intTypeParams("m", "n"),
            dot2dArgs(),
            typeIdentifier("float"),
            [
                returnStmt(
                    callExpr(
                        attrExpr(
                            binOp(
                                varIdentifier("s", "Tensor[float][[m, n]]"),
                                "*",
                                varIdentifier("p", "Tensor[float][[m, n]]")
                            ),
                            "sum",
                            "float"
                        ),
                        [numberLiteral(0), numberLiteral(1)]
                    )
                ),
            ]
        ),
    ]);

    const corr2dHeightType =
        "(((h + (2 * padding0)) - m) + stride0) / stride0";
    const corr2dWidthType =
        "(((w + (2 * padding1)) - n) + stride1) / stride1";
    const corr2dResultType = `Tensor[float][[${corr2dHeightType}, ${corr2dWidthType}]]`;
    const corr2dRank3ResultType =
        `Tensor[float][[c, ${corr2dHeightType}, ${corr2dWidthType}]]`;
    const corr2dSeqHeightType = `Tensor[int64][[${corr2dHeightType}]]`;
    const corr2dSeqWidthType = `Tensor[int64][[${corr2dWidthType}]]`;
    const corr2dPaddedType =
        "Tensor[float][[(padding0 + h) + padding0, w + (2 * padding1)]]";
    const corr2dMultiInOutWidthType =
        "(((width + (2 * padding1)) - n) + stride1) / stride1";
    const corr2dMultiInOutResultType =
        `Tensor[float][[o, ${corr2dHeightType}, ${corr2dMultiInOutWidthType}]]`;

    const corr2dseqHeightEndExpr = () =>
        binOp(
            binOp(
                binOp(
                    intIdentifier("h"),
                    "+",
                    binOp(numberLiteral(2), "*", int64Identifier("padding0"))
                ),
                "-",
                intIdentifier("m")
            ),
            "+",
            int64Identifier("stride0")
        );

    const corr2dseqWidthEndExpr = () =>
        binOp(
            binOp(
                binOp(
                    intIdentifier("w"),
                    "+",
                    binOp(numberLiteral(2), "*", int64Identifier("padding1"))
                ),
                "-",
                intIdentifier("n")
            ),
            "+",
            int64Identifier("stride1")
        );

    const corr2dHeightSpanExpr = () =>
        binOp(corr2dseqHeightEndExpr(), "/", int64Identifier("stride0"));

    const corr2dWidthSpanExpr = () =>
        binOp(corr2dseqWidthEndExpr(), "/", int64Identifier("stride1"));

    const corr2dReturnType = () =>
        floatTensorType([corr2dHeightSpanExpr(), corr2dWidthSpanExpr()]);

    const corr2dSeqWidthCall = () =>
        callExpr(fnIdentifier("seq", corr2dSeqWidthType), [
            numberLiteral(0),
            corr2dseqWidthEndExpr(),
            int64Identifier("stride1"),
        ]);

    const corr2dSeqHeightCall = () =>
        callExpr(fnIdentifier("seq", corr2dSeqHeightType), [
            numberLiteral(0),
            corr2dseqHeightEndExpr(),
            int64Identifier("stride0"),
        ]);

    const corr2dBaseArgs = () => [
        argNode(
            "s",
            floatTensorType([intIdentifier("h"), intIdentifier("w")]),
            "Tensor[float][[h, w]]"
        ),
        argNode(
            "p",
            floatTensorType([intIdentifier("m"), intIdentifier("n")]),
            "Tensor[float][[m, n]]"
        ),
        argNode("stride0", typeIdentifier("int"), "int64"),
        argNode("stride1", typeIdentifier("int"), "int64"),
        argNode("padding0", typeIdentifier("int"), "int64"),
        argNode("padding1", typeIdentifier("int"), "int64"),
    ];

    const corr2dBiasArgs = () => [
        ...corr2dBaseArgs().slice(0, 2),
        argNode("bias", typeIdentifier("float"), "float"),
        ...corr2dBaseArgs().slice(2),
    ];

    const corr2dNoBiasCallArgs = () => [
        varIdentifier("s", "Tensor[float][[h, w]]"),
        varIdentifier("p", "Tensor[float][[m, n]]"),
        int64Identifier("stride0"),
        int64Identifier("stride1"),
        int64Identifier("padding0"),
        int64Identifier("padding1"),
    ];

    const corr2dWindowExpr = () =>
        subscriptExpr(
            varIdentifier("padded", corr2dPaddedType),
            tupleExpr([
                sliceExpr(
                    int64Identifier("j"),
                    binOp(int64Identifier("j"), "+", intIdentifier("m"))
                ),
                sliceExpr(
                    int64Identifier("i"),
                    binOp(int64Identifier("i"), "+", intIdentifier("n"))
                ),
            ])
        );

    const corr2dNoBiasBody = (elt: unknown = callExpr(fnIdentifier("dot2d", "float"), [corr2dWindowExpr(), varIdentifier("p", "Tensor[float][[m, n]]")])) => [
        assignStmt(
            varIdentifier("padded", corr2dPaddedType),
            callExpr(fnIdentifier("pad2d", corr2dPaddedType), [
                varIdentifier("s", "Tensor[float][[h, w]]"),
                int64Identifier("padding0"),
                int64Identifier("padding1"),
            ])
        ),
        returnStmt(
            listCompExpr(
                listCompExpr(elt, [int64Identifier("i")], corr2dSeqWidthCall()),
                [int64Identifier("j")],
                corr2dSeqHeightCall()
            )
        ),
    ];

    const corr2dDefinitionBlock = codeBlock([
        functionDef(
            "corr2d",
            intTypeParams("h", "w", "m", "n"),
            corr2dBaseArgs(),
            corr2dReturnType(),
            corr2dNoBiasBody()
        ),
    ]);

    const corr2dWithBiasDefinitionBlock = codeBlock([
        functionDef(
            "corr2d_with_bias",
            intTypeParams("h", "w", "m", "n"),
            corr2dBiasArgs(),
            corr2dReturnType(),
            [
                returnStmt(
                    binOp(
                        callExpr(
                            fnIdentifier("corr2d", corr2dResultType),
                            corr2dNoBiasCallArgs()
                        ),
                        "+",
                        varIdentifier("bias", "float")
                    )
                ),
            ]
        ),
    ]);

    const corr2dPairDefinitionBlock = codeBlock([
        ...corr2dDefinitionBlock.body,
        { kind: "BlankLine" },
        ...corr2dWithBiasDefinitionBlock.body,
    ]);

    const corr2dMultiInDefinitionBlock = codeBlock([
        functionDef(
            "corr2d_multi_in",
            intTypeParams("c", "h", "w", "m", "n"),
            [
                argNode(
                    "s",
                    floatTensorType([intIdentifier("c"), intIdentifier("h"), intIdentifier("w")]),
                    "Tensor[float][[c, h, w]]"
                ),
                argNode(
                    "p",
                    floatTensorType([intIdentifier("c"), intIdentifier("m"), intIdentifier("n")]),
                    "Tensor[float][[c, m, n]]"
                ),
                argNode("bias", typeIdentifier("float"), "float"),
                argNode("stride0", typeIdentifier("int"), "int64"),
                argNode("stride1", typeIdentifier("int"), "int64"),
                argNode("padding0", typeIdentifier("int"), "int64"),
                argNode("padding1", typeIdentifier("int"), "int64"),
            ],
            corr2dReturnType(),
            [
                returnStmt(
                    binOp(
                        callExpr(
                            attrExpr(
                                callExpr(
                                    fnIdentifier("corr2d", corr2dRank3ResultType),
                                    [
                                        varIdentifier("s", "Tensor[float][[c, h, w]]"),
                                        varIdentifier("p", "Tensor[float][[c, m, n]]"),
                                        int64Identifier("stride0"),
                                        int64Identifier("stride1"),
                                        int64Identifier("padding0"),
                                        int64Identifier("padding1"),
                                    ]
                                ),
                                "sum",
                                corr2dResultType
                            ),
                            [numberLiteral(0)]
                        ),
                        "+",
                        varIdentifier("bias", "float")
                    )
                ),
            ]
        ),
    ]);

    const corr2dMultiInReturnTypeBlock = codeBlock([
        exprStmt(
            floatTensorType([
                intIdentifier("c"),
                corr2dHeightSpanExpr(),
                corr2dWidthSpanExpr(),
            ])
        ),
    ]);

    const corr2dMultiInOutWidthSpanExpr = () =>
        binOp(
            binOp(
                binOp(
                    intIdentifier("width"),
                    "+",
                    binOp(numberLiteral(2), "*", int64Identifier("padding1"))
                ),
                "-",
                intIdentifier("n")
            ),
            "+",
            int64Identifier("stride1")
        );

    const corr2dMultiInOutReturnType = () =>
        floatTensorType([
            intIdentifier("o"),
            corr2dHeightSpanExpr(),
            binOp(corr2dMultiInOutWidthSpanExpr(), "/", int64Identifier("stride1")),
        ]);

    const corr2dMultiInOutFunctionBlock = codeBlock([
        functionDef(
            "corr2d_multi_in_out",
            intTypeParams("o", "i", "h", "width", "m", "n"),
            [
                argNode(
                    "s",
                    floatTensorType([intIdentifier("i"), intIdentifier("h"), intIdentifier("width")]),
                    "Tensor[float][[i, h, width]]"
                ),
                argNode(
                    "w",
                    floatTensorType([
                        intIdentifier("o"),
                        intIdentifier("i"),
                        intIdentifier("m"),
                        intIdentifier("n"),
                    ]),
                    "Tensor[float][[o, i, m, n]]"
                ),
                argNode(
                    "b",
                    floatTensorType([intIdentifier("o")]),
                    "Tensor[float][[o]]"
                ),
                argNode("stride0", typeIdentifier("int"), "int64"),
                argNode("stride1", typeIdentifier("int"), "int64"),
                argNode("padding0", typeIdentifier("int"), "int64"),
                argNode("padding1", typeIdentifier("int"), "int64"),
            ],
            corr2dMultiInOutReturnType(),
            [
                returnStmt(
                    callExpr(
                        fnIdentifier("corr2d_multi_in", corr2dMultiInOutResultType),
                        [
                            varIdentifier("s", "Tensor[float][[i, h, width]]"),
                            varIdentifier("w", "Tensor[float][[o, i, m, n]]"),
                            varIdentifier("b", "Tensor[float][[o]]"),
                            int64Identifier("stride0"),
                            int64Identifier("stride1"),
                            int64Identifier("padding0"),
                            int64Identifier("padding1"),
                        ]
                    )
                ),
            ]
        ),
    ]);

    const corr2dMultiInOutDefinitionBlock = codeBlock([
        ...corr2dMultiInOutFunctionBlock.body,
    ]);

    const pool2dHeightType =
        "(((m + (2 * padding0)) - h) + stride0) / stride0";
    const pool2dWidthType =
        "(((n + (2 * padding1)) - w) + stride1) / stride1";
    const pool2dPaddedType =
        "Tensor[float][[(padding0 + m) + padding0, n + (2 * padding1)]]";
    const pool2dSeqHeightType = `Tensor[int64][[${pool2dHeightType}]]`;
    const pool2dSeqWidthType = `Tensor[int64][[${pool2dWidthType}]]`;

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
                            type: "int64",
                        },
                    },
                },
                op: "-",
                right: {
                    kind: "Identifier",
                    name: "h",
                    role: "var",
                    type: "int64",
                },
            },
            op: "+",
            right: {
                kind: "Identifier",
                name: "stride0",
                role: "var",
                type: "int64",
            },
        },
        op: "/",
        right: {
            kind: "Identifier",
            name: "stride0",
            role: "var",
            type: "int64",
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
                            type: "int64",
                        },
                    },
                },
                op: "-",
                right: {
                    kind: "Identifier",
                    name: "w",
                    role: "var",
                    type: "int64",
                },
            },
            op: "+",
            right: {
                kind: "Identifier",
                name: "stride1",
                role: "var",
                type: "int64",
            },
        },
        op: "/",
        right: {
            kind: "Identifier",
            name: "stride1",
            role: "var",
            type: "int64",
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
                        type: "int64",
                    },
                },
            },
            op: "-",
            right: {
                kind: "Identifier",
                name: "h",
                role: "var",
                type: "int64",
            },
        },
        op: "+",
        right: {
            kind: "Identifier",
            name: "stride0",
            role: "var",
            type: "int64",
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
                        type: "int64",
                    },
                },
            },
            op: "-",
            right: {
                kind: "Identifier",
                name: "w",
                role: "var",
                type: "int64",
            },
        },
        op: "+",
        right: {
            kind: "Identifier",
            name: "stride1",
            role: "var",
            type: "int64",
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
                            name: "h",
                            role: "var",
                            type: "int64",
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
                            type: "int64",
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
                            type: "int64",
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
                            type: "int64",
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
                                                    type: "Tensor[float][[m, n]]",
                                                },
                                                index: {
                                                    kind: "BinOp",
                                                    left: {
                                                        kind: "Identifier",
                                                        name: "j",
                                                        role: "var",
                                                        type: "int64",
                                                    },
                                                    op: "+",
                                                    right: {
                                                        kind: "Identifier",
                                                        name: "x_j",
                                                        role: "var",
                                                        type: "int64",
                                                    },
                                                },
                                            },
                                            index: {
                                                kind: "BinOp",
                                                left: {
                                                    kind: "Identifier",
                                                    name: "i",
                                                    role: "var",
                                                    type: "int64",
                                                },
                                                op: "+",
                                                right: {
                                                    kind: "Identifier",
                                                    name: "x_i",
                                                    role: "var",
                                                    type: "int64",
                                                },
                                            },
                                        },
                                        target: [
                                            {
                                                kind: "Identifier",
                                                name: "i",
                                                role: "var",
                                                type: "int64",
                                            },
                                        ],
                                        iter: {
                                            kind: "Call",
                                            callee: {
                                                kind: "Identifier",
                                                name: "iota",
                                                role: "fn",
                                                type: "Tensor[int64][[w]]",
                                            },
                                            args: [
                                                {
                                                    kind: "Identifier",
                                                    name: "w",
                                                    role: "var",
                                                    type: "int64",
                                                },
                                            ],
                                        },
                                    },
                                    target: [
                                        {
                                            kind: "Identifier",
                                            name: "j",
                                            role: "var",
                                            type: "int64",
                                        },
                                    ],
                                    iter: {
                                        kind: "Call",
                                        callee: {
                                            kind: "Identifier",
                                            name: "iota",
                                            role: "fn",
                                            type: "Tensor[int64][[h]]",
                                        },
                                        args: [
                                            {
                                                kind: "Identifier",
                                                name: "h",
                                                role: "var",
                                                type: "int64",
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
                            name: "h",
                            role: "var",
                            type: "int64",
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
                            type: "int64",
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
                            type: "int64",
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
                            type: "int64",
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
                            type: "int64",
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
                            type: "int64",
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
                            type: pool2dPaddedType,
                        },
                        value: {
                            kind: "Call",
                            callee: {
                                kind: "Identifier",
                                name: "pad2d",
                                role: "fn",
                                type: pool2dPaddedType,
                            },
                            args: [
                                {
                                    kind: "Identifier",
                                    name: "x",
                                    role: "var",
                                    type: "Tensor[float][[m, n]]",
                                },
                                {
                                    kind: "Identifier",
                                    name: "padding0",
                                    role: "var",
                                    type: "int64",
                                },
                                {
                                    kind: "Identifier",
                                    name: "padding1",
                                    role: "var",
                                    type: "int64",
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
                                            type: pool2dPaddedType,
                                        },
                                        {
                                            kind: "Identifier",
                                            name: "h",
                                            role: "var",
                                            type: "int64",
                                        },
                                        {
                                            kind: "Identifier",
                                            name: "w",
                                            role: "var",
                                            type: "int64",
                                        },
                                        {
                                            kind: "Identifier",
                                            name: "j",
                                            role: "var",
                                            type: "int64",
                                        },
                                        {
                                            kind: "Identifier",
                                            name: "i",
                                            role: "var",
                                            type: "int64",
                                        },
                                    ],
                                },
                                target: [
                                    {
                                        kind: "Identifier",
                                        name: "i",
                                        role: "var",
                                        type: "int64",
                                    },
                                ],
                                iter: {
                                    kind: "Call",
                                    callee: {
                                        kind: "Identifier",
                                        name: "seq",
                                        role: "fn",
                                        type: pool2dSeqWidthType,
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
                                            type: "int64",
                                        },
                                    ],
                                },
                            },
                            target: [
                                {
                                    kind: "Identifier",
                                    name: "j",
                                    role: "var",
                                    type: "int64",
                                },
                            ],
                            iter: {
                                kind: "Call",
                                callee: {
                                    kind: "Identifier",
                                    name: "seq",
                                    role: "fn",
                                    type: pool2dSeqHeightType,
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
                                        type: "int64",
                                    },
                                ],
                            },
                        },
                    },
                ],
            },
        ],
    };

    const lenetDefinitionBlock = codeBlock([
        {
            kind: "ImportFrom",
            module: identifier("pypie", "plain"),
            names: [fnIdentifier("larger")],
        },
        { kind: "BlankLine" },
        {
            kind: "ClassDef",
            name: typeIdentifier("LeNet"),
            bases: [typeIdentifier("Model")],
            body: [
                {
                    ...functionDef(
                        "predict",
                        intTypeParams("h", "w"),
                        [
                            argNode(
                                "x",
                                floatTensorType([numberLiteral(1), intIdentifier("h"), intIdentifier("w")]),
                                "Tensor[float][[1, 28, 28]]"
                            ),
                            argNode(
                                "params",
                                genericType("Tuple", [
                                    floatTensorType([
                                        numberLiteral(6),
                                        numberLiteral(1),
                                        numberLiteral(5),
                                        numberLiteral(5),
                                    ]),
                                    floatTensorType([numberLiteral(6)]),
                                    floatTensorType([
                                        numberLiteral(16),
                                        numberLiteral(6),
                                        numberLiteral(5),
                                        numberLiteral(5),
                                    ]),
                                    floatTensorType([numberLiteral(16)]),
                                    ellipsisExpr(),
                                ])
                            ),
                        ],
                        floatTensorType([numberLiteral(10)]),
                        [
                            assignStmt(
                                tupleExpr([
                                    varIdentifier("p1", "Tensor[float][[6, 1, 5, 5]]"),
                                    varIdentifier("b1", "Tensor[float][[6]]"),
                                    varIdentifier("p2", "Tensor[float][[16, 6, 5, 5]]"),
                                    varIdentifier("b2", "Tensor[float][[16]]"),
                                    ellipsisExpr(),
                                ]),
                                varIdentifier("params")
                            ),
                            assignStmt(
                                varIdentifier("layer1", "Tensor[float][[6, 28, 28]]"),
                                callExpr(fnIdentifier("larger", "Tensor[float][[6, 28, 28]]"), [
                                    callExpr(fnIdentifier("corr2d_multi_in_out", "Tensor[float][[6, 28, 28]]"), [
                                        varIdentifier("x", "Tensor[float][[1, 28, 28]]"),
                                        varIdentifier("p1", "Tensor[float][[6, 1, 5, 5]]"),
                                        varIdentifier("b1", "Tensor[float][[6]]"),
                                        numberLiteral(1),
                                        numberLiteral(1),
                                        numberLiteral(2),
                                        numberLiteral(2),
                                    ]),
                                    numberLiteral(0),
                                ])
                            ),
                            assignStmt(
                                varIdentifier("layer2", "Tensor[float][[6, 14, 14]]"),
                                callExpr(fnIdentifier("pool2d", "Tensor[float][[6, 14, 14]]"), [
                                    varIdentifier("layer1", "Tensor[float][[6, 28, 28]]"),
                                    numberLiteral(2),
                                    numberLiteral(2),
                                    numberLiteral(2),
                                    numberLiteral(2),
                                    numberLiteral(0),
                                    numberLiteral(0),
                                ])
                            ),
                            assignStmt(
                                varIdentifier("layer3", "Tensor[float][[16, 10, 10]]"),
                                callExpr(fnIdentifier("larger", "Tensor[float][[16, 10, 10]]"), [
                                    callExpr(fnIdentifier("corr2d_multi_in_out", "Tensor[float][[16, 10, 10]]"), [
                                        varIdentifier("layer2", "Tensor[float][[6, 14, 14]]"),
                                        varIdentifier("p2", "Tensor[float][[16, 6, 5, 5]]"),
                                        varIdentifier("b2", "Tensor[float][[16]]"),
                                        numberLiteral(1),
                                        numberLiteral(1),
                                        numberLiteral(0),
                                        numberLiteral(0),
                                    ]),
                                    numberLiteral(0),
                                ])
                            ),
                            assignStmt(
                                varIdentifier("layer4", "Tensor[float][[16, 5, 5]]"),
                                callExpr(fnIdentifier("pool2d", "Tensor[float][[16, 5, 5]]"), [
                                    varIdentifier("layer3", "Tensor[float][[16, 10, 10]]"),
                                    numberLiteral(2),
                                    numberLiteral(2),
                                    numberLiteral(2),
                                    numberLiteral(2),
                                    numberLiteral(0),
                                    numberLiteral(0),
                                ])
                            ),
                            exprStmt(ellipsisExpr()),
                        ]
                    ),
                    decorator: undefined,
                },
            ],
        },
    ]);

    const corr2dIncompleteDefinitionBlock = codeBlock([
        {
            ...(corr2dDefinitionBlock.body[0] as object),
            body: corr2dNoBiasBody(ellipsisExpr()),
        },
    ]);

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
                                    value: "0",
                                },
                                {
                                    kind: "Number",
                                    value: "1.0",
                                },
                                {
                                    kind: "Number",
                                    value: "0",
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
                                    value: "0",
                                },
                                {
                                    kind: "Number",
                                    value: "1.0",
                                },
                                {
                                    kind: "Number",
                                    value: "0",
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
                "Here's a signal:\n`Tensor([0, 1.0, 0, 0, 0])`.\nLet's check if it contains the pattern\n`Tensor([0, 1.0, 0])`.\n" +
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
            },
            message(
                "W",
                "In our case, `n` is `3`, the length of the pattern. For the first segment of the signal, we have `dot(Tensor([0, 1.0, 0]), Tensor([0, 1.0, 0]))`, which is `1.0`."
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
                "The signal `s` and the pattern `p` are rank-1 tensors, but they may have different shapes. " +
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
                textAfterCode: "It prints `Tensor([1.0, 0, 0])`--three `dot`s for three segments."
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
                    "To use elements more evenly, we can pad the signal before computing `corr1d`.\n" +
                    "`pad1d` builds zero tensors with `replicate`, then uses `concat` to put one on each side of `xs`."
                ),
                codeLabel: "`pad1d` definition",
                buildCodeBlock: (_ast: AstApi) => pad1dDefinitionBlock,
                textAfterCode: "`pad1d` returns `2 * padding + w` elements.\n" +
                    "Extend `corr1d` with !!padding!!. How many elements does it return?"
            },
            {
                ...message(
                    "W",
                    "It returns `2 * padding` additional elements compared to vanilla `corr1d`."
                ),
                codeLabel: "`corr1d_padded` definition",
                buildCodeBlock: (_ast: AstApi) => corr1dPaddedDefinitionBlock,
                textAfterCode: "Running `corr1d_padded(signal, pattern, 1)` gives\n" +
                    "`Tensor([0, 1.0, 0, 0, 0])`;\n" +
                    "and `corr1d_padded(signal, pattern, 2)` gives\n" +
                    "`Tensor([0, 0, 1.0, 0, 0, 0, 0])`.\n" +
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
                    "Here's the template for `corr2d`, which handles padding, strides, and the sliding windows."
                ),
                codeLabel: "`corr2d` definition (incomplete)",
                buildCodeBlock: (_ast: AstApi) => corr2dIncompleteDefinitionBlock,
                textAfterCode: "`j` is the index along `h`, sliding from top to bottom. `i` is the index along `w`, sliding from left to right.\n" +
                    "We need functions for padding and dot products for rank-2 tensors. " +
                    "Define `pad2d` first by reusing `pad1d` on each row, then concatenating zero rows above and below."
            },
            {
                ...message(
                    "W",
                    "How about this? It pads every row left and right, then adds the top and bottom rows with `replicate` and `concat`."
                ),
                codeLabel: "`pad2d` definition",
                buildCodeBlock: (_ast: AstApi) => pad2dDefinitionBlock,
                textAfterCode: "`padding0` controls height padding; `padding1` controls width padding."
            },
            {
                ...message(
                    "D",
                    "Very well.\n" +
                    "Here's the next helper: `dot2d`."
                ),
                codeLabel: "incomplete `dot2d`",
                buildCodeBlock: (_ast: AstApi) => dot2dIncompleteDefinitionBlock,
                textAfterCode: "`dot2d` takes two tensors with the same shape, so `corr2d` can pass the current slice of `s` directly.\n" +
                "Complete `dot2d`."
            },
            {
                ...message(
                    "W",
                    "Like this?"
                ),
                codeLabel: "`dot2d` definition",
                buildCodeBlock: (_ast: AstApi) => dot2dDefinitionBlock,
                textAfterCode: "We multiply the two tensors element-wise, then collapse both dimensions with `sum(0, 1)`."
            },
            {
                ...message(
                    "D",
                    "Exactly. Now we can finish `corr2d`, and make `corr2d_with_bias` the small bias wrapper."
                ),
                codeLabel: "`corr2d` and `corr2d_with_bias` definitions",
                buildCodeBlock: (_ast: AstApi) => corr2dPairDefinitionBlock,
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
                textAfterCode: "But the returned value should be rank-2--does `sum(0)` remove `c`?"
            },
            message(
                "D",
                "Yes. We can specify dimensions for `sum`. Here, `sum` collapses the first dimension, `c`, producing the expected rank-2 tensor."
            ),
            message(
                "W",
                "That is very handy!"
            ),
            {
                ...message(
                    "D",
                    "Next, for multiple output channels, we pass the output-channel weights and biases separately."
                ),
                codeLabel: "`corr2d_multi_in_out` definition",
                buildCodeBlock: (_ast: AstApi) => corr2dMultiInOutDefinitionBlock,
            },
            message(
                "W",
                "I see. `w` stores `o` patterns, and `b` stores one bias for each output channel.\n" +
                "And we can directly reuse `corr2d_multi_in`."
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
                textAfterCode: "`p1` is the pattern tensor for the first round of correlation: it has `1` input channel to match `x`, and `6` output channels. `b1` has one bias per output channel.\n" +
                "`p2` and `b2` do the same for the second round: `6` input channels and `16` output channels.\n"
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
                "Here, we achieve non-linearity by simply replacing negative values with `0`."
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
    });
})();
