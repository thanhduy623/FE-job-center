<template>
    <form @submit.prevent="submitForm" class="flex flex-col gap-1 p-4 border rounded">
        <!-- Department -->
        <div class="flex flex-col">
            <label for="department">Phòng ban</label>
            <select id="department" v-model="formData.departmentId" required>
                <option value="">-- Chọn phòng ban --</option>
                <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                    {{ dept.name_vi }}
                </option>
            </select>
        </div>

        <!-- Name -->
        <div class="flex flex-row gap-1">
            <div class="flex-1">
                <label for="name_vi">Tên (VI)</label>
                <input id="name_vi" v-model="formData.name_vi" type="text" required />
            </div>
            <div class="flex-1">
                <label for="name_en">Tên (EN)</label>
                <input id="name_en" v-model="formData.name_en" type="text" required />
            </div>
        </div>

        <!-- Position -->
        <div class="flex flex-row gap-1">
            <div class="flex-1">
                <label for="position_vi">Vị trí (VI)</label>
                <input id="position_vi" v-model="formData.position_vi" type="text" />
            </div>
            <div class="flex-1">
                <label for="position_en">Vị trí (EN)</label>
                <input id="position_en" v-model="formData.position_en" type="text" />
            </div>
        </div>

        <!-- Description -->
        <div class="flex flex-row gap-1">
            <div class="flex-1">
                <label for="description_vi">Mô tả (VI)</label>
                <textarea id="description_vi" v-model="formData.description_vi" rows="3"></textarea>
            </div>
            <div class="flex-1">
                <label for="description_en">Mô tả (EN)</label>
                <textarea id="description_en" v-model="formData.description_en" rows="3"></textarea>
            </div>
        </div>

        <!-- Requirements -->
        <div class="flex flex-row gap-1">
            <div class="flex-1">
                <label for="requirements_vi">Yêu cầu (VI)</label>
                <textarea id="requirements_vi" v-model="formData.requirements_vi" rows="3"></textarea>
            </div>
            <div class="flex-1">
                <label for="requirements_en">Yêu cầu (EN)</label>
                <textarea id="requirements_en" v-model="formData.requirements_en" rows="3"></textarea>
            </div>
        </div>

        <!-- Benefits -->
        <div class="flex flex-row gap-1">
            <div class="flex-1">
                <label for="benefits_vi">Quyền lợi (VI)</label>
                <textarea id="benefits_vi" v-model="formData.benefits_vi" rows="3"></textarea>
            </div>
            <div class="flex-1">
                <label for="benefits_en">Quyền lợi (EN)</label>
                <textarea id="benefits_en" v-model="formData.benefits_en" rows="3"></textarea>
            </div>
        </div>

        <!-- Application Deadline -->
        <div class="flex flex-row gap-1">
            <div class="flex-1">
                <label for="applicationDeadlineStart">Bắt đầu nhận hồ sơ</label>
                <input id="applicationDeadlineStart" v-model="formData.applicationDeadlineStart" type="date" />
            </div>
            <div class="flex-1">
                <label for="applicationDeadlineEnd">Kết thúc nhận hồ sơ</label>
                <input id="applicationDeadlineEnd" v-model="formData.applicationDeadlineEnd" type="date" />
            </div>
        </div>

        <!-- Job type & Salary & Status -->
        <div class="flex flex-row gap-1">
            <div class="flex-1">
                <label for="jobType">Loại công việc</label>
                <input id="jobType" v-model="formData.jobType" type="text" />
            </div>
            <div class="flex-1">
                <label for="salary">Mức lương</label>
                <input id="salary" v-model="formData.salary" type="text" />
            </div>
            <div class="flex-1">
                <label for="status">Trạng thái</label>
                <select id="status" v-model="formData.status">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>
        </div>

        <!-- Location -->
        <div class="flex flex-row gap-1">
            <div class="flex-1">
                <label for="location">Địa điểm</label>
                <input id="location" v-model="formData.location" type="text" />
            </div>
        </div>

        <!-- Submit -->
        <div class="flex justify-end gap-1">
            <button type="submit" class="bg-primary text-white px-4 py-2 rounded">
                {{ jobId ? 'Cập nhật' : 'Thêm mới' }}
            </button>
        </div>
    </form>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import JobService from '@/services/JobService.js';
    import DepartmentService from '@/services/DepartmentService.js';
    import { defineProps, defineEmits } from 'vue';

    const props = defineProps({ jobId: { type: [String, Number], default: null } });
    const emit = defineEmits(['saved']);

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
        applicationDeadlineStart: '',
        applicationDeadlineEnd: '',
        jobType: '',
        salary: '',
        status: 'active',
        location: ''
    });

    const departments = ref([]);

    onMounted(async () => {
        const deptRes = await DepartmentService.getAllDepartment();
        departments.value = deptRes.success ? deptRes.data : [];

        if (props.jobId) {
            const res = await JobService.getAllJob();
            const job = res.success ? res.data.find(j => j.id == props.jobId) : null;
            if (job) Object.assign(formData.value, job);
        }
    });

    async function submitForm() {
        if (props.jobId) {
            const res = await JobService.updateJob(formData.value, { id: props.jobId });
            if (res.success) emit('saved');
        } else {
            const res = await JobService.addJob(formData.value);
            if (res.success) emit('saved');
        }
    }
</script>