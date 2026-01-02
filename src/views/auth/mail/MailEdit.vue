<template>
    <div class="main-container">
        <div class="flex flex-row gap-1 wrap">
            <h2 class="text-primary flex-1">Quản lý mẫu email hệ thống</h2>
            <button @click="loadTemplate('INTERVIEW')">{{ $t('interview') }}</button>
            <button @click="loadTemplate('REJECTED')">{{ $t('rejected') }}</button>
            <button @click="loadTemplate('HIRED')">{{ $t('hired') }}</button>
        </div>

        <div class="flex flex-row wrap gap-2 mt-2">
            <!-- LEFT: Editor -->
            <div class="card flex-1 flex flex-col gap-1">
                <h3>Chỉnh sửa nội dung</h3>
                <TextEditerSingle ref="emailEditor" v-model="contentHtml" :height="'650px'" />

                <!-- Hiển thị các biến trong template -->
                <div class="variable-info">
                    <h4>Biến có thể thay thế:</h4>
                    <ul>
                        <li v-for="v in variantListArr" :key="v.key" :class="{ activeVar: variableInContent(v.key) }">
                            {{ v.key }} — {{ v.description_vi }} — {{ v.description_en }}
                        </li>
                    </ul>
                </div>

                <div class="flex flex-row gap-1 justify-end mt-2">
                    <button @click="resetTemplate" class="bg-gray-400">{{ $t('reset') }}</button>
                    <button @click="saveTemplate" class="bg-blue-500 text-white">{{ $t('update') }}</button>
                </div>
            </div>

            <!-- RIGHT: Preview -->
            <MailPreview :contentHtml="contentHtml" />
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import TextEditerSingle from '@/components/textEditers/TextEditerSingle.vue'
    import MailPreview from '@/components/mails/MailPreview.vue'
    import { getMailTemplate, updateMailTemplate } from '@/services/MailTemplateService'
    import { EventBus } from '@/utils/eventBus'

    const emailEditor = ref(null)
    const contentHtml = ref("")
    const originalContent = ref("")
    const currentTemplateId = ref("")
    const variantList = ref({})     // Lưu nguyên object từ Supabase
    const variantListArr = ref([])  // Mảng để hiển thị

    // Load template từ Supabase
    async function loadTemplate(templateId) {
        try {
            const response = await getMailTemplate({ id: templateId })
            if (response?.success && response.data?.length > 0) {
                const data = response.data[0]
                contentHtml.value = data.bodyMail || ""
                originalContent.value = data.bodyMail || ""
                currentTemplateId.value = templateId

                // Lấy variantList
                variantList.value = data.variantList || {}
                variantListArr.value = Object.values(variantList.value)
            } else {
                contentHtml.value = "<p>Template không tồn tại</p>"
                originalContent.value = contentHtml.value
                variantList.value = {}
                variantListArr.value = []
            }
        } catch (error) {
            console.error("Lỗi khi load template:", error)
            contentHtml.value = "<p>Lỗi khi tải nội dung</p>"
            originalContent.value = contentHtml.value
            variantList.value = {}
            variantListArr.value = []
        }
    }

    // Reset về dữ liệu gốc
    function resetTemplate() {
        contentHtml.value = originalContent.value
    }

    // Kiểm tra biến có xuất hiện trong nội dung
    function variableInContent(key) {
        const regex = new RegExp(`{{\\s*${key}\\s*}}`)
        return regex.test(contentHtml.value)
    }

    // Save template, gửi luôn variantList để không bị null
    async function saveTemplate() {
        if (!currentTemplateId.value) return

        // Kiểm tra tất cả biến còn đầy đủ
        const currentKeys = Object.values(variantList.value).map(v => v.key)
        const missingVars = currentKeys.filter(v => !variableInContent(v))
        if (missingVars.length > 0) {
            EventBus.showNotify("Không thể lưu: biến bị xóa " + missingVars.join(', '), "warning")
            return
        }

        try {
            const data = {
                id: currentTemplateId.value,
                bodyMail: contentHtml.value,
                variantList: variantList.value  // Gửi nguyên object
            }
            const response = await updateMailTemplate(data)
            if (!response?.error) {
                originalContent.value = contentHtml.value
            } else {
                console.error(response.error)
                EventBus.showNotify("Cập nhật thất bại!", "error")
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật template:", error)
            EventBus.showNotify("Có lỗi xảy ra khi cập nhật template", "error")
        }
    }
</script>

<style scoped>
    .variable-info {
        font-family: Arial, sans-serif;
        padding: 0.5rem;
        margin-top: 1rem;
        background-color: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 0.25rem;
    }

    .variable-info ul {
        list-style: disc;
        padding-left: 1.25rem;
        font-size: 0.875rem;
        color: #374151;
    }

    .variable-info li.activeVar {
        color: #16a34a;
        font-weight: bold;
    }
</style>