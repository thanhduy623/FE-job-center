<template>
    <div>
        <!-- FULLSCREEN CHATBOT -->
        <div v-if="isShow" class="chatbot-container">

            <!-- Overlay mờ phía sau -->
            <div class="chatbot-overlay" @click="closeChatbot"></div>

            <!-- Chat wrapper -->
            <div class="wrapper">
                <!-- HEADER -->
                <div class="chatbot-header flex flex-row items-center">
                    <p class="flex flex-1 text-white" style="margin-bottom: 0 !important;">VAS CHATBOT</p>
                    <img class="icon" src="@/assets/images/ic-scale.png" @click="closeChatbot" />
                </div>

                <!-- BODY -->
                <div ref="chatBody" class="chatbot-body">
                    <div v-for="(item, index) in conservationHistory" :key="index" class="chat-message"
                        :class="{ me: item.me }">
                        <img v-if="!item.me" class="icon" src="@/assets/images/ic-chatbot.png" />

                        <div class="chatbot-chat-frame" :class="item.me ? 'bg-gray-400' : 'bg-primary text-white'">
                            <div class="chat-message-text" v-html="renderMarkdown(item.text)"></div>

                            <template v-if="item.fileName">
                                <hr />
                                <p class="italic text-xs"
                                    style="padding: 6px; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                    File: {{ item.fileName }}
                                </p>
                            </template>
                        </div>
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
                        <span class="fileRaw-name-display" @click="clearfileRaw">X</span>
                    </div>

                    <form class="chat-input flex flex-row" @submit.prevent="handleSubmit(messageText)">
                        <input class="chatbot-textbox text-xs" type="text" v-model="messageText" required />

                        <input id="file-input" type="file" hidden @change="handleFileRawChange" />
                        <label for="file-input">
                            <img class="icon" src="@/assets/images/ic-link.png" />
                        </label>

                        <button ref="sendBtn" type="submit" class="send-btn">
                            <img class="icon" src="@/assets/images/ic-send.png" />
                        </button>
                    </form>
                </div>
            </div>
        </div>

        <!-- ICON nhỏ mở chatbot khi đóng -->
        <img v-if="!isShow" class="chatbot-icon" src="@/assets/images/ic-chatbot.png" @click="isShow = true" />
    </div>
</template>

<script setup>
    import { ref, watch, nextTick, onMounted } from 'vue'
    import { marked } from 'marked'
    import { EventBus } from '@/utils/eventBus'
    import { uploadFile } from '@/utils/supabaseFileUtils.js'
    import { useI18n } from 'vue-i18n'
    import ApplicationService from '@/services/ApplicationService'

    const { t, locale } = useI18n()

    const isShow = ref(false)
    const isLoading = ref(false)
    const fileRaw = ref(null)
    const messageText = ref('')
    const chatBody = ref(null)
    const sendBtn = ref(null)

    const renderMarkdown = (text) => marked.parse(text || '')

    const conservationHistory = ref([
        { me: false, text: t('pageChatbot.introduction') },
    ])

    watch(locale, () => {
        if (conservationHistory.value.length > 0) {
            conservationHistory.value[0].text = t('pageChatbot.introduction')
        }
    })

    function addMessage(type, text, file) {
        conservationHistory.value.push({
            me: type,
            text,
            fileName: file || null
        });
    }

    const scrollToBottom = async () => {
        await nextTick()
        if (chatBody.value) chatBody.value.scrollTop = chatBody.value.scrollHeight
    }

    const handleFileRawChange = (e) => {
        fileRaw.value = e.target.files[0] || null
    }

    const clearfileRaw = () => {
        fileRaw.value = null
        document.getElementById('file-input').value = null
    }

    const closeChatbot = () => {
        isShow.value = false
    }

    // ESC key đóng chatbot
    onMounted(() => {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeChatbot()
        })
    })

    const handleSubmit = async (message) => {
        if (!message && !fileRaw.value) return

        try {
            sendBtn.value.disabled = true

            let filePayload = null

            addMessage(true, message, fileRaw.value?.name || null)
            isLoading.value = true
            messageText.value = ''
            clearfileRaw()
            await scrollToBottom()

            if (fileRaw.value) {
                const resFile = await uploadFile(fileRaw.value, 'chat-attachments')
                if (resFile.success) {
                    filePayload = { fileKey: resFile.path, bucketName: 'chat-attachments' }
                } else {
                    addMessage(false, t('pageChatbot.fileError'))
                    return
                }
            }

            const res = await ApplicationService.callChatbot({ message, file: filePayload })
            addMessage(false, res?.output || t('pageChatbot.systemBusy'))
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
    /* ICON mở chatbot */
    .chatbot-icon {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        padding: 10px;
        border-radius: 16px;
        background: white;
        cursor: pointer;
        z-index: 9999;
    }

    /* ================= Fullscreen container ================= */
    .chatbot-container {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        pointer-events: auto;
    }

    /* Overlay */
    .chatbot-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
    }

    /* Wrapper */
    .wrapper {
        position: relative;
        width: 95%;
        max-width: 800px;
        height: 90vh;
        background: white;
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        z-index: 100;
        box-shadow: 0 12px 48px rgba(0, 0, 0, 0.3);
        animation: fadeIn 0.3s ease-out;
    }

    /* Header */
    .chatbot-header {
        flex-shrink: 0;
        padding: 12px 16px;
        background: var(--color-primary);
        color: white;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    /* Body */
    .chatbot-body {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        background: #f9f9f9;
    }

    /* Footer */
    .chatbot-footer {
        flex-shrink: 0;
        padding: 12px 16px;
        background: #fff;
        border-top: 1px solid #eee;
    }

    /* Chat messages */
    .chat-message {
        display: flex;
        gap: 6px;
        margin-bottom: 6px;
    }

    .chat-message.me {
        flex-direction: row-reverse;
    }

    .chatbot-chat-frame {
        border-radius: 6px;
    }

    .chat-message-text {
        max-width: 320px;
        padding: 6px;
        border-radius: 6px;
        font-size: 12px;
        line-height: 1.4;
    }

    /* Loading bubble */
    .loading-bubble {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .loading-gif {
        height: 14px;
        filter: invert(1) brightness(2);
    }

    /* Input */
    .chat-input {
        display: flex;
        gap: 6px;
        align-items: center;
    }

    .chatbot-textbox {
        flex: 1;
        min-width: 0;
        padding: 6px 10px;
        border-radius: 8px;
        border: 1px solid #ccc;
    }

    /* Icons */
    .icon {
        width: 24px;
        height: 24px;
        cursor: pointer;
    }

    /* File preview */
    .fileRaw-name-display {
        font-size: 12px;
        font-style: italic;
        color: gray;
    }

    /* Animations */
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }

        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>