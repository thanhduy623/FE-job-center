<template>
    <div class="main-container flex flex-col gap-1">
        <div class="flex flex-row items-center justify-between">
            <h2 v-t="'pageApplication.interview'" class="text-primary text-title"></h2>
        </div>

        <!-- INPUTS -->
        <div class="flex flex-col wrap gap-1">
            <div class="flex flex-row gap-1 wrap">
                <div class="flex flex-col flex-1">
                    <label class="w-40">Chọn cơ sở:</label>
                    <LocationSelect v-model="selectedLocation" />
                </div>

                <div class="flex flex-col flex-1">
                    <label>Chọn ngày (có thể không liên tiếp):</label>
                    <MultiDatePicker v-model="selectedDates" />
                </div>

                <div class="flex flex-col flex-1">
                    <label>Thời gian phỏng vấn mỗi lượt (phút)</label>
                    <select v-model.number="duration">
                        <option v-for="t in [15,20,25,30,35,40,45]" :key="t" :value="t">{{ t }} phút</option>
                    </select>
                </div>

                <div class="flex flex-col flex-1">
                    <label>Thời gian nghỉ giữa các lượt (phút)</label>
                    <select v-model.number="breakTime">
                        <option v-for="b in [2,3,5,10]" :key="b" :value="b">{{ b }} phút</option>
                    </select>
                </div>
            </div>

            <div class="flex flex-row gap-1 wrap">
                <div class="flex flex-col flex-1">
                    <label>Bắt đầu ca sáng</label>
                    <input type="time" v-model="morningStart" />
                </div>
                <div class="flex flex-col flex-1">
                    <label>Kết thúc ca sáng</label>
                    <input type="time" v-model="morningEnd" />
                </div>

                <div class="flex flex-col flex-1">
                    <label>Bắt đầu ca chiều</label>
                    <input type="time" v-model="afternoonStart" />
                </div>
                <div class="flex flex-col flex-1">
                    <label>Kết thúc ca chiều</label>
                    <input type="time" v-model="afternoonEnd" />
                </div>
            </div>

            <div class="flex flex-row gap-1 justify-end">
                <button class="bg-primary" @click="handleSubmit" v-t="'sendMail'"></button>
                <button class="bg-secondary" @click="handleComputeSchedule" v-t="'getData'"></button>
                <button type="reset" @click="handleReset" v-t="'reset'"></button>
            </div>
        </div>

        <!-- OUTPUT SCHEDULE -->
        <div id="schedule-container" v-if="groupedSchedule.length">
            <h3 class="text-primary">LỊCH PHỎNG VẤN DỰ KIẾN</h3>

            <div v-for="day in groupedSchedule" :key="day.date">
                <div v-for="dept in day.departments" :key="dept.id">
                    <h4 class="text-primary"> {{ dept.name }} </h4>

                    <div class="schedule-grid gap-1">
                        <div class="card" v-for="app in dept.applicants" :key="app.id">
                            <h5 class="text-uppercase">{{ app.fullName }}</h5>

                            <p><strong>Công việc: </strong>{{ app.Application_jobId_fkey?.name_vi }}</p>

                            <p>
                                <strong>Thời gian: </strong>
                                {{ app.scheduleTime }} - {{ app.scheduleEndTime }},
                                ngày {{ app.scheduleDate }}
                            </p>

                            <p><strong>Trạng thái: </strong>{{ app.status }}</p>

                            <p><strong>SĐT: </strong>{{ app.phone }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else>
            Không có lịch phỏng vấn để hiển thị.
        </div>

    </div>
</template>

<script setup>
    import { ref, onMounted, computed } from "vue"
    import { computeSchedule } from '@/utils/computeSchedule';

    import LocationSelect from "@/components/selects/LocationSelect.vue"
    import MultiDatePicker from "@/components/selects/MultiDatePicker.vue"
    import ApplicationService from "@/services/ApplicationService.js"
    import DepartmentService from "@/services/DepartmentService.js"
    import ApplicationWorkflow from "@/workflows/ApplicationWorkflow.js"

    // state
    const selectedLocation = ref(null)
    const selectedDates = ref([])
    const duration = ref(25)
    const breakTime = ref(5)

    const morningStart = ref('08:00')
    const morningEnd = ref('11:30')
    const afternoonStart = ref('13:30')
    const afternoonEnd = ref('17:00')

    const rawApplications = ref([])
    const rawDepartments = ref([])
    const scheduledApplicants = ref([])

    // --- MAP DEPARTMENT NAME ---
    const departmentMap = computed(() => {
        const map = {};
        rawDepartments.value.forEach(dept => {
            map[dept.id] = dept.name_vi || dept.name_en || 'Không rõ khoa';
        });
        return map;
    });

    // --- GROUP LOGIC ---
    const groupedSchedule = computed(() => {
        const list = scheduledApplicants.value;
        if (!list || list.length === 0) return [];

        const grouped = {};

        list.forEach(app => {
            const date = app.scheduleDate;
            const deptId = app.Application_jobId_fkey?.departmentId || 'UNKNOWN';

            if (!grouped[date]) grouped[date] = {};
            if (!grouped[date][deptId]) grouped[date][deptId] = [];

            grouped[date][deptId].push(app);
        });

        return Object.keys(grouped).map(date => ({
            date,
            departments: Object.keys(grouped[date]).map(deptId => ({
                id: deptId,
                name: departmentMap.value[deptId] || 'Không rõ khoa',
                applicants: grouped[date][deptId].sort((a, b) =>
                    a.scheduleStartTime.localeCompare(b.scheduleStartTime)
                )
            }))
                .filter(dept => dept.applicants.length > 0)
        }))
            .filter(day => day.departments.length > 0);
    });

    // --- HANDLER ---
    function handleReset() {
        selectedLocation.value = "";
        selectedDates.value = []
        duration.value = 25
        breakTime.value = 5

        morningStart.value = '08:00'
        morningEnd.value = '11:30'
        afternoonStart.value = '13:30'
        afternoonEnd.value = '17:00'

        rawApplications.value = []
        rawDepartments.value = []
        scheduledApplicants.value = []
    }

    async function handleSubmit() {
        if (!scheduledApplicants.value.length) {
            console.warn("Chưa có lịch ứng viên để gửi mail");
            return;
        }

        const promises = scheduledApplicants.value.map(async (app) => {
            const form = {
                idApplication: app.id,
                status: "INTERVIEW",
                scheduleStartTime: app.scheduleStartTime,
                scheduleEndTime: app.scheduleEndTime,
                scheduleDate: app.scheduleDate
            };

            try {
                const res = await ApplicationWorkflow.sendMailer(form);
                console.log(`✅ Mail sent for ${app.fullName}`, res);
                return { success: true, app, res };
            } catch (err) {
                console.error(`❌ Error sending mail for ${app.fullName}`, err);
                return { success: false, app, err };
            }
        });

        // Gửi song song tất cả mail và chờ hoàn tất
        const results = await Promise.all(promises);

        // Log tổng kết
        const successCount = results.filter(r => r.success).length;
        const failCount = results.length - successCount;

        console.log(`Finished sending mails: ${successCount} success, ${failCount} failed.`);
        console.log("Detailed results:", results);

        // Nếu muốn, có thể hiển thị thông báo cho người dùng
        alert(`Mail sending completed: ${successCount} success, ${failCount} failed.`);
    }



    const handleComputeSchedule = () => {
        getRawData()

        const result = computeSchedule(
            selectedLocation.value,
            selectedDates.value,
            duration.value,
            breakTime.value,
            morningStart.value,
            morningEnd.value,
            afternoonStart.value,
            afternoonEnd.value,
            rawApplications.value
        );

        scheduledApplicants.value = result || [];
    }



    // --- LOAD RAW DATA ---
    async function getRawData() {
        const resApplication = await ApplicationService.getApplicationInterview()
        if (resApplication.success) rawApplications.value = resApplication.data;

        const resDepartment = await DepartmentService.getDepartment()
        if (resDepartment.success) rawDepartments.value = resDepartment.data;
    }

    onMounted(async () => { getRawData() })
</script>

<style scoped>
    .schedule-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 1rem;
    }

    .card {
        padding: 1rem;
        border-radius: 8px;
        background: #fff;
        border: 1px solid #dcdcdc;
    }
</style>