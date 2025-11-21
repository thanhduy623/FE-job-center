import { callN8n } from "@/utils/apiN8N";

/**
 * Upload document thông qua n8n webhook
 * @param {File|Blob} file - file từ input
 * @param {string} name - tên file
 * @param {string} type - loại file
 */
export async function uploadDocument({ file, name, type }) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("type", type);

    return await callN8n({
        method: "POST",
        endpoint: "/upload-document-metadata",
        body: formData
    });
}

/**
 * Xóa document thông qua n8n webhook
 * @param {string} id - id file trên n8n / storage
 */
export async function deleteDocument({ id }) {
    return await callN8n({
        method: "DELETE",
        endpoint: "/delete-document-metadata",
        query: { documentId: id }
    });
}

export default { uploadDocument, deleteDocument };
