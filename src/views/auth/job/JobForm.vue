<template>
    <form @submit.prevent="submitForm" class="flex flex-col gap-1">

        <div class="flex flex-col">
            <label>{{ $t('department') }}</label>
            <DepartmentSelect v-model="formData.departmentId" required />
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
            <button type="submit" class="bg-primary text-white px-4 py-2">
                {{ jobId ? 'Cập nhật' : 'Thêm mới' }}
            </button>
        </div>
    </form>
</template>

<script setup>
    import { ref, watch, defineProps, defineEmits } from 'vue'
    import { translateText } from '@/utils/translateText'
    import DepartmentSelect from '@/components/selects/DepartmentSelect.vue'
    import JobService from '@/services/JobService'

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
        benefits_en: ''
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

    const timers = {}

    /**
     * Chỉ dịch khi người dùng ngừng nhập (debounce),
     * không disable và không ghi đè trong lúc đang gõ
     */
    function debounceTranslate(sourceKey, targetKey, sourceLang, label) {
        clearTimeout(timers[sourceKey])

        timers[sourceKey] = setTimeout(async () => {
            const sourceValue = formData.value[sourceKey]
            const targetValue = formData.value[targetKey]

            if (!sourceValue) return
            if (targetValue) return

            loading.value[targetKey] = true
            formData.value[targetKey] = `Translating (${label})...`

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

    /* Name */
    watch(() => formData.value.name_vi, () =>
        debounceTranslate('name_vi', 'name_en', 'vi', 'TA')
    )
    watch(() => formData.value.name_en, () =>
        debounceTranslate('name_en', 'name_vi', 'en', 'TV')
    )

    /* Position */
    watch(() => formData.value.position_vi, () =>
        debounceTranslate('position_vi', 'position_en', 'vi', 'TA')
    )
    watch(() => formData.value.position_en, () =>
        debounceTranslate('position_en', 'position_vi', 'en', 'TV')
    )

    /* Description */
    watch(() => formData.value.description_vi, () =>
        debounceTranslate('description_vi', 'description_en', 'vi', 'TA')
    )
    watch(() => formData.value.description_en, () =>
        debounceTranslate('description_en', 'description_vi', 'en', 'TV')
    )

    /* Requirements */
    watch(() => formData.value.requirements_vi, () =>
        debounceTranslate('requirements_vi', 'requirements_en', 'vi', 'TA')
    )
    watch(() => formData.value.requirements_en, () =>
        debounceTranslate('requirements_en', 'requirements_vi', 'en', 'TV')
    )

    /* Benefits */
    watch(() => formData.value.benefits_vi, () =>
        debounceTranslate('benefits_vi', 'benefits_en', 'vi', 'TA')
    )
    watch(() => formData.value.benefits_en, () =>
        debounceTranslate('benefits_en', 'benefits_vi', 'en', 'TV')
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
</script>

<style scoped>
    textarea {
        min-height: 8em;
    }
</style>