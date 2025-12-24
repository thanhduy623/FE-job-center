<template>
    <div class="confirm-interview-container flex flex-col items-center">
        <!-- Form xác nhận -->
        <form v-if="!submitted" class="flex flex-col items-center" @submit.prevent="handleSubmit">
            <img class="logo" src="@/assets/images/logo.webp" alt="logo">
            <h1 class="text-primary text-uppercase text-center" v-t="'pageApplication.confirm'"></h1>

            <label>Tên ứng viên:</label>
            <input type="text" :value="applicantName" readonly />

            <label>Xác nhận tham gia:</label>
            <select v-model="canAttend" @change="handleSelectChange">
                <option value="true">Tôi có thể tham gia</option>
                <option value="false">Tôi không thể tham gia</option>
            </select>

            <label v-if="showReason">Lý do và đề xuất ngày:</label>
            <textarea v-if="showReason" v-model="reason" placeholder="Vui lòng nhập lý do và đề xuất ngày khác"
                required></textarea>

            <button type="submit" class="bg-primary">
                XÁC NHẬN
            </button>

        </form>

        <!-- Thông báo sau submit -->
        <form v-else class="flex flex-col items-center">
            <img class="logo" src="@/assets/images/logo.webp" alt="logo">
            <h1 class="text-primary text-uppercase text-center" v-t="'pageApplication.confirm'"></h1>
            <p v-if="submitSuccess && canAttend === 'true'">Bạn đã xác nhận tham dự thành công!</p>
            <p v-else-if="submitSuccess && canAttend === 'false'">Cảm ơn bạn đã phản hồi. Chúng tôi sẽ xem xét và liên
                hệ bạn sớm nhất.</p>
            <p v-else class="text-error"> {{textError}}</p>
        </form>

    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { useRoute } from 'vue-router'
    import { getScheduleByToken } from '@/services/ScheduleInterviewService.js'
    import ApplicationService from "@/services/ApplicationService.js"

    const route = useRoute()
    const id = route.params.id

    // state
    const applicantName = ref('')
    const canAttend = ref('true')
    const reason = ref('')
    const showReason = ref(false)
    const submitted = ref(false)
    const submitSuccess = ref(false)
    const textError = ref("Xác nhận lỗi, vui lòng thử lại hoặc liên hệ trung tâm tuyển dụng: xxx")

    // xử lý ẩn/hiện textarea lý do
    function handleSelectChange() {
        showReason.value = canAttend.value === 'false'
    }

    // gọi API lấy thông tin
    onMounted(async () => {
        if (id) {
            const res = await getScheduleByToken(id)

            if (res.success && res.data.length) {
                applicantName.value = res.data[0]?.Token_applicationId_fkey?.fullName || 'Không rõ tên'
            } else {
                submitted.value = true;
                submitSuccess.value = false;
                textError.value = 'Token không hợp lệ hoặc đã phản hồi'
            }
        }
    })

    // handle submit
    async function handleSubmit() {
        submitted.value = true

        const fd = new FormData();
        fd.append("token", id)
        fd.append("canAttend", canAttend.value)
        fd.append("reason", reason.value)

        try {
            const res = await ApplicationService.confirmMailer(fd)

            if (res.length > 0) {
                submitSuccess.value = true
            } else {
                submitSuccess.value = false
            }
        } catch (err) {
            console.error(err)
            submitSuccess.value = false
        }
    }
</script>

<style scoped>
    form {
        background-color: rgba(255, 255, 255, 0.8);
        box-shadow: 0 2px 20px var(--color-primary);
    }

    .logo {
        height: 80px;
    }

    .text-error {
        color: red;
    }
</style>