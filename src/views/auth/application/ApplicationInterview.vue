<template>
    <div class="main-container flex flex-col gap-1">
        <!-- HEADER + FILTER -->
        <div class="flex flex-row items-center justify-between">
            <h2 v-t="'pageApplication.interview'" class="text-primary text-title"></h2>

            <div class="flex flex-row gap-1 wrap">
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

        <!-- DISPLAY SCHEDULE -->
        <div v-else-if="scheduledApplicants.length === 0" class="text-primary">
            Không có lịch phỏng vấn cho ngày và cơ sở này.
        </div>

        <div v-else>
            <TableComponent :rows="tableRows" :columns="tableHeaders" class="mt-1" />
        </div>
    </div>
</template>

<script setup>
    import { ref, computed } from "vue";
    import { useRouter } from "vue-router"

    import LocationSelect from "@/components/selects/LocationSelect.vue";
    import TableComponent from "@/components/tables/tableComponent.vue";
    import { getSchedule, updateSchedule } from "@/services/ScheduleInterviewService";

    const router = useRouter()
    const selectedDate = ref("");
    const selectedLocation = ref("");
    const scheduledApplicants = ref([]);

    // Lấy dữ liệu khi filter thay đổi
    const onFilterChange = async () => {
        if (!selectedDate.value || !selectedLocation.value) {
            scheduledApplicants.value = [];
            console.log("Chưa đủ thông tin để lấy dữ liệu");
            return;
        }

        try {
            const res = await getSchedule({ scheduleDate: selectedDate.value });
            console.log(res);

            if (res.success) {
                scheduledApplicants.value = res.data.filter(
                    (app) => app.locationId === selectedLocation.value
                );
            } else {
                scheduledApplicants.value = [];
                console.log("API trả về lỗi hoặc không có dữ liệu");
            }
        } catch (err) {
            console.error("Lỗi tải dữ liệu:", err);
            scheduledApplicants.value = [];
        }
    };

    // Sắp xếp theo thời gian
    const sortedByTime = (apps) => {
        return [...apps].sort((a, b) =>
            a.scheduleStartTime.localeCompare(b.scheduleStartTime)
        );
    };

    // Chuyển dữ liệu sang dạng bảng
    const tableRows = computed(() =>
        sortedByTime(scheduledApplicants.value).map((app) => ({
            id: app.id,
            idApplication: app.applicationId.id,
            fullName: app.applicationId.fullName,
            jobName: app.jobId.name_vi,
            startTime: app.scheduleStartTime,
            endTime: app.scheduleEndTime,
            status: app.applicationId.status,
            reason: app.reason || "",
        }))
    );

    // Cấu hình các cột bảng
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
                    func: async (row) => {
                        const newDate = prompt("Nhập ngày mới (YYYY-MM-DD):", row.startDate || "");
                        if (!newDate) return;

                        const newStart = prompt("Nhập giờ bắt đầu mới (HH:mm):", row.startTime);
                        if (!newStart) return;

                        const newEnd = prompt("Nhập giờ kết thúc mới (HH:mm):", row.endTime);
                        if (!newEnd) return;

                        try {
                            const res = await updateSchedule({
                                id: row.id,
                                scheduleDate: newDate,
                                scheduleStartTime: newStart,
                                scheduleEndTime: newEnd
                            });
                            if (res.success) {
                                alert("Cập nhật thành công!");
                                // Cập nhật dữ liệu local luôn
                                row.startTime = newStart;
                                row.endTime = newEnd;
                                row.scheduleDate = newDate;
                            } else {
                                alert("Cập nhật thất bại: " + (res.message || ""));
                            }
                        } catch (err) {
                            console.error(err);
                            alert("Lỗi khi cập nhật lịch.");
                        }
                    }
                }
            ]
        }
    ];
</script>