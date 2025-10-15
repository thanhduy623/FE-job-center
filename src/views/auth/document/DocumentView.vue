<template>
    <div class="main-container flex flex-col gap-1">
        <h2 class="text-primary text-title flex-1">Quản lý file</h2>

        <form @submit.prevent="onUploadFile" class="flex gap-1 flex-wrap">
            <div class="flex flex-row wrap gap-1">
                <div class="flex flex-col flex-1">
                    <label>Tên tài liệu (VI)</label>
                    <input type="text" v-model="formData.name_vi" placeholder="Tên tiếng Việt" required />
                </div>
                <div class="flex flex-col flex-1">
                    <label>Document name (EN)</label>
                    <input type="text" v-model="formData.name_en" placeholder="Tên tiếng Anh" required />
                </div>
            </div>

            <div class="flex flex-row wrap gap-1 items-end">
                <div class="flex flex-col flex-1">
                    <label>File</label>
                    <input type="file" ref="fileInput" required />
                </div>
                <div class="flex flex-col flex-1">
                    <button type="submit" class="bg-primary text-white px-4 py-2">Upload</button>
                </div>
            </div>
        </form>

        <TableComponent v-model:rows="fileList" :columns="headers" />
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import TableComponent from "@/components/tables/tableComponent.vue"
    import { uploadFile, deleteFile, getPublicUrl } from '@/utils/supabaseFileUtils.js'
    import DocumentService from "@/services/DocumentService.js"

    const fileList = ref([])
    const formData = ref({ name_vi: '', name_en: '' })
    const fileInput = ref(null)

    /**
     * 🧩 Hàm chuyển publicUrl sang link preview online
     */
    function getOnlineFileUrl(fileUrl) {
        if (!fileUrl) return '#'
        const url = Array.isArray(fileUrl) ? fileUrl[0] : fileUrl
        const lowerUrl = url.toLowerCase()

        if (lowerUrl.endsWith('.pdf'))
            return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`

        if (lowerUrl.endsWith('.docx') || lowerUrl.endsWith('.xlsx') || lowerUrl.endsWith('.pptx'))
            return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`

        // Ảnh, video, text... thì dùng link gốc
        return url
    }

    // -------------------
    // BẢNG HIỂN THỊ FILES
    // -------------------
    const headers = ref([
        { key: 'name_vi', label: 'Tên tiếng Việt' },
        { key: 'name_en', label: 'English name' },
        {
            key: 'action',
            label: 'Hành động',
            actions: [
                {
                    icon: '👁️',
                    label: 'Xem',
                    func: (row) => {
                        if (row.publicUrl) {
                            const onlineUrl = getOnlineFileUrl(row.publicUrl)
                            window.open(onlineUrl, '_blank', 'noopener,noreferrer')
                        } else {
                            alert('Không tìm thấy đường dẫn xem file.')
                        }
                    }
                },
                {
                    icon: '✏️',
                    label: 'Cập nhật file',
                    func: async (row, index) => {
                        const input = document.createElement('input')
                        input.type = 'file'
                        input.onchange = async e => {
                            const newFile = e.target.files[0]
                            if (!newFile) return

                            try {
                                // 1️⃣ Xóa file cũ
                                const resDeleteOld = await deleteFile('documents', row.path)
                                if (!resDeleteOld.success) throw new Error(resDeleteOld.message)

                                // 2️⃣ Upload file mới (tạo tên mới)
                                const resUploadNew = await uploadFile(newFile, 'documents')
                                if (!resUploadNew.success) throw new Error(resUploadNew.message)

                                // 3️⃣ Cập nhật DB với path và publicUrl mới
                                const resUpdate = await DocumentService.updateDocument(
                                    { id: row.id, path: resUploadNew.path },
                                    ['id']
                                )

                                if (!resUpdate.success) throw new Error(resUpdate.message)

                                // 4️⃣ Cập nhật local list
                                fileList.value[index].path = resUploadNew.path
                                fileList.value[index].publicUrl = resUploadNew.publicUrl

                                alert('Cập nhật file thành công!')
                            } catch (err) {
                                console.error(err)
                                alert(`Cập nhật file thất bại: ${err.message}`)
                            }
                        }
                        input.click()
                    }
                },
                {
                    icon: '🗑️',
                    label: 'Xóa',
                    func: async (row, index) => {
                        try {
                            const resDeleteFile = await deleteFile('documents', row.path)
                            if (!resDeleteFile.success) throw new Error(resDeleteFile.message)

                            const resDeleteDB = await DocumentService.deleteDocument({ id: row.id })
                            if (!resDeleteDB.success) throw new Error(resDeleteDB.message)

                            fileList.value.splice(index, 1)
                            alert('Xóa file thành công!')
                        } catch (err) {
                            console.error(err)
                            alert(`Xóa thất bại: ${err.message}`)
                        }
                    }
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
            if (!file) throw new Error('Vui lòng chọn file.')

            const { name_vi, name_en } = formData.value
            if (!name_vi || !name_en) throw new Error('Vui lòng nhập cả tên tiếng Việt và tiếng Anh.')

            // Upload lên Supabase
            const resUpload = await uploadFile(file, 'documents')
            if (!resUpload.success) throw new Error(resUpload.message)

            // Lưu thông tin vào DB
            const resAdd = await DocumentService.addDocument({
                path: resUpload.path,
                name_vi,
                name_en
            })
            if (!resAdd.success) throw new Error(resAdd.message)

            fileList.value.push({
                ...resAdd.data[0],
                publicUrl: resUpload.publicUrl
            })

            formData.value = { name_vi: '', name_en: '' }
            fileInput.value.value = ''

            alert('Upload file thành công!')
        } catch (err) {
            console.error(err)
            alert(`Upload thất bại: ${err.message}`)
        }
    }

    // -------------------
    // LẤY DANH SÁCH FILE
    // -------------------
    const fetchFiles = async () => {
        try {
            const res = await DocumentService.getDocuments()
            if (!res.success) throw new Error(res.message)

            fileList.value = res.data.map(f => ({
                ...f,
                publicUrl: getPublicUrl('documents', f.path)
            }))
        } catch (err) {
            console.error(err)
            alert(`Lấy danh sách file thất bại: ${err.message}`)
        }
    }

    onMounted(fetchFiles)
</script>