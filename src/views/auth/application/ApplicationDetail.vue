<template>
    <div class="main-container">
        <h2 class="text-primary">{{ $t('pageApplication.detail') }}</h2>

        <div v-if="application" class="flex flex-col gap-1">
            <div class="flex flex-row wrap gap-1">
                <div class="card flex-1 info-card">
                    <h3>{{ $t('infomation') }}</h3>
                    <table class="info-table">
                        <tbody>
                            <tr>
                                <th>{{ $t('fullname') }}</th>
                                <td>{{ application.fullName }}</td>
                            </tr>
                            <tr v-if="application.jobName">
                                <th>{{ $t('job') || 'Công việc' }}</th>
                                <td>{{ application.jobName }}</td>
                            </tr>
                            <tr v-if="application.departmentName">
                                <th>{{ $t('department') || 'Phòng ban' }}</th>
                                <td>{{ application.departmentName }}</td>
                            </tr>
                            <tr>
                                <th>{{ $t('coverLetter') }}</th>
                                <td>{{ application.coverLetter }}</td>
                            </tr>
                            <tr>
                                <th>{{ $t('phone') }}</th>
                                <td>{{ application.phone }}</td>
                            </tr>
                            <tr>
                                <th>{{ $t('email') }}</th>
                                <td>{{ application.email }}</td>
                            </tr>
                            <tr>
                                <th>{{ $t('address') }}</th>
                                <td>{{ application.address }}</td>
                            </tr>

                            <tr v-for="cv in mappedCustomValues" :key="cv?.id">
                                <th>{{ cv?.fieldName || 'Field' }}</th>
                                <td>
                                    <span v-if="!isFile(cv?.value)">
                                        {{ Array.isArray(cv?.value) ? cv.value.join(', ') : cv?.value }}
                                    </span>
                                    <a v-else :href="getOnlineFileUrl(cv?.value)" target="_blank"
                                        rel="noopener noreferrer">
                                        {{ $t('viewFile') }}
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="card flex-1 ai-card">
                    <h3>{{ $t('aiEvaluate') }}</h3>
                    <p>Chấm điểm AI hoặc đánh giá tự động ở đây...</p>
                </div>
            </div>

            <div class="card status-section">
                <label>{{ $t('status') }}</label>
                <StatusApplicationSelect v-model="selectedStatus" @update:modelValue="handleStatusChange" />
            </div>
        </div>

        <div v-else>
            <p>Loading...</p>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { useRoute } from 'vue-router'
    import { useI18n } from 'vue-i18n'
    import { EventBus } from '@/utils/eventBus.js'
    import StatusApplicationSelect from '@/components/selects/StatusApplicationSelect.vue'
    import ApplicationService from '@/services/ApplicationService.js'
    import ApplicationCustomFieldValueService from '@/services/ApplicationCustomFieldValueService.js'
    import { mapLocaleField } from '@/utils/mapLocaleField.js'

    const route = useRoute()
    const { locale } = useI18n()

    const application = ref(null)
    const customValues = ref([])
    const selectedStatus = ref(null)

    // --- Hàm tiện ích map locale cho 1 object ---
    const getLocaleField = (obj, viKey, enKey) => {
        if (!obj) return ''
        return locale.value === 'vi' ? obj[viKey] ?? '' : obj[enKey] ?? ''
    }

    // check file
    function isFile(value) {
        const url = Array.isArray(value) ? value[0] : value
        return (
            typeof url === 'string' &&
            (url.startsWith('http') ||
                url.endsWith('.pdf') ||
                url.endsWith('.docx') ||
                url.endsWith('.jpg') ||
                url.endsWith('.png'))
        )
    }

    // link file
    function getOnlineFileUrl(fileUrl) {
        if (!fileUrl) return '#'
        const url = Array.isArray(fileUrl) ? fileUrl[0] : fileUrl
        const lowerUrl = url.toLowerCase()
        if (lowerUrl.endsWith('.pdf'))
            return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
        if (
            lowerUrl.endsWith('.docx') ||
            lowerUrl.endsWith('.xlsx') ||
            lowerUrl.endsWith('.pptx')
        )
            return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                url
            )}`
        return url
    }

    // load application + custom values
    onMounted(async () => {
        EventBus.showLoading('Đang tải dữ liệu hồ sơ...')
        try {
            const appRes = await ApplicationService.getApplicationById(route.params.id)
            if (appRes.success && appRes.data?.length) {
                // Map trực tiếp jobName và departmentName
                const app = appRes.data[0]
                const job = app.Application_jobId_fkey || {}
                const department = job.Job_departmentId_fkey || {}

                application.value = {
                    ...app,
                    jobName: getLocaleField(job, 'name_vi', 'name_en'),
                    departmentName: getLocaleField(department, 'name_vi', 'name_en')
                }
                selectedStatus.value = application.value.status
            }

            const cvRes = await ApplicationCustomFieldValueService.getByApplicationId(
                route.params.id
            )
            if (cvRes.success) {
                customValues.value = (cvRes.data || []).filter(cv => cv != null)
            } else {
                customValues.value = []
            }
        } catch (err) {
            EventBus.showNotify('Lỗi khi tải dữ liệu hồ sơ: ' + err.message, 'error')
        } finally {
            EventBus.hideLoading()
        }
    })

    // SỬA LỖI map: Truyền ref 'customValues' cho mappedCustomValues
    const mappedCustomValues = mapLocaleField(customValues, [
        {
            newKey: 'fieldName',
            parentKey: 'ApplicationCustomFieldValue_jobCustomFieldId_fkey',
            viKey: 'fieldName_vi',
            enKey: 'fieldName_en'
        }
    ])

    // handle status
    async function handleStatusChange(newStatus) {
        const currentStatus = selectedStatus.value
        const order = ['PENDING', 'REVIEWING', 'INTERVIEW', 'HIRED', 'REJECTED']
        const canProceed = order.indexOf(newStatus) > order.indexOf(currentStatus)

        if (!canProceed) {
            EventBus.showNotify('Không thể cập nhật lùi trạng thái!', 'warning')
            selectedStatus.value = currentStatus
            return
        }

        const confirmed = await EventBus.confirm(
            `Xác nhận cập nhật trạng thái từ "${currentStatus}" → "${newStatus}"?`
        )
        if (!confirmed) {
            selectedStatus.value = currentStatus
            return
        }

        try {
            EventBus.showLoading('Đang cập nhật trạng thái...')
            const res = await ApplicationService.updateApplicationStatus(
                route.params.id,
                newStatus
            )
            if (res.success) {
                selectedStatus.value = newStatus
                EventBus.showNotify('Cập nhật trạng thái thành công!', 'success')
                if (['INTERVIEW', 'HIRED', 'REJECTED'].includes(newStatus)) {
                    alert(
                        `Ứng viên đã được cập nhật trạng thái: ${newStatus}. Gửi mail thông báo...`
                    )
                }
            } else throw new Error(res.message)
        } catch (err) {
            EventBus.showNotify('Lỗi khi cập nhật trạng thái: ' + err.message, 'error')
            selectedStatus.value = currentStatus
        } finally {
            EventBus.hideLoading()
        }
    }
</script>

<style scoped>
    .info-table {
        width: 100%;
        border-collapse: collapse;
    }

    th {
        min-width: 50px;
        max-width: 150px;
        white-space: nowrap;
        text-align: start;
    }
</style>