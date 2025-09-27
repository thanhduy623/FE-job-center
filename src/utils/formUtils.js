// utils/formUtils.js
export function getFormData(formElement) {
    if (!formElement) return {};

    const formData = {};
    const elements = formElement.querySelectorAll("input, select, textarea");

    elements.forEach(el => {
        const name = el.name || el.id;
        if (!name) return;

        let value = el.value;

        if (el.type === "checkbox") {
            formData[name] = el.checked;
        } else if (el.type === "radio") {
            if (el.checked) {
                formData[name] = value;
            }
        } else if (el.type === "number") {
            formData[name] = value === "" ? null : Number(value);
        } else if (el.type === "date") {
            formData[name] = value === "" ? null : value; // để Supabase hiểu null hoặc date string
        } else {
            formData[name] = value === "" ? null : value;
        }
    });

    return formData;
}
