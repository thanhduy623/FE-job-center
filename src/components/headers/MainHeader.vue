<template>
    <header class="header">
        <!-- Logo -->
        <img class="logo" src="@/assets/images/logo.webp" alt="Logo" />

        <!-- Menu desktop -->
        <nav>
            <RouterLink v-for="item in menuItems" :key="item.to" :to="item.to" class="text-white text-uppercase">
                {{ item.name }}
            </RouterLink>
        </nav>

        <!-- Burger button chỉ hiện trên mobile -->
        <button class="burger" @click="isOpen = !isOpen">☰</button>

        <!-- Sidebar mobile -->
        <transition name="slide">
            <nav v-if="isOpen" class="nav-mobile flex flex-col gap-4">
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

    const isOpen = ref(false);

    const menuItems = [
        { name: "Trang chủ", to: "/" },
        { name: "Gọng kính", to: "/" },
        { name: "Kính mát", to: "/" },
        { name: "Tròng kính", to: "/" },
        { name: "Phụ kiện", to: "/" },
        { name: "Tin tức", to: "/" },
        { name: "Liên hệ", to: "/contact" }
    ];
</script>