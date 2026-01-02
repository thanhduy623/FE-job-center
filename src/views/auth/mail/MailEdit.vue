<template>
    <div class="main-container">
        <h2 class="text-primary">Quản lý mẫu email hệ thống</h2>

        <div class="flex flex-row wrap gap-2 mt-2">
            <!-- LEFT: Editor -->
            <div class="card flex-1 flex flex-col gap-1">
                <h3>Chỉnh sửa nội dung</h3>
                <TextEditerSingle ref="emailEditor" v-model="contentHtml" :height="'650px'"
                    placeholder="Nhập nội dung email tại đây..." />

                <div class="flex justify-end gap-1 mt-2">
                    <button class="text-uppercase bg-gray-400" @click="reset">
                        {{ $t('reset')}}
                    </button>
                    <button class="text-uppercase bg-primary text-white" @click="save">
                        {{ $t('update')}}
                    </button>
                </div>
            </div>

            <!-- RIGHT: Preview -->
            <MailInterview :contentHtml="contentHtml" />
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import TextEditerSingle from '@/components/textEditers/TextEditerSingle.vue'
    import MailInterview from '@/components/mails/MailRejected.vue'


    const emailEditor = ref(null)
    const defaultContent = defaultContentHired || defaultContentInterview || defaultContentRejected || defaultContentHired

    const defaultContentInterview = `
<p>Kính gửi ứng viên {{ fullName }},</p>

<p>Cảm ơn bạn đã quan tâm và nộp hồ sơ vào vị trí <strong>{{ jobName }}</strong> tại Hệ thống giáo dục Việt Anh. Chúng tôi trân trọng mời bạn tham dự buổi phỏng vấn với chúng tôi theo thông tin sau:</p>

<ul>
  <li><strong>Thời gian:</strong> {{ scheduleTime }}</li>
  <li><strong>Địa điểm:</strong> {{ location }}</li>
  <li><strong>Trang phục:</strong> Lịch sự, phù hợp với môi trường giáo dục</li>
</ul>

<p>Vui lòng xác nhận phỏng vấn hoặc phản hồi nếu không thể tham gia bằng cách nhấn vào link xác nhận bên dưới trong vòng 07 ngày kể từ ngày nhận email này: {{ linkConfirm }}</p>

<p>Trân trọng./.</p>
`



    const defaultContentHired = `
<p>Kính gửi ứng viên {{ fullName }},</p>

<p>Chúng tôi rất vui mừng thông báo rằng bạn đã <strong>đậu phỏng vấn</strong> cho vị trí <strong>{{ jobName }}</strong> tại Hệ thống giáo dục Việt Anh. Chúng tôi đánh giá cao năng lực, kinh nghiệm và sự phù hợp của bạn với văn hóa tại đơn vị.</p>

<p><strong>Thông tin chi tiết về việc nhận việc:</strong></p>
<ul>
  <li><strong>Cơ sở tiếp nhận hồ sơ:</strong> {{ locationName }}</li>
  <li><strong>Đơn vị quản lý trực tiếp:</strong> {{ department }}</li>
  <li><strong>Địa chỉ liên hệ / ký hợp đồng:</strong> {{ address }}</li>
  <li><strong>Hồ sơ, giấy tờ cần chuẩn bị:</strong> {{ documents }}</li>
</ul>

<p>Chúng tôi rất mong được chào đón bạn gia nhập Hệ thống giáo dục Việt Anh và cùng nhau phát triển trong thời gian tới.</p>

<p>Mọi chi tiết hoặc thắc mắc vui lòng liên hệ qua email <a href="mailto:{{ emailContact }}">{{ emailContact }}</a>. Không phản hồi lại email này!</p>

<p>Trân trọng./.</p>
`



    const defaultContentRejected = `
<p>Kính gửi ứng viên {{ fullName }},</p>

<p>Cảm ơn bạn đã quan tâm và tham gia phỏng vấn cho vị trí <strong>{{ jobName }}</strong> tại <strong>{{ locationName }}</strong>. Sau quá trình đánh giá kỹ lưỡng, rất tiếc chúng tôi thông báo rằng bạn <strong>chưa phù hợp</strong> cho vị trí này tại đơn vị chúng tôi.</p>

<p>Chúng tôi đánh giá cao sự nỗ lực, kinh nghiệm và thời gian mà bạn đã dành cho quá trình tuyển dụng. Hồ sơ của bạn sẽ được lưu lại và chúng tôi có thể liên hệ cho các cơ hội phù hợp trong tương lai.</p>

<p>Chúc bạn nhiều thành công trên con đường sự nghiệp sắp tới và hy vọng sẽ có cơ hội hợp tác với bạn trong các dự án hoặc vị trí khác tại Hệ thống giáo dục Việt Anh.</p>

<p>Mọi chi tiết hoặc thắc mắc vui lòng liên hệ qua email <a href="mailto:{{ emailContact }}">{{ emailContact }}</a>. Không phản hồi lại email này!</p>

<p>Trân trọng./.</p>
`


    const contentHtml = ref(defaultContent)

    function reset() {
        if (emailEditor.value) {
            emailEditor.value.setContent(defaultContent)
            contentHtml.value = defaultContent
        }
    }

    function save() {
        console.log('HTML lưu xuống DB:', contentHtml.value)
        alert('Đã lưu mẫu email!')
    }
</script>

<style scoped>
    .editor-container {
        min-height: 400px;
        background: #f9f9f9;
        border-radius: 8px;
    }
</style>