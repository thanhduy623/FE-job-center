<template>
    <div class="main-container flex flex-col gap-1">

        <!-- HEADER + FILTER -->
        <div class="flex flex-row items-center justify-between wrap gap-1 items-center">
            <h2 v-t="'pageApplication.interview'" class="text-uppercase text-primary"></h2>

            <div class="flex flex-row gap-1 flex-1 justify-end">
                <div class="flex flex-col">
                    <label>Chọn ngày:</label>
                    <input type="date" v-model="selectedDate" @change="onFilterChange" />
                </div>
            </div>
        </div>

        <div v-if="scheduledApplicants.length === 0" class="text-primary">
            Không có lịch phỏng vấn.
        </div>

        <div v-else>
            <TableComponent :rows="tableRows" :columns="tableHeaders" class="mt-1" />
        </div>
    </div>

    <!-- OVERLAY UPDATE FORM -->
    <div v-if="showUpdateForm" class="overlay-update-form">
        <form style="width: 600px;">
            <h3 class="text-primary text-center text-uppercase">Cập nhật lịch</h3>

            <label>Họ tên</label>
            <input type="text" v-model="formData.fullName" disabled>

            <label>Ngày</label>
            <input type="date" v-model="formData.scheduleDate">

            <div class="flex flex-row gap-1">
                <div class="flex flex-col flex-1">
                    <label>Bắt đầu</label>
                    <input type="time" v-model="formData.scheduleStartTime">
                </div>
                <div class="flex flex-col flex-1">
                    <label>Kết thúc</label>
                    <input type="time" v-model="formData.scheduleEndTime">
                </div>
            </div>

            <div class="flex flex-row justify-end gap-1 mt-1">
                <button class="btn btn-secondary" @click.prevent="cancelUpdate">Hủy</button>
                <button class="btn btn-primary" @click.prevent="confirmUpdate">Cập nhật</button>
            </div>
        </form>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted } from "vue";
    import { useRouter } from "vue-router";

    import TableComponent from "@/components/tables/tableComponent.vue";
    import { getSchedule, updateSchedule } from "@/services/ScheduleInterviewService";

    const router = useRouter();

    const selectedDate = ref("");
    const scheduledApplicants = ref([]);

    /* ==========================
            LOAD SCHEDULE
    ========================== */
    const loadAllSchedule = async () => {
        try {
            const res = await getSchedule({});
            scheduledApplicants.value = res.success ? res.data : [];
        } catch {
            scheduledApplicants.value = [];
        }
    };

    const onFilterChange = async () => {
        try {
            const params = selectedDate.value
                ? { scheduleDate: selectedDate.value }
                : {};

            const res = await getSchedule(params);
            scheduledApplicants.value = res.success ? res.data : [];
        } catch {
            scheduledApplicants.value = [];
        }
    };

    onMounted(() => {
        loadAllSchedule();
    });

    /* ==========================
            SORT TIME
    ========================== */
    const sortedByTime = (apps) =>
        [...apps].sort((a, b) =>
            a.scheduleStartTime.localeCompare(b.scheduleStartTime)
        );

    /* ==========================
            TABLE DATA
    ========================== */
    const tableRows = computed(() =>
        sortedByTime(scheduledApplicants.value).map((app) => ({
            id: app.id,
            idApplication: app.applicationId.id,
            fullName: app.applicationId.fullName,
            jobName: app.jobId.name_vi,

            // gộp ngày + giờ vào 1 cột
            interviewTime: `${app.scheduleDate} | ${app.scheduleStartTime} - ${app.scheduleEndTime}`,

            status: app.applicationId.status,
            reason: app.reason || "",

            // vẫn giữ dữ liệu gốc để form update dùng
            scheduleDate: app.scheduleDate,
            startTime: app.scheduleStartTime,
            endTime: app.scheduleEndTime,
        }))
    );

    /* ==========================
            UPDATE FORM STATE
    ========================== */
    const showUpdateForm = ref(false);

    const formData = ref({
        id: "",
        fullName: "",
        scheduleDate: "",
        scheduleStartTime: "",
        scheduleEndTime: "",
    });

    /* ==========================
            TABLE ACTIONS
    ========================== */
    const tableHeaders = [
        { key: "fullName", label: "Họ tên" },
        { key: "jobName", label: "Công việc" },

        // CỘT GỘP
        { key: "interviewTime", label: "Thời gian phỏng vấn" },

        { key: "status", label: "Trạng thái" },
        { key: "reason", label: "Lý do" },
        {
            key: "action",
            label: "Hành động",
            actions: [
                {
                    icon: "📄",
                    label: "Xem hồ sơ",
                    func: (row) => router.push(`/application/${row.idApplication}`)
                },
                {
                    icon: "🔀",
                    label: "Cập nhật lịch",
                    func: (row) => {
                        formData.value = {
                            id: row.id,
                            fullName: row.fullName,
                            scheduleDate: row.scheduleDate,
                            scheduleStartTime: row.startTime,
                            scheduleEndTime: row.endTime,
                        };
                        showUpdateForm.value = true;
                    }
                }
            ]
        }
    ];

    /* ==========================
            CONFIRM UPDATE
    ========================== */
    const confirmUpdate = async () => {
        const res = await updateSchedule({
            id: formData.value.id,
            scheduleDate: formData.value.scheduleDate,
            scheduleStartTime: formData.value.scheduleStartTime,
            scheduleEndTime: formData.value.scheduleEndTime,
        });

        if (res.success) {
            showUpdateForm.value = false;
            await onFilterChange();
        }
    };

    /* ==========================
            CANCEL UPDATE
    ========================== */
    const cancelUpdate = () => {
        showUpdateForm.value = false;
        formData.value = {
            id: "",
            fullName: "",
            scheduleDate: "",
            scheduleStartTime: "",
            scheduleEndTime: "",
        };
    };
</script>

<style>
    form {
        background-color: white;
    }

    .overlay-update-form {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.4);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    }
</style>