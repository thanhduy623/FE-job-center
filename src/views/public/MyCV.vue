<template>
    <div v-if="application" class="cv-wrapper">
        <!-- Aura rings -->
        <span class="aura aura-1"></span>
        <span class="aura aura-2"></span>

        <div class="cv-glass">
            <!-- Header -->
            <div class="cv-header">
                <h2 class="cv-name">{{ application.fullName }}</h2>
                <span class="cv-status">{{ application.status }}</span>
            </div>

            <!-- Info -->
            <div class="cv-info">
                <div class="info-item" v-if="application.email">
                    <span class="label">Thư điện tử</span>
                    <span class="value">{{ application.email }}</span>
                </div>

                <div class="info-item" v-if="application.phone">
                    <span class="label">Số điện thoại</span>
                    <span class="value">{{ application.phone }}</span>
                </div>

                <div class="info-item" v-if="application.address">
                    <span class="label">Địa chỉ</span>
                    <span class="value">{{ application.address }}</span>
                </div>

                <div class="info-item" v-if="cvFile">
                    <span class="label">File hồ sơ</span>
                    <a class="cv-link" :href="cvFile" target="_blank" rel="noopener noreferrer">
                        Xem CV
                    </a>
                </div>
            </div>

            <!-- Philosophy / Quotes -->
            <div class="philosophy">
                {{ currentQuote }}
            </div>
        </div>
    </div>

    <div v-else class="loading">Đang tải hồ sơ...</div>
</template>

<script setup>
    import { ref, onMounted, onUnmounted } from 'vue'
    import { useRoute } from 'vue-router'
    import { EventBus } from '@/utils/eventBus'
    import ApplicationService from '@/services/ApplicationService'
    import ApplicationCustomFieldValueService from '@/services/ApplicationCustomFieldValueService'

    const route = useRoute()
    const application = ref(null)
    const cvFile = ref(null)

    const CV_FIELD_ID = '7dea290a-7fda-4c87-93d2-da8683b2345d'

    // Các câu triết lý luân phiên
    const quotes = [
        'Trung thực – Xây dựng niềm tin và sự tôn trọng trong mọi mối quan hệ.',
        'Đổi mới – Khuyến khích sáng tạo, tư duy phản biện và tinh thần tiên phong.',
        'Liêm chính – Hành động đúng đắn, kể cả khi đối diện thử thách.',
        'Nhân ái – Thấu cảm, tôn trọng khác biệt và lan tỏa giá trị nhân văn.',
        'Nỗ lực – Kiên trì hoàn thiện bản thân để đạt kết quả tốt nhất.'
    ]

    const currentQuote = ref(quotes[0])
    let quoteTimer = null

    onMounted(async () => {
        EventBus.showLoading()
        try {
            const appRes = await ApplicationService.getMyCV(route.params.id)
            if (appRes.success && appRes.data?.length) {
                application.value = appRes.data[0]
            }

            const cvRes = await ApplicationCustomFieldValueService.getFieldOfMyCV(route.params.id)
            if (cvRes.success) {
                const cv = cvRes.data.find(i => i.id === CV_FIELD_ID)
                cvFile.value = cv?.value || null
            }

            // Luân phiên quote mỗi 3s
            let index = 0
            quoteTimer = setInterval(() => {
                index = (index + 1) % quotes.length
                currentQuote.value = quotes[index]
            }, 3000)
        } finally {
            EventBus.hideLoading()
        }
    })

    onUnmounted(() => {
        clearInterval(quoteTimer)
    })
</script>

<style scoped>
    .cv-wrapper {
        position: relative;
        width: 100%;
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 56px 16px;
        overflow: hidden;
    }

    /* Aura Rings */
    .aura {
        position: absolute;
        width: 520px;
        height: 520px;
        border-radius: 50%;
        filter: blur(120px);
        opacity: 0.5;
        pointer-events: none;
    }

    .aura-1 {
        background: #6366f1;
        top: -120px;
        left: -160px;
        animation: auraFloat 22s ease-in-out infinite;
    }

    .aura-2 {
        background: #3b82f6;
        bottom: -140px;
        right: -160px;
        animation: auraFloat 26s ease-in-out infinite reverse;
    }

    /* Glass */
    .cv-glass {
        width: 100%;
        max-width: 400px;
        height: fit-content;
        background: rgba(255, 255, 255, 0.5);
        backdrop-filter: blur(20px);
        border-radius: 22px;
        padding: 32px;
        box-shadow: 0 30px 80px rgba(0, 0, 0, 0.15);
        animation: subtleFloat 6s ease-in-out infinite;
    }

    /* Divider */
    .soft-divider {
        height: 1px;
        margin: 28px 0;
        background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.15), transparent);
    }

    /* Content */
    .cv-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 28px;
    }

    .cv-name {
        margin: 0;
        font-size: 1.7rem;
        font-weight: 700;
    }

    .cv-status {
        padding: 6px 16px;
        border-radius: 999px;
        background: rgba(241, 99, 99, 0.5);
        font-weight: 600;
        font-size: 0.85rem;
    }

    .cv-info {
        display: grid;
        gap: 16px;
    }

    .info-item {
        display: flex;
        justify-content: space-between;
        padding-bottom: 8px;
        border-bottom: 1px dashed rgba(0, 0, 0, 0.12);
    }

    .label {
        font-size: 0.9rem;
        color: #555;
    }

    .value {
        font-weight: 500;
    }

    .cv-link {
        font-weight: 600;
        color: var(--color-primary);
        text-decoration: none;
        position: relative;
    }

    .cv-link::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -2px;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, var(--color-primary), #3b82f6);
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.25s ease;
    }

    .cv-link:hover::after {
        transform: scaleX(1);
    }

    /* Quote / Philosophy */
    .philosophy {
        margin: 2rem 10% !important;
        width: 80%;
        font-size: 0.85rem;
        font-style: italic;
        color: #555;
        text-align: center;
        transition: opacity 0.6s ease, transform 0.6s ease;
        opacity: 1;
    }

    /* Loading */
    .loading {
        text-align: center;
        padding: 60px;
    }

    /* Animations */
    @keyframes auraFloat {
        0% {
            transform: translateY(0);
        }

        50% {
            transform: translateY(-40px);
        }

        100% {
            transform: translateY(0);
        }
    }

    @keyframes subtleFloat {
        0% {
            transform: translateY(0);
        }

        50% {
            transform: translateY(-6px);
        }

        100% {
            transform: translateY(0);
        }
    }
</style>