<template>
    <div class="main-container flex flex-col gap-1">
        <!-- HEADER -->
        <div class="flex flex-row items-center justify-between">
            <h2 v-t="'pageApplication.interview'" class="text-primary text-title"></h2>
        </div>

        <!-- TABLES -->
        <div v-if="groupedData.length">
            <div v-for="group in groupedData" :key="group.key" class="mb-3">
                <!-- SUBTITLE -->
                <div class="flex flex-row items-center mb-1">
                    <div class="flex-1 text-primary font-bold">
                        {{ group.locationName }} - {{ group.departmentName }}
                    </div>

                    <button class="bg-primary" :disabled="!hasChecked(group)" @click="openSchedulePopup(group)">
                        Xếp lịch phỏng vấn
                    </button>
                </div>

                <table class="table table-bordered table-striped w-full">
                    <thead>
                        <tr>
                            <th>
                                <input type="checkbox" :checked="isAllChecked(group)"
                                    @change="toggleCheckAll(group, $event)" />
                            </th>
                            <th>Họ tên</th>
                            <th>Công việc</th>
                            <th>Ngày</th>
                            <th>Bắt đầu</th>
                            <th>Kết thúc</th>
                            <th>Gửi mail</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="app in group.applicants" :key="app.id">
                            <td>
                                <input type="checkbox" v-model="checkedMap[app.id]" />
                            </td>

                            <td class="text-uppercase">{{ app.email }}</td>

                            <td>
                                {{ app.Application_jobId_fkey?.name_vi || app.Application_jobId_fkey?.name_en }}
                            </td>

                            <td>{{ app.scheduleDate || '' }}</td>
                            <td>{{ app.scheduleStartTime || '' }}</td>
                            <td>{{ app.scheduleEndTime || '' }}</td>

                            <!-- SEND MAIL COLUMN -->
                            <td>
                                <!-- ĐÃ GỬI -->
                                <span v-if="app.sentMail" class="text-success">
                                    Đã gửi
                                </span>

                                <!-- LOADING -->
                                <span v-else-if="app.loading">
                                    Đang gửi...
                                </span>

                                <!-- BUTTON -->
                                <button v-else-if="canSendMail(app)" class="bg-primary" @click="handleSendMail(app)">
                                    Gửi mail
                                </button>

                                <!-- ERROR -->
                                <span v-else-if="app.mailError" class="text-danger">
                                    {{ app.mailError }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div v-else>Không có dữ liệu để hiển thị.</div>

        <!-- POPUP -->
        <div v-if="showPopup" class="popup-overlay">
            <div class="popup">
                <h3 class="text-primary mb-1">Xếp lịch phỏng vấn</h3>

                <div class="flex flex-col gap-1">
                    <div class="flex flex-col">
                        <label>Ngày phỏng vấn</label>
                        <input type="date" v-model="popupDate" />
                    </div>

                    <div class="flex flex-row wrap gap-1">
                        <div class="flex flex-col">
                            <label>Thời lượng phỏng vấn (phút)</label>
                            <select v-model.number="popupDuration">
                                <option v-for="t in [15,20,25,30,35,40,45]" :key="t" :value="t">
                                    {{ t }}
                                </option>
                            </select>
                        </div>

                        <div class="flex flex-col">
                            <label>Thời lượng nghỉ giữa ca (phút)</label>
                            <select v-model.number="popupBreak">
                                <option v-for="b in [2,3,5,10]" :key="b" :value="b">
                                    {{ b }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div class="flex flex-row wrap gap-1">
                        <div class="flex flex-col">
                            <label>Bắt đầu ca sáng</label>
                            <input type="time" v-model="popupMorningStart" />
                        </div>

                        <div class="flex flex-col">
                            <label>Kết thúc ca sáng</label>
                            <input type="time" v-model="popupMorningEnd" />
                        </div>
                    </div>

                    <div class="flex flex-row wrap gap-1">
                        <div class="flex flex-col">
                            <label>Bắt đầu ca chiều</label>
                            <input type="time" v-model="popupAfternoonStart" />
                        </div>

                        <div class="flex flex-col">
                            <label>Kết thúc ca chiều</label>
                            <input type="time" v-model="popupAfternoonEnd" />
                        </div>
                    </div>
                </div>

                <div class="flex justify-end gap-1 mt-2">
                    <button @click="closePopup">Hủy</button>
                    <button class="bg-primary" @click="confirmSchedule">Xác nhận</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, computed } from 'vue'
    import ApplicationService from '@/services/ApplicationService'
    import DepartmentService from '@/services/DepartmentService'
    import LocationService from '@/services/LocationService'
    import { computeSchedule } from '@/utils/computeSchedule'

    const rawApplications = ref([])
    const rawDepartments = ref([])
    const rawLocations = ref([])
    const checkedMap = ref({})

    const showPopup = ref(false)
    const activeGroup = ref(null)
    const popupDate = ref(null)
    const popupDuration = ref(25)
    const popupBreak = ref(5)
    const popupMorningStart = ref('08:00')
    const popupMorningEnd = ref('11:30')
    const popupAfternoonStart = ref('13:30')
    const popupAfternoonEnd = ref('17:00')

    const departmentMap = computed(() => {
        const map = {}
        rawDepartments.value.forEach(d => {
            map[d.id] = d.name_vi || d.name_en
        })
        return map
    })

    const locationMap = computed(() => {
        const map = {}
        rawLocations.value.forEach(l => {
            map[l.id] = l.name_vi || l.name_en
        })
        return map
    })

    const groupedData = computed(() => {
        const grouped = {}

        rawApplications.value.forEach(app => {
            const l = app.Application_jobId_fkey?.locationId
            const d = app.Application_jobId_fkey?.departmentId
            const key = `${l}-${d}`

            if (!grouped[key]) {
                grouped[key] = {
                    key,
                    locationName: locationMap.value[l],
                    departmentName: departmentMap.value[d],
                    applicants: []
                }
            }

            if (checkedMap.value[app.id] === undefined) {
                checkedMap.value[app.id] = false
            }

            grouped[key].applicants.push(app)
        })

        return Object.values(grouped)
    })

    function hasChecked(group) {
        return group.applicants.some(a => checkedMap.value[a.id])
    }

    function isAllChecked(group) {
        return group.applicants.every(a => checkedMap.value[a.id])
    }

    function toggleCheckAll(group, e) {
        group.applicants.forEach(a => {
            checkedMap.value[a.id] = e.target.checked
        })
    }

    function canSendMail(app) {
        return (
            app.scheduleDate &&
            app.scheduleStartTime &&
            app.scheduleEndTime &&
            !app.sentMail &&
            !app.loading
        )
    }

    /* SEND MAIL */
    async function handleSendMail(app) {
        app.loading = true
        app.mailError = null

        const fd = new FormData()
        fd.append('idApplication', app.id)
        fd.append('status', 'INTERVIEW')
        fd.append('scheduleStartTime', app.scheduleStartTime)
        fd.append('scheduleEndTime', app.scheduleEndTime)
        fd.append('scheduleDate', app.scheduleDate)

        try {
            await ApplicationService.sendMailer(fd)
            app.sentMail = true
        } catch (e) {
            app.mailError = 'Gửi thất bại'
        } finally {
            app.loading = false
        }
    }

    /* POPUP */
    function openSchedulePopup(group) {
        if (!hasChecked(group)) return
        activeGroup.value = group
        showPopup.value = true
    }

    function closePopup() {
        showPopup.value = false
        activeGroup.value = null
    }

    function confirmSchedule() {
        if (!activeGroup.value || !popupDate.value) return

        const selectedApplicants = activeGroup.value.applicants.filter(
            app => checkedMap.value[app.id]
        )

        const result = computeSchedule(
            [new Date(popupDate.value)],
            popupDuration.value,
            popupBreak.value,
            popupMorningStart.value,
            popupMorningEnd.value,
            popupAfternoonStart.value,
            popupAfternoonEnd.value,
            selectedApplicants
        )

        if (result?.length) {
            const map = {}
            result.forEach(r => (map[r.id] = r))

            activeGroup.value.applicants.forEach(app => {
                if (map[app.id]) {
                    app.scheduleDate = map[app.id].scheduleDate
                    app.scheduleStartTime = map[app.id].scheduleStartTime
                    app.scheduleEndTime = map[app.id].scheduleEndTime
                }
            })
        }

        closePopup()
    }

    async function loadData() {
        const resApp = await ApplicationService.getApplicationInterview()
        if (resApp.success) rawApplications.value = resApp.data

        const resDept = await DepartmentService.getDepartment()
        if (resDept.success) rawDepartments.value = resDept.data

        const resLoc = await LocationService.getLocation()
        if (resLoc.success) rawLocations.value = resLoc.data
    }

    onMounted(loadData)
</script>


<style scoped>
    .popup-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .popup {
        background: #fff;
        padding: 1rem;
        max-width: 650px;
        border-radius: 8px;
    }

    .mb-3 {
        margin-bottom: 16px;
    }

    th input[type="checkbox"] {
        background-color: white;
    }

    table th:nth-child(1) {
        width: 40px;
    }

    table th:nth-child(2) {
        width: 320px;
    }

    table th:nth-child(3) {
        width: 350px;
    }

    table th:nth-child(4) {
        width: 120px;
    }

    table th:nth-child(5) {
        width: 100px;
    }

    table th:nth-child(6) {
        width: 100px;
    }
</style>