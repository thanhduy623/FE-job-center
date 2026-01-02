<template>
    <div class="flex flex-row items-center wrap gap-1">
        <!-- VI Editor -->
        <div class="flex-1">
            <div class="flex flex-row items-center wrap gap-1">
                <label class="flex flex-1">{{ $t(label) }} (VI)</label>
                <button type="button" class="translate-btn" @click="translate('vi', 'en')">
                </button>
            </div>
            <div ref="editorVi" class="editor-container"></div>
        </div>

        <!-- EN Editor -->
        <div class="flex-1">
            <div class="flex flex-row items-center wrap gap-1">
                <label class="flex flex-1">{{ $t(label) }} (EN)</label>
                <button type="button" class="translate-btn" @click="translate('en', 'vi')">
                </button>
            </div>
            <div ref="editorEn" class="editor-container"></div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, defineProps, defineEmits } from 'vue'
    import Quill from 'quill'
    import 'quill/dist/quill.snow.css'

    const props = defineProps({
        label: { type: String, required: true },
        fieldVi: { type: String, required: true },
        fieldEn: { type: String, required: true },
        formData: { type: Object, required: true },
        loading: { type: Object, required: true }
    })

    const emit = defineEmits(['update'])

    const editorVi = ref(null)
    const editorEn = ref(null)
    let quillEditors = {}

    function initEditor(refEl, fieldKey) {
        if (!refEl.value) return null
        const quill = new Quill(refEl.value, {
            theme: 'snow',
            modules: { toolbar: [['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }], ['link']] }
        })
        quill.clipboard.dangerouslyPasteHTML(props.formData[fieldKey] || '')
        quill.on('text-change', () => {
            emit('update', { key: fieldKey, value: quill.root.innerHTML })
            autoResizeEditor(quill, refEl)
        })
        autoResizeEditor(quill, refEl)
        return quill
    }

    function autoResizeEditor(editor, containerRef) {
        if (!editor || !containerRef.value) return
        const contentHeight = editor.root.scrollHeight
        containerRef.value.style.height = contentHeight + 12 + 'px'
    }

    function translate(sourceLang) {
        const sourceKey = sourceLang === 'vi' ? props.fieldVi : props.fieldEn
        const targetKey = sourceLang === 'vi' ? props.fieldEn : props.fieldVi
        emit('translate', { sourceKey, targetKey, sourceLang, editorInstance: quillEditors[targetKey] })
    }

    onMounted(() => {
        quillEditors = {
            [props.fieldVi]: initEditor(editorVi, props.fieldVi),
            [props.fieldEn]: initEditor(editorEn, props.fieldEn)
        }
    })
</script>


<style scoped>
    .editor-container {
        display: block;
        min-height: 300px;
        min-width: 300px;
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

    .translate-btn {
        background-color: transparent;
        padding: 0;
        background-image: url('https://png.pngtree.com/png-clipart/20230916/original/pngtree-google-translate-translation-icon-vector-png-image_12256678.png');
        width: 24px;
        height: 24px;
        background-size: cover;
    }
</style>