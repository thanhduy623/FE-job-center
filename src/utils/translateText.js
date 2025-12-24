export async function translateText(q, sourceLang = 'vi') {
    const targetLang = sourceLang === 'vi' ? 'en' : 'vi';
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(q)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Giải thích: 
        // data[0] là mảng chứa các phân đoạn văn bản
        // item[0] là chuỗi đã dịch của phân đoạn đó
        const result = data[0].map(item => item[0]).join('');

        return result; // Trả về đúng chuỗi đã dịch (tl)
    } catch (error) {
        return "Lỗi dịch thuật";
    }
}