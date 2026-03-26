# Website Agent Guidelines

These rules apply to AST objects used in lesson files under `learn/*/main.ts`.

## AST Conversion Rules

1. Use real node kinds, not text-packed identifiers.
2. Never encode full source lines inside `Identifier.name`.
3. Only use `Identifier` for actual identifiers (names in expressions/types), not for layout.
4. Represent imports with `ImportFrom`.
5. Represent class definitions with `ClassDef`.
6. Represent blank lines with `BlankLine`.
7. Represent string literals with `String`.
8. Keep function definitions as `FunctionDef` with structured `Arg`, `TypeSubscript`, and `TypeList`.

## Sloppy Patterns To Avoid

- `ExprStmt` containing `Identifier` with import text such as `from x import y`
- `Identifier` with `name: ""` to fake spacing
- `Identifier` with quoted literals such as `name: "\"n\""`
- `Identifier` containing indented `def`, `class`, `return`, or assignment text

## Role and Type Conventions

- Use `role: "fn"` for callable names.
- Use `role: "type"` for type names.
- Use `role: "var"` for variables.
- Use `role: "plain"` for non-typed plain names (for example module paths and attribute names like `sum`).
- Set `Identifier.type` when variable type hover info is known and useful.

## When A Node Kind Is Missing

1. Add printer support in `code-types.ts` first.
2. Regenerate JS by compiling TypeScript.
3. Then migrate lesson AST objects to the new node kind.

## Quick Validation Checklist

Run these checks after converting a lesson:

```bash
rg -n 'name:\s*"from ' learn/<chapter>/main.ts
rg -n 'name:\s*""' learn/<chapter>/main.ts
rg -n 'name:\s*".*\\".*"' learn/<chapter>/main.ts
node_modules/.bin/tsc --target ES2020 --lib DOM,ES2020 --module none --pretty false --skipLibCheck --noEmitOnError code-types.ts learn/<chapter>/main.ts
```

Expected result:

- No matches for the first three `rg` checks.
- TypeScript compile succeeds with no errors.
