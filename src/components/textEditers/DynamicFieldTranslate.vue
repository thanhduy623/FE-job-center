<template>
    <div class="flex flex-row items-center wrap gap-1">
        <!-- VI Input -->
        <div class="flex-1">
            <div class="flex flex-row items-center wrap gap-1">
                <label class="flex flex-1">{{ $t(label) }} (VI)</label>
                <button type="button" class="translate-btn" @click="translate('vi')"></button>
            </div>
            <input type="text" :value="formData[fieldVi]" :disabled="loading?.[fieldVi]"
                @input="onInput($event, fieldVi)">
        </div>

        <!-- EN Input -->
        <div class="flex-1">
            <div class="flex flex-row items-center wrap gap-1">
                <label class="flex flex-1">{{ $t(label) }} (EN)</label>
                <button type="button" class="translate-btn" @click="translate('en')"></button>
            </div>
            <input type="text" :value="formData[fieldEn]" :disabled="loading?.[fieldEn]"
                @input="onInput($event, fieldEn)">
        </div>
    </div>
</template>

<script setup>
    import { defineProps, defineEmits } from 'vue'

    const props = defineProps({
        label: { type: String, required: true },
        fieldVi: { type: String, required: true },
        fieldEn: { type: String, required: true },
        formData: { type: Object, required: true },
        loading: { type: Object, required: true }
    })

    const emit = defineEmits(['update', 'translate'])

    function onInput(event, fieldKey) {
        emit('update', {
            key: fieldKey,
            value: event.target.value
        })
    }

    function translate(sourceLang) {
        const sourceKey = sourceLang === 'vi' ? props.fieldVi : props.fieldEn
        const targetKey = sourceLang === 'vi' ? props.fieldEn : props.fieldVi

        emit('translate', {
            sourceKey,
            targetKey,
            sourceLang
        })
    }
</script>

<style scoped>
    .text-input {
        width: 100%;
        min-height: 150px;
        resize: vertical;
        padding: 8px;
        border: 1px solid #dcdcdc;
        border-radius: 4px;
        background: #f9f9f9;
        font-size: 14px;
        line-height: 1.5;
    }

    .translate-btn {
        background-color: transparent;
        padding: 0;
        background-image: url('https://png.pngtree.com/png-clipart/20230916/original/pngtree-google-translate-translation-icon-vector-png-image_12256678.png');
        width: 24px;
        height: 24px;
        background-size: cover;
        border: none;
        cursor: pointer;
    }
</style>