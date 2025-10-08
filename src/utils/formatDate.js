/**
 * Định dạng ngày theo format (mặc định: DD/MM/YYYY)
 * @param {string|Date|null|undefined} dateStr - Chuỗi ngày hoặc đối tượng Date
 * @param {string} format - Kiểu định dạng (VD: "DD/MM/YYYY", "DD/MM/YYYY HH:mm:ss")
 * @returns {string} Ngày đã định dạng hoặc "-"
 */
export function formatDate(dateStr, format = "DD/MM/YYYY") {
    if (!dateStr) return "-"

    const date = new Date(dateStr)
    if (isNaN(date)) return "-"

    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    const seconds = String(date.getSeconds()).padStart(2, "0")

    // Thay các ký tự trong format
    return format
        .replace("DD", day)
        .replace("MM", month)
        .replace("YYYY", year)
        .replace("HH", hours)
        .replace("mm", minutes)
        .replace("ss", seconds)
}
