<template>
    <div class="flex flex-col">
        <label v-if="label" class="mb-2">{{ $t(label) }}</label>
        <div ref="editorContainer" class="editor-container"></div>
    </div>
</template>

<script setup>
    import { ref, onMounted, watch, defineProps, defineEmits } from 'vue'
    import Quill from 'quill'
    import 'quill/dist/quill.snow.css'

    const props = defineProps({
        label: { type: String, required: true },
        modelValue: { type: String, default: '' },
        height: { type: String, default: '150px' }, // default height
        width: { type: String, default: '100%' }    // default width
    })

    const emit = defineEmits(['update:modelValue'])

    const editorContainer = ref(null)
    let quill = null

    onMounted(() => {
        if (!editorContainer.value) return

        // set initial width & height
        editorContainer.value.style.width = props.width
        editorContainer.value.style.minHeight = props.height

        quill = new Quill(editorContainer.value, {
            theme: 'snow',
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['link']
                ]
            }
        })

        quill.clipboard.dangerouslyPasteHTML(props.modelValue || '')

        quill.on('text-change', () => {
            emit('update:modelValue', quill.root.innerHTML)
            autoResizeEditor()
        })

        autoResizeEditor()
    })

    watch(() => props.modelValue, (newVal) => {
        if (quill && quill.root.innerHTML !== newVal) {
            quill.root.innerHTML = newVal || ''
            autoResizeEditor()
        }
    })

    function autoResizeEditor() {
        if (!editorContainer.value || !quill) return
        const contentHeight = quill.root.scrollHeight
        // set dynamic height only if content exceeds initial height
        const initialHeight = parseInt(props.height)
        editorContainer.value.style.height = Math.max(contentHeight + 12, initialHeight) + 'px'
    }
</script>

<style scoped>
    .editor-container {
        background: #f9f9f9;
        padding: 6px;
        height: auto;
    }

    .ql-container {
        height: auto !important;
    }

    .ql-editor {
        min-height: 150px;
        height: auto !important;
        overflow-y: visible;
    }
</style>