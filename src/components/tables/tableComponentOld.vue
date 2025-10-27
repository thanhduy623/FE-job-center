<template>
    <table class="custom-table">
        <thead>
            <tr>
                <!-- Cột STT -->
                <th>#</th>
                <th v-for="col in nonActionColumns" :key="col.key" v-t="col.label"></th>
                <th v-if="actionColumns.length" v-t="'action'"></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(row, rowIndex) in localRows" :key="rowIndex" class="hover:bg-gray-50">
                <!-- Hiển thị số thứ tự -->
                <td>{{ rowIndex + 1 }}</td>

                <td v-for="col in nonActionColumns" :key="col.key">{{ row[col.key] }}</td>
                <td v-if="actionColumns.length" class="flex flex-row gap-1">
                    <button v-for="(act, ai) in actionColumns" :key="ai" class="table-btn " :title="act.label"
                        @click="handleAction(act, row, rowIndex)">
                        <span v-if="act.icon">{{ act.icon }}</span>
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
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
            };
        },
        computed: {
            nonActionColumns() {
                return this.columns.filter(c => !c.actions);
            },
            actionColumns() {
                return this.columns.find(c => c.actions)?.actions || [];
            },
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
                this.$emit("update:rows", this.localRows);
            },
        },
    };
</script>

<style scoped>
    button {
        height: 32px;
        width: 32px;
        font-size: 16px;
        padding: 3px;
        border-radius: 6px;
    }
</style>