<template>
    <div class="mail-header">
        <img :src="logo" alt="Logo" class="logo" />
        <h2 class="title">{{ title }}</h2>
    </div>
</template>

<script setup>
    import { defineProps } from 'vue'

    defineProps({
        logo: {
            type: String,
            default: 'https://iphbzwnkdbbmoibqedil.supabase.co/storage/v1/object/public/assets/logo_single_color.png'
        },
        title: { type: String, default: 'VIET ANH SCHOOL' }
    })
</script>

<style scoped>
    .mail-header {
        background-color: #99212d;
        color: #ffffff;
        padding: 20px;
        text-align: center;
    }

    .mail-header .logo {
        height: 80px;
        display: block;
        margin: 0 auto 10px;
    }

    .mail-header .title {
        margin: 0;
        color: white;
        font-size: 24px;
        font-weight: bold;
    }
</style>