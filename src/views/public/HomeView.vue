<template>
    <div class="home">
        <Banner :images="images" />
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import Banner from '@/components/others/BannerSlide.vue'

    const images = ref([
        "https://static.kiddihub.com/images/-ZWkcIpY70x@1652337239.jpg",
        "https://www.vietanhschool.edu.vn/wp-content/uploads/2020/06/truong-VA2.jpg",
        "https://www.vietanhschool.edu.vn/wp-content/uploads/2020/06/VA002-scaled.jpg",
        "https://static.kiddihub.com/images/mo-ta-co-so-vat-chat-cua-truong-trung-tieu-hoc-viet-anh-di-an-KakwszEVqA@1652336686.jpg",
        "https://static.kiddihub.com/images/mo-ta-cac-tien-ich-cua-truong-trung-tieu-hoc-viet-anh-di-an-mQOyXzdDp3@1652337137.png",
        "https://www.vietanhschool.edu.vn/wp-content/uploads/2023/06/Untitled-3-03.jpg"
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