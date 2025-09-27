<template>
    <div class="chatbot-container card">
        <div class="messages-container">
            <div class="w-full flex flex-col" v-for="(msg, index) in conversation" :key="index"
                :class="['message', msg.isMe ? 'message-me' : 'message-bot']">
                <div class="message-text">{{ msg.text }}</div>
                <div class="message-time text-xs">{{ msg.timestamp }}</div>
            </div>
        </div>

        <div class="input-container flex flex-row">
            <input type="text" class="chat-input" v-model="mess" @keydown.enter="addMessage"
                placeholder="Nhập tin nhắn..." />
            <button class="chat-submit" @click="addMessage">➤</button>
        </div>
    </div>
</template>

<script setup>
    import { ref, nextTick } from "vue";

    const mess = ref("");
    const conversation = ref([]);

    // Thêm tin nhắn
    function addMessage() {
        if (!mess.value.trim()) return;

        conversation.value.push({
            text: mess.value,
            timestamp: new Date().toLocaleTimeString(),
            isMe: true
        });

        // Giả lập bot trả lời
        conversation.value.push({
            text: "Bot trả lời: " + mess.value,
            timestamp: new Date().toLocaleTimeString(),
            isMe: false
        });

        mess.value = "";

        // Scroll xuống cuối
        nextTick(() => {
            const container = document.querySelector(".messages-container");
            if (container) { // Kiểm tra xem container có tồn tại không trước khi truy cập
                container.scrollTop = container.scrollHeight;
            }
        });
    }
</script>

<style scoped>
    .chatbot-container {
        margin: 16px 10%;
        height: 500px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .messages-container {
        flex: 1;
        overflow-y: auto;
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .message {
        max-width: 350px;
        padding: 10px 14px;
        word-wrap: break-word;
    }

    .message-me {
        background-color: var(--color-primary);
        /* màu xanh người dùng */
        color: white;
        border-radius: 16px 0 16px 16px;
        /* bo góc kiểu Messenger */
        margin-left: auto;
        align-self: flex-end;
    }

    .message-bot {
        background-color: #e5e5ea;
        color: black;
        border-radius: 0 16px 16px 16px;
        margin-right: auto;
        align-self: flex-start;
    }

    .input-container {
        width: 100%;
        display: flex;
        align-items: center;
    }

    .chat-input {
        flex: 1;
        padding: 10px 15px;
        border: 1px solid #ccc;
        border-radius: 20px 0 0 20px;
        outline: none;
    }

    .chat-submit {
        background-color: var(--color-primary);
        color: white;
        border: none;
        border-radius: 0 20px 20px 0;
        width: 50px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.2em;
        cursor: pointer;
    }
</style>