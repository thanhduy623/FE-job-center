<template>
    <div v-if="visible" class="overlay loading-overlay">
        <div class="spinner"></div>
        <p>{{ message }}</p>
    </div>
</template>

<script setup>
    import { ref, onMounted, onUnmounted } from 'vue'
    import { EventBus } from '@/utils/eventBus'

    const visible = ref(false)
    const message = ref('Loading...')

    function showLoading(msg = 'Loading...') {
        message.value = msg
        visible.value = true
    }

    function hideLoading() {
        visible.value = false
    }

    onMounted(() => {
        EventBus.on('loading:show', showLoading)
        EventBus.on('loading:hide', hideLoading)
    })

    onUnmounted(() => {
        EventBus.off('loading:show', showLoading)
        EventBus.off('loading:hide', hideLoading)
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

    .spinner {
        width: 50px;
        height: 50px;
        border: 5px solid white;
        border-top: 5px solid transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }
</style>