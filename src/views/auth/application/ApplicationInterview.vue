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

                <div class="flex flex-col">
                    <label>Chọn cơ sở:</label>
                    <LocationSelect v-model="selectedLocation" @change="onFilterChange" />
                </div>
            </div>
        </div>

        <!-- EMPTY CHECK -->
        <div v-if="!selectedDate || !selectedLocation" class="text-primary">
            Vui lòng chọn ngày và cơ sở để xem lịch.
        </div>

        <div v-else-if="scheduledApplicants.length === 0" class="text-primary">
            Không có lịch phỏng vấn cho ngày và cơ sở này.
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
    import { ref, computed } from "vue";
    import { useRouter } from "vue-router";

    import LocationSelect from "@/components/selects/LocationSelect.vue";
    import TableComponent from "@/components/tables/tableComponent.vue";
    import { getSchedule, updateSchedule } from "@/services/ScheduleInterviewService";

    const router = useRouter();
    const selectedDate = ref("");
    const selectedLocation = ref("");
    const scheduledApplicants = ref([]);

    /* ==========================
            LOAD SCHEDULE
    =========================== */
    const onFilterChange = async () => {
        if (!selectedDate.value || !selectedLocation.value) {
            scheduledApplicants.value = [];
            return;
        }

        try {
            const res = await getSchedule({ scheduleDate: selectedDate.value });

            if (res.success) {
                scheduledApplicants.value = res.data.filter(
                    (app) => app.locationId === selectedLocation.value
                );
            } else {
                scheduledApplicants.value = [];
            }
        } catch {
            scheduledApplicants.value = [];
        }
    };

    /* ==========================
            SORT TIME
    =========================== */
    const sortedByTime = (apps) =>
        [...apps].sort((a, b) =>
            a.scheduleStartTime.localeCompare(b.scheduleStartTime)
        );

    /* ==========================
            TABLE DATA
    =========================== */
    const tableRows = computed(() =>
        sortedByTime(scheduledApplicants.value).map((app) => ({
            id: app.id,
            idApplication: app.applicationId.id,
            fullName: app.applicationId.fullName,
            jobName: app.jobId.name_vi,
            startTime: app.scheduleStartTime,
            endTime: app.scheduleEndTime,
            scheduleDate: app.scheduleDate,
            status: app.applicationId.status,
            reason: app.reason || "",
        }))
    );

    /* ==========================
            UPDATE FORM STATE
    =========================== */
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
    =========================== */
    const tableHeaders = [
        { key: "fullName", label: "Họ tên" },
        { key: "jobName", label: "Công việc" },
        { key: "startTime", label: "Bắt đầu" },
        { key: "endTime", label: "Kết thúc" },
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
                            scheduleDate: row.scheduleDate || selectedDate.value,
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
    =========================== */
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
    =========================== */
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

    .overlay {
        z-index: 9999;
    }

    /* Overay phủ toàn màn hình */
    .overlay-update-form {
        position: fixed;
        /* fixed */
        top: 0;
        /* top-0 */
        left: 0;
        /* left-0 */
        width: 100%;
        /* w-full */
        height: 100%;
        /* h-full */
        background-color: rgba(0, 0, 0, 0.4);
        /* bg-black bg-opacity-40 */
        display: flex;
        /* flex */
        justify-content: center;
        /* justify-center */
        align-items: center;
        /* items-center */
        z-index: 9999;
    }
</style>