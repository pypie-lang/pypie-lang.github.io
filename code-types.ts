// @ts-nocheck
const DEFAULT_TYPE = "float";
const HOVER_RADIUS = 10;
const MAX_LINE_LENGTH = 80;

const id = (name, role, type) => ({
  kind: "Identifier",
  name,
  role,
  type,
});

const varId = (name, type = DEFAULT_TYPE) => id(name, "var", type);
const fnId = (name, type) => id(name, "fn", type);
const typeId = (name) => id(name, "type");
const plainId = (name, type) => id(name, "plain", type);

const typeList = (items) => ({ kind: "TypeList", items });
const typeSubscript = (base, index) => ({ kind: "TypeSubscript", base, index });

const arg = (name, annotation, type) => ({
  kind: "Arg",
  name: varId(name, type),
  annotation,
});

const funcDef = (name, args, returns, body, options = {}) => ({
  kind: "FunctionDef",
  name: fnId(name),
  args,
  returns,
  body,
  decorator: options.decorator === undefined ? fnId("op") : options.decorator,
  typeParams: options.typeParams,
});

const assign = (target, value) => ({ kind: "Assign", target, value });
const ret = (value) => ({ kind: "Return", value });
const exprStmt = (value) => ({ kind: "ExprStmt", value });
const replInput = (value) => ({ kind: "ReplInput", value });
const replOutput = (value) => ({ kind: "ReplOutput", value });
const replAssign = (target, value) => ({ kind: "ReplAssign", target, value });
const block = (body) => ({ kind: "Block", body });

const attr = (value, name) => ({
  kind: "Attribute",
  value,
  attr: typeof name === "string" ? plainId(name) : name,
});
const call = (callee, args) => ({ kind: "Call", callee, args });
const subscript = (value, index) => ({ kind: "Subscript", value, index });
const sliceExpr = (start, end, step) => ({ kind: "Slice", start, end, step });
const listExpr = (elements) => ({ kind: "List", elements });
const tupleExpr = (elements) => ({ kind: "Tuple", elements });
const listComp = (elt, target, iter) => ({ kind: "ListComp", elt, target, iter });
const binOp = (left, op, right) => ({ kind: "BinOp", left, op, right });
const boolOp = (op, values) => ({ kind: "BoolOp", op, values });
const compare = (left, op, right) => ({ kind: "Compare", left, op, right });
const ifExpr = (body, test, orelse) => ({ kind: "IfExpr", body, test, orelse });
const parenthesized = (value) => ({ kind: "Parenthesized", value });
const ellipsis = () => ({ kind: "Ellipsis" });
const unaryOp = (op, operand) => ({ kind: "UnaryOp", op, operand });
const number = (value) => ({ kind: "Number", value: String(value) });
const noWrap = (value) => ({ kind: "NoWrap", value });

const tensorType = (scalarType, shapeVars) => {
  const base = typeSubscript(typeId("Tensor"), typeId(scalarType));
  const shape = typeList([typeList(shapeVars)]);
  return typeSubscript(base, shape);
};

const typeM = varId("m", "int");
const typeN = varId("n", "int");

const softmaxBlock = {
  kind: "Block",
  body: [
    noWrap(
      funcDef(
        "softmax",
        [arg("x", tensorType("float", [typeN]), "Tensor[float][[n]]")],
        tensorType("float", [typeN]),
        [
          noWrap(
            assign(
              varId("x_exp", "Tensor[float][[n]]"),
              call(attr(varId("x", "Tensor[float][[n]]"), plainId("exp", "Tensor[float][[n]]")), [])
            )
          ),
          noWrap(
            ret(
              binOp(
                varId("x_exp", "Tensor[float][[n]]"),
                "/",
                call(attr(varId("x_exp", "Tensor[float][[n]]"), plainId("sum", "float")), [number(0)])
              )
            )
          ),
        ],
        { typeParams: [typeN] }
      )
    ),
  ],
};

const crossEntropyBlock = {
  kind: "Block",
  body: [
    noWrap(
      funcDef(
        "cross_entropy",
        [
          arg("ys_pred", tensorType("float", [typeM, typeN]), "Tensor[float][[m, n]]"),
          arg("ys", tensorType("int", [typeM]), "Tensor[int][[m]]"),
        ],
        typeId("float"),
        [
          noWrap(
            assign(
              varId("target_probs", "Tensor[float][[m]]"),
              listComp(
                subscript(varId("probs", "Tensor[float][[n]]"), varId("idx", "int")),
                [varId("probs", "Tensor[float][[n]]"), varId("idx", "int")],
                call(plainId("zip"), [
                  call(fnId("softmax", "Tensor[float][[m]]"), [varId("ys_pred", "Tensor[float][[m, n]]")]),
                  varId("ys", "Tensor[int][[m]]"),
                ])
              )
            )
          ),
          noWrap(
              ret(
              unaryOp(
                "-",
                call(
                  attr(
                    call(
                      attr(
                        varId("target_probs", "Tensor[float][[m]]"),
                        plainId("log", "Tensor[float][[m]]")
                      ),
                      []
                    ),
                    plainId("avg", "float")
                  ),
                  [number(0)]
                )
              )
            )
          ),
        ],
        { typeParams: [typeM, typeN] }
      )
    ),
  ],
};

const exampleBlock = {
  kind: "Block",
  body: [
    replAssign(
      varId("pred", "Tensor[float][[2, 3]]"),
      call(typeId("Tensor"), [
        listExpr([
          listExpr([number(2.0), number(5.0), number(-6.0)]),
          listExpr([number(1.0), number(3.0), number(5.1)]),
        ]),
      ])
    ),
    replAssign(
      varId("indices", "Tensor[int][[2]]"),
      call(typeId("Tensor"), [listExpr([number(0), number(2)])])
    ),
      replInput(
        call(plainId("print"), [
          call(fnId("cross_entropy"), [varId("pred", "Tensor[float][[2, 3]]"), varId("indices", "Tensor[int][[2]]")]),
        ])
      ),
    replOutput(number(1.5894)),
  ],
};

const defaultBlocks = [
  { selector: ".hero-code", block: softmaxBlock },
  { selector: ".hero-code-secondary", block: crossEntropyBlock },
  { selector: ".hero-code-example", block: exampleBlock },
];

let activeBlocks = defaultBlocks;

const astApi = {
  id,
  varId,
  fnId,
  typeId,
  plainId,
  typeList,
  typeSubscript,
  arg,
  funcDef,
  assign,
  ret,
  exprStmt,
  replInput,
  replOutput,
  replAssign,
  attr,
  call,
  subscript,
  sliceExpr,
  listExpr,
  tupleExpr,
  listComp,
  binOp,
  boolOp,
  compare,
  ifExpr,
  parenthesized,
  ellipsis,
  unaryOp,
  number,
  noWrap,
  tensorType,
  block,
};

const runtimeWindow = window;
runtimeWindow.PYPIE_AST = astApi;

const escapeHtml = (value) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

class DocBuilder {
  constructor() {
    this.lines = [[]];
    this.indentLevel = 0;
    this.indentText = "    ";
  }

  token(text, className, dataType) {
    if (this.lines.length === 0) {
      this.lines.push([]);
    }
    const line = this.lines[this.lines.length - 1];
    if (line.length === 0) {
      line.push({ text: this.indentText.repeat(this.indentLevel) });
    }
    line.push({ text, className, dataType });
  }

  space() {
    this.token(" ");
  }

  newline() {
    this.lines.push([]);
  }

  indent() {
    this.indentLevel += 1;
  }

  dedent() {
    this.indentLevel = Math.max(0, this.indentLevel - 1);
  }

  currentLineLength() {
    if (this.lines.length === 0) {
      return 0;
    }
    const line = this.lines[this.lines.length - 1];
    return line.reduce(
      (total, segment) => total + String(segment?.text ?? "").length,
      0
    );
  }

  toHtml() {
    const lines = this.lines.slice();
    if (lines.length > 0 && lines[lines.length - 1].length === 0) {
      lines.pop();
    }
    return lines
      .map((line) =>
        line
          .map((segment) => {
            const text = escapeHtml(segment.text);
            if (!segment.className && !segment.dataType) {
              return text;
            }
            const attrs = [];
            if (segment.className) {
              attrs.push(`class=\"${segment.className}\"`);
            }
            if (segment.dataType) {
              attrs.push(`data-type=\"${escapeHtml(segment.dataType)}\"`);
            }
            return `<span ${attrs.join(" ")}>${text}</span>`;
          })
          .join("")
      )
      .join("\n");
  }
}

const estimateIdentifierLength = (node) => String(node?.name ?? "").length;

const unwrapNoWrap = (node) => {
  let current = node;
  let forced = false;

  while (current?.kind === "NoWrap") {
    forced = true;
    current = current.value;
  }

  return { node: current, forced };
};

const estimateTypeLength = (node) => {
  const unwrapped = unwrapNoWrap(node);
  node = unwrapped.node;
  if (!node) {
    return 0;
  }
  if (node.kind === "Identifier") {
    return estimateIdentifierLength(node);
  }
  if (node.kind === "TypeList") {
    const itemsLength = (node.items || []).reduce(
      (sum, item, index) =>
        sum + estimateTypeLength(item) + (index < node.items.length - 1 ? 2 : 0),
      0
    );
    return 1 + itemsLength + 1;
  }
  if (node.kind === "TypeSubscript") {
    const indexLength =
      node.index?.kind === "TypeList"
        ? (node.index.items || []).reduce(
            (sum, item, index) =>
              sum +
              estimateTypeLength(item) +
              (index < node.index.items.length - 1 ? 2 : 0),
            0
          )
        : estimateTypeLength(node.index);
    return estimateTypeLength(node.base) + 1 + indexLength + 1;
  }
  return estimateExprLength(node);
};

const estimateExprLength = (node) => {
  const unwrapped = unwrapNoWrap(node);
  node = unwrapped.node;
  if (!node) {
    return 0;
  }
  switch (node.kind) {
    case "Identifier":
      return estimateIdentifierLength(node);
    case "Attribute":
      return estimateExprLength(node.value) + 1 + estimateIdentifierLength(node.attr);
    case "Call": {
      const argsLength = (node.args || []).reduce(
        (sum, argNode, index) =>
          sum + estimateExprLength(argNode) + (index < node.args.length - 1 ? 2 : 0),
        0
      );
      return estimateExprLength(node.callee) + 1 + argsLength + 1;
    }
    case "Subscript":
      return estimateExprLength(node.value) + 1 + estimateExprLength(node.index) + 1;
    case "Slice": {
      let length = 3; // " : "
      if (node.start) {
        length += estimateExprLength(node.start);
      }
      if (node.end) {
        length += estimateExprLength(node.end);
      }
      if (node.step) {
        length += 1 + estimateExprLength(node.step);
      }
      return length;
    }
    case "List": {
      const itemsLength = (node.elements || []).reduce(
        (sum, element, index) =>
          sum + estimateExprLength(element) + (index < node.elements.length - 1 ? 2 : 0),
        0
      );
      return 1 + itemsLength + 1;
    }
    case "Tuple": {
      const itemsLength = (node.elements || []).reduce(
        (sum, element, index) =>
          sum + estimateExprLength(element) + (index < node.elements.length - 1 ? 2 : 0),
        0
      );
      const trailingComma = node.elements?.length === 1 ? 1 : 0;
      return 1 + itemsLength + trailingComma + 1;
    }
    case "ListComp": {
      const targetLength = (node.target || []).reduce(
        (sum, targetNode, index) =>
          sum + estimateExprLength(targetNode) + (index < node.target.length - 1 ? 2 : 0),
        0
      );
      return (
        1 +
        estimateExprLength(node.elt) +
        5 +
        targetLength +
        4 +
        estimateExprLength(node.iter) +
        1
      );
    }
    case "BinOp":
      return (
        estimateExprLength(node.left) +
        node.op.length +
        2 +
        estimateExprLength(node.right)
      );
    case "BoolOp": {
      const sep = node.op.length + 2;
      return (node.values || []).reduce(
        (sum, valueNode, index) =>
          sum + estimateExprLength(valueNode) + (index < node.values.length - 1 ? sep : 0),
        0
      );
    }
    case "Compare":
      return (
        estimateExprLength(node.left) +
        node.op.length +
        2 +
        estimateExprLength(node.right)
      );
    case "IfExpr":
      return (
        estimateExprLength(node.body) +
        4 +
        estimateExprLength(node.test) +
        6 +
        estimateExprLength(node.orelse)
      );
    case "Parenthesized":
      return estimateExprLength(node.value) + 2;
    case "UnaryOp":
      return node.op.length + estimateExprLength(node.operand);
    case "Number":
      return String(node.value ?? "").length;
    case "String":
      return JSON.stringify(String(node.value ?? "")).length;
    case "Ellipsis":
      return 3;
    default:
      return 0;
  }
};

const estimateArgLength = (argNode) =>
  estimateIdentifierLength(argNode?.name) + 2 + estimateTypeLength(argNode?.annotation);

const wouldOverflow = (builder, trailingLength) =>
  builder.currentLineLength() + trailingLength > MAX_LINE_LENGTH;

const printIdentifier = (builder, node) => {
  const hoverType =
    typeof node.type === "string" && node.type.trim().length > 0
      ? node.type
      : undefined;

  if (node.role === "fn") {
    builder.token(node.name, "fn", hoverType);
  } else if (node.role === "type") {
    builder.token(node.name, "type", hoverType);
  } else if (node.role === "var") {
    builder.token(node.name, "code-var", hoverType || DEFAULT_TYPE);
  } else {
    builder.token(node.name, undefined, hoverType);
  }
};

const printTypeListItems = (builder, items = [], options = {}) => {
  const shouldWrapItems =
    !options?.noWrap && Boolean(options?.multiline) && items.length > 0;

  if (shouldWrapItems) {
    builder.newline();
    builder.indent();
    items.forEach((item, index) => {
      printType(builder, item, { ...options, multiline: "auto" });
      if (index < items.length - 1) {
        builder.token(",");
      }
      builder.newline();
    });
    builder.dedent();
    return;
  }

  items.forEach((item, index) => {
    printType(builder, item, options);
    if (index < items.length - 1) {
      builder.token(",");
      builder.space();
    }
  });
};

const estimateTypeListInlineLength = (items = []) =>
  items.reduce(
    (sum, item, index) =>
      sum + estimateTypeLength(item) + (index < items.length - 1 ? 2 : 0),
    0
  );

const printType = (builder, node, options = {}) => {
  const unwrapped = unwrapNoWrap(node);
  node = unwrapped.node;
  const resolvedOptions = unwrapped.forced
    ? { ...options, multiline: false, noWrap: true }
    : options;
  const forceNoWrap = Boolean(resolvedOptions?.noWrap);
  if (!node) {
    return;
  }
  if (node.kind === "TypeList") {
    const shouldWrapTypeList =
      !forceNoWrap &&
      (resolvedOptions?.multiline === true ||
        (resolvedOptions?.multiline === "auto" &&
          wouldOverflow(builder, estimateTypeListInlineLength(node.items) + 2)));
    builder.token("[");
    printTypeListItems(builder, node.items, {
      ...resolvedOptions,
      multiline: shouldWrapTypeList,
    });
    builder.token("]");
    return;
  }
  if (node.kind === "TypeSubscript") {
    const shouldWrapSubscriptIndex =
      !forceNoWrap &&
      (resolvedOptions?.multiline === true ||
        (resolvedOptions?.multiline === "auto" &&
          wouldOverflow(builder, estimateTypeLength(node))));
    printType(builder, node.base, { ...resolvedOptions, multiline: false });
    builder.token("[");
    if (node.index?.kind === "TypeList") {
      printTypeListItems(builder, node.index.items, {
        ...resolvedOptions,
        multiline: shouldWrapSubscriptIndex,
      });
    } else {
      printType(builder, node.index, { ...resolvedOptions, multiline: false });
    }
    builder.token("]");
    return;
  }
  if (node.kind === "Identifier") {
    printIdentifier(builder, node);
    return;
  }
  if (
    node.kind === "Attribute" ||
    node.kind === "Call" ||
    node.kind === "Subscript" ||
    node.kind === "List" ||
    node.kind === "Tuple" ||
    node.kind === "ListComp" ||
    node.kind === "BinOp" ||
    node.kind === "BoolOp" ||
    node.kind === "Compare" ||
    node.kind === "IfExpr" ||
    node.kind === "Ellipsis" ||
    node.kind === "UnaryOp" ||
    node.kind === "Number" ||
    node.kind === "String" ||
    node.kind === "Slice"
  ) {
    printExpr(builder, node, 0, resolvedOptions);
  }
};

const printTypeParam = (builder, node) => {
  if (!node) {
    return;
  }

  if (node.kind === "Identifier") {
    printIdentifier(builder, node);
  } else {
    printType(builder, node, { multiline: false, noWrap: true });
  }

  if (node.annotation) {
    builder.token(":");
    builder.space();
    printType(builder, node.annotation, { multiline: false, noWrap: true });
    return;
  }

  if (typeof node.type === "string" && node.type.trim().length > 0) {
    builder.token(":");
    builder.space();
    printType(
      builder,
      {
        kind: "Identifier",
        name: node.type.trim(),
        role: "type",
      },
      { multiline: false, noWrap: true }
    );
  }
};

const printTypeParams = (builder, params = []) => {
  if (!Array.isArray(params) || params.length === 0) {
    return;
  }

  builder.token("[");
  params.forEach((paramNode, index) => {
    printTypeParam(builder, paramNode);
    if (index < params.length - 1) {
      builder.token(",");
      builder.space();
    }
  });
  builder.token("]");
};

const getBinOpPrecedence = (op) => {
  switch (op) {
    case "**":
      return 40;
    case "*":
    case "/":
    case "%":
      return 30;
    case "+":
    case "-":
      return 20;
    default:
      return 10;
  }
};

const printExpr = (builder, node, parentPrecedence = 0, options = {}) => {
  const unwrapped = unwrapNoWrap(node);
  node = unwrapped.node;
  const resolvedOptions = unwrapped.forced ? { ...options, noWrap: true } : options;
  const forceNoWrap = Boolean(resolvedOptions.noWrap);

  if (!node) {
    return;
  }

  switch (node.kind) {
    case "Identifier":
      printIdentifier(builder, node);
      return;
    case "Attribute": {
      const valueNode = unwrapNoWrap(node.value).node;
      if (valueNode?.kind === "BinOp" || valueNode?.kind === "UnaryOp") {
        builder.token("(");
        printExpr(builder, node.value, 0, resolvedOptions);
        builder.token(")");
      } else {
        printExpr(builder, node.value, 0, resolvedOptions);
      }
      builder.token(".");
      printIdentifier(builder, node.attr);
      return;
    }
    case "Call": {
      printExpr(builder, node.callee, 0, resolvedOptions);
      builder.token("(");
      const inlineArgsLength = (node.args || []).reduce(
        (sum, argNode, index) =>
          sum + estimateExprLength(argNode) + (index < node.args.length - 1 ? 2 : 0),
        0
      );
      const shouldWrapArgs =
        !forceNoWrap &&
        node.args.length > 0 &&
        wouldOverflow(builder, inlineArgsLength + 1);

      if (shouldWrapArgs) {
        builder.newline();
        builder.indent();
        node.args.forEach((argNode, index) => {
          printExpr(builder, argNode, 0, resolvedOptions);
          if (index < node.args.length - 1) {
            builder.token(",");
          }
          builder.newline();
        });
        builder.dedent();
        builder.token(")");
        return;
      }

      node.args.forEach((argNode, index) => {
        printExpr(builder, argNode, 0, resolvedOptions);
        if (index < node.args.length - 1) {
          builder.token(",");
          builder.space();
        }
      });
      builder.token(")");
      return;
    }
    case "Subscript":
      printExpr(builder, node.value, 0, resolvedOptions);
      builder.token("[");
      printExpr(builder, node.index, 0, resolvedOptions);
      builder.token("]");
      return;
    case "Slice":
      if (node.start) {
        printExpr(builder, node.start, 0, resolvedOptions);
      }
      builder.space();
      builder.token(":");
      builder.space();
      if (node.end) {
        printExpr(builder, node.end, 0, resolvedOptions);
      }
      if (node.step) {
        builder.token(":");
        printExpr(builder, node.step, 0, resolvedOptions);
      }
      return;
    case "List": {
      builder.token("[");
      const inlineElementsLength = (node.elements || []).reduce(
        (sum, element, index) =>
          sum + estimateExprLength(element) + (index < node.elements.length - 1 ? 2 : 0),
        0
      );
      const shouldWrapElements =
        !forceNoWrap &&
        node.elements.length > 0 &&
        wouldOverflow(builder, inlineElementsLength + 1);

      if (shouldWrapElements) {
        builder.newline();
        builder.indent();
        node.elements.forEach((element, index) => {
          printExpr(builder, element, 0, resolvedOptions);
          if (index < node.elements.length - 1) {
            builder.token(",");
          }
          builder.newline();
        });
        builder.dedent();
        builder.token("]");
        return;
      }

      node.elements.forEach((element, index) => {
        printExpr(builder, element, 0, resolvedOptions);
        if (index < node.elements.length - 1) {
          builder.token(",");
          builder.space();
        }
      });
      builder.token("]");
      return;
    }
    case "Tuple": {
      builder.token("(");
      const inlineElementsLength = (node.elements || []).reduce(
        (sum, element, index) =>
          sum + estimateExprLength(element) + (index < node.elements.length - 1 ? 2 : 0),
        0
      );
      const trailingComma = node.elements.length === 1 ? 1 : 0;
      const shouldWrapElements =
        !forceNoWrap &&
        node.elements.length > 0 &&
        wouldOverflow(builder, inlineElementsLength + trailingComma + 1);

      if (shouldWrapElements) {
        builder.newline();
        builder.indent();
        node.elements.forEach((element, index) => {
          printExpr(builder, element, 0, resolvedOptions);
          if (index < node.elements.length - 1 || node.elements.length === 1) {
            builder.token(",");
          }
          builder.newline();
        });
        builder.dedent();
        builder.token(")");
        return;
      }

      node.elements.forEach((element, index) => {
        printExpr(builder, element, 0, resolvedOptions);
        if (index < node.elements.length - 1) {
          builder.token(",");
          builder.space();
        }
      });
      if (node.elements.length === 1) {
        builder.token(",");
      }
      builder.token(")");
      return;
    }
    case "ListComp": {
      builder.token("[");
      if (forceNoWrap) {
        printExpr(builder, node.elt, 0, resolvedOptions);
        builder.space();
        builder.token("for", "kw");
        builder.space();
        node.target.forEach((targetNode, index) => {
          printExpr(builder, targetNode, 0, resolvedOptions);
          if (index < node.target.length - 1) {
            builder.token(",");
            builder.space();
          }
        });
        builder.space();
        builder.token("in", "kw");
        builder.space();
        printExpr(builder, node.iter, 0, resolvedOptions);
      } else {
        builder.newline();
        builder.indent();
        printExpr(builder, node.elt, 0, resolvedOptions);
        builder.newline();
        builder.token("for", "kw");
        builder.space();
        node.target.forEach((targetNode, index) => {
          printExpr(builder, targetNode, 0, resolvedOptions);
          if (index < node.target.length - 1) {
            builder.token(",");
            builder.space();
          }
        });
        builder.space();
        builder.token("in", "kw");
        builder.space();
        printExpr(builder, node.iter, 0, resolvedOptions);
        builder.newline();
        builder.dedent();
      }
      builder.token("]");
      return;
    }
    case "BoolOp": {
      const precedence = 8;
      const shouldWrap = true;
      const inlineLength = estimateExprLength(node);
      const shouldBreakClauses =
        !forceNoWrap &&
        node.op === "and" &&
        Array.isArray(node.values) &&
        node.values.length > 1 &&
        wouldOverflow(builder, inlineLength);

      if (shouldWrap) {
        builder.token("(");
      }

      if (shouldBreakClauses) {
        builder.newline();
        builder.indent();
        node.values.forEach((valueNode, index) => {
          if (index > 0) {
            builder.token(node.op, "kw");
            builder.space();
          }
          printExpr(builder, valueNode, precedence + 1, resolvedOptions);
          builder.newline();
        });
        builder.dedent();
        if (shouldWrap) {
          builder.token(")");
        }
        return;
      }

      node.values.forEach((valueNode, index) => {
        printExpr(builder, valueNode, precedence + 1, resolvedOptions);
        if (index < node.values.length - 1) {
          builder.space();
          if (node.op === "and" || node.op === "or") {
            builder.token(node.op, "kw");
          } else {
            builder.token(node.op, "op");
          }
          builder.space();
        }
      });

      if (shouldWrap) {
        builder.token(")");
      }
      return;
    }
    case "IfExpr": {
      const precedence = 5;
      const shouldWrap = precedence < parentPrecedence;
      const testNode = unwrapNoWrap(node.test).node;
      const shouldBreakBranches =
        !forceNoWrap &&
        testNode?.kind === "BoolOp" &&
        Array.isArray(testNode.values) &&
        testNode.values.length >= 3;
      if (shouldWrap) {
        builder.token("(");
      }

      printExpr(builder, node.body, precedence + 1, resolvedOptions);
      if (shouldBreakBranches) {
        builder.newline();
        builder.token("if", "kw");
        builder.space();
        printExpr(builder, node.test, precedence + 1, resolvedOptions);
        builder.newline();
        builder.token("else", "kw");
        builder.space();
        printExpr(builder, node.orelse, precedence, resolvedOptions);
      } else {
        builder.space();
        builder.token("if", "kw");
        builder.space();
        printExpr(builder, node.test, precedence + 1, resolvedOptions);
        builder.space();
        builder.token("else", "kw");
        builder.space();
        printExpr(builder, node.orelse, precedence, resolvedOptions);
      }

      if (shouldWrap) {
        builder.token(")");
      }
      return;
    }
    case "Parenthesized":
      builder.token("(");
      printExpr(builder, node.value, 0, resolvedOptions);
      builder.token(")");
      return;
    case "Compare": {
      const precedence = 15;
      const shouldWrap = precedence < parentPrecedence;
      if (shouldWrap) {
        builder.token("(");
      }

      printExpr(builder, node.left, precedence + 1, resolvedOptions);
      builder.space();
      builder.token(node.op, "op");
      builder.space();
      printExpr(builder, node.right, precedence + 1, resolvedOptions);

      if (shouldWrap) {
        builder.token(")");
      }
      return;
    }
    case "BinOp": {
      const precedence = getBinOpPrecedence(node.op);
      const shouldWrap = precedence < parentPrecedence;
      if (shouldWrap) {
        builder.token("(");
      }

      const leftPrecedence = node.op === "**" ? precedence + 1 : precedence;
      const rightPrecedence = node.op === "**" ? precedence : precedence + 1;
      printExpr(builder, node.left, leftPrecedence, resolvedOptions);
      builder.space();
      builder.token(node.op, "op");
      builder.space();
      printExpr(builder, node.right, rightPrecedence, resolvedOptions);

      if (shouldWrap) {
        builder.token(")");
      }
      return;
    }
    case "UnaryOp":
      builder.token(node.op, "op");
      printExpr(builder, node.operand, 0, resolvedOptions);
      return;
    case "Number":
      builder.token(node.value, "num");
      return;
    case "String":
      builder.token(JSON.stringify(String(node.value ?? "")));
      return;
    case "Ellipsis":
      builder.token("...");
      return;
    case "TypeSubscript":
    case "TypeList":
      printType(builder, node, { multiline: "auto", ...resolvedOptions });
      return;
    default:
      return;
  }
};

const printStatement = (builder, node, options = {}) => {
  const unwrapped = unwrapNoWrap(node);
  node = unwrapped.node;
  const resolvedOptions = unwrapped.forced ? { ...options, noWrap: true } : options;
  const forceNoWrap = Boolean(resolvedOptions.noWrap);

  if (!node) {
    return;
  }

  switch (node.kind) {
    case "BlankLine":
      builder.newline();
      return;
    case "IndentedBlock": {
      const rawLevel = Number(node.level);
      const level =
        Number.isFinite(rawLevel) && rawLevel >= 0 ? Math.floor(rawLevel) : 1;

      for (let i = 0; i < level; i += 1) {
        builder.indent();
      }

      if (Array.isArray(node.body)) {
        node.body.forEach((stmt) => {
          printStatement(builder, stmt, resolvedOptions);
        });
      } else if (node.body) {
        printStatement(builder, node.body, resolvedOptions);
      }

      for (let i = 0; i < level; i += 1) {
        builder.dedent();
      }

      return;
    }
    case "ImportFrom":
      builder.token("from", "kw");
      builder.space();
      printIdentifier(builder, node.module);
      builder.space();
      builder.token("import", "kw");
      builder.space();
      node.names.forEach((nameNode, index) => {
        printIdentifier(builder, nameNode);
        if (index < node.names.length - 1) {
          builder.token(",");
          builder.space();
        }
      });
      builder.newline();
      return;
    case "ClassDef":
      builder.token("class", "kw");
      builder.space();
      printIdentifier(builder, node.name);
      printTypeParams(builder, node.typeParams);
      if (Array.isArray(node.bases) && node.bases.length > 0) {
        builder.token("(");
        node.bases.forEach((baseNode, index) => {
          printExpr(builder, baseNode, 0, resolvedOptions);
          if (index < node.bases.length - 1) {
            builder.token(",");
            builder.space();
          }
        });
        builder.token(")");
      }
      builder.token(":");
      builder.newline();
      builder.indent();
      if (Array.isArray(node.body) && node.body.length > 0) {
        node.body.forEach((stmt) => {
          printStatement(builder, stmt, resolvedOptions);
        });
      } else {
        builder.token("pass", "kw");
        builder.newline();
      }
      builder.dedent();
      return;
    case "FunctionDef":
      if (node.decorator) {
        builder.token("@", "op");
        printIdentifier(builder, node.decorator);
        builder.newline();
      }
      builder.token("def", "kw");
      builder.space();
      printIdentifier(builder, node.name);
      printTypeParams(builder, node.typeParams);
      builder.token("(");
      const inlineArgsLength = (node.args || []).reduce(
        (sum, argNode, index) =>
          sum + estimateArgLength(argNode) + (index < node.args.length - 1 ? 2 : 0),
        0
      );
      const returnSuffixLength = 1 + 4 + estimateTypeLength(node.returns) + 1;
      const shouldWrapArgs =
        !forceNoWrap &&
        node.args.length > 0 &&
        wouldOverflow(builder, inlineArgsLength + returnSuffixLength);

      if (shouldWrapArgs) {
        builder.newline();
        builder.indent();
        node.args.forEach((argNode, index) => {
          printIdentifier(builder, argNode.name);
          builder.token(":");
          builder.space();
          printType(builder, argNode.annotation, {
            multiline: "auto",
            noWrap: forceNoWrap,
          });
          if (index < node.args.length - 1) {
            builder.token(",");
          }
          builder.newline();
        });
        builder.dedent();
      } else {
        node.args.forEach((argNode, index) => {
          printIdentifier(builder, argNode.name);
          builder.token(":");
          builder.space();
          printType(builder, argNode.annotation, {
            multiline: "auto",
            noWrap: forceNoWrap,
          });
          if (index < node.args.length - 1) {
            builder.token(",");
            builder.space();
          }
        });
      }
      builder.token(")");
      builder.space();
      builder.token("->", "op");
      builder.space();
      printType(builder, node.returns, { multiline: "auto", noWrap: forceNoWrap });
      builder.token(":");
      builder.newline();
      builder.indent();
      node.body.forEach((stmt) => {
        printStatement(builder, stmt, resolvedOptions);
      });
      builder.dedent();
      return;
    case "Assign":
      printExpr(builder, node.target, 0, resolvedOptions);
      builder.space();
      builder.token("=", "op");
      builder.space();
      printExpr(builder, node.value, 0, resolvedOptions);
      builder.newline();
      return;
    case "AnnAssign":
      printExpr(builder, node.target, 0, resolvedOptions);
      builder.token(":");
      builder.space();
      printType(builder, node.annotation, {
        multiline: "auto",
        noWrap: forceNoWrap,
      });
      builder.newline();
      return;
    case "ReplAssign":
      builder.token(">", "op");
      builder.space();
      printExpr(builder, node.target, 0, resolvedOptions);
      builder.space();
      builder.token("=", "op");
      builder.space();
      printExpr(builder, node.value, 0, resolvedOptions);
      builder.newline();
      return;
    case "Return":
      builder.token("return", "kw");
      builder.space();
      printExpr(builder, node.value, 0, resolvedOptions);
      builder.newline();
      return;
    case "ExprStmt":
      printExpr(builder, node.value, 0, resolvedOptions);
      builder.newline();
      return;
    case "ReplInput":
      builder.token(">", "op");
      builder.space();
      printExpr(builder, node.value, 0, resolvedOptions);
      builder.newline();
      return;
    case "ReplOutput":
      printExpr(builder, node.value, 0, resolvedOptions);
      builder.newline();
      return;
    default:
      return;
  }
};

const renderBlocks = () => {
  activeBlocks.forEach(({ selector, block }) => {
    const element = document.querySelector(selector);
    if (!element) {
      return;
    }
    const builder = new DocBuilder();
    block.body.forEach((stmt) => {
      printStatement(builder, stmt);
    });
    element.innerHTML = builder.toHtml();
  });
};

runtimeWindow.PYPIE_SET_BLOCKS = (nextBlocks) => {
  activeBlocks = Array.isArray(nextBlocks) ? nextBlocks : [];
  renderBlocks();
  rebuildMap();
};

const positionTypeMap = new Map();
let rectEntries = [];

const getPosKey = (rect) => {
  const left = Math.round(rect.left);
  const top = Math.round(rect.top);
  const width = Math.round(rect.width);
  const height = Math.round(rect.height);
  return `${left}:${top}:${width}:${height}`;
};

const rebuildMap = () => {
  positionTypeMap.clear();
  rectEntries = [];
  const vars = document.querySelectorAll("[data-type]");
  vars.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const key = getPosKey(rect);
    const dataType = el.getAttribute("data-type") || DEFAULT_TYPE;
    positionTypeMap.set(key, dataType);
    rectEntries.push({ rect, key });
  });
};

const findTypeAt = (x, y) => {
  for (const entry of rectEntries) {
    const rect = entry.rect;
    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
      return positionTypeMap.get(entry.key) || DEFAULT_TYPE;
    }
  }
  let nearest = null;
  let nearestDist = Infinity;
  for (const entry of rectEntries) {
    const rect = entry.rect;
    const cx = (rect.left + rect.right) / 2;
    const cy = (rect.top + rect.bottom) / 2;
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.hypot(dx, dy);
    if (dist < nearestDist) {
      nearestDist = dist;
      nearest = entry;
    }
  }
  if (nearest && nearestDist <= HOVER_RADIUS) {
    return positionTypeMap.get(nearest.key) || DEFAULT_TYPE;
  }
  return null;
};

const tooltip = document.querySelector(".code-type-tooltip");
const hoverSurfaces = Array.from(
  document.querySelectorAll(".hero, [data-code-surface]")
);

const isPointInsideRect = (x, y, rect) =>
  x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

const isInsideAnyHoverSurface = (x, y) =>
  hoverSurfaces.some((surface) => isPointInsideRect(x, y, surface.getBoundingClientRect()));

if (tooltip && hoverSurfaces.length > 0) {
  const show = (x, y, type) => {
    tooltip.textContent = type;
    tooltip.style.opacity = "1";
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
  };

  const hide = () => {
    tooltip.style.opacity = "0";
  };

  let rebuildQueued = false;
  const scheduleMapRebuild = () => {
    if (rebuildQueued) {
      return;
    }
    rebuildQueued = true;
    requestAnimationFrame(() => {
      rebuildQueued = false;
      rebuildMap();
    });
  };

  const handleMove = (event) => {
    if (!isInsideAnyHoverSurface(event.clientX, event.clientY)) {
      hide();
      return;
    }

    const type = findTypeAt(event.clientX, event.clientY);
    if (type) {
      show(event.clientX, event.clientY, type);
      return;
    }

    hide();
  };

  const rebuildAndSync = () => {
    renderBlocks();
    rebuildMap();
  };

  const handleScroll = () => {
    hide();
    scheduleMapRebuild();
  };

  window.addEventListener("resize", rebuildAndSync);
  window.addEventListener("load", rebuildAndSync);
  window.addEventListener("scroll", handleScroll, { passive: true });
  document.addEventListener("scroll", handleScroll, { passive: true, capture: true });

  document.addEventListener("mousemove", handleMove);
  hoverSurfaces.forEach((surface) => surface.addEventListener("mouseleave", hide));

  if (document.fonts && "ready" in document.fonts) {
    document.fonts.ready.then(rebuildAndSync);
  }

  requestAnimationFrame(rebuildAndSync);
}
