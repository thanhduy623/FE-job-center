<template>
    <form @submit.prevent="submitForm" class="flex flex-col gap-1">

        <!-- Location & Department -->
        <div class="flex flex-row wrap gap-1">
            <div class="flex-1">
                <label>{{ $t('location') }}</label>
                <LocationSelect v-model="formData.locationId" />
            </div>
            <div class="flex-1">
                <label>{{ $t('department') }}</label>
                <DepartmentSelect v-model="formData.departmentId" required />
            </div>
        </div>

        <!-- Name -->
        <div class="flex flex-row wrap gap-1">
            <div class="flex-1">
                <label>{{ $t('name') }} (VI)</label>
                <input v-model="formData.name_vi" type="text" :disabled="loading.name_vi" />
            </div>
            <div class="flex-1">
                <label>{{ $t('name') }} (EN)</label>
                <input v-model="formData.name_en" type="text" :disabled="loading.name_en" />
            </div>
        </div>

        <!-- Position -->
        <div class="flex flex-row wrap gap-1">
            <div class="flex-1">
                <label>{{ $t('position') }} (VI)</label>
                <input v-model="formData.position_vi" type="text" :disabled="loading.position_vi" />
            </div>
            <div class="flex-1">
                <label>{{ $t('position') }} (EN)</label>
                <input v-model="formData.position_en" type="text" :disabled="loading.position_en" />
            </div>
        </div>

        <!-- Job Type, Salary, Status -->
        <div class="flex flex-row wrap gap-1">
            <div class="flex-1">
                <label>{{ $t('type') }}</label>
                <JobTypeSelect v-model="formData.jobType" />
            </div>
            <div class="flex-1">
                <label>{{ $t('salary') }}</label>
                <input v-model="formData.salary" type="text" />
            </div>
            <div class="flex-1">
                <label>{{ $t('status') }}</label>
                <StatusSelect v-model="formData.status" />
            </div>
        </div>

        <!-- Application Deadline -->
        <div class="flex flex-row wrap gap-1">
            <div class="flex-1">
                <label>{{ $t('fromDate') }}</label>
                <input type="date" v-model="applicationDeadlineStartDate" />
            </div>
            <div class="flex-1">
                <label>{{ $t('toDate') }}</label>
                <input type="date" v-model="applicationDeadlineEndDate" />
            </div>
        </div>

        <!-- Description -->
        <TextEditorTranslate label="description" fieldVi="description_vi" fieldEn="description_en" :formData="formData"
            :loading="loading" @update="handleUpdate" @translate="handleTranslate" />

        <!-- Requirements -->
        <TextEditorTranslate label="request" fieldVi="requirements_vi" fieldEn="requirements_en" :formData="formData"
            :loading="loading" @update="handleUpdate" @translate="handleTranslate" />

        <!-- Benefits -->
        <TextEditorTranslate label="benifit" fieldVi="benefits_vi" fieldEn="benefits_en" :formData="formData"
            :loading="loading" @update="handleUpdate" @translate="handleTranslate" />

        <!-- Submit Buttons -->
        <div class="flex justify-end gap-1">
            <button v-if="jobId" type="button" class="bg-gray-500 text-white px-4 py-2" @click="goToJobField">
                Trường công việc
            </button>
            <button type="submit" class="bg-primary text-white px-4 py-2">
                {{ jobId ? 'Cập nhật' : 'Thêm mới' }}
            </button>
        </div>
    </form>
</template>

<script setup>
    import { ref, computed, onMounted, defineProps, defineEmits } from 'vue'
    import { useRouter } from 'vue-router'
    import DepartmentSelect from '@/components/selects/DepartmentSelect.vue'
    import JobTypeSelect from '@/components/selects/JobTypeSelect.vue'
    import StatusSelect from '@/components/selects/StatusSelect.vue'
    import LocationSelect from '@/components/selects/LocationSelect.vue'
    import JobService from '@/services/JobService'
    import { translateText } from '@/utils/translateText'
    import { EventBus } from '@/utils/eventBus'
    import TextEditorTranslate from '@/components/textEditers/TextEditerTranslate.vue'

    const router = useRouter()
    const props = defineProps({ jobId: { type: [String, Number], default: null } })
    const emit = defineEmits(['saved'])

    const formData = ref({
        departmentId: '',
        name_vi: '',
        name_en: '',
        position_vi: '',
        position_en: '',
        description_vi: '',
        description_en: '',
        requirements_vi: '',
        requirements_en: '',
        benefits_vi: '',
        benefits_en: '',
        jobType: 'FULL_TIME',
        salary: '',
        status: 'PUBLISHED',
        applicationDeadlineStart: '',
        applicationDeadlineEnd: '',
        locationId: ''
    })

    const loading = ref({
        name_vi: false,
        name_en: false,
        position_vi: false,
        position_en: false,
        description_vi: false,
        description_en: false,
        requirements_vi: false,
        requirements_en: false,
        benefits_vi: false,
        benefits_en: false
    })

    const applicationDeadlineStartDate = computed({
        get: () => formData.value.applicationDeadlineStart ? formData.value.applicationDeadlineStart.split('T')[0] : '',
        set: val => formData.value.applicationDeadlineStart = val ? new Date(val + 'T00:00:00Z').toISOString() : null
    })
    const applicationDeadlineEndDate = computed({
        get: () => formData.value.applicationDeadlineEnd ? formData.value.applicationDeadlineEnd.split('T')[0] : '',
        set: val => formData.value.applicationDeadlineEnd = val ? new Date(val + 'T23:59:59Z').toISOString() : null
    })

    // Khi con emit update
    function handleUpdate({ key, value }) {
        formData.value[key] = value
    }

    // Khi con emit translate
    async function handleTranslate({ sourceKey, targetKey, sourceLang, editorInstance }) {
        const sourceValue = formData.value[sourceKey]
        if (!sourceValue) return

        loading.value[targetKey] = true
        formData.value[targetKey] = sourceLang === 'en' ? 'Translating...' : 'Đang dịch...'

        if (editorInstance) editorInstance.enable(false)

        try {
            const result = await translateText(sourceValue, sourceLang)
            formData.value[targetKey] = result
            if (editorInstance) editorInstance.root.innerHTML = result
        } catch {
            formData.value[targetKey] = 'Lỗi dịch thuật'
        } finally {
            loading.value[targetKey] = false
            if (editorInstance) editorInstance.enable(true)
        }
    }

    async function loadJob() {
        if (!props.jobId) return
        try {
            const res = await JobService.getJob({ id: props.jobId })
            if (res.success && res.data && res.data[0]) {
                const dataJob = res.data[0]
                formData.value = {
                    id: props.jobId,
                    departmentId: dataJob.Job_departmentId_fkey?.id ?? '',
                    name_vi: dataJob.name_vi ?? '',
                    name_en: dataJob.name_en ?? '',
                    position_vi: dataJob.position_vi ?? '',
                    position_en: dataJob.position_en ?? '',
                    description_vi: dataJob.description_vi ?? '',
                    description_en: dataJob.description_en ?? '',
                    requirements_vi: dataJob.requirements_vi ?? '',
                    requirements_en: dataJob.requirements_en ?? '',
                    benefits_vi: dataJob.benefits_vi ?? '',
                    benefits_en: dataJob.benefits_en ?? '',
                    jobType: dataJob.jobType ?? 'FULL_TIME',
                    salary: dataJob.salary ?? '',
                    status: dataJob.status ?? 'PUBLISHED',
                    applicationDeadlineStart: dataJob.applicationDeadlineStart ?? '',
                    applicationDeadlineEnd: dataJob.applicationDeadlineEnd ?? '',
                    locationId: dataJob.Job_locationId_fkey?.id ?? ''
                }
            } else EventBus.showNotify("Không tồn tại dữ liệu", "warning")
        } catch (e) { console.error(e) }
    }

    async function submitForm() {
        try {
            const res = props.jobId
                ? await JobService.updateJob(formData.value)
                : await JobService.addJob(formData.value)
            if (res.success) emit('saved', res.data[0].id)
        } catch (e) { console.error(e) }
    }

    function goToJobField() {
        router.push(`/job/field/${props.jobId}`)
    }

    onMounted(() => loadJob())
</script>