// Menggunakan env variable untuk fleksibilitas (local vs production)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const BASE_URL_ONLINE = process.env.NEXT_PUBLIC_API_URL || "https://belajar-laravel-evomi-main-dlc8ss.free.laravel.cloud";

export const SETTINGS = {
    API_BASE: `${BASE_URL}/api`,
    STORAGE_BASE: `${BASE_URL}/storage`,
    ENDPOINTS: {
        LOGIN: "/login",
        REGISTER: "/register",
        PRODUCTS: "/products",
        PROFILE_UPDATE: "/profile/update",
        CHAT: "/chat/messages",
        PAYMENT: "/payment/authorize"
    }
};

/**
 * Fungsi General untuk membangun URL
 * @param {string} key - Kunci dari ENDPOINTS (misal: 'PRODUCTS')
 * @param {string|number} suffix - Tambahan di akhir URL (misal: ID produk)
 * @returns {string} - URL lengkap
 */
export const getApiUrl = (key, suffix = "") => {
    const path = SETTINGS.ENDPOINTS[key] || "";
    const fullPath = suffix ? `${path}/${suffix}` : path;
    return `${SETTINGS.API_BASE}${fullPath}`;
};