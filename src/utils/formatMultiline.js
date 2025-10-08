/**
 * Định dạng text có nhiều dòng hoặc dấu gạch đầu dòng (" - ") thành HTML xuống dòng
 * @param {string|null|undefined} text - Nội dung gốc
 * @returns {string} HTML đã định dạng, dùng với v-html
 */
export function formatMultiline(text) {
    if (!text) return "-"
    return text
        .replaceAll("\n", "<br>")
        .replaceAll(" - ", "<br>• ")
}
