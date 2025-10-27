<template>
    <div>
        <!-- Tìm kiếm toàn bảng -->
        <div class="flex flex-row wrap gap-1 mb-2">
            <input v-model="searchText" type="text" placeholder="Tìm kiếm..." class="flex-1" />
            <button @click="resetAll">{{ $t('reset') }}</button>
        </div>

        <!-- Container cuộn ngang -->
        <div class="table-container">
            <table class="custom-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th v-for="col in nonActionColumns" :key="col.key" @click="toggleSort(col.key)"
                            class="cursor-pointer select-none">
                            <span v-if="sortBy === col.key">
                                {{ sortOrder === 'asc' ? '▲' : '▼' }}
                            </span>
                            {{ $t(col.label) }}
                        </th>
                        <th v-if="actionColumns.length" v-t="'action'"></th>
                    </tr>

                    <!-- Bộ lọc theo từng cột -->
                    <tr>
                        <th></th>
                        <th v-for="col in nonActionColumns" :key="col.key">
                            <input v-model="columnFilters[col.key]" type="text" placeholder="Lọc..." class="w-full" />
                        </th>
                        <th v-if="actionColumns.length"></th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="(row, rowIndex) in filteredRows" :key="rowIndex" class="hover:bg-gray-50">
                        <td>{{ rowIndex + 1 }}</td>

                        <td v-for="col in nonActionColumns" :key="col.key">
                            {{ row[col.key] }}
                        </td>

                        <td v-if="actionColumns.length" class="flex flex-row gap-1">
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

                // Tìm kiếm toàn bảng
                if (this.searchText.trim()) {
                    const keyword = this.searchText.toLowerCase();
                    result = result.filter((row) =>
                        this.nonActionColumns.some((col) =>
                            String(row[col.key] || "").toLowerCase().includes(keyword)
                        )
                    );
                }

                // Lọc theo cột
                for (const [key, value] of Object.entries(this.columnFilters)) {
                    if (value && value.trim()) {
                        const keyword = value.toLowerCase();
                        result = result.filter((row) =>
                            String(row[key] || "").toLowerCase().includes(keyword)
                        );
                    }
                }

                // Sắp xếp
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
    .custom-table button {
        height: 32px;
        width: 32px;
        font-size: 16px;
        padding: 3px;
        border-radius: 6px;
    }

    .cursor-pointer {
        cursor: pointer;
    }

    .select-none {
        user-select: none;
    }

    .custom-table thead>tr:nth-child(1) {
        text-align: center;
    }

    .custom-table thead>tr:nth-child(2) {
        background-color: #e5e5e5;
    }

    .custom-table input {
        padding: 0;
        height: 24px;
        border-style: none;
        border-radius: 0;
        color: black;
        min-width: 0;
    }

    /* Container cuộn ngang nếu bảng rộng hơn cha */
    .table-container {
        width: 100%;
        overflow-x: auto;
    }
</style>