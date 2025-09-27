<template>
    <header class="header">
        <!-- Logo -->
        <img class="logo" src="@/assets/images/logo.webp" alt="Logo" />
        <h2 class="text-white mb-0">TUYỂN DỤNG</h2>

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

    const isOpen = ref(false);

    const menuItems = [
        { name: "Thông tin", to: "/infomation" },
        { name: "Nhân sự", to: "/staff" },
        { name: "Phòng ban", to: "/department" },
        { name: "Vị trí", to: "/job" },
        { name: "Tuyển dụng", to: "/recruitment" },
        { name: "Chatbot", to: "/chatbot" },
        { name: "Đăng xuất", to: "/login" },
    ];
</script>