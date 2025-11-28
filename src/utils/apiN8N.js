import { EventBus } from './eventBus'

import axios from "axios";
export const N8N_BASE = "https://n8n.dat3k.tech/webhook-test";


export async function callN8n({ method = "GET", endpoint, body = {}, query = {} }) {
    EventBus.showLoading()
    const isFormData = body instanceof FormData;
    const config = {
        method: method.toLowerCase(),
        url: `${N8N_BASE}${endpoint}`,
        headers: isFormData ? {} : { "Content-Type": "application/json" },
        params: query,
        data: body,
    };
    try {
        const response = await axios(config);
        EventBus.hideLoading()
        return response.data;
    } catch (err) {
        console.error("Error calling n8n webhook:", err.response?.data || err.message);
        EventBus.hideLoading()
        throw err;
    }
}
