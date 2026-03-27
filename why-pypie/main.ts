(() => {
    type ManualPageMeta = {
        id?: string;
        slug: string;
        title: string;
        navTitle?: string;
    };

    type ManualSeries = {
        title: string;
        pages: ManualPageMeta[];
    };

    type ManualSectionContent = {
        prose?: string;
        code?: string;
        codeClass?: string;
        codeLabel?: string;
    };

    type ManualSection = {
        id?: string;
        title: string;
        body?: string;
        prose?: string;
        code?: string;
        codeClass?: string;
        codeLabel?: string;
        content?: ManualSectionContent[];
    };

    type ManualPageConfig = {
        id: string;
        title: string;
        lead: string;
        intro?: string;
        sections: ManualSection[];
        series?: ManualSeries;
    };

    type BenchmarkColumn = {
        key: string;
        label: string;
    };

    type BenchmarkColumnGroup = {
        label: string;
        columns: BenchmarkColumn[];
    };

    type BenchmarkRow = {
        label: string;
        values: Record<string, string>;
    };

    type BenchmarkTableData = {
        rowHeaderLabel: string;
        columnGroups: BenchmarkColumnGroup[];
        rows: BenchmarkRow[];
    };

    type ManualRender = (config: ManualPageConfig) => void;

    type ManualWindow = Window & {
        PYPIE_MANUAL_RENDER?: ManualRender;
    };

    const BENCHMARK_SECTION_DOM_ID = "why-pypie-benchmarks";
    const BENCHMARK_STYLE_ID = "why-pypie-benchmark-table-styles";
    const BENCHMARK_DATA_SCRIPT_ID = "why-pypie-benchmarks-data";

    const isRecord = (value: unknown): value is Record<string, unknown> =>
        typeof value === "object" && value !== null;

    const normalizeBenchmarkCell = (value: unknown): string => {
        if (typeof value === "string" && value.trim().length > 0) {
            return value;
        }

        if (typeof value === "number" && Number.isFinite(value)) {
            return String(value);
        }

        return "—";
    };

    const parseBenchmarkColumns = (value: unknown): BenchmarkColumn[] => {
        if (!Array.isArray(value)) {
            return [];
        }

        return value
            .map((column): BenchmarkColumn | null => {
                if (!isRecord(column) || typeof column.key !== "string" || typeof column.label !== "string") {
                    return null;
                }

                const key = column.key.trim();
                const label = column.label.trim();
                if (key.length === 0 || label.length === 0) {
                    return null;
                }

                return { key, label };
            })
            .filter((column): column is BenchmarkColumn => column !== null);
    };

    const parseBenchmarkTableData = (value: unknown): BenchmarkTableData | null => {
        if (!isRecord(value) || !Array.isArray(value.rows)) {
            return null;
        }

        const columnGroups = Array.isArray(value.columnGroups)
            ? value.columnGroups
                .map((group): BenchmarkColumnGroup | null => {
                    if (
                        !isRecord(group) ||
                        typeof group.label !== "string" ||
                        !Array.isArray(group.columns)
                    ) {
                        return null;
                    }

                    const label = group.label.trim();
                    const columns = parseBenchmarkColumns(group.columns);
                    if (label.length === 0 || columns.length === 0) {
                        return null;
                    }

                    return { label, columns };
                })
                .filter((group): group is BenchmarkColumnGroup => group !== null)
            : [];

        const fallbackColumns =
            columnGroups.length === 0 && Array.isArray(value.columns) ? parseBenchmarkColumns(value.columns) : [];
        const normalizedColumnGroups =
            columnGroups.length > 0 ? columnGroups : fallbackColumns.length > 0 ? [{ label: "", columns: fallbackColumns }] : [];
        const columns = normalizedColumnGroups.flatMap((group) => group.columns);

        const rows = value.rows
            .map((row): BenchmarkRow | null => {
                if (!isRecord(row) || typeof row.label !== "string" || !isRecord(row.values)) {
                    return null;
                }

                const label = row.label.trim();
                if (label.length === 0) {
                    return null;
                }

                const values: Record<string, string> = {};
                columns.forEach((column) => {
                    values[column.key] = normalizeBenchmarkCell(row.values[column.key]);
                });

                return { label, values };
            })
            .filter((row): row is BenchmarkRow => row !== null);

        if (normalizedColumnGroups.length === 0 || columns.length === 0 || rows.length === 0) {
            return null;
        }

        const rowHeaderLabel =
            typeof value.rowHeaderLabel === "string" && value.rowHeaderLabel.trim().length > 0
                ? value.rowHeaderLabel.trim()
                : "Workload";

        return {
            rowHeaderLabel,
            columnGroups: normalizedColumnGroups,
            rows,
        };
    };

    const ensureBenchmarkTableStyles = (): void => {
        if (document.getElementById(BENCHMARK_STYLE_ID)) {
            return;
        }

        const style = document.createElement("style");
        style.id = BENCHMARK_STYLE_ID;
        style.textContent = `
            .why-pypie-benchmark-table {
                margin-top: 1rem;
            }
            .why-pypie-benchmark-table__scroll {
                overflow-x: auto;
                border: 1px solid var(--panel-border);
                border-radius: 14px;
                background: var(--section-bg);
            }
            .why-pypie-benchmark-table__table {
                width: 100%;
                min-width: 42rem;
                border-collapse: collapse;
            }
            .why-pypie-benchmark-table__table th,
            .why-pypie-benchmark-table__table td {
                padding: 0.85rem 1rem;
                border-bottom: 1px solid var(--panel-border);
            }
            .why-pypie-benchmark-table__table thead th {
                font-size: 0.74rem;
                letter-spacing: 0.08em;
                text-transform: uppercase;
                color: var(--muted-text);
                background: var(--panel-bg);
                white-space: nowrap;
                text-align: center;
                vertical-align: middle;
            }
            .why-pypie-benchmark-table__workload-header {
                text-align: left !important;
            }
            .why-pypie-benchmark-table__table tbody th {
                text-align: left;
                font-weight: 600;
                min-width: 18rem;
                white-space: pre-line;
                overflow-wrap: anywhere;
            }
            .why-pypie-benchmark-table__table tbody td {
                text-align: right;
                white-space: pre-line;
                overflow-wrap: anywhere;
                font-family: "IBM Plex Mono", "Courier New", monospace;
            }
            .why-pypie-benchmark-table__table tbody tr:last-child th,
            .why-pypie-benchmark-table__table tbody tr:last-child td {
                border-bottom: 0;
            }
            .why-pypie-benchmark-status {
                margin-top: 1rem;
                color: var(--muted-text);
            }
        `;
        document.head.appendChild(style);
    };

    const clearBenchmarkSectionContent = (section: HTMLElement): void => {
        section
            .querySelectorAll(".why-pypie-benchmark-table, .why-pypie-benchmark-status")
            .forEach((node) => node.remove());
    };

    const appendBenchmarkStatus = (section: HTMLElement, message: string): void => {
        const status = document.createElement("p");
        status.className = "manual-prose why-pypie-benchmark-status";
        status.textContent = message;
        section.appendChild(status);
    };

    const buildBenchmarkTable = (data: BenchmarkTableData): HTMLElement => {
        const wrapper = document.createElement("div");
        wrapper.className = "why-pypie-benchmark-table";

        const scroll = document.createElement("div");
        scroll.className = "why-pypie-benchmark-table__scroll";

        const table = document.createElement("table");
        table.className = "why-pypie-benchmark-table__table";

        const columns = data.columnGroups.flatMap((group) => group.columns);
        const showGroupedHeader = data.columnGroups.length > 1 && data.columnGroups.every((group) => group.label.length > 0);
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        const labelHeader = document.createElement("th");
        labelHeader.scope = "col";
        labelHeader.className = "why-pypie-benchmark-table__workload-header";
        labelHeader.textContent = data.rowHeaderLabel;
        if (showGroupedHeader) {
            labelHeader.rowSpan = 2;
        }
        headerRow.appendChild(labelHeader);

        if (showGroupedHeader) {
            data.columnGroups.forEach((group) => {
                const th = document.createElement("th");
                th.scope = "colgroup";
                th.colSpan = group.columns.length;
                th.textContent = group.label;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);

            const subheaderRow = document.createElement("tr");
            columns.forEach((column) => {
                const th = document.createElement("th");
                th.scope = "col";
                th.textContent = column.label;
                subheaderRow.appendChild(th);
            });
            thead.appendChild(subheaderRow);
        } else {
            columns.forEach((column) => {
                const th = document.createElement("th");
                th.scope = "col";
                th.textContent = column.label;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
        }
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        data.rows.forEach((row) => {
            const tr = document.createElement("tr");

            const rowHeader = document.createElement("th");
            rowHeader.scope = "row";
            rowHeader.textContent = row.label;
            tr.appendChild(rowHeader);

            columns.forEach((column) => {
                const td = document.createElement("td");
                td.textContent = row.values[column.key] || "—";
                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        scroll.appendChild(table);
        wrapper.appendChild(scroll);
        return wrapper;
    };

    const getEmbeddedBenchmarkTableData = (): BenchmarkTableData | null => {
        const dataNode = document.getElementById(BENCHMARK_DATA_SCRIPT_ID);
        if (!(dataNode instanceof HTMLScriptElement) || dataNode.textContent === null) {
            return null;
        }

        try {
            return parseBenchmarkTableData(JSON.parse(dataNode.textContent));
        } catch (_error) {
            return null;
        }
    };

    const renderBenchmarks = (): void => {
        const section = document.getElementById(BENCHMARK_SECTION_DOM_ID);
        if (!(section instanceof HTMLElement)) {
            return;
        }

        ensureBenchmarkTableStyles();
        clearBenchmarkSectionContent(section);

        const data = getEmbeddedBenchmarkTableData();
        if (data) {
            section.appendChild(buildBenchmarkTable(data));
            return;
        }

        appendBenchmarkStatus(section, "Benchmark data is currently unavailable.");
    };

    const render = (window as ManualWindow).PYPIE_MANUAL_RENDER;
    if (typeof render !== "function") {
        return;
    }

    render({
        id: "",
        title: "",
        lead: "",
        intro: "What if a natural Python program could run nearly as fast as a hand-optimized CUDA kernel on a GPU, while offering Haskell-like type rigor? " +
        "We are not there yet, but we believe PyPie can make this possible.",
        series: {
            title: "",
            pages: [
                {
                    id: "why-pypie",
                    slug: "../why-pypie/index.html",
                    title: "Why PyPie?",
                    navTitle: "0. Why PyPie?",
                },
            ],
        },
        sections: [
            {
                title: "Python syntax, Python spirit",
                prose: "PyPie is embedded in normal Python code. More than just looking like Python, PyPie encourages Pythonic idioms: " +
                "the program stays concise, simple, and high-level. To run fast on GPU, you don't need to think about threads, blocks, or warps. " +
                "You may just write the pleasantly comprehensible math, and let the compiler make it efficient."
            },
            {
                title: "Just the right amount of type safety",
                prose: "PyPie enables a quick and reliable validation. We have built a full dependent type checker to power " +
                "this validation. The type checker is extended with automation tailored for tensor programming, so you still write programs, not proofs. For example, PyPie knows " +
                "`x + y == y + x` and `y / 1 == y`, while most other dependent type languages require additional, explicit proofs."
            },
            {
                title: "Where are we?",
                prose: "We have completed stage 1: the DSL and the type checker. With the DSL, you may describe tensor transformations with simplicity and clarity. " +
                "With the type checker, you may catch shape mismatches before running the program.\n\n" +
                "PyPie elaborates its DSL to [Futhark](https://futhark-lang.org/) programs for fusion, parallelization, and automatic differentiation. " +
                "The generated CUDA programs are runnable but significantly worse than their highly optimized PyTorch counterparts, " +
                "especially when matmul is involved, as shown in the benchmarks below. " +
                "So, we are in stage 2: making the generated code run faster, to compete with hand-optimized kernels."
            },
            {
                id: "benchmarks",
                title: "Benchmarks",
                prose: "Tested on RTX 5090, with the models in our tutorial: LeNet ([PyPie](https://github.com/pypie-lang/pypie-examples/blob/master/models/lenet.py) vs [PyTorch](https://github.com/pypie-lang/pypie-examples/blob/master/models/pytorch_benchmark/lenet.py)) and the LittleTransformer ([PyPie](https://github.com/pypie-lang/pypie-examples/blob/master/models/transformer.py) vs [PyTorch](https://github.com/pypie-lang/pypie-examples/blob/master/models/pytorch_benchmark/transformer.py))."
            }
        ],
    });

    renderBenchmarks();

    const nav = document.querySelector<HTMLElement>("[data-manual-nav]");
    if (nav) {
        nav.innerHTML = "";
        nav.setAttribute("aria-hidden", "true");
        nav.style.background = "transparent";
        nav.style.border = "0";
        nav.style.padding = "0";
        nav.style.marginLeft = "0";
        nav.style.pointerEvents = "none";
    }

    const eyebrow = document.querySelector<HTMLElement>("[data-manual-eyebrow]");
    if (eyebrow) {
        eyebrow.textContent = "";
        eyebrow.hidden = true;
    }
})();
