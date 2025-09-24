/**
 * Lọc danh sách theo một key để lấy unique
 * @param {Array<Object>} list - Danh sách object đầu vào
 * @param {string} uniqueKey - Thuộc tính dùng để lọc trùng
 * @param {Array<string>} fields - Các field muốn giữ lại trong output
 * @returns {Array<Object>} Danh sách object đã lọc unique, chỉ gồm các field cần thiết
 */
export function getUniqueBy(list, uniqueKey, fields) {
    const map = new Map();

    list.forEach(item => {
        const key = item[uniqueKey];
        if (!map.has(key)) {
            const newItem = {};
            fields.forEach(f => {
                newItem[f] = item[f];
            });
            map.set(key, newItem);
        }
    });

    return Array.from(map.values());
}

/**
 * Sắp xếp danh sách theo một key
 * @param {Array<Object>} list - Danh sách object đầu vào
 * @param {string} sortKey - Thuộc tính để sắp xếp
 * @param {boolean} [asc=true] - true: tăng dần, false: giảm dần
 * @returns {Array<Object>} Danh sách object đã được sắp xếp
 */
export function sortBy(list, sortKey, asc = true) {
    return [...list].sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];

        if (valA === valB) return 0;

        if (asc) {
            return valA > valB ? 1 : -1;
        } else {
            return valA < valB ? 1 : -1;
        }
    });
}
