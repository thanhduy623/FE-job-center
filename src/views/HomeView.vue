<template>
    <div class="home">
        <Banner :images="images" />
        <h1>Home Page</h1>
        <div class="buttons">
            <button @click="showLoadingDemo">Show Loading</button>
            <button @click="showConfirmDemo">Show Confirm</button>
            <button @click="showNotifyDemo">Show Notify</button>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import Banner from '@/components/banners/BannerSlide.vue'

    const images = ref([
        "https://lh5.googleusercontent.com/proxy/Gl9MFVDl9zeVOq_LTsJ9rQM3bqvNh7SymGCrq-1z0SO3OQELpdp_USJBT5cd0fmK91DsMjgRoq6Q51YYKzSe_fUvXOzHVhMCCEfeigGOGSASpyDSO4o",
        "https://dntt.mediacdn.vn/197608888129458176/2023/10/2/anh-01-16962155871951919570427.jpg",
        "https://dntt.mediacdn.vn/197608888129458176/2023/9/5/anh-08-16938994501491276043469.jpg"
    ])
</script>

<style scoped>
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