<template>
    <div class="staff-layout">
        <AppHeader />
        <main>
            <router-view />
        </main>
        <AppFooter />
        <ChatbotWidget />
    </div>
</template>


<script setup>
    import AppHeader from '@/components/headers/StaffHeader.vue'
    import ChatbotWidget from '@/components/chatbots/ChatbotStaffer.vue'
    import AppFooter from '@/components/footers/StaffFooter.vue'
</script>

<style scoped>
    main {
        padding: 0 16px;
    }
</style>