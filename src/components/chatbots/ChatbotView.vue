<template>
    <div class="chatbot-container" :class="{ open: isShow }">
        <!-- ICON -->
        <img v-if="!isShow" class="chatbot-icon" src="@/assets/images/ic-chatbot.png" @click="isShow = true" />

        <!-- CHAT PANEL -->
        <div v-if="isShow" class="wrapper">
            <!-- HEADER -->
            <div class="chatbot-header flex flex-row items-center">
                <p class="flex flex-1 text-white">VAS CHATBOT</p>
                <img class="icon" src="@/assets/images/ic-scale.png" @click="isShow = false" />
            </div>

            <!-- BODY -->
            <div ref="chatBody" class="chatbot-body">
                <div v-for="(item, index) in conservationHistory" :key="index" class="chat-message"
                    :class="{ me: item.me }">
                    <img v-if="!item.me" class="icon" src="@/assets/images/ic-chatbot.png" />
                    <span class="chat-message-text" :class="item.me ? 'bg-gray-400' : 'bg-primary text-white'">
                        {{ item.text }}
                        <template v-if="item.fileName">
                            <br />
                            <hr />
                            <p class="italic text-xs"> File: {{ item.fileName }} </p>
                        </template>
                    </span>
                </div>

                <!-- LOADING -->
                <div v-if="isLoading" class="chat-message">
                    <img class="icon" src="@/assets/images/ic-chatbot.png" />
                    <span class="chat-message-text bg-primary text-white loading-bubble">
                        <img class="loading-gif" src="@/assets/images/ic-chatbot-loading.gif" />
                    </span>
                </div>
            </div>

            <!-- FOOTER -->
            <div class="chatbot-footer">
                <div v-if="fileRaw" class="flex flex-row fileRaw-attachment-preview">
                    <span class="fileRaw-name-display flex-1">
                        Đính kèm: {{ fileRaw.name }}
                    </span>
                    <span class="fileRaw-name-display" @click="clearfileRaw">
                        X
                    </span>
                </div>

                <form class="chat-input flex flex-row">
                    <input class="chatbot-textbox" type="text" v-model="messageText" required />

                    <input id="file-input" type="file" hidden @change="handleFileRawChange" />

                    <label for="file-input">
                        <img class="icon" src="@/assets/images/ic-link.png" />
                    </label>

                    <button ref="sendBtn" type="submit" class="send-btn" @click.prevent="handleSubmit(messageText)">
                        <img class="icon" src="@/assets/images/ic-send.png" />
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, nextTick } from 'vue'
    import { EventBus } from '@/utils/eventBus'
    import { uploadFile } from '@/utils/supabaseFileUtils.js'
    import ApplicationService from '@/services/ApplicationService'

    const isShow = ref(false)
    const isLoading = ref(false)
    const fileRaw = ref(null)
    const messageText = ref('')
    const chatBody = ref(null)
    const sendBtn = ref(null)

    const conservationHistory = ref([
        { me: false, text: 'Welcome to Viet Anh School chatbot!' },
        { me: true, text: 'Welcome to Viet Anh School chatbot!', fileName: 'a' },
    ])

    function addMessage(type, text, file) {
        conservationHistory.value.push({
            me: type,
            text: text,
            fileName: file || null
        });
    }

    const scrollToBottom = async () => {
        await nextTick()
        if (chatBody.value) {
            chatBody.value.scrollTop = chatBody.value.scrollHeight
        }
    }

    const handleFileRawChange = (e) => {
        fileRaw.value = e.target.files[0] || null
    }

    const clearfileRaw = () => {
        fileRaw.value = null
        document.getElementById('file-input').value = null
    }


    // ChatbotView.vue (trích đoạn handleSubmit)
    const handleSubmit = async (message) => {
        if (!message && !fileRaw.value) return;

        try {
            sendBtn.value.disabled = true

            let filePayload = null

            if (fileRaw.value) {
                const promiseFile = uploadFile(fileRaw.value, 'chat-attachments')
                EventBus.hideLoading()
                const resFile = await promiseFile
                if (resFile.success) {
                    filePayload = {
                        fileKey: resFile.path,
                        bucketName: 'chat-attachments'
                    }
                } else {
                    EventBus.showNotify('Tải file thất bại, không gửi message', 'error')
                    return
                }
            }

            // Hiển thị tạm thời message của người dùng
            addMessage(true, message, fileRaw.value.name)
            isLoading.value = true
            messageText.value = ''
            clearfileRaw()
            await scrollToBottom()

            // Gọi chatbot kèm message + file nếu có
            const promiseRes = ApplicationService.callChatbot({
                message,
                file: filePayload
            })

            EventBus.hideLoading()
            const res = await promiseRes
            addMessage(false, res.output)
            await scrollToBottom()
        } catch (err) {
            EventBus.showNotify('Gửi tin nhắn thất bại', 'error')
            console.error(err)
        } finally {
            isLoading.value = false
            sendBtn.value.disabled = false
        }
    }

</script>

<style scoped>
    form {
        padding: 0;
        margin: 0;
        border: none;
    }

    .chatbot-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;

        width: 60px;
        height: 60px;
        border-radius: 16px;
    }

    .chatbot-container.open {
        width: 300px;
        height: 400px;
        background: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        overflow: hidden;
    }

    .chatbot-icon {
        width: 60px;
        height: 60px;
        padding: 10px;
        border-radius: 16px;
        background: white;
        cursor: pointer;
    }

    .wrapper {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .chatbot-header {
        height: 36px;
        padding: 10px;
        background: var(--color-primary);
        flex-shrink: 0;
    }

    .chatbot-body {
        flex: 1;
        padding: 10px;
        overflow-y: auto;
    }

    .chat-message {
        display: flex;
        gap: 6px;
        margin-bottom: 6px;
    }

    .chat-message.me {
        flex-direction: row-reverse;
    }

    .chat-message-text {
        max-width: 200px;
        padding: 6px;
        border-radius: 6px;
        font-size: 12px;
    }

    .chatbot-footer {
        padding: 8px;
        background: var(--color-gray-100);
        flex-shrink: 0;
    }

    .chat-input {
        display: flex;
        gap: 6px;
        align-items: center;
    }

    .icon {
        width: 24px !important;
        height: 24px !important;
    }

    .loading-bubble {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .loading-gif {
        height: 14px;
        filter: invert(1) brightness(2);
    }

    .fileRaw-name-display {
        font-size: 12px;
        font-style: italic;
        color: gray;
    }

    label {
        width: fit-content !important;
        margin: 0 !important;
        padding: 0;
    }

    .chatbot-textbox {
        flex: 1;
        display: flex;
        min-width: 0;
    }

    .send-btn,
    .send-btn .icon,
    label .icon {
        all: unset;
        cursor: pointer;
        display: flex;
        align-items: center;
        width: 24px;
    }
</style>