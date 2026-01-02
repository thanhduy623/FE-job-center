<template>
  <div class="card flex-1">
    <h3>Xem trước email</h3>

    <div class="email-preview">
      <MailHeader />

      <div class="email-body" v-html="bodyHtml"></div>

      <MailFooter />
    </div>

    <!-- Phần mô tả biến -->
    <div class="variable-info">
      <h4 class="font-bold">Các biến có thể sử dụng:</h4>
      <ul>
        <li v-for="variable in variables" :key="variable.key">
          <code>{{ variable.key }}</code> - {{ variable.description }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
  import { reactive, computed, defineProps } from 'vue'
  import MailHeader from './MailHeader.vue'
  import MailFooter from './MailFooter.vue'

  const props = defineProps({
    contentHtml: { type: String, required: true }
  })

  // Mock dữ liệu preview
  const variables = reactive([
    { key: '{{ fullName }}', text: 'Nguyễn Văn A', description: 'Họ và tên ứng viên' },
    { key: '{{ jobName }}', text: 'Giáo viên Toán', description: 'Vị trí ứng tuyển' },
    { key: '{{ locationName }}', text: 'Việt Anh 3', description: 'Cơ sở làm việc' },
  ])

  // Replace placeholder trong contentHtml
  const bodyHtml = computed(() => {
    let html = props.contentHtml
    variables.forEach(v => {
      html = html.replaceAll(v.key, v.text)
    })
    return html
  })
</script>

<style scoped>
  .email-preview {
    max-width: 600px;
    margin: 24px auto;
    background: #fff;
    border-radius: 8px;
    font-family: Arial, sans-serif;
    overflow: hidden;
  }

  .email-body {
    padding: 30px 20px;
    color: #333;
    font-size: 16px;
    line-height: 1.6;
    text-align: justify;
  }

  .variable-info {
    font-family: Arial, sans-serif;
    padding: 0.25rem;
    margin-top: 1rem;
    background-color: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 0.25rem;
  }

  .variable-info ul {
    list-style: disc;
    padding-left: 1.25rem;
    font-size: 0.875rem;
    color: #374151;
  }
</style>