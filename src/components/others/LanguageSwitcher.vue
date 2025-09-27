<template>
    <button @click="toggleLanguage" :style="{ backgroundImage: `url(${currentFlag})` }" class="lang-btn"></button>
</template>

<script setup>
    import { ref, watch } from 'vue'
    import { useI18n } from 'vue-i18n'

    // Lấy i18n instance
    const { locale } = useI18n()

    // Mặc định là VN
    const currentFlag = ref(require('@/assets/images/vn.png'))

    function toggleLanguage() {
        locale.value = locale.value === 'vi' ? 'en' : 'vi'
    }

    // Theo dõi thay đổi ngôn ngữ để đổi cờ
    watch(locale, (newLocale) => {
        currentFlag.value =
            newLocale === 'vi'
                ? require('@/assets/images/vn.png')
                : require('@/assets/images/en.png')
    })
</script>

<style>
    .lang-btn {
        width: 32px;
        height: 32px;
        border: none;
        cursor: pointer;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
    }
</style>