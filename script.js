document.addEventListener('DOMContentLoaded', function() {
    // Mengambil elemen notifikasi dan tombol penutup
    document.getElementById('welcome-notification').style.display = 'flex';
    
    document.getElementById('close-notification').addEventListener('click', function() {
        document.getElementById('welcome-notification').style.display = 'none';
    });
});

document.getElementById('downloadBtn').addEventListener('click', function() {
    const url = document.getElementById('url').value.trim(); // Menghapus spasi di awal dan akhir
    const quality = document.getElementById('quality').value;
    const resultDiv = document.getElementById('result');
    const loadingDiv = document.getElementById('loading');

    // Validasi URL
    if (url === "") {
        resultDiv.innerHTML = "<p style='color: red;'>Silakan masukkan URL yang valid.</p>";
        return;
    }

    loadingDiv.style.display = 'flex';

    // Memeriksa jenis URL dan memanggil API yang sesuai
    if (url.includes("youtube.com") || url.includes("youtu.be"))
{
        handleYouTubeDownload(url, quality, resultDiv, loadingDiv);
    } else if (url.includes("instagram.com")) {
        handleInstagramDownload(url, resultDiv, loadingDiv);
    } else if (url.includes("tiktok.com")) {
        handleTikTokDownload(url, resultDiv, loadingDiv);
    } else if (url.includes("spotify.com")) {
        handleSpotifyDownload(url, resultDiv, loadingDiv);
    } else {
        loadingDiv.style.display = 'none';
        resultDiv.innerHTML = "<p style='color: red;'>URL tidak dikenali. Silakan masukkan URL YouTube, Instagram, TikTok, atau Spotify.</p>";
    }
});

// Fungsi untuk menangani download YouTube
async function handleYouTubeDownload(url, quality, resultDiv, loadingDiv) {
    const VideoId = url
    if (!url) {
        resultDiv.innerHTML = "<p style='color: red;'>URL tidak valid. Silakan masukkan URL YouTube yang benar.</p>";
        return;
    }

    const downloadText = quality === "mp3" ? `DOWNLOAD MP3: ` : `DOWNLOAD MP4: `;
    const apiUrl = quality === "mp3" 
        ? `https://api.agatz.xyz/api/ytmp3?url=${VideoId}`
        : `https://api.agatz.xyz/api/ytmp4?url=${VideoId}`;
    
    try {
        // Mengambil data dari API ytmp3 atau ytmp4
        const response1 = await fetch(apiUrl);
        const data1 = await response1.json();
        // Memastikan response1 berhasil
        if (data1.status !== 200) {
            throw new Error("Gagal mengambil data dari API ytmp3 atau ytmp4");
        }

        const response2 = await fetch(`https://api.agatz.xyz/api/ytsearch?message=${encodeURIComponent(url)}`);
        const data2 = await response2.json();
        // Memastikan response2 berhasil
        if (data2.status !== 200) {
            throw new Error("Gagal mengambil data dari API ytsearch");
        }

        loadingDiv.style.display = 'none';

        if (quality === "mp3") {
            let downloadLinks = '';
            const videoInfo = data2.data[0];

            // Memastikan ada data audio
            if (data1.data.length === 0) {
                resultDiv.innerHTML = "<p style='color: red;'>Tidak ada audio yang tersedia.</p>";
                return;
            }

            data1.data.forEach(audio => {
                downloadLinks += `
                <p>
                    <strong>${audio.quality}</strong>: 
                    <a href="${audio.downloadUrl}" target="_blank" class="download-button">
                        <img src="https://img.icons8.com/material-outlined/24/ffffff/download.png" alt="Download" />
                    </a>
                </p>
                `;
            });

            resultDiv.innerHTML = `
            <div style="text-align: center;">
                <h2>${videoInfo.title}</h2>
                <img src="${videoInfo.thumbnail}" alt="${videoInfo.title}" style="max-width: 100%; height: auto; border-radius: 8px;">
                <p>${downloadText}</p>
                ${downloadLinks}
                <p><strong>Deskripsi:</strong> ${videoInfo.description || 'Tidak ada deskripsi.'}</p>
                <p><strong>Durasi:</strong> ${videoInfo.duration || 'Tidak tersedia'} detik</p>
                <p><strong>Jumlah Tampilan:</strong> ${videoInfo.views || 'Tidak tersedia'}</p>
                <p><strong>Pengarang:</strong> <a href="${videoInfo.author.url}" target="_blank">${videoInfo.author.name}</a></p>
                <p><strong>Diunggah:</strong> ${videoInfo.ago || 'Tidak tersedia'}</p>
            </div>
            `;
        } else if (quality === "mp4") {
            const videoInfo = data2.data[0];
            const videoData = data1.data; // Mengambil data dari ytmp4

            // Memastikan ada data video
            if (!videoData.success) {
                resultDiv.innerHTML = "<p style='color: red;'>Tidak ada video yang tersedia.</p>";
                return;
            }

            resultDiv.innerHTML = `
            <div style="text-align: center;">
                <h2>${videoData.title}</h2>
                <img src="${videoData.image}" alt="${videoData.title}" style="max-width: 100%; height: auto; border-radius: 8px;">
                <p>${downloadText}
                    <a href="${videoData.downloadUrl}" target="_blank" class="download-button">
                        <img src="https://img.icons8.com/material-outlined/24/ffffff/download.png" alt="Download" />
                    </a>
                </p>
                <p><strong>Deskripsi:</strong> ${videoInfo.description || 'Tidak ada deskripsi.'}</p>
                <p><strong>Durasi:</strong> ${videoInfo.duration || 'Tidak tersedia'} detik</p>
                <p><strong>Jumlah Tampilan:</strong> ${videoInfo.views || 'Tidak tersedia'}</p>
                <p><strong>Pengarang:</strong> <a href="${videoInfo.author.url}" target="_blank">${videoInfo.author.name}</a></p>
                <p><strong>Diunggah:</strong> ${videoInfo.ago || 'Tidak tersedia'}</p>
            </div>
            `;
        }
    } catch (error) {
        loadingDiv.style.display = 'none';
        console.error('Error:', error);
        resultDiv.innerHTML = "<p style='color: red;'>Terjadi kesalahan saat menghubungi server YouTube.</p>";
    }
}

// Fungsi untuk menangani download Instagram
function handleInstagramDownload(url, resultDiv, loadingDiv) {
    const apiUrl = `https://api.siputzx.my.id/api/d/igdl?url=${encodeURIComponent(url)}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            loadingDiv.style.display = 'none';
            if (data.status) {
                resultDiv.innerHTML = data.data.map(item => `
                    <div>
                        <h3>Thumbnail:</h3>
                        <img src="${item.thumbnail}" alt="Thumbnail" style="max-width: 100%; height: auto;">
                        <p>DOWNLOAD LINK:: 
                            <a href="${item.url}" target="_blank" class="download-button">
                                <img src="https://img.icons8.com/material-outlined/24/ffffff/download.png" alt="Download" />
                            </a>
                        </p>
                    </div>
                `).join('');
            } else {
                resultDiv.innerHTML = "<p style='color: red;'>Terjadi kesalahan saat memproses permintaan Instagram.</p>";
            }
        })
        .catch(error => {
            loadingDiv.style.display = 'none';
            console.error('Error:', error);
            resultDiv.innerHTML = "<p style='color: red;'>Terjadi kesalahan saat menghubungi server Instagram.</p>";
        });
}

// Fungsi untuk menangani download TikTok
function handleTikTokDownload(url, resultDiv, loadingDiv) {
    const apiUrl = `https://fgsi-tiktok.hf.space/?url=${encodeURIComponent(url)}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            loadingDiv.style.display = 'none';
            if (data.status && data.data) {
                const videoData = data.data;
                const originalUrl = `https://www.tiktok.com/@${videoData.author.unique_id}/video/${videoData.aweme_id}`;
                const videoUrls = videoData.video.play_addr.url_list;
                const musicTitle = videoData.music.title;
                const musicAuthor = videoData.music.author;
                resultDiv.innerHTML = `
                    <h2>Video TikTok</h2>
                    <p>Original URL: <a href="${originalUrl}" target="_blank">${originalUrl}</a></p>
                    <p>Deskripsi: ${videoData.desc}</p>
                    <p>Pengguna: ${videoData.author.nickname} (@${videoData.author.unique_id})</p>
                    <p>Musik: ${musicTitle} oleh ${musicAuthor}</p>
                    <h3>Download Links:</h3>
                    ${videoUrls.map(videoUrl => `
                        <p>DOWNLOAD LINK:
                        <a href="${videoUrl}" target="_blank" class="download-button">
                                <img src="https://img.icons8.com/material-outlined/24/ffffff/download.png" alt="Download" />
                            </a>
                        </p>
                    `).join('')}
                `;
            } else {
                resultDiv.innerHTML = "<p style='color: red;'>Terjadi kesalahan saat memproses permintaan TikTok.</p>";
            }
        })
        .catch(error => {
            loadingDiv.style.display = 'none';
            console.error('Error:', error);
            resultDiv.innerHTML = "<p style='color: red;'>Terjadi kesalahan saat menghubungi server TikTok.</p>";
        });
}

// Fungsi untuk menangani download Spotify
function handleSpotifyDownload(url, resultDiv, loadingDiv) {
    const apiUrl = `https://fgsi-spotify.hf.space/?url=${encodeURIComponent(url)}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            loadingDiv.style.display = 'none';
            if (data.status && data.data) {
                const trackData = data.data.metadata;
                const downloads = data.data.downloads;
                resultDiv.innerHTML = `
                    <h2>Lagu Spotify</h2>
                    <p>Judul: ${trackData.title}</p>
                    <p>Artis: ${trackData.artists}</p>
                    <p>Album: ${trackData.album}</p>
                    <p>Durasi: ${Math.floor(trackData.duration / 60000)}:${((trackData.duration % 60000) / 1000).toFixed(0).padStart(2, '0')}</p>
                    <p>Rilis: ${trackData.release_date}</p>
                    <p>Link: <a href="${trackData.link}" target="_blank">${trackData.link}</a></p>
                    <img src="${trackData.cover_url}" alt="Cover" style="width: 200px; height: 200px;"/>
                    <h3>Download Links:</h3>
                    ${downloads.map(download => `
                        <p>DOWNLOAD LINK:
                            <a href="${download.url}" target="_blank" class="download-button">
                                <img src="https://img.icons8.com/material-outlined/24/ffffff/download.png" alt="Download" />
                            </a>
                        </p>
                    `).join('')}
                `;
            } else {
                resultDiv.innerHTML = "<p style='color: red;'>Terjadi kesalahan saat memproses permintaan Spotify.</p>";
            }
        })
        .catch(error => {
            loadingDiv.style.display = 'none';
            console.error('Error:', error);
            resultDiv.innerHTML = "<p style='color: red;'>Terjadi kesalahan saat menghubungi server Spotify.</p>";
        });
}

function extractVideoId(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null
}