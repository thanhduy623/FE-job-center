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
    import { ref, onMounted, watch, defineProps, defineEmits } from 'vue'
    import Quill from 'quill'
    import 'quill/dist/quill.snow.css'

    const props = defineProps({
        label: { type: String, required: true },
        fieldVi: { type: String, required: true },
        fieldEn: { type: String, required: true },
        formData: { type: Object, required: true },
        loading: { type: Object, required: true }
    })

    const emit = defineEmits(['update', 'translate'])

    const editorVi = ref(null)
    const editorEn = ref(null)
    const quillEditors = {}

    function initEditor(refEl, fieldKey) {
        if (!refEl.value) return null

        const quill = new Quill(refEl.value, {
            theme: 'snow',
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['link']
                ]
            }
        })

        quill.on('text-change', () => {
            emit('update', { key: fieldKey, value: quill.root.innerHTML })
            autoResizeEditor(quill, refEl)
        })

        autoResizeEditor(quill, refEl)
        return quill
    }

    function autoResizeEditor(editor, containerRef) {
        if (!editor || !containerRef.value) return
        containerRef.value.style.height = editor.root.scrollHeight + 12 + 'px'
    }

    function translate(sourceLang) {
        const sourceKey = sourceLang === 'vi' ? props.fieldVi : props.fieldEn
        const targetKey = sourceLang === 'vi' ? props.fieldEn : props.fieldVi
        emit('translate', {
            sourceKey,
            targetKey,
            sourceLang,
            editorInstance: quillEditors[targetKey]
        })
    }

    onMounted(() => {
        quillEditors[props.fieldVi] = initEditor(editorVi, props.fieldVi)
        quillEditors[props.fieldEn] = initEditor(editorEn, props.fieldEn)
    })

    watch(
        () => props.formData[props.fieldVi],
        (newVal) => {
            const editor = quillEditors[props.fieldVi]
            if (editor && editor.root.innerHTML !== newVal) {
                editor.clipboard.dangerouslyPasteHTML(newVal || '')
                autoResizeEditor(editor, editorVi)
            }
        }
    )

    watch(
        () => props.formData[props.fieldEn],
        (newVal) => {
            const editor = quillEditors[props.fieldEn]
            if (editor && editor.root.innerHTML !== newVal) {
                editor.clipboard.dangerouslyPasteHTML(newVal || '')
                autoResizeEditor(editor, editorEn)
            }
        }
    )
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

    /* Fix gốc font-size của Quill */
    .editor-container.ql-container {
        font-size: 1rem !important;
    }

    /* Đảm bảo toàn bộ nội dung trong editor */
    .editor-container .ql-editor,
    .editor-container .ql-editor * {
        font-size: 1rem !important;
    }

    /* Fix riêng cho bullet / number */
    .editor-container .ql-editor li {
        font-size: 1rem !important;
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