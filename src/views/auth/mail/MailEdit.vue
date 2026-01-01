<template>
    <div class="main-container">
        <h2 class="text-primary">Quản lý mẫu email hệ thống</h2>

        <div class="flex flex-row wrap gap-2 mt-2">
            <!-- LEFT: QUILL EDITOR -->
            <div class="card flex-1 flex flex-col gap-1">
                <h3>Soạn nội dung email</h3>

                <!-- Quill Editor -->
                <div ref="editorContainer" class="editor-container"></div>

                <small class="text-sm text-secondary">
                    Bạn có thể sử dụng các biến để hiển thị:
                    <ul style="margin:4px 0 0 20px">
                        <li><strong v-pre>{{ fullName }} </strong> - Họ và tên ứng viên</li>
                        <li><strong v-pre>{{ jobName }}</strong> - Vị trí ứng tuyển</li>
                        <li><strong v-pre>{{ scheduleTime }}</strong> - Thời gian phỏng vấn</li>
                        <li><strong v-pre>{{ location }}</strong> - Địa điểm phỏng vấn</li>
                    </ul>
                    <br />
                </small>

                <div class="flex justify-end gap-1 mt-2">
                    <button class="p-1 rounded bg-gray-400" @click="reset">
                        Khôi phục mặc định
                    </button>
                    <button class="p-1 rounded bg-primary text-white" @click="save">
                        Lưu mẫu email
                    </button>
                </div>
            </div>

            <!-- RIGHT: PREVIEW -->
            <div class="card flex-1">
                <h3>Xem trước email</h3>
                <div v-html="previewHtml"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, computed } from 'vue'
    import Quill from 'quill'
    import 'quill/dist/quill.snow.css'

    const editorContainer = ref(null)
    let quill = null

    const defaultContent = `
<p>Kính gửi ứng viên {{ fullName }},</p>
<p>Cảm ơn bạn đã quan tâm và nộp hồ sơ vào vị trí <strong>{{ jobName }}</strong> tại Hệ thống giáo dục Việt Anh. Chúng tôi trân trọng mời bạn tham dự buổi phỏng vấn với chúng tôi theo thông tin sau:</p>
<ul>
<li><strong>Thời gian:</strong> {{ scheduleTime }}</li>
<li><strong>Địa điểm:</strong> {{ location }}</li>
<li><strong>Trang phục:</strong> Lịch sự, phù hợp môi trường giáo dục</li>
<li><strong>Người liên hệ:</strong> MrS. Kim Oanh - SĐT: 0XXX XXX XXX.</li>
</ul>
<p>Vui lòng xác nhận phỏng vấn hoặc phản hồi nếu không thể tham gia bằng cách nhấn nút bên dưới trong vòng 07 ngày kể từ ngày nhận email này:</p>
<p>Trân trọng./.</p>
`

    // ref dùng cho preview realtime
    const contentHtml = ref(defaultContent)

    onMounted(() => {
        quill = new Quill(editorContainer.value, {
            theme: 'snow',
            placeholder: 'Nhập nội dung email tại đây...',
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['link']
                ]
            }
        })

        quill.clipboard.dangerouslyPasteHTML(defaultContent)

        // cập nhật contentHtml khi gõ
        quill.on('text-change', () => {
            contentHtml.value = quill.root.innerHTML
        })
    })

    function reset() {
        if (quill) {
            quill.clipboard.dangerouslyPasteHTML(defaultContent)
            contentHtml.value = defaultContent
        }
    }

    function save() {
        console.log('HTML lưu xuống DB:', quill.root.innerHTML)
        alert('Đã lưu mẫu email!')
    }

    // preview realtime
    const previewHtml = computed(() => {
        return `
<div style="max-width:600px;margin:24px auto;background:#ffffff;border-radius:8px;font-family:Arial,sans-serif;overflow:hidden">
  <div style="background:#99212d;color:#ffffff;padding:20px;text-align:center">
    <h2 style="margin:0; color:#ffffff">VIET ANH SCHOOL</h2>
  </div>
  <div style="padding:24px;font-size:16px;line-height:1.6;color:#333333">
    ${contentHtml.value}
    <div style="text-align:center;margin:24px 0">
      <a href="{{ confirmLink }}" style="display:inline-block;padding:12px 28px;background:#99212d;color:#fff;border-radius:5px;text-decoration:none;font-weight:bold">
        PHẢN HỒI PHỎNG VẤN
      </a>
    </div>
  </div>
  <div style="background:#f4f4f4;padding:16px;text-align:center;font-size:12px;color:#777777">
    &copy; 2025 Hệ thống giáo dục Việt Anh. All rights reserved.
  </div>
</div>
  `
    })
</script>


<style scoped>
    .editor-container {
        min-height: 400px;
        background: #f9f9f9;
        border-radius: 8px;
    }
</style>