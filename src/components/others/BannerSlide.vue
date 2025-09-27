<template>
    <div v-if="images.length" class="banner-container">
        <!-- Slides -->
        <div class="banner-slide" v-for="(img, index) in images" :key="index" v-show="index === currentIndex">
            <img :src="img" alt="banner image" />
        </div>

        <!-- Nút điều hướng -->
        <button class="nav prev" @click="prevSlide">‹</button>
        <button class="nav next" @click="nextSlide">›</button>

        <!-- Dot indicator -->
        <div class="dots">
            <span v-for="(img, idx) in images" :key="idx" :class="['dot', idx === currentIndex ? 'active' : '']"
                @click="goToSlide(idx)"></span>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, onUnmounted, defineProps } from 'vue'

    const props = defineProps({
        images: {
            type: Array,
            default: () => []
        }
    })

    const currentIndex = ref(0)
    let interval = null

    // Chuyển slide tiếp theo
    function nextSlide() {
        if (!props.images.length) return
        currentIndex.value = (currentIndex.value + 1) % props.images.length
    }

    // Chuyển slide trước
    function prevSlide() {
        if (!props.images.length) return
        currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
    }

    // Chuyển trực tiếp đến slide idx
    function goToSlide(idx) {
        currentIndex.value = idx
    }

    // Tự động chuyển slide mỗi 3s
    onMounted(() => {
        interval = setInterval(nextSlide, 3000)
    })

    onUnmounted(() => {
        clearInterval(interval)
    })
</script>

<style scoped>
    .banner-container {
        position: relative;
        width: 100%;
        aspect-ratio: 16 / 9;
        overflow: hidden;
    }

    .banner-slide {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }

    .banner-slide img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    /* Nút điều hướng */
    .nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 10;
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        border: none;
        font-size: 2em;
        cursor: pointer;
        user-select: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .nav.prev {
        left: 20px;
    }

    .nav.next {
        right: 20px;
    }

    .nav:hover {
        background-color: rgba(0, 0, 0, 0.8);
    }

    /* Dot indicator */
    .dots {
        position: absolute;
        bottom: 20px;
        width: 100%;
        text-align: center;
    }

    .dot {
        display: inline-block;
        width: 12px;
        height: 12px;
        margin: 0 6px;
        background-color: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .dot.active {
        background-color: white;
    }

    /* Mặc định đã full màn hình (desktop) */

    /* Tablet (width <= 1024px) */
    @media (max-width: 1024px) {
        .banner-container {
            height: 70vh;
            /* giảm chiều cao */
        }

        .nav {
            font-size: 1.5em;
            width: 35px;
            height: 35px;
        }

        .dot {
            width: 10px;
            height: 10px;
            margin: 0 4px;
        }
    }

    /* Mobile (width <= 768px) */
    @media (max-width: 768px) {
        .banner-container {
            height: 50vh;
            /* banner nhỏ gọn hơn */
        }

        .nav {
            font-size: 1.2em;
            width: 30px;
            height: 30px;
        }

        .nav.prev {
            left: 10px;
        }

        .nav.next {
            right: 10px;
        }

        .dot {
            width: 8px;
            height: 8px;
            margin: 0 3px;
        }
    }

    /* Mobile nhỏ (<= 480px) */
    @media (max-width: 480px) {
        .banner-container {
            height: 40vh;
        }

        .nav {
            font-size: 1em;
            width: 25px;
            height: 25px;
        }

        .dot {
            width: 6px;
            height: 6px;
        }
    }
</style>