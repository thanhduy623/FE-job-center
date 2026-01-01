<template>
    <form @submit.prevent="submitForm" class="flex flex-col gap-1">

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

        <!-- Job type, Salary, Status -->
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

        <!-- Application deadline -->
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
        <div class="flex flex-row wrap gap-1">
            <div class="flex-1">
                <label>{{ $t('description') }} (VI)</label>
                <textarea v-model="formData.description_vi" :disabled="loading.description_vi" />
            </div>
            <div class="flex-1">
                <label>{{ $t('description') }} (EN)</label>
                <textarea v-model="formData.description_en" :disabled="loading.description_en" />
            </div>
        </div>

        <!-- Requirements -->
        <div class="flex flex-row wrap gap-1">
            <div class="flex-1">
                <label>{{ $t('request') }} (VI)</label>
                <textarea v-model="formData.requirements_vi" :disabled="loading.requirements_vi" />
            </div>
            <div class="flex-1">
                <label>{{ $t('request') }} (EN)</label>
                <textarea v-model="formData.requirements_en" :disabled="loading.requirements_en" />
            </div>
        </div>

        <!-- Benefits -->
        <div class="flex flex-row wrap gap-1">
            <div class="flex-1">
                <label>{{ $t('benifit') }} (VI)</label>
                <textarea v-model="formData.benefits_vi" :disabled="loading.benefits_vi" />
            </div>
            <div class="flex-1">
                <label>{{ $t('benifit') }} (EN)</label>
                <textarea v-model="formData.benefits_en" :disabled="loading.benefits_en" />
            </div>
        </div>

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
    import { ref, watch, computed, onMounted, defineProps, defineEmits } from 'vue'
    import { translateText } from '@/utils/translateText'
    import { EventBus } from '@/utils/eventBus'
    import { useRouter } from 'vue-router'

    import DepartmentSelect from '@/components/selects/DepartmentSelect.vue'
    import JobTypeSelect from '@/components/selects/JobTypeSelect.vue'
    import StatusSelect from '@/components/selects/StatusSelect.vue'
    import LocationSelect from '@/components/selects/LocationSelect.vue'
    import JobService from '@/services/JobService'

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

    function goToJobField() {
        router.push(`/job/field/${props.jobId}`)
    }

    const applicationDeadlineStartDate = computed({
        get() {
            const v = formData.value.applicationDeadlineStart
            return v ? v.split('T')[0] : ''
        },
        set(val) {
            formData.value.applicationDeadlineStart = val
                ? new Date(val + 'T00:00:00Z').toISOString()
                : null
        }
    })

    const applicationDeadlineEndDate = computed({
        get() {
            const v = formData.value.applicationDeadlineEnd
            return v ? v.split('T')[0] : ''
        },
        set(val) {
            formData.value.applicationDeadlineEnd = val
                ? new Date(val + 'T23:59:59Z').toISOString()
                : null
        }
    })

    const timers = {}

    async function loadJob() {
        if (!props.jobId) return

        try {
            const res = await JobService.getJob({ id: props.jobId })

            if (res.success && res.data && res.data[0]) {
                const dataJob = res.data[0];

                formData.value = {
                    id: props.jobId,
                    departmentId: dataJob.Job_departmentId_fkey.id ?? '',
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
                    locationId: dataJob.Job_locationId_fkey.id ?? ''
                }
            } else {
                EventBus.showNotify("Không tồn tại dữ liệu", "warning");
            }
        } catch (e) {
            console.error(e)
        }
    }


    function debounceTranslate(sourceKey, targetKey, sourceLang) {
        clearTimeout(timers[sourceKey])

        timers[sourceKey] = setTimeout(async () => {
            const sourceValue = formData.value[sourceKey]
            const targetValue = formData.value[targetKey]

            if (!sourceValue) return
            if (targetValue) return

            loading.value[targetKey] = true
            formData.value[targetKey] = sourceLang === 'en' ? 'Translating' : 'Đang dịch'

            try {
                const result = await translateText(sourceValue, sourceLang)
                formData.value[targetKey] = result
            } catch {
                formData.value[targetKey] = 'Lỗi dịch thuật'
            } finally {
                loading.value[targetKey] = false
            }
        }, 800)
    }

    /* watchers giữ nguyên */
    watch(() => formData.value.name_vi, () =>
        debounceTranslate('name_vi', 'name_en', 'vi')
    )
    watch(() => formData.value.name_en, () =>
        debounceTranslate('name_en', 'name_vi', 'en')
    )
    watch(() => formData.value.position_vi, () =>
        debounceTranslate('position_vi', 'position_en', 'vi')
    )
    watch(() => formData.value.position_en, () =>
        debounceTranslate('position_en', 'position_vi', 'en')
    )
    watch(() => formData.value.description_vi, () =>
        debounceTranslate('description_vi', 'description_en', 'vi')
    )
    watch(() => formData.value.description_en, () =>
        debounceTranslate('description_en', 'description_vi', 'en')
    )
    watch(() => formData.value.requirements_vi, () =>
        debounceTranslate('requirements_vi', 'requirements_en', 'vi')
    )
    watch(() => formData.value.requirements_en, () =>
        debounceTranslate('requirements_en', 'requirements_vi', 'en')
    )
    watch(() => formData.value.benefits_vi, () =>
        debounceTranslate('benefits_vi', 'benefits_en', 'vi')
    )
    watch(() => formData.value.benefits_en, () =>
        debounceTranslate('benefits_en', 'benefits_vi', 'en')
    )

    async function submitForm() {
        try {
            const res = props.jobId
                ? await JobService.updateJob(formData.value)
                : await JobService.addJob(formData.value)

            if (res.success) emit('saved', res.data[0].id)
        } catch (e) {
            console.error(e)
        }
    }

    onMounted(loadJob)
</script>

<style scoped>
    textarea {
        min-height: 8em;
    }
</style>