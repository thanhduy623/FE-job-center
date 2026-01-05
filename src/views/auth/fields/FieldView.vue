<template>
    <div class="main-container flex flex-col gap-2">

        <h2 class="text-primary" v-t="'field'"> </h2>

        <form ref="formRef" class="flex flex-col gap-1" @submit.prevent="submitForm">

            <!-- Tên trường -->
            <TextTranslate label="name" fieldVi="fieldName_vi" fieldEn="fieldName_en" :formData="formData"
                :loading="loading" @update="handleUpdate" @translate="handleTranslate" />

            <!-- Mô tả -->
            <TextTranslate label="description" fieldVi="description_vi" fieldEn="description_en" :formData="formData"
                :loading="loading" @update="handleUpdate" @translate="handleTranslate" />

            <!-- Loại & thứ tự -->
            <div class="flex flex-row gap-1 wrap">
                <div class="flex-1">
                    <label>{{ $t('type') }}</label>
                    <select v-model="formData.fieldType" required>
                        <option value="TEXT">TEXT</option>
                        <option value="TEXTAREA">TEXTAREA</option>
                        <option value="NUMBER">NUMBER</option>
                        <option value="DATE">DATE</option>
                        <option value="URL">URL</option>
                        <option value="DROPDOWN">DROPDOWN</option>
                        <option value="FILE">FILE</option>
                    </select>
                </div>

                <div class="flex-1">
                    <label>{{ $t('order') }}</label>
                    <input v-model="formData.order" type="number" />
                </div>
            </div>

            <!-- Options DROPDOWN -->
            <div v-if="formData.fieldType === 'DROPDOWN'">
                <TextTranslate label="options" fieldVi="options_vi_text" fieldEn="options_en_text"
                    :formData="optionTextWrapper" :loading="loading" @update="handleOptionUpdate"
                    @translate="handleTranslate" />
            </div>

            <!-- Buttons -->
            <div class="flex justify-end gap-1">
                <button type="button" class="bg-gray-400" @click="resetForm">
                    Làm mới
                </button>
                <button type="submit" class="bg-primary text-white">
                    {{ editId ? 'Cập nhật' : 'Thêm mới' }}
                </button>
            </div>
        </form>

        <!-- Danh sách -->
        <table class="custom-table">
            <thead>
                <tr>
                    <th>{{ $t('name_vi') }}</th>
                    <th>{{ $t('name_en') }}</th>
                    <th>{{ $t('type') }}</th>
                    <th>{{ $t('order') }}</th>
                    <th>{{ $t('action') }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, index) in list" :key="row.id">
                    <td>{{ row.fieldName_vi }}</td>
                    <td>{{ row.fieldName_en }}</td>
                    <td>{{ row.fieldType }}</td>
                    <td>{{ row.order }}</td>
                    <td class="flex gap-1 justify-center">
                        <button class="table-btn" @click="editRow(row)">✏️</button>
                        <button class="table-btn" @click="deleteRow(row, index)">🗑️</button>
                    </td>
                </tr>
            </tbody>
        </table>

    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import TextTranslate from '@/components/textEditers/DynamicFieldTranslate.vue'
    import JobCustomFieldService from '@/services/JobCustomFieldService'
    import { translateText } from '@/utils/translateText'

    const formRef = ref(null)
    const list = ref([])
    const editId = ref(null)

    /* form chính */
    const formData = ref({
        fieldName_vi: '',
        fieldName_en: '',
        fieldType: 'TEXT',
        order: 1000,
        options_vi: [],
        options_en: [],
        description_vi: '',
        description_en: ''
    })

    /* text wrapper cho options */
    const optionTextWrapper = ref({
        options_vi_text: '',
        options_en_text: ''
    })

    /* loading dịch */
    const loading = ref({
        fieldName_vi: false,
        fieldName_en: false,
        description_vi: false,
        description_en: false,
        options_vi_text: false,
        options_en_text: false
    })

    /* ===== helpers ===== */
    function normalizeOptions(text) {
        if (!text) return []
        return Array.from(
            new Set(
                text
                    .split(',')
                    .map(v => v.replace(/\s+/g, ' ').trim())
                    .filter(Boolean)
            )
        )
    }

    /* update text thường */
    function handleUpdate({ key, value }) {
        formData.value[key] = value
    }

    /* update options */
    function handleOptionUpdate({ key, value }) {
        optionTextWrapper.value[key] = value

        if (key === 'options_vi_text') {
            formData.value.options_vi = normalizeOptions(value)
        }

        if (key === 'options_en_text') {
            formData.value.options_en = normalizeOptions(value)
        }
    }

    /* translate dùng chung */
    async function handleTranslate({ sourceKey, targetKey, sourceLang }) {
        const source =
            formData.value[sourceKey] ??
            optionTextWrapper.value[sourceKey]

        if (!source) return

        loading.value[targetKey] = true
        try {
            const result = await translateText(source, sourceLang)
            if (targetKey in formData.value) {
                formData.value[targetKey] = result
            } else {
                optionTextWrapper.value[targetKey] = result
                handleOptionUpdate({ key: targetKey, value: result })
            }
        } finally {
            loading.value[targetKey] = false
        }
    }

    /* load */
    async function loadData() {
        const res = await JobCustomFieldService.getJobCustomField()
        list.value = res.success
            ? res.data.sort((a, b) => Number(a.order) - Number(b.order))
            : []
    }

    /* scroll */
    function scrollToForm() {
        formRef.value?.scrollIntoView({ behavior: 'smooth' })
    }

    /* edit */
    function editRow(row) {
        editId.value = row.id
        formData.value = {
            fieldName_vi: row.fieldName_vi,
            fieldName_en: row.fieldName_en,
            fieldType: row.fieldType,
            order: row.order,
            options_vi: row.options_vi ?? [],
            options_en: row.options_en ?? [],
            description_vi: row.description_vi,
            description_en: row.description_en
        }

        optionTextWrapper.value.options_vi_text =
            (row.options_vi || []).join(', ')
        optionTextWrapper.value.options_en_text =
            (row.options_en || []).join(', ')

        scrollToForm()
    }

    /* submit */
    async function submitForm() {
        const payload = {
            ...formData.value,
            options_vi:
                formData.value.fieldType === 'DROPDOWN'
                    ? formData.value.options_vi
                    : [],
            options_en:
                formData.value.fieldType === 'DROPDOWN'
                    ? formData.value.options_en
                    : []
        }

        let res
        if (editId.value) {
            res = await JobCustomFieldService.updateJobCustomField({
                ...payload,
                id: editId.value
            })
            if (res.success) {
                const i = list.value.findIndex(v => v.id === editId.value)
                if (i !== -1) list.value[i] = res.data[0]
            }
        } else {
            res = await JobCustomFieldService.addJobCustomField(payload)
            if (res.success) list.value.push(res.data[0])
        }

        list.value.sort((a, b) => Number(a.order) - Number(b.order))
        resetForm()
    }

    /* delete */
    async function deleteRow(row, index) {
        const res = await JobCustomFieldService.deleteJobCustomField({ id: row.id })
        if (res.success) list.value.splice(index, 1)
    }

    /* reset */
    function resetForm() {
        editId.value = null
        formData.value = {
            fieldName_vi: '',
            fieldName_en: '',
            fieldType: 'TEXT',
            order: 1000,
            options_vi: [],
            options_en: [],
            description_vi: '',
            description_en: ''
        }
        optionTextWrapper.value = {
            options_vi_text: '',
            options_en_text: ''
        }
    }

    onMounted(loadData)
</script>

<style scoped>
    .table-btn {
        padding: 0.3rem 0.5rem;
        border-radius: 6px;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 0.9rem;
        background-color: var(--color-secondary);
    }

    .table-btn:hover {
        background-color: var(--color-primary);
    }
</style>