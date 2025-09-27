<template>
    <div v-if="visible" class="overlay confirm-overlay">
        <div class="modal">
            <p class="icon">ⓘ</p>
            <p>{{ message }}</p>
            <button class="cancel" @click="cancel" v-t="'cancel'"></button>
            <button class="confirm" @click="confirm" v-t="'confirm'"></button>
        </div>
    </div>
</template>


<script setup>
    import { ref, onMounted, onUnmounted } from 'vue'
    import { EventBus } from '@/utils/eventBus'

    const visible = ref(false)
    const message = ref('')

    function showConfirm(msg) {
        message.value = msg
        visible.value = true
    }

    function confirm() {
        visible.value = false
        EventBus.emit('confirm:response', true)
    }

    function cancel() {
        visible.value = false
        EventBus.emit('confirm:response', false)
    }

    onMounted(() => {
        EventBus.on('confirm:show', showConfirm)
    })

    onUnmounted(() => {
        EventBus.off('confirm:show', showConfirm)
    })
</script>


<style scoped>
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        color: white;

        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        z-index: 9999;
    }

    .modal {
        background: white;
        padding: 20px 30px;
        border-radius: 8px;
        text-align: center;
        min-width: 300px;
        max-width: 90%;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    }

    .modal p {
        margin-bottom: 20px;
        font-size: 16px;
        color: var(--color-secondary);
        font-style: italic;
    }

    .modal button {
        padding: 8px 16px;
        margin: 0 10px;
        border: none;
        border-radius: 5px;
        font-size: 14px;
        cursor: pointer;
    }

    .modal .icon {
        display: block;
        text-align: center;
        font-style: unset;
        font-size: 56px;
        font-family: "Arial", "Helvetica", sans-serif;
        line-height: 1;
        color: var(--color-primary);
    }


    .modal .cancel {
        background-color: #333;
    }

    .modal .confirm {
        background-color: var(--color-primary);
    }
</style>