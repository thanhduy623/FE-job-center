<template>
    <div class="main-container flex flex-col gap-1">
        <h2 class="text-primary text-title flex-1" v-t="'pageFile.title'"></h2>

        <!-- FORM UPLOAD -->
        <form @submit.prevent="onUploadFile" class="flex gap-1 flex-wrap">
            <div class="flex flex-row wrap gap-1">
                <div class="flex flex-col flex-1">
                    <label>{{ $t('name') }}</label>
                    <input type="text" v-model="nameInput" placeholder="Tên" required />
                </div>
                <div class="flex flex-col flex-1">
                    <label>{{ $t('type') }}</label>
                    <TypeSelect v-model="typeInput" />
                </div>
            </div>

            <div class="flex flex-row wrap gap-1 items-end">
                <div class="flex flex-col flex-1">
                    <label>File</label>
                    <input type="file" ref="fileInput" accept="application/pdf" required />
                </div>
            </div>

            <div class="flex flex-row wrap gap-1 justify-end">
                <button type="submit" class="bg-primary text-white px-4 py-2" v-t="'update'"></button>
            </div>
        </form>

        <!-- TABLE FILES -->
        <TableComponent v-model:rows="fileList" :columns="headers" />
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { EventBus } from '@/utils/eventBus'

    import DocumentService from "@/services/DocumentService.js"

    import TableComponent from "@/components/tables/tableComponent.vue"
    import TypeSelect from "@/components/selects/TypeSelect.vue"

    const fileList = ref([])
    const nameInput = ref('')
    const typeInput = ref('')
    const fileInput = ref(null)

    // -------------------
    // COLUMNS TABLE
    // -------------------
    const headers = ref([
        { key: 'title', label: 'name' },
        { key: 'schema', label: 'type' },
        {
            key: 'action',
            label: 'Hành động',
            actions: [
                {
                    icon: '👁️',
                    label: 'Xem',
                    func: (row) => window.open(row.url, "_blank", "noopener,noreferrer")
                },
                {
                    icon: '🗑️',
                    label: 'Xóa',
                    func: (row, index) => onDeleteFile(row, index)
                }
            ]
        }
    ])

    // -------------------
    // UPLOAD FILE MỚI
    // -------------------
    const onUploadFile = async () => {
        try {
            const file = fileInput.value.files[0]
            if (!file) throw new Error("Vui lòng chọn file.")

            const name = nameInput.value.trim()
            const type = typeInput.value.trim()
            if (!name || !type) throw new Error("Vui lòng nhập đầy đủ tên và loại file.")

            const formData = new FormData()
            formData.append("file", file)
            formData.append("name", name)
            formData.append("is_active", type)

            const resUpload = await DocumentService.addDocument(formData)

            if (!resUpload?.success) {
                throw new Error(resUpload?.message || "Upload thất bại")
            }

            await fetchFiles()

            nameInput.value = ""
            typeInput.value = ""
            fileInput.value.value = ""

            EventBus.showNotify("Tải file lên thành công", "success")
        } catch (err) {
            console.error(err)
            EventBus.showNotify("Tải file lên thất bại", "error")
        }
    }


    // -------------------
    // XÓA FILE
    // -------------------
    const onDeleteFile = async (row, index) => {
        try {
            const formData = new FormData()
            formData.append("id", row.id)

            const resDeleteFile = await await DocumentService.deleteDocument(formData)

            if (!resDeleteFile?.success) return

            fileList.value.splice(index, 1)
            EventBus.showNotify("Xóa file thành công", "success")
        } catch (err) {
            console.error(err)
            EventBus.showNotify("Xóa file thất bại", "error")
        }
    }


    // -------------------
    // LẤY DANH SÁCH FILE
    // -------------------
    const fetchFiles = async () => {
        try {
            const res = await DocumentService.getDocuments()
            if (!res.success) throw new Error(res.message)
            fileList.value = res.data
        } catch (err) {
            console.error(err)
            EventBus.showNotify("Lấy danh sách thất bại", 'error');
        }
    }

    onMounted(fetchFiles)
</script>