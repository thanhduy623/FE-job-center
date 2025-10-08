<template>
    <div class="flex flex-col gap-1">
        <div class="card">
            <h3 class="text-primary" v-t="'infomation'"></h3>
            <p>{{ $t('name') }}: {{ job?.name || '-' }}</p>
            <p>{{ $t('position') }}: {{ job?.position || '-' }}</p>
            <p>{{ $t('salary') }}: {{ job?.salary || '-' }}</p>
            <p>
                {{ $t('fromDate') }}: {{ formatDate(job?.applicationDeadlineStart) }}
                {{ $t('toDate') }} {{formatDate(job?.applicationDeadlineEnd) }}</p>
        </div>

        <div class="card">
            <h3 class="text-primary" v-t="'description'"></h3>
            <p v-html="formatMultiline(job?.description)"></p>
        </div>

        <div class="card">
            <h3 class="text-primary" v-t="'requirement'"></h3>
            <p v-html="formatMultiline(job?.requirements)"></p>
        </div>

        <div class="card">
            <h3 class="text-primary" v-t="'benefit'"></h3>
            <p v-html="formatMultiline(job?.benefits)"></p>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, defineProps, computed } from "vue"
    import { getJob } from "@/services/JobService"
    import { mapLocaleField } from "@/utils/mapLocaleField.js"
    import { formatDate } from "@/utils/formatDate.js"
    import { formatMultiline } from "@/utils/formatMultiline.js"

    const props = defineProps({
        jobId: {
            type: String,
            required: true
        }
    })

    const rawJobList = ref([])

    const mappedJobList = mapLocaleField(rawJobList, [
        { newKey: "name" },
        { newKey: "position" },
        { newKey: "description" },
        { newKey: "requirements" },
        { newKey: "benefits" },
    ])

    const job = computed(() => mappedJobList.value[0] || null)

    onMounted(async () => {
        try {
            const res = await getJob({ id: props.jobId })
            if (res.success && res.data?.length) {
                rawJobList.value = res.data
            } else {
                console.warn("Không tìm thấy job.")
            }
        } catch (err) {
            console.error("Lỗi khi lấy dữ liệu job:", err)
        }
    })
</script>