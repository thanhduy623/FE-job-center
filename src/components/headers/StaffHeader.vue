<template>
    <header class="header">
        <!-- Logo -->
        <img class="logo" src="@/assets/images/logo.webp" alt="Logo" />

        <!-- Desktop Menu -->
        <nav v-if="windowWidth > 768" class="nav-menu nav-desktop">
            <RouterLink v-for="item in menuItems" :key="item.to" :to="item.to"
                class="nav-item text-white text-uppercase" v-t="item.name">
            </RouterLink>
        </nav>

        <!-- Right section -->
        <div class="right-section" :class="{ mobile: windowWidth <= 768 }">
            <LanguageSwitcher />
            <button v-if="windowWidth <= 768" class="burger" @click="isOpen = !isOpen">
                ☰
            </button>
        </div>

        <!-- Mobile Menu -->
        <transition name="slide">
            <nav v-if="isOpen && windowWidth <= 768" class="nav-menu nav-mobile">
                <RouterLink v-for="item in menuItems" :key="item.to" :to="item.to"
                    class="nav-item text-white text-uppercase" @click="handleItemClick" v-t="item.name">
                </RouterLink>
            </nav>
        </transition>
    </header>
</template>

<script setup>
    import { ref, onMounted, onUnmounted } from "vue";
    import LanguageSwitcher from "@/components/others/LanguageSwitcher.vue";

    const isOpen = ref(false);
    const windowWidth = ref(window.innerWidth);

    const menuItems = [
        { name: "profile", to: "/profile" },
        { name: "staff", to: "/staff" },
        { name: "department", to: "/department" },
        { name: "job", to: "/job" },
        { name: "application", to: "/application" },
        { name: "document", to: "/document" },
        { name: "chatbot", to: "/chatbot/statistic" },
        { name: "logout", to: "/login" },
    ];

    function handleResize() {
        windowWidth.value = window.innerWidth;
        if (windowWidth.value > 768) isOpen.value = false;
    }

    function handleItemClick() {
        if (windowWidth.value <= 768) isOpen.value = false;
    }

    onMounted(() => window.addEventListener("resize", handleResize));
    onUnmounted(() => window.removeEventListener("resize", handleResize));
</script>

<style scoped>
    /* ========== HEADER LAYOUT ========== */
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: white;
        padding: 0 1rem;
        height: 64px;
        position: relative;
        z-index: 1000;
    }

    /* ========== NAVIGATION MENU ========== */
    .nav-menu {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .nav-item {
        text-decoration: none;
        color: white;
        font-weight: 500;
        transition: opacity 0.2s;
    }

    .nav-item:hover {
        opacity: 0.8;
    }

    /* Desktop Menu */
    .nav-desktop {
        flex: 1;
        justify-content: end;
    }

    /* Right Section (User + Burger) */
    .right-section {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .right-section.mobile {
        gap: 0.75rem;
    }

    /* Burger button */
    .burger {
        font-size: 1.8rem;
        background: none;
        border: none;
        color: white;
        cursor: pointer;
    }

    /* Mobile Menu (Full screen) */
    .nav-mobile {
        position: fixed;
        top: 64px;
        /* ✅ Bắt đầu ngay dưới header */
        left: 0;
        right: 0;
        height: calc(100vh - 64px);
        /* ✅ Không đè header */
        background-color: #333;
        padding: 2rem 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        z-index: 999;
        /* thấp hơn header */
        overflow-y: auto;
    }

    /* ========== TRANSITION ========== */
    .slide-enter-active,
    .slide-leave-active {
        transition: all 0.3s ease;
    }

    .slide-enter-from,
    .slide-leave-to {
        transform: translateY(-20px);
        opacity: 0;
    }
</style>