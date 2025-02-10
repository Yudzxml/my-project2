document.getElementById('quality').addEventListener('change', function() {
    // Tidak perlu menampilkan tombol resolusi lagi
    // Jika Anda ingin menambahkan logika di sini, silakan lakukan.
});

document.getElementById('downloadBtn').addEventListener('click', function() {
    const url = document.getElementById('url').value;
    const quality = document.getElementById('quality').value;
    const resultDiv = document.getElementById('result');
    const loadingDiv = document.getElementById('loading');

    // Validasi URL
    if (url === "") {
        resultDiv.innerHTML = "<p style='color: red;'>Silakan masukkan URL yang valid.</p>";
        return;
    }

    // Tampilkan animasi loading
    loadingDiv.style.display = 'flex'; // Tampilkan spinner
    // Deteksi jenis URL
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
        const downloadText = quality === "mp3" 
            ? `DOWNLOAD MP3: ` 
            : `DOWNLOAD MP4: `;
        const apiUrl = quality === "mp3" 
            ? `https://ditzdevs-yt2apps.hf.space/api/ytmp3?url=${encodeURIComponent(url)}`
            : `https://ditzdevs-yt2apps.hf.space/api/ytmp4?url=${encodeURIComponent(url)}&reso=360p`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                loadingDiv.style.display = 'none'; // Sembunyikan animasi loading
                if (data.status) {
                    const title = data.download.title;
                    const downloadUrl = data.download.downloadUrl;
                    const expiresIn = data.download.expiresIn;
                    const quality = data.download.quality; // Misalkan ini adalah variabel yang menunjukkan format (mp3/mp4)
                    const thumbnail = data.result.thumbnail[0].url; // Ambil thumbnail
                    const videoDetails = data.result; // Ambil detail video

                    // Menampilkan informasi
                    resultDiv.innerHTML = `
                        <div style="text-align: center;">
                            <h2>${title}</h2>
                            <img src="${thumbnail}" alt="${title}" style="max-width: 100%; height: auto; border-radius: 8px;">
                            <p>${downloadText}
                                <a href="${downloadUrl}" target="_blank" class="download-button">
                                    <img src="https://img.icons8.com/material-outlined/24/ffffff/download.png" alt="Download" />
                                </a>
                            </p>
                            <p>Link akan kedaluwarsa dalam: ${expiresIn}</p>
                            ${videoDetails ? `
                                <p><strong>Deskripsi:</strong> ${videoDetails.short_description}</p>
                                <p><strong>Durasi:</strong> ${videoDetails.duration} detik</p>
                                <p><strong>Jumlah Tampilan:</strong> ${videoDetails.view_count}</p>
                                <p><strong>Pengarang:</strong> ${videoDetails.author}</p>
                            ` : ''}
                        </div>
                    `;
                } else {
                    resultDiv.innerHTML = "<p style='color: red;'>Terjadi kesalahan saat memproses permintaan.</p>";
                }
            })
            .catch(error => {
                loadingDiv.style.display = 'none'; // Sembunyikan animasi loading
                console.error('Error:', error);
                resultDiv.innerHTML = "<p style='color: red;'>Terjadi kesalahan saat menghubungi server YouTube.</p>";
            });
    } else if (url.includes("instagram.com")) {
        // Mengunduh konten Instagram
        const apiUrl = `https://api.siputzx.my.id/api/d/igdl?url=${encodeURIComponent(url)}`;
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                loadingDiv.style.display = 'none'; // Sembunyikan animasi loading
                if (data.status) {
                    // Menampilkan informasi gambar
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
                loadingDiv.style.display = 'none'; // Sembunyikan animasi loading
                console.error('Error:', error);
                resultDiv.innerHTML = "<p style='color: red;'>Terjadi kesalahan saat menghubungi server Instagram.</p>";
            });
    } else if (url.includes("tiktok.com")) {
        // Mengunduh konten TikTok
        const apiUrl = `https://fgsi-tiktok.hf.space/?url=${encodeURIComponent(url)}`;
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                loadingDiv.style.display = 'none'; // Sembunyikan animasi loading
                if (data.status && data.data) {
                    const videoData = data.data;
                    const originalUrl = `https://www.tiktok.com/@${videoData.author.unique_id}/video/${videoData.aweme_id}`;
                    const videoUrls = videoData.video.play_addr.url_list; // URL video untuk diunduh
                    const musicTitle = videoData.music.title;
                    const musicAuthor = videoData.music.author;

                    // Menampilkan informasi video TikTok
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
                loadingDiv.style.display = 'none'; // Sembunyikan animasi loading
                console.error('Error:', error);
                resultDiv.innerHTML = "<p style='color: red;'>Terjadi kesalahan saat menghubungi server TikTok.</p>";
            });
    } else if (url.includes("spotify.com")) {
        // Mengunduh konten Spotify
        const apiUrl = `https://fgsi-spotify.hf.space/?url=${encodeURIComponent(url)}`;
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                loadingDiv.style.display = 'none'; // Sembunyikan animasi loading
                if (data.status && data.data) {
                    const trackData = data.data.metadata;
                    const downloads = data.data.downloads;

                    // Menampilkan informasi lagu Spotify
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
                loadingDiv.style.display = 'none'; // Sembunyikan animasi loading
                console.error('Error:', error);
                resultDiv.innerHTML = "<p style='color: red;'>Terjadi kesalahan saat menghubungi server Spotify.</p>";
            });
    } else {
        loadingDiv.style.display = 'none'; // Sembunyikan animasi loading
        resultDiv.innerHTML = "<p style='color: red;'>URL tidak dikenali. Silakan masukkan URL YouTube, Instagram, atau TikTok.</p>";
    }
});