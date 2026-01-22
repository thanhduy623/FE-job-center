<template>
    <div class="chatbot-container" :class="{ open: isShow }">
        <!-- ICON -->
        <img v-if="!isShow" class="chatbot-icon" src="@/assets/images/ic-chatbot.png" @click="isShow = true" />

        <!-- CHAT PANEL -->
        <div v-if="isShow" class="wrapper">
            <!-- HEADER -->
            <div class="chatbot-header flex flex-row items-center">
                <p class="flex flex-1 text-white" style="margin-bottom: 0 !important;">VAS CHATBOT</p>
                <img class="icon" src="@/assets/images/ic-scale.png" @click="isShow = false" />
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
                                style="padding: 6px; margin: 0; white-space: nowrap; overflow: hidden;  text-overflow: ellipsis;">
                                File: {{ item.fileName }}</p>
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
                    <span class="fileRaw-name-display" @click="clearfileRaw">
                        X
                    </span>
                </div>

                <form class="chat-input flex flex-row">
                    <textarea class="chatbot-textbox text-xs" type="text" v-model="messageText" rows="1"
                        @input="autoResize" required />

                    <input id="file-input" type="file" hidden accept="application/pdf" @change="handleFileRawChange" />

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
    import { ref, watch, nextTick } from 'vue'
    import { marked } from 'marked'
    import { EventBus } from '@/utils/eventBus'
    import { uploadFile } from '@/utils/supabaseFileUtils.js'
    import { useI18n } from 'vue-i18n'
    import ApplicationService from '@/services/ApplicationService'

    const { t, locale } = useI18n()

    watch(locale, () => {
        // chỉ update message chào đầu tiên
        if (conservationHistory.value.length > 0) {
            conservationHistory.value[0].text = t('pageChatbot.introduction')
        }
    })

    const isShow = ref(false)
    const isLoading = ref(false)
    const fileRaw = ref(null)
    const messageText = ref('')
    const chatBody = ref(null)
    const sendBtn = ref(null)


    const renderMarkdown = (text) => {
        return marked.parse(text || '')
    }

    const conservationHistory = ref([
        { me: false, text: t('pageChatbot.introduction') },
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
            sendBtn.value.disabled = true;

            isLoading.value = true;

            // Giữ lại file gốc trước khi clear UI
            const fileToUpload = fileRaw.value;

            // Hiển thị message của người dùng ngay lập tức
            addMessage(true, message, fileToUpload?.name || null);
            messageText.value = '';
            clearfileRaw();
            await scrollToBottom();

            let filePayload = null;

            // Upload file nếu có
            if (fileToUpload) {
                const resFile = await uploadFile(fileToUpload, 'chat-attachments');

                if (resFile.success) {
                    filePayload = {
                        fileKey: resFile.path,
                        bucketName: 'chat-attachments'
                    };
                } else {
                    addMessage(false, t('pageChatbot.fileError'));
                    return;
                }
            }

            // Gọi chatbot kèm message + file (nếu có)
            const res = await ApplicationService.callChatbotApplyer({
                message,
                file: filePayload
            });

            if (!res) {
                addMessage(false, t('pageChatbot.systemBusy'));
                return;
            }

            addMessage(false, res.output);
            await scrollToBottom();
        } catch (err) {
            EventBus.showNotify('Gửi tin nhắn thất bại', 'error');
            console.error(err);
        } finally {
            isLoading.value = false;
            sendBtn.value.disabled = false;
        }
    };

    const autoResize = (event) => {
        const el = event.target
        el.style.height = 'auto' // reset trước
        const lineHeight = parseFloat(getComputedStyle(el).lineHeight)
        const maxLines = 4
        const maxHeight = lineHeight * maxLines
        el.style.height = Math.min(el.scrollHeight, maxHeight) + 'px'
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
        width: 750px;
        height: 500px;
        background: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        overflow: hidden;
    }

    .chatbot-container.open {
        width: 750px;
        height: 500px;
        background: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        overflow: hidden;
    }

    @media (max-width: 768px) {
        .chatbot-container.open {
            width: 90vw;
            height: 70vh;
        }
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

    .chatbot-chat-frame {
        border-radius: 6px;
    }

    .chat-message-text {
        max-width: 320px;
        padding: 6px;
        border-radius: 6px;
        font-size: 12px;
        font-size: 12px;
        line-height: 1.2;

        word-wrap: break-word;
        overflow-wrap: break-word;
        white-space: pre-wrap;
    }

    .chat-message-text :deep(*) {
        font-size: 12px;
        line-height: 1.2;
        margin: 0 !important;

        word-wrap: break-word;
        overflow-wrap: break-word;
        white-space: pre-wrap;
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
        width: 100%;
        min-height: 2.5em;
        max-height: 8.5em;
        line-height: 1.4em;
        padding: 6px;
        overflow-y: auto;
        resize: none;
        box-sizing: border-box;
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

    .fileRaw-attachment-preview {
        padding: 6px;
    }

    .chat-message-text {
        font-size: 12px;
        line-height: 1.4;
        max-width: 320px;
    }

    .chat-message-text :deep(p) {
        margin: 0 0 6px 0;
    }

    .chat-message-text :deep(p:last-child) {
        margin-bottom: 0;
    }

    .chat-message:not(.me) .chat-message-text :deep(p),
    .chat-message:not(.me) .chat-message-text :deep(li),
    .chat-message:not(.me) .chat-message-text :deep(strong),
    .chat-message:not(.me) .chat-message-text :deep(em),
    .chat-message:not(.me) .chat-message-text :deep(a) {
        color: white;
    }
</style>