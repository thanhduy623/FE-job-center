<template>
    <div class="notify-container">
        <transition-group name="notify" tag="div">
            <div v-for="(note, index) in notifications" :key="note.id" class="notify-overlay"
                :class="`bg-${note.status}`" :style="{ bottom: `${20 + index * 60}px` }">
                {{ note.message }}
            </div>
        </transition-group>
    </div>
</template>

<script setup>
    import { ref, onMounted, onUnmounted } from 'vue'
    import { EventBus } from '@/utils/eventBus'

    const notifications = ref([])
    let nextId = 1

    function showNotify(payload) {
        const { message, status = 'info' } = payload
        const id = nextId++
        notifications.value.push({ id, message, status })

        // Xóa thông báo sau 3s
        setTimeout(() => {
            const index = notifications.value.findIndex(n => n.id === id)
            if (index !== -1) notifications.value.splice(index, 1)
        }, 3000)
    }

    onMounted(() => {
        EventBus.on('notify:show', showNotify)
    })

    onUnmounted(() => {
        EventBus.off('notify:show', showNotify)
    })
</script>

<style scoped>
    .notify-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column-reverse;
        /* stack từ dưới */
    }

    .notify-overlay {
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        min-width: 200px;
        margin-top: 10px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    /* Transition-group animation: slide từ bên phải */
    .notify-enter-from,
    .notify-leave-to {
        opacity: 0;
        transform: translateX(100%);
        /* bắt đầu ngoài màn hình bên phải */
    }

    .notify-enter-to,
    .notify-leave-from {
        opacity: 1;
        transform: translateX(0);
        /* về vị trí đúng */
    }

    .notify-enter-active,
    .notify-leave-active {
        transition: all 0.3s ease;
    }
</style>