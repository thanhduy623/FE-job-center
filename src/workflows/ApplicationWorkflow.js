import { callN8n } from "@/utils/apiN8N";

/**
 * Upload CV thông qua n8n webhook
 */
export async function uploadCV(form) {
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
    return await callN8n({
        method: "POST",
        endpoint: "/upload-cv",
        body: fd
    });
}



/**
 * Gửi mail thông qua n8n webhook /mailer
 */
export async function sendMailer(form) {
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
    return await callN8n({
        method: "POST",
        endpoint: "/mailer",
        body: fd
    });
}


/**
 * Xác nhận phỏng vấn
 */
export async function confirm(token, canAttend, reason) {
    const fd = new FormData();

    // append các field thông thường
    fd.append("token", token)
    fd.append("canAttend", canAttend)
    fd.append("reason", reason)

    // gọi API n8n webhook
    return await callN8n({
        method: "POST",
        endpoint: "/confirm",
        body: fd
    });
}


export default { uploadCV, sendMailer, confirm };
