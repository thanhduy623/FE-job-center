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



/**
 * Gửi mail thông qua n8n webhook /mailer
 */
export async function sendMailer(form) {
    try {
        const fd = new FormData();

        const authSessionRaw = localStorage.getItem("auth_session");
        const authSession = authSessionRaw ? JSON.parse(authSessionRaw) : null;
        const token = authSession?.value?.access_token || null;

        // append các field thông thường
        fd.append("idApplication", form.idApplication)
        fd.append("status", form.status || null)

        fd.append("scheduleStartTime", form.scheduleStartTime || null)
        fd.append("scheduleEndTime", form.scheduleEndTime || null)
        fd.append("scheduleDate", form.scheduleDate || null)
        fd.append("token", token);

        // gọi API n8n webhook
        const res = await callN8n({
            method: "POST",
            endpoint: "/mailer",
            body: fd
        });

        console.log(res);


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


/**
 * Xác nhận phỏng vấn
 */
export async function confirm(token, canAttend, reason) {
    try {
        const fd = new FormData();

        // append các field thông thường
        fd.append("token", token)
        fd.append("canAttend", canAttend)
        fd.append("reason", reason)

        // gọi API n8n webhook
        const res = await callN8n({
            method: "POST",
            endpoint: "/confirm",
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


export default { uploadCV, sendMailer, confirm };
