<template>
    <div class="chatbot-wrapper">
        <!-- Giao diện chatbot n8n -->
        <n8n-embedded-chat-interface label="🤖 VAS CHATBOT" hostname="https://n8n.dat3k.tech/webhook/chatbot" mode="n8n"
            open-on-start="false" primary-color="#99212d" secondary-color="#262265" background-color="#f8f9fa"
            text-color="#212529" placeholder-text="Nhập tin nhắn..."
            bot-avatar="https://cdn-icons-png.flaticon.com/512/8943/8943377.png"
            user-avatar="https://cdn-icons-png.flaticon.com/512/1077/1077012.png"></n8n-embedded-chat-interface>
    </div>
</template>

<script setup>
    // Không cần xử lý JS nếu chỉ nhúng widget
</script>

<style scoped>
    .chatbot-wrapper {
        width: 100%;
        max-width: 420px;
        height: 600px;
        margin: 40px auto;
        border: 1px solid #ddd;
        border-radius: 12px;
        overflow: hidden;
    }
</style>