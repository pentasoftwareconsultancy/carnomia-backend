import axios from 'axios';

export const convertImageToBase64 = async (imageUrl) => {
    try {
        if (!imageUrl) return '';
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const base64 = Buffer.from(response.data, 'binary').toString('base64');
        const mimeType = response.headers['content-type'];
        return `data:${mimeType};base64,${base64}`;
    } catch (err) {
        console.error('Error converting image to base64:', imageUrl, err.message);
        return '';
    }
};
