<template>
    <table class="table-auto border-collapse border border-gray-300 w-full">
        <thead>
            <tr>
                <th v-for="(col, i) in columns" :key="i" class="border border-gray-300 px-3 py-2 bg-gray-100 text-left">
                    {{ col.label }}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(row, rowIndex) in localRows" :key="rowIndex" class="hover:bg-gray-50">
                <!-- Render các cột dữ liệu -->
                <td v-for="(col, colIndex) in columns" :key="colIndex" class="border border-gray-300 px-3 py-2">
                    <!-- Nếu là action column -->
                    <template v-if="col.actions">
                        <div class="flex gap-2">
                            <button v-for="(act, ai) in col.actions" :key="ai"
                                class="px-2 py-1 rounded border bg-white hover:bg-gray-100 flex items-center gap-1"
                                :title="act.label" @click="() => handleAction(act, row, rowIndex)">
                                <span v-if="act.icon">{{ act.icon }}</span>
                                <span class="sr-only">{{ act.label }}</span>
                            </button>
                        </div>
                    </template>

                    <!-- Nếu là cột thường -->
                    <template v-else>
                        {{ row[col.key] }}
                    </template>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
    export default {
        name: "TableComponent",
        props: {
            rows: {
                type: Array,
                required: true,
            },
            columns: {
                type: Array,
                required: true,
            },
        },
        emits: ["update:rows"],
        data() {
            return {
                localRows: [...this.rows], // copy để reactive
            };
        },
        watch: {
            rows: {
                handler(newVal) {
                    this.localRows = [...newVal];
                },
                deep: true,
            },
        },
        methods: {
            handleAction(action, row, rowIndex) {
                if (typeof action.func === "function") {
                    action.func(row, rowIndex, this.localRows);
                }
                // nếu action có xoá, thay đổi dữ liệu thì emit ngược lên
                this.$emit("update:rows", this.localRows);
            },
        },
    };
</script>