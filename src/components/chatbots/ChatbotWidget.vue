<template>
    <div class="w-full max-w-lg h-[90vh] md:h-[80vh] mx-auto p-4 md:p-8">
        <div id="n8n-chat-widget"></div>
    </div>
</template>

<script setup>
    import { onMounted } from "vue";
    import initChatbot from "@/utils/chatbotInit.js";

    onMounted(() => {
        initChatbot();
    });
</script>

<style scoped></style>