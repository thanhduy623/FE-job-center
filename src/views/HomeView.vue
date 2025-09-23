<template>
    <div class="home">
        <h1>Home Page</h1>
        <div class="buttons">
            <button @click="showLoadingDemo">Show Loading</button>
            <button @click="showConfirmDemo">Show Confirm</button>
            <button @click="showNotifyDemo">Show Notify</button>
        </div>
    </div>
</template>

<script setup>
    import { EventBus } from '@/utils/eventBus'

    function showLoadingDemo() {
        EventBus.showLoading('Loading data...')
        setTimeout(() => {
            EventBus.hideLoading()
            // EventBus.showNotify('Loading completed!')
        }, 2000)
    }

    async function showConfirmDemo() {
        const confirmed = await EventBus.confirm('Are you sure you want to proceed?')
        if (confirmed) {
            EventBus.showNotify('You clicked OK!')
        } else {
            EventBus.showNotify('You clicked Cancel!')
        }
    }

    function showNotifyDemo() {
        // Success
        EventBus.showNotify('Thành công!', 'success')
        EventBus.showNotify('Có lỗi xảy ra!', 'error')
        EventBus.showNotify('Cảnh báo!', 'warning')
        EventBus.showNotify('Thông tin!', 'info')


    }
</script>

<style scoped>
    .home {
        padding: 20px;
    }

    .buttons {
        display: flex;
        gap: 10px;
        margin-top: 20px;
    }

    button {
        padding: 10px 20px;
        cursor: pointer;
    }
</style>