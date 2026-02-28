const axios = require('axios');

export default async function handler(req, res) {
    // Hanya izinkan method POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL TikTok wajib diisi!' });
    }

    try {
        // Panggil API TikWM
        const response = await axios.post('https://www.tikwm.com/api/', { url });
        const data = response.data.data;

        if (!data) {
            return res.status(404).json({ error: 'Gagal! Pastikan link benar atau akun tidak diprivat.' });
        }

        // Cek apakah postingan slide gambar atau video
        if (data.images && data.images.length > 0) {
            return res.status(200).json({ type: 'images', images: data.images, title: data.title });
        } else if (data.play) {
            return res.status(200).json({ type: 'video', play: data.play, title: data.title });
        } else {
            return res.status(400).json({ error: 'Format tidak didukung.' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }
}
