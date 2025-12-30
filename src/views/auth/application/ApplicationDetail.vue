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

                            <!-- Custom Fields -->
                            <tr v-for="cv in mappedCustomValues" :key="cv?.id">
                                <th>{{ cv?.fieldName }}</th>
                                <td>
                                    <template v-if="isLink(cv?.value)">
                                        <a :href="getOnlineFileUrl(getValue(cv.value))" target="_blank"
                                            rel="noopener noreferrer">
                                            {{ $t('viewFile') }}
                                        </a>
                                    </template>

                                    <template v-else>
                                        {{ Array.isArray(cv?.value) ? cv.value.join(', ') : cv?.value }}
                                    </template>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="card flex-1 ai-card">
                    <h3>{{ $t('aiEvaluate') }}</h3>
                    <p>{{ application.evaluation || "NULL" }}</p>
                </div>
            </div>

            <div class="card status-section">
                <label>{{ $t('status') }}</label>
                <StatusApplicationSelect v-model="selectedStatus" @attemptChange="handleStatusChange" />
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

    // Lấy text theo ngôn ngữ
    const getLocaleField = (obj, viKey, enKey) => {
        if (!obj) return ''
        return locale.value === 'vi' ? obj[viKey] ?? '' : obj[enKey] ?? ''
    }

    // Lấy giá trị CV (hỗ trợ array)
    const getValue = val => Array.isArray(val) ? val[0] : val

    // Nhận diện link rất đơn giản
    const isLink = value => {
        const v = getValue(value)
        return typeof v === 'string' && v.startsWith('http')
    }

    // Xử lý link xem file online
    function getOnlineFileUrl(url) {
        if (!url) return '#'
        const lower = url.toLowerCase()

        if (lower.endsWith('.pdf'))
            return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`

        if (lower.endsWith('.docx') || lower.endsWith('.xlsx') || lower.endsWith('.pptx'))
            return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`

        return url
    }

    // Load dữ liệu
    onMounted(async () => {
        EventBus.showLoading('Đang tải dữ liệu hồ sơ...')
        try {
            const appRes = await ApplicationService.getApplicationById(route.params.id)
            if (appRes.success && appRes.data?.length) {
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

            const cvRes = await ApplicationCustomFieldValueService.getByApplicationId(route.params.id)
            customValues.value = cvRes.success ? cvRes.data.filter(v => v != null) : []
        } catch (err) {
            EventBus.showNotify('Lỗi khi tải dữ liệu hồ sơ: ' + err.message, 'error')
        } finally {
            EventBus.hideLoading()
        }
    })

    // Map custom fields
    const mappedCustomValues = mapLocaleField(customValues, [
        {
            newKey: 'fieldName',
            parentKey: 'ApplicationCustomFieldValue_jobCustomFieldId_fkey',
            viKey: 'fieldName_vi',
            enKey: 'fieldName_en'
        }
    ])

    async function handleStatusChange({ newValue, oldValue }) {
        // Nếu parent không có giá trị trước (an toàn)
        const currentStatus = oldValue ?? selectedStatus.value

        const order = ["PENDING", "REVIEWING", "INTERVIEW", "MAILED", "DECLINED", "CONFIRMED", "HIRED", "REJECTED"]
        const oldIndex = order.indexOf(currentStatus)
        const newIndex = order.indexOf(newValue)

        // bảo đảm hợp lệ (phòng trường hợp)
        if (newIndex === -1 || oldIndex === -1) {
            selectedStatus.value = oldValue;
            EventBus.showNotify("Trạng thái không hợp lệ!", "error")
            return
        }

        // nếu lùi trạng thái — Select đã chặn nhưng double-check
        if (newIndex < oldIndex) {
            EventBus.showNotify("Không thể cập nhật lùi trạng thái!", "warning")
            selectedStatus.value = oldValue;
            return
        }

        // nếu không tiến (bằng nhau) thì nothing
        if (newIndex === oldIndex) return

        // Call API để cập nhật trạng thái
        try {
            EventBus.showLoading("Đang cập nhật trạng thái...")
            const res = await ApplicationService.updateApplicationStatus(route.params.id, newValue)

            if (newValue == "HIRED" || newValue == "REJECTED") {
                const fd = new FormData();
                fd.append("idApplication", route.params.id)
                fd.append("status", newValue)
                await ApplicationService.sendMailer(fd)
            }

            if (!res.success) {
                throw new Error(res.message || "Cập nhật thất bại")
            }

            // API thành công -> cập nhật v-model (parent state)
            selectedStatus.value = newValue
        } catch (err) {
            // EventBus.showNotify("Lỗi khi cập nhật trạng thái: " + err.message, "error")
            // nếu muốn đảm bảo UI là giá trị cũ thì selectedStatus giữ nguyên vì chúng ta chưa set nó
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