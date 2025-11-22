<template>
    <form @submit.prevent="submitForm" class="flex flex-col gap-1">
        <!-- Department -->
        <div class="flex flex-col">
            <label for="departmentId">{{ $t('department') }}</label>
            <DepartmentSelect v-model="formData.departmentId" required />
        </div>

        <!-- Name -->
        <div class="flex flex-row wrap gap-1">
            <div class="flex-1">
                <label for="name_vi">{{ $t('name') }} (VI)</label>
                <input id="name_vi" v-model="formData.name_vi" type="text" required />
            </div>
            <div class="flex-1">
                <label for="name_en">{{ $t('name') }} (EN)</label>
                <input id="name_en" v-model="formData.name_en" type="text" required />
            </div>
        </div>

        <!-- Position -->
        <div class="flex flex-row wrap gap-1">
            <div class="flex-1">
                <label for="position_vi">{{ $t('position') }} (VI)</label>
                <input id="position_vi" v-model="formData.position_vi" type="text" required />
            </div>
            <div class="flex-1">
                <label for="position_en">{{ $t('position') }} (EN)</label>
                <input id="position_en" v-model="formData.position_en" type="text" required />
            </div>
        </div>

        <!-- Job type & Salary & Status -->
        <div class="flex flex-row wrap gap-1">
            <div class="flex-1">
                <label for="jobType">{{ $t('type') }}</label>
                <JobTypeSelect v-model="formData.jobType" required />
            </div>
            <div class="flex-1">
                <label for="salary">{{ $t('salary') }}</label>
                <input id="salary" v-model="formData.salary" type="text" required />
            </div>
            <div class="flex-1">
                <label for="status">{{ $t('status') }}</label>
                <StatusSelect v-model="formData.status" required />
            </div>
        </div>

        <!-- Description -->
        <div class="flex flex-row wrap gap-1">
            <div class="flex-1">
                <label for="description_vi">{{ $t('description') }} (VI)</label>
                <textarea id="description_vi" v-model="formData.description_vi" rows="3"></textarea>
            </div>
            <div class="flex-1">
                <label for="description_en">{{ $t('description') }} (EN)</label>
                <textarea id="description_en" v-model="formData.description_en" rows="3"></textarea>
            </div>
        </div>

        <!-- Requirements -->
        <div class="flex flex-row wrap gap-1">
            <div class="flex-1">
                <label for="requirements_vi">{{ $t('request') }} (VI)</label>
                <textarea id="requirements_vi" v-model="formData.requirements_vi" rows="3"></textarea>
            </div>
            <div class="flex-1">
                <label for="requirements_en">{{ $t('request') }} (EN)</label>
                <textarea id="requirements_en" v-model="formData.requirements_en" rows="3"></textarea>
            </div>
        </div>

        <!-- Benefits -->
        <div class="flex flex-row wrap gap-1">
            <div class="flex-1">
                <label for="benefits_vi">{{ $t('benifit') }} (VI)</label>
                <textarea id="benefits_vi" v-model="formData.benefits_vi" rows="3"></textarea>
            </div>
            <div class="flex-1">
                <label for="benefits_en">{{ $t('benifit') }} (EN)</label>
                <textarea id="benefits_en" v-model="formData.benefits_en" rows="3"></textarea>
            </div>
        </div>

        <!-- Application Deadline -->
        <div class="flex flex-row wrap gap-1">
            <div class="flex-1">
                <label for="applicationDeadlineStart">{{ $t('fromDate') }}</label>
                <input id="applicationDeadlineStart" v-model="formData.applicationDeadlineStart" type="date" />
            </div>
            <div class="flex-1">
                <label for="applicationDeadlineEnd">{{ $t('toDate') }}</label>
                <input id="applicationDeadlineEnd" v-model="formData.applicationDeadlineEnd" type="date" />
            </div>
        </div>

        <!-- Location -->
        <div class="flex flex-row wrap gap-1">
            <div class="flex-1">
                <label for="location">{{ $t('location') }}</label>
                <LocationSelect v-model="formData.locationId" />
            </div>
        </div>

        <!-- Submit -->
        <div class="flex justify-end gap-1">
            <button type="submit" class="bg-primary text-white px-4 py-2">
                {{ jobId ? 'Cập nhật' : 'Thêm mới' }}
            </button>
        </div>
    </form>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import { defineProps, defineEmits } from 'vue';

    import DepartmentSelect from '@/components/selects/DepartmentSelect.vue'
    import JobTypeSelect from '@/components/selects/JobTypeSelect.vue'
    import StatusSelect from '@/components/selects/StatusSelect.vue'
    import LocationSelect from '@/components/selects/LocationSelect.vue'

    import JobService from '@/services/JobService.js';

    const props = defineProps({ jobId: { type: [String, Number], default: null } });
    const emit = defineEmits(['saved']);

    const formData = ref({
        departmentId: '',
        name_vi: 'Test',
        name_en: 'Test',
        position_vi: 'Test',
        position_en: 'Test',
        description_vi: 'Test',
        description_en: 'Test',
        requirements_vi: 'Test',
        requirements_en: 'Test',
        benefits_vi: 'Test',
        benefits_en: 'Test',
        applicationDeadlineStart: new Date(Date.now()).toISOString().split("T")[0],
        applicationDeadlineEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        jobType: 'FULL_TIME',
        salary: 'Test',
        status: 'PUBLISHED',
        locationId: 'b69a365c-21ae-449a-8df1-080ddd8d3780'
    });


    onMounted(async () => {
        if (props.jobId) {
            const res = await JobService.getJob({ id: props.jobId })
            if (res.success && res.data.length > 0) {
                const job = res.data[0]

                // Chuyển định dạng datetime sang date (YYYY-MM-DD)
                job.applicationDeadlineStart = job.applicationDeadlineStart
                    ? job.applicationDeadlineStart.split('T')[0] || job.applicationDeadlineStart.split(' ')[0]
                    : ''
                job.applicationDeadlineEnd = job.applicationDeadlineEnd
                    ? job.applicationDeadlineEnd.split('T')[0] || job.applicationDeadlineEnd.split(' ')[0]
                    : ''

                formData.value = { ...job }

                console.log(res.data[0]);

            }
        }
    })

    async function submitForm() {
        // Chỉ lấy các cột thực sự có trong bảng Job
        const allowedFields = [
            "id",
            "departmentId",
            "name_vi",
            "name_en",
            "position_vi",
            "position_en",
            "description_vi",
            "description_en",
            "requirements_vi",
            "requirements_en",
            "benefits_vi",
            "benefits_en",
            "applicationDeadlineStart",
            "applicationDeadlineEnd",
            "jobType",
            "salary",
            "status",
            "locationId"
        ];

        // Lọc formData
        const dataToSave = {};
        allowedFields.forEach(key => {
            if (formData.value[key] !== undefined) {
                dataToSave[key] = formData.value[key];
            }
        });

        // Chuyển định dạng datetime sang timestamptz
        if (dataToSave.applicationDeadlineStart)
            dataToSave.applicationDeadlineStart = `${dataToSave.applicationDeadlineStart} 00:00:00+00`;
        if (dataToSave.applicationDeadlineEnd)
            dataToSave.applicationDeadlineEnd = `${dataToSave.applicationDeadlineEnd} 00:00:00+00`;

        try {
            if (props.jobId) {
                // Cập nhật
                const res = await JobService.updateJob(dataToSave);
                console.log(res)
                if (res.success) emit('saved');
            } else {
                // Thêm mới
                const res = await JobService.addJob(dataToSave);
                if (res.success) emit('saved');
            }
        } catch (error) {
            console.error("Lỗi khi lưu job:", error);
        }
    }

</script>

<style scoped>
    textarea {
        min-height: calc(1.4em * 6 + 1rem);
    }
</style>