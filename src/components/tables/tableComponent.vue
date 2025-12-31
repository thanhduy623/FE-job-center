<template>
    <div class="table-wrapper">
        <!-- Tìm kiếm toàn bảng -->
        <div class="search-reset flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
            <input v-model="searchText" type="text" placeholder="Tìm kiếm..." class="search-input flex-1 mb-2" />
            <!-- <button @click="resetAll" class="reset-btn">{{ $t('reset') }}</button> -->
        </div>

        <!-- Container cuộn ngang cho mobile -->
        <div class="table-container">
            <table class="custom-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th v-for="col in nonActionColumns" :key="col.key" @click="toggleSort(col.key)"
                            class="cursor-pointer select-none sortable">
                            <span v-if="sortBy === col.key">
                                {{ sortOrder === 'asc' ? '▲' : '▼' }}
                            </span>
                            {{ $t(col.label) }}
                        </th>
                        <th v-if="actionColumns.length">{{ $t('action') }}</th>
                    </tr>
                    <tr class="filter-row">
                        <th></th>
                        <th v-for="col in nonActionColumns" :key="col.key">
                            <input v-model="columnFilters[col.key]" type="text" placeholder="Lọc..."
                                class="filter-input" />
                        </th>
                        <th v-if="actionColumns.length"></th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="(row, rowIndex) in filteredRows" :key="rowIndex" class="hover-row">
                        <td>{{ rowIndex + 1 }}</td>
                        <td v-for="col in nonActionColumns" :key="col.key">{{ row[col.key] }}</td>
                        <td v-if="actionColumns.length" class="action-buttons">
                            <button v-for="(act, ai) in actionColumns" :key="ai" class="table-btn" :title="act.label"
                                @click="handleAction(act, row, rowIndex)">
                                <span v-if="act.icon">{{ act.icon }}</span>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TableComponent",
        props: {
            rows: { type: Array, required: true },
            columns: { type: Array, required: true },
        },
        emits: ["update:rows"],
        data() {
            return {
                localRows: [...this.rows],
                searchText: "",
                columnFilters: {},
                sortBy: null,
                sortOrder: "asc",
            };
        },
        computed: {
            nonActionColumns() {
                return this.columns.filter((c) => !c.actions);
            },
            actionColumns() {
                return this.columns.find((c) => c.actions)?.actions || [];
            },
            filteredRows() {
                let result = [...this.localRows];

                if (this.searchText.trim()) {
                    const keyword = this.searchText.toLowerCase();
                    result = result.filter((row) =>
                        this.nonActionColumns.some((col) =>
                            String(row[col.key] || "").toLowerCase().includes(keyword)
                        )
                    );
                }

                for (const [key, value] of Object.entries(this.columnFilters)) {
                    if (value && value.trim()) {
                        const keyword = value.toLowerCase();
                        result = result.filter((row) =>
                            String(row[key] || "").toLowerCase().includes(keyword)
                        );
                    }
                }

                if (this.sortBy) {
                    result.sort((a, b) => {
                        const valA = a[this.sortBy];
                        const valB = b[this.sortBy];
                        if (valA < valB) return this.sortOrder === "asc" ? -1 : 1;
                        if (valA > valB) return this.sortOrder === "asc" ? 1 : -1;
                        return 0;
                    });
                }

                return result;
            },
        },
        watch: {
            rows: {
                handler(newVal) {
                    this.localRows = [...newVal];
                },
                deep: true,
                immediate: true,
            },
        },
        methods: {
            handleAction(action, row, rowIndex) {
                if (typeof action.func === "function") {
                    action.func(row, rowIndex, this.localRows);
                }
                this.$emit("update:rows", this.localRows);
            },
            toggleSort(key) {
                if (this.sortBy === key) {
                    this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
                } else {
                    this.sortBy = key;
                    this.sortOrder = "asc";
                }
            },
            resetAll() {
                this.searchText = "";
                this.columnFilters = {};
                this.sortBy = null;
                this.sortOrder = "asc";
            },
        },
    };
</script>

<style scoped>
    .table-wrapper {
        width: 100%;
        padding: 0.5rem;
        box-sizing: border-box;
    }

    .search-input {
        padding: 0.5rem;
        border-radius: 6px;
        border: 1px solid #ccc;
        flex: 1;
        margin-bottom: 0;
    }

    .table-container {
        overflow-x: auto;
        border-radius: 8px;
    }

    .custom-table thead tr:first-child {
        color: #fff;
    }

    /* Filter row */
    .filter-row {
        background-color: #f9fafb;
    }

    .filter-input {
        width: 100%;
        padding: 0.35rem;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        font-size: 0.85rem;
    }

    /* Sortable columns */
    .sortable {
        user-select: none;
    }

    .custom-table thead th:last-child {
        text-align: center;
        vertical-align: middle;
        min-width: 120px;
        width: auto;
    }

    /* Action buttons */
    .action-buttons {
        display: flex;
        gap: 0.25rem;
        justify-content: center;
    }

    .table-btn {
        padding: 0.3rem 0.5rem;
        border-radius: 6px;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 0.9rem;
        background-color: var(--color-secondary);
        /* background-color: var(--color-gray-300); */
    }

    .table-btn:hover {
        background-color: var(--color-primary);
    }

    /* Responsive overrides */
    @media (max-width: 768px) {
        .table-btn {
            padding: 0.25rem 0.35rem;
            font-size: 0.75rem;
        }

        .custom-table th,
        .custom-table td {
            padding: 0.5rem 0.75rem;
        }
    }

    @media (max-width: 480px) {

        .custom-table th,
        .custom-table td {
            padding: 0.4rem 0.5rem;
            font-size: 0.75rem;
        }

        .filter-input {
            font-size: 0.7rem;
        }
    }
</style>