import { EventBus } from '@/utils/eventBus'

const PREFIX = "auth_";

/**
 * Lưu session với thời hạn
 */
export function setSession(key, data, ttlSeconds = 3600) {
    if (!key) throw new Error("Key không được để trống");
    const record = {
        value: data,
        expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null
    };
    try {
        localStorage.setItem(PREFIX + key, JSON.stringify(record));
    } catch (e) {
        console.error("Lưu session thất bại:", e);
    }
}

/**
 * Lấy session, kiểm tra hết hạn
 */
export function getSession(key) {
    if (!key) throw new Error("Key không được để trống");
    try {
        const jsonData = localStorage.getItem(PREFIX + key);
        if (!jsonData) return null;

        const record = JSON.parse(jsonData);
        if (record.expiresAt && Date.now() > record.expiresAt) {
            EventBus.showNotify("Phiên làm việc đã hết hạn...", 'error');
            clearAllSessions();
            window.location.href = "/login";
            return null;
        }
        return record.value;
    } catch (e) {
        console.error("Lấy session thất bại:", e);
        return null;
    }
}

/**
 * Xóa một session
 */
export function removeSession(key) {
    if (!key) throw new Error("Key không được để trống");
    try {
        localStorage.removeItem(PREFIX + key);
    } catch (e) {
        console.error("Xóa session thất bại:", e);
    }
}

/**
 * Xóa tất cả session
 */
export function clearAllSessions() {
    try {
        // xóa mọi key trong localStorage
        localStorage.clear()
    } catch (e) {
        console.error("Xóa tất cả session thất bại:", e);
    }
}
