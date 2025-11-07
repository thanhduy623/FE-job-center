<template>
    <div class="main-layout flex flex-col justify-center">
        <AppHeader />
        <main>
            <router-view />
        </main>
        <ChatbotWidget />
        <AppFooter />
    </div>
</template>


<script setup>
    import AppHeader from '@/components/headers/MainHeader.vue'
    import AppFooter from '@/components/footers/MainFooter.vue'
    import ChatbotWidget from '@/components/chatbots/ChatbotWidget.vue'
</script>