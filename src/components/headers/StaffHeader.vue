<template>
    <header class="header">
        <!-- Logo -->
        <img class="logo" src="@/assets/images/logo.webp" alt="Logo" />
        <h3 class="text-white mb-0" v-t="'systemName'"></h3>

        <!-- Menu desktop -->
        <nav>
            <RouterLink v-for="item in menuItems" :key="item.to" :to="item.to" v-t="item.name"
                class="text-white text-uppercase" />
            <button class="text-white text-uppercase" @click="handleLogout" v-t="'logout'"></button>
        </nav>

        <!-- Ngôn ngữ + menu mobile -->
        <LanguageSwitcher />
        <button class="burger" @click="isOpen = !isOpen">☰</button>

        <transition name="slide">
            <nav v-if="isOpen" class="nav-mobile flex flex-col gap-1">
                <RouterLink v-for="item in menuItems" :key="item.to" :to="item.to"
                    class="text-white text-uppercase slide-enter-active">
                    {{ item.name }}
                </RouterLink>

                <button class="text-white text-uppercase" @click="handleLogout">
                    {{ $t('logout') }}
                </button>
            </nav>
        </transition>
    </header>
</template>

<script setup>
    import { ref } from "vue";
    import { logout } from "@/services/AuthService.js";
    import LanguageSwitcher from "@/components/others/LanguageSwitcher.vue";

    const isOpen = ref(false);

    const menuItems = [
        { name: "profile", to: "/profile" },
        { name: "staff", to: "/staff" },
        { name: "department", to: "/department" },
        { name: "job", to: "/job" },
        { name: "application", to: "/application" },
        { name: "chatbot", to: "/chatbot/statistic" },
    ];

    async function handleLogout() {
        await logout();
    }
</script>


<style scoped>
    button {
        background: none;
        padding: 0;
        text-align: start;
        margin: 0;
    }

    button:hover {
        background-color: inherit;
    }
</style>