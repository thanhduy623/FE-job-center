import { callN8n } from "@/utils/apiN8N";
import { EventBus } from "@/utils/eventBus.js"

/**
 * Upload CV thông qua n8n webhook
 */
export async function uploadCV(form) {
    try {
        const fd = new FormData();

        // append fields normal
        fd.append("jobId", form.jobId);
        fd.append("fullName", form.fullName);
        fd.append("email", form.email);
        fd.append("phone", form.phone);
        fd.append("address", form.address);
        fd.append("coverLetter", form.coverLetter);

        // append dynamicField
        Object.entries(form.dynamicField).forEach(([id, value]) => {
            if (value instanceof File) {
                // file
                fd.append(`dynamicField[${id}]`, value, value.name);
            } else {
                // text
                fd.append(`dynamicField[${id}]`, value ?? "");
            }
        });

        // gọi API, body là FormData
        const res = await callN8n({
            method: "POST",
            endpoint: "/upload-cv",
            body: fd
        });

        // Nếu n8n trả lỗi (ví dụ 404, 500)
        if (!res || res.success === false) {
            throw new Error(res?.message || "API trả về lỗi");
        }

        return res;
    } catch (err) {
        EventBus.showNotify("Lỗi khi gửi mail!", "error");
        return false;
    }
}



export default { uploadCV };
