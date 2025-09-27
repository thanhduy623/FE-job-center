<template>
    <header class="header">
        <!-- Logo -->
        <img class="logo" src="@/assets/images/logo.webp" alt="Logo" />
        <h3 class="text-white mb-0" v-t="'systemName'"></h3>

        <!-- Menu desktop -->
        <nav>
            <RouterLink v-for="item in menuItems" :key="item.to" :to="item.to" v-t="item.name"
                class="text-white text-uppercase"> </RouterLink>
        </nav>

        <!-- Burger button chỉ hiện trên mobile -->
        <LanguageSwitcher />
        <button class="burger" @click="isOpen = !isOpen">☰</button>

        <!-- Sidebar mobile -->
        <transition name="slide">
            <nav v-if="isOpen" class="nav-mobile flex flex-col gap-1">
                <RouterLink v-for="item in menuItems" :key="item.to" :to="item.to"
                    class="text-white text-uppercase slide-enter-active">
                    {{ item.name }}
                </RouterLink>
            </nav>
        </transition>
    </header>
</template>

<script setup>
    import { ref } from "vue";
    import LanguageSwitcher from '@/components/others/LanguageSwitcher.vue'

    const isOpen = ref(false);

    const menuItems = [
        { name: "home", to: "/" },
        { name: "recruitment", to: "/recruitment" },
        { name: "chatbot", to: "/chatbot" },
        { name: "login", to: "/login" },
    ];
</script>