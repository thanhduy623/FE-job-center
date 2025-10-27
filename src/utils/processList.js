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
        if (asc) return valA > valB ? 1 : -1;
        return valA < valB ? 1 : -1;
    });
}


/**
 * Lọc danh sách dựa theo nhiều điều kiện (bao gồm lọc ngày trong khoảng).
 * @param {Array<Object>} list - Danh sách gốc
 * @param {Object} conditions - Các điều kiện lọc (key: value)
 * @returns {Array<Object>} Danh sách đã lọc
 */
export function filterList(list, conditions = {}) {
    if (!Array.isArray(list) || !list.length) return [];

    return list.filter(item => {
        return Object.entries(conditions).every(([key, value]) => {
            if (value === '' || value === null || value === undefined) return true;

            const fieldValue = item[key];
            if (fieldValue === undefined || fieldValue === null) return false;

            // Nếu là lọc theo khoảng ngày
            if (typeof value === 'object' && (value.from || value.to)) {
                const itemDate = new Date(fieldValue);
                if (isNaN(itemDate)) return false;

                // Chỉ lấy phần ngày (YYYY-MM-DD)
                const itemDay = itemDate.toISOString().split('T')[0];

                // Tạo ngày giới hạn
                const fromDay = value.from ? new Date(value.from).toISOString().split('T')[0] : null;
                const toDay = value.to ? new Date(value.to).toISOString().split('T')[0] : null;

                let inRange = true;
                if (fromDay && itemDay < fromDay) inRange = false;
                if (toDay && itemDay > toDay) inRange = false;
                return inRange;
            }

            // Nếu là chuỗi → so sánh không phân biệt hoa thường + có chứa
            if (typeof fieldValue === 'string' && typeof value === 'string') {
                return fieldValue.toLowerCase().includes(value.toLowerCase());
            }

            // Nếu là số hoặc id → so sánh chính xác
            return fieldValue === value;
        });
    });
}


/**
 * Tìm kiếm trong danh sách theo 1 hoặc nhiều trường chuỗi
 * @param {Array<Object>} list - Danh sách gốc
 * @param {string} searchValue - Giá trị tìm kiếm
 * @param {Array<string>} fields - Các field cần tìm (vd: ['firstname', 'lastname'])
 * @returns {Array<Object>} Danh sách sau khi tìm kiếm
 */
export function searchList(list, searchValue, fields = []) {
    if (!Array.isArray(list) || !list.length) return [];
    if (!searchValue || !fields.length) return list;

    const search = searchValue.trim().toLowerCase();

    return list.filter(item => {
        // Hỗ trợ đặc biệt cho fullname
        const fullName = `${item.lastname ?? ''} ${item.firstname ?? ''}`.toLowerCase().trim();
        if (fields.includes('fullname') && fullName.includes(search)) {
            return true;
        }

        // Duyệt qua các field còn lại
        return fields.some(field => {
            const val = item[field];
            return typeof val === 'string' && val.toLowerCase().includes(search);
        });
    });
}
