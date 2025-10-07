<template>
    <div class="file-upload-container" :class="{ 'is-disabled': isDisabled }" @click="handleClick"
        @dragover.prevent="handleDragOver" @dragleave.prevent="handleDragLeave" @drop.prevent="handleDrop">
        <div class="upload-area" :class="{ 'is-dragging': isDragging }">
            <input type="file" ref="fileInput" :accept="allowedFileTypes" :multiple="isMultiple" :disabled="isDisabled"
                @change="handleFileChange" hidden />

            <div class="content">
                <svg class="cloud-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M17.5 18H5.5C4.11929 18 3 16.8807 3 15.5C3 14.1611 3.52296 12.9431 4.38216 12.0016C4.84654 11.4883 5.34149 11.0592 5.85764 10.7077C6.06992 10.565 6.27303 10.4357 6.4673 10.3197C7.29135 9.8166 8.27435 9.47957 9.33081 9.34966C9.69741 9.30571 10.046 9.27855 10.3768 9.26871C10.6698 9.26002 10.966 9.25547 11.2655 9.25506C11.7583 9.25439 12.2511 9.25439 12.7439 9.25506C13.0434 9.25547 13.3396 9.26002 13.6326 9.26871C13.9634 9.27855 14.312 9.30571 14.6786 9.34966C15.7351 9.47957 16.7181 9.8166 17.5421 10.3197C17.7364 10.4357 17.9395 10.565 18.107 10.6725C18.6656 11.0264 19.1673 11.4589 19.6105 11.9774C20.477 12.9234 21 14.1378 21 15.5C21 16.8807 19.8807 18 18.5 18H17.5Z"
                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

                <p class="text-main">
                    {{ mainText }}
                </p>
                <p class="text-accepted-types">
                    {{ acceptedTypesText }}
                </p>

                <!-- Hiển thị tên file đã chọn -->
                <ul class="selected-files" v-if="selectedFiles.length > 0">
                    <li v-for="(file, index) in selectedFiles" :key="index">
                        {{ file.name }} <span class="file-type">({{ getFileExtension(file.name) }})</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed, defineEmits, defineProps } from 'vue';

    // --- 1. NHẬN BIẾN TỪ CHA (PROPS) ---
    const props = defineProps({
        allowedFileTypes: {
            type: [String, Array],
            default: () => ['.png', '.pdf', '.jpg', '.docx']
        },
        isMultiple: {
            type: Boolean,
            default: false
        },
        isDisabled: {
            type: Boolean,
            default: false
        },
        mainText: {
            type: String,
            default: 'select your file or drag and drop'
        },
    });

    const acceptedTypesText = computed(() => {
        if (Array.isArray(props.allowedFileTypes)) {
            return props.allowedFileTypes.join(', ').replace(/\./g, '');
        }
        return props.allowedFileTypes.split(',').map(t => t.trim().replace(/\./g, '')).join(', ');
    });

    // --- 2. GỬI DỮ LIỆU LÊN CHA (EMIT) ---
    const emit = defineEmits(['file-selected', 'upload-error']);

    // --- 3. LOGIC XỬ LÝ FILE ---
    const fileInput = ref(null);
    const isDragging = ref(false);
    const selectedFiles = ref([]); // <== DANH SÁCH FILE ĐƯỢC CHỌN

    const handleClick = () => {
        if (!props.isDisabled) {
            fileInput.value.click();
        }
    };

    const handleFileChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const fileList = props.isMultiple ? Array.from(files) : [files[0]];
            selectedFiles.value = fileList;
            emit('file-selected', props.isMultiple ? fileList : fileList[0]);
        }
    };

    const handleDragOver = () => {
        if (!props.isDisabled) {
            isDragging.value = true;
        }
    };

    const handleDragLeave = () => {
        if (!props.isDisabled) {
            isDragging.value = false;
        }
    };

    const handleDrop = (event) => {
        if (props.isDisabled) return;

        isDragging.value = false;
        const droppedFiles = event.dataTransfer.files;

        if (droppedFiles.length > 0) {
            const acceptedTypesArray = Array.isArray(props.allowedFileTypes)
                ? props.allowedFileTypes.map(t => t.toLowerCase().trim())
                : props.allowedFileTypes.toLowerCase().split(',').map(t => t.trim());

            const validFiles = Array.from(droppedFiles).filter(file => {
                const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
                return acceptedTypesArray.includes(fileExtension) || acceptedTypesArray.includes(file.type);
            });

            if (validFiles.length > 0) {
                const filesToEmit = props.isMultiple ? validFiles : validFiles.slice(0, 1);
                selectedFiles.value = filesToEmit;
                emit('file-selected', props.isMultiple ? filesToEmit : filesToEmit[0]);
            } else {
                emit('upload-error', 'Tất cả các file đã thả đều không hợp lệ.');
            }
        }
    };

    // Helper để lấy phần mở rộng
    const getFileExtension = (filename) => {
        return filename.split('.').pop().toUpperCase();
    };
</script>


<style scoped>
    .file-upload-container {
        cursor: pointer;
        padding: var(--spacing-1);
    }

    .file-upload-container.is-disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }

    .upload-area {
        border: 2px dashed var(--color-gray-300);
        border-radius: 8px;
        padding: 40px 20px;
        transition: all 0.2s ease-in-out;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        background-color: var(--color-white);
        min-height: 200px;
    }

    .upload-area:hover:not(.is-dragging):not(.is-disabled) {
        border-color: var(--color-primary);
    }

    .upload-area.is-dragging {
        border-color: var(--color-secondary);
        background-color: var(--color-gray-100);
    }

    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
    }

    .cloud-icon {
        width: 48px;
        height: 48px;
        color: var(--color-secondary);
        stroke: var(--color-secondary);
    }

    .text-main {
        font-size: 1.1em;
        font-weight: 500;
        color: var(--color-gray-900);
        margin: 0;
    }

    .text-accepted-types {
        font-size: 0.9em;
        color: var(--color-gray-500);
        margin: 0;
    }

    .selected-files {
        list-style: none;
        padding: 0;
        margin-top: var(--spacing-1);
        font-size: 0.9em;
        color: var(--color-gray-700);
        text-align: left;
        max-width: 300px;
        word-wrap: break-word;
    }

    .selected-files li {
        margin-bottom: 4px;
    }

    .file-type {
        color: var(--color-gray-500);
        font-style: italic;
        margin-left: 5px;
    }
</style>