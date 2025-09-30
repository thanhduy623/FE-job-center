// utils/mapLocaleField.js
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export function mapLocaleField(data, mappings) {
    const { locale } = useI18n()

    const mappedData = computed(() =>
        data.value.map(item => {
            const newItem = { ...item }
            mappings.forEach(({ newKey, parentKey, viKey, enKey }) => {
                if (parentKey) {
                    const obj = item[parentKey] || {}
                    const vKey = viKey || 'name_vi'
                    const eKey = enKey || 'name_en'
                    newItem[newKey] = locale.value === 'vi' ? obj[vKey] ?? '' : obj[eKey] ?? ''
                } else {
                    newItem[newKey] = locale.value === 'vi' ? item[viKey] ?? '' : item[enKey] ?? ''
                }
            })
            return newItem
        })
    )

    return mappedData
}
