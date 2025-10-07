// utils/mapLocaleField.js
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export function mapLocaleField(data, mappings) {
    const { locale } = useI18n()

    const mappedData = computed(() =>
        data.value.map(item => {
            const newItem = { ...item }

            mappings.forEach(({ newKey, parentKey, viKey, enKey }) => {
                const viField = viKey || `${newKey}_vi`
                const enField = enKey || `${newKey}_en`

                if (parentKey) {
                    const obj = item[parentKey] || {}
                    newItem[newKey] = locale.value === 'vi' ? obj[viField] ?? '' : obj[enField] ?? ''
                } else {
                    newItem[newKey] = locale.value === 'vi' ? item[viField] ?? '' : item[enField] ?? ''
                }
            })

            return newItem
        })
    )

    return mappedData
}
