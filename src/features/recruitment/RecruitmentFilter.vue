<template>
    <div class="recruitment-filter-container p-1">
        <button class="filter-btn bg-primary" @click="applyFilter">
            Áp dụng bộ lọc
        </button>

        <h4>Phân ban</h4>
        <div v-for="dept in departments" :key="dept.departmentId">
            <input type="checkbox" :id="dept.departmentId" :value="dept.departmentId"
                v-model="internalSelectedDepartments" />
            <label :for="dept.departmentId">{{ dept.departmentName }}</label>
        </div>

        <hr />

        <h4>Công việc</h4>
        <div v-for="job in jobs" :key="job.jobId">
            <input type="checkbox" :id="job.jobId" :value="job.jobId" v-model="internalSelectedJobs" />
            <label :for="job.jobId">{{ job.jobName }}</label>
        </div>
    </div>
</template>


<script setup>
    import { ref, watch, onMounted, defineProps, defineEmits } from "vue"

    // Nhận vào từ component cha
    const props = defineProps({
        selectedDepartments: { type: Array, default: () => [] },
        selectedJobs: { type: Array, default: () => [] }
    })

    // Dữ liệu toàn cục
    const departments = ref([]);
    const jobs = ref([]);


    // Emit khi con thay đổi
    const emit = defineEmits(["apply-filter"])

    // Sao chép props sang cục bộ
    const internalSelectedDepartments = ref([...props.selectedDepartments])
    const internalSelectedJobs = ref([...props.selectedJobs])


    // ================= WATCH =================

    // Cha --> Con
    watch(
        () => props.selectedDepartments,
        (val) => { internalSelectedDepartments.value = [...val] }
    )

    watch(
        () => props.selectedJobs,
        (val) => { internalSelectedJobs.value = [...val] }
    )


    // Con --> Cha
    // watch(internalSelectedDepartments, (val) => {
    //     emit("update:selectedDepartments", val)
    // })

    // watch(internalSelectedJobs, (val) => {
    //     emit("update:selectedJobs", val)
    // })


    // ================= FUNTION =================

    // Lấy danh sách phòng ban
    function getDepartments() {
        return ([
            { departmentId: "01", departmentName: "Ban Văn phòng" },
            { departmentId: "02", departmentName: "Ban Kế toán" },
            { departmentId: "03", departmentName: "Ban Giảng dạy" },
            { departmentId: "04", departmentName: "Ban Bảo vệ" },
            { departmentId: "05", departmentName: "Ban Tạp vụ" }
        ])
    }

    // Lấy danh sách công việc
    function getJobs() {
        return ([
            { jobId: "0101", jobName: "Nhân viên Hành chính", departmentId: "01" },
            { jobId: "0102", jobName: "Thư ký Văn phòng", departmentId: "01" },
            { jobId: "0103", jobName: "Nhân viên Y tế", departmentId: "01" },
            { jobId: "0201", jobName: "Kế toán viên", departmentId: "02" },
            { jobId: "0202", jobName: "Thủ quỹ", departmentId: "02" },
            { jobId: "0301", jobName: "Giáo viên đứng lớp", departmentId: "03" },
            { jobId: "0302", jobName: "Giáo viên Mỹ thuật", departmentId: "03" },
            { jobId: "0303", jobName: "Giáo viên Thể dục", departmentId: "03" },
            { jobId: "0304", jobName: "Giáo viên Tin học", departmentId: "03" },
            { jobId: "0305", jobName: "Giáo viên Tiếng Anh", departmentId: "03" },
            { jobId: "0306", jobName: "Trợ giảng Ngoại ngữ", departmentId: "03" },
            { jobId: "0401", jobName: "Nhân viên Bảo vệ ca ngày", departmentId: "04" },
            { jobId: "0402", jobName: "Nhân viên Bảo vệ ca đêm", departmentId: "04" },
            { jobId: "0501", jobName: "Nhân viên Tạp vụ lớp học", departmentId: "05" },
            { jobId: "0502", jobName: "Nhân viên Tạp vụ khuôn viên", departmentId: "05" }])
    }

    function applyFilter() {
        // Chỉ emit khi bấm nút
        emit("apply-filter", {
            selectedDepartments: internalSelectedDepartments.value,
            selectedJobs: internalSelectedJobs.value
        })
    }

    // ================= FUNTION =================

    // Khởi chạy ban đầu
    onMounted(() => {
        departments.value = getDepartments();
        jobs.value = getJobs();
    })
</script>


<style scoped>
    .recruitment-filter-container {
        min-width: 300px;
        max-width: 350px;
        border: 3px solid var(--color-primary);
        border-radius: 16px;
    }

    .filter-btn {
        width: 100%;
        border-radius: 0;
        margin-bottom: 10px;
    }
</style>