document.addEventListener('DOMContentLoaded', function() {
    // Mengambil elemen notifikasi dan tombol penutup
    document.getElementById('welcome-notification').style.display = 'flex';
    
    document.getElementById('close-notification').addEventListener('click', function() {
        document.getElementById('welcome-notification').style.display = 'none';
    });
});

// Menangani pengiriman komentar
document.getElementById('submitComment').addEventListener('click', function() {
    var comment = document.getElementById('comment').value.trim();
    var feedbackMessage = document.getElementById('feedbackMessage');

    if (comment === "") {
        feedbackMessage.textContent = "Silakan tambahkan komentar Anda.";
        feedbackMessage.style.color = "#dc3545";
        feedbackMessage.style.display = "block";
        setTimeout(function() {
            feedbackMessage.style.display = "none";
        }, 3000);
    } else {
        var commentsList = document.getElementById('commentsList');
        var newCommentContainer = document.createElement('div');
        newCommentContainer.className = 'comment-container';

        var profilePic = document.createElement('img');
        profilePic.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60';
        profilePic.alt = 'Profile Picture';

        var commentTextContainer = document.createElement('div');
        var commentName = document.createElement('p');
        commentName.innerHTML = '<strong>Anonymous</strong>';
        var commentText = document.createElement('p');
        commentText.textContent = comment;

        commentTextContainer.appendChild(commentName);
        commentTextContainer.appendChild(commentText);
        newCommentContainer.appendChild(profilePic);
        newCommentContainer.appendChild(commentTextContainer);
        commentsList.appendChild(newCommentContainer);

        // Simpan komentar ke Local Storage
        saveComment(comment);

        document.getElementById('comment').value = '';
        feedbackMessage.textContent = "Terima kasih telah mengirimkan komentar Anda!";
        feedbackMessage.style.color = "#28a745";
        feedbackMessage.style.display = "block";

        setTimeout(function() {
            feedbackMessage.style.display = "none";
            document.getElementById('comment').style.display = "none";
            document.getElementById('submitComment').style.display = "none";
        }, 3000);
    }
});

// Fungsi untuk menyimpan komentar ke Local Storage
function saveComment(comment) {
    let comments = JSON.parse(localStorage.getItem('comments')) || [];
    comments.push(comment);
    localStorage.setItem('comments', JSON.stringify(comments));
}

// Fungsi untuk memuat komentar dari Local Storage saat halaman dimuat
function loadComments() {
    let comments = JSON.parse(localStorage.getItem('comments')) || [];
    comments.forEach(function(comment) {
        var commentsList = document.getElementById('commentsList');
        var newCommentContainer = document.createElement('div');
        newCommentContainer.className = 'comment-container';

        var profilePic = document.createElement('img');
        profilePic.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60';
        profilePic.alt = 'Profile Picture';

        var commentTextContainer = document.createElement('div');
        var commentName = document.createElement('p');
        commentName.innerHTML = '<strong>Anonymous</strong>';
        var commentText = document.createElement('p');
        commentText.textContent = comment;

        commentTextContainer.appendChild(commentName);
        commentTextContainer.appendChild(commentText);
        newCommentContainer.appendChild(profilePic);
        newCommentContainer.appendChild(commentTextContainer);
        commentsList.appendChild(newCommentContainer);
    });
}

// Memuat komentar saat halaman dimuat
window.onload = loadComments;

document.getElementById('downloadBtn').addEventListener('click', function() {
  window.onload = loadComments;
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
   window.onload = loadComments; 
    if (!url) {
        resultDiv.innerHTML = "<p style='color: red;'>URL tidak valid. Silakan masukkan URL YouTube yang benar.</p>";
        return;
    }
    
    const formatAudio = ['mp3', 'm4a', 'webm', 'aac', 'flac', 'opus', 'ogg', 'wav'];
    const formatVideo = ['360', '480', '720', '1080', '1440', '4k'];

    const ddownr = {
        download: async (url, format) => {
            if (!formatAudio.includes(format) && !formatVideo.includes(format)) {
                throw new Error('Format tidak didukung, silakan cek kembali daftar format yang tersedia.');
            }

            const config = {
                method: 'GET',
                url: `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            };

            try {
                const response = await axios.request(config);
                if (response.data && response.data.success) {
                    const { id, title, info } = response.data;
                    const { image } = info;
                    const downloadUrl = await ddownr.cekProgress(id);

                    return {
                        id: id,
                        image: image,
                        title: title,
                        downloadUrl: downloadUrl
                    };
                } else {
                    throw new Error('Gagal mengambil detail video.');
                }
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
        },
        cekProgress: async (id) => {
            const config = {
                method: 'GET',
                url: `https://p.oceansaver.in/ajax/progress.php?id=${id}`,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            };

            try {
                while (true) {
                    const response = await axios.request(config);
                    if (response.data && response.data.success && response.data.progress === 1000) {
                        return response.data.download_url;
                    }
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
        }
    };

    const downloadText = quality === "mp3" ? `DOWNLOAD MP3: ` : `DOWNLOAD MP4: `;
    let videoInfo, downloadUrl;

    try {
        // Fetch video details using the new API
        const apiUrl = `https://restapi.apibotwa.biz.id/api/search-yts?message=${encodeURIComponent(url)}`;
        const response2 = await fetch(apiUrl);
        const data2 = await response2.json();

        if (data2.status !== 200 || !data2.data.response.video.length) {
            resultDiv.innerHTML = "<p style='color: red;'>Tidak ada video yang ditemukan.</p>";
            return;
        }

        videoInfo = data2.data.response.video[0]; // Get the first video from the response

        if (quality === "mp3") {
            // Fetch MP3 download link using the new API
            const mp3ApiUrl = `https://ditzdevs-yt2apps.hf.space/api/ytmp3?url=${encodeURIComponent(url)}`;
            const mp3Response = await fetch(mp3ApiUrl);
            const mp3Data = await mp3Response.json();

            if (!mp3Data.status) {
                resultDiv.innerHTML = "<p style='color: red;'>Tidak ada audio yang tersedia.</p>";
                return;
            }

            const downloadLink = mp3Data.download.downloadUrl;

            resultDiv.innerHTML = `
                <div style="text-align: center;">
                    <h2>${mp3Data.download.title}</h2>
                    <img src="${videoInfo.thumbnail}" alt="${videoInfo.title}" style="max-width: 100%; height: auto; border-radius: 8px;">
                    <p>${downloadText}
                        <a href="${downloadLink}" target="_blank" class="download-button">
                            <img src="https://img.icons8.com/material-outlined/24/ffffff/download.png" alt="Download" />
                        </a>
                    </p>
                    <p><strong>Deskripsi:</strong> ${videoInfo.description || 'Tidak ada deskripsi.'}</p>
                    <p><strong>Durasi:</strong> ${videoInfo.durationH || 'Tidak tersedia'}</p>
                    <p><strong>Jumlah Tampilan:</strong> ${videoInfo.viewH || 'Tidak tersedia'}</p>
                    <p><strong>Pengarang:</strong> <a href="${videoInfo.url}" target="_blank">${videoInfo.authorName}</a></p>
                    <p><strong>Diunggah:</strong> ${videoInfo.publishedTime || 'Tidak tersedia'}</p>
                </div>
            `;
        } else if (quality === "mp4") {
            const videoData = await ddownr.download(url, "720");
            downloadUrl = videoData.downloadUrl;

            resultDiv.innerHTML = `
                <div style="text-align: center;">
                    <h2>${videoData.title}</h2>
                    <img src="${videoData.image}" alt="${videoData.title}" style="max-width: 100%; height: auto; border-radius: 8px;">
                    <p>${downloadText}
                        <a href="${downloadUrl}" target="_blank" class="download-button">
                            <img src="https://img.icons8.com/material-outlined/24/ffffff/download.png" alt="Download" />
                        </a>
                    </p>
                    <p><strong>Deskripsi:</strong> ${videoInfo.description || 'Tidak ada deskripsi.'}</p>
                    <p><strong>Durasi:</strong> ${videoInfo.durationH || 'Tidak tersedia'}</p>
                    <p><strong>Jumlah Tampilan:</strong> ${videoInfo.viewH || 'Tidak tersedia'}</p>
                    <p><strong>Pengarang:</strong> <a href="${videoInfo.url}" target="_blank">${videoInfo.authorName}</a></p>
                    <p><strong>Diunggah:</strong> ${videoInfo.publishedTime || 'Tidak tersedia'}</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error:', error);
        resultDiv.innerHTML = "<p style='color: red;'>Terjadi kesalahan saat menghubungi server YouTube.</p>";
    } finally {
        loadingDiv.style.display = 'none';
    }
}

// Fungsi untuk menangani download Instagram
function handleInstagramDownload(url, resultDiv, loadingDiv) {
  window.onload = loadComments;
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
  window.onload = loadComments;
    const videoApiUrl = `https://fgsi-tiktok.hf.space/?url=${encodeURIComponent(url)}`;
    fetch(videoApiUrl)
        .then(response => response.json())
        .then(data => {
            loadingDiv.style.display = 'none';
            if (data.status && data.data) {
                // Jika berhasil mendapatkan video
                handleTikTokVideoResponse(data, resultDiv);
            } else {
                // Jika gagal, coba ambil gambar
                handleTikTokImageDownload(url, resultDiv, loadingDiv);
            }
        })
        .catch(error => {
            loadingDiv.style.display = 'none';
            console.error('Error:', error);
            resultDiv.innerHTML = "<p style='color: red;'>Terjadi kesalahan saat menghubungi server TikTok.</p>";
        });
}

function handleTikTokVideoResponse(data, resultDiv) {
  window.onload = loadComments;
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
}

function handleTikTokImageDownload(url, resultDiv, loadingDiv) {
  window.onload = loadComments;
    const imageApiUrl = `https://api.agatz.xyz/api/tiktok?url=${encodeURIComponent(url)}`;
    fetch(imageApiUrl)
        .then(response => response.json())
        .then(data => {
            loadingDiv.style.display = 'none';
            if (data.status === 200 && data.data.status) {
                const imageData = data.data;
                const imageUrls = imageData.data.map(image => image.url); // Mengambil URL gambar

                resultDiv.innerHTML = `
                    <h2>${imageData.title}</h2>
                    <h3>Download Images:</h3>
                `;

                // Jika ada gambar, buat slideshow
                if (imageUrls.length > 0) {
                    resultDiv.innerHTML += `
                        <div class="slideshow-container">
                            ${imageUrls.map((url, index) => `
                                <div class="mySlides fade">
                                    <img src="${url}" style="width:100%">
                                    <div class="text">Image ${index + 1}</div>
                                    <a href="${url}" target="_blank" class="button-download">
                                        <button>Download Image ${index + 1}</button>
                                    </a>
                                </div>
                            `).join('')}
                            <a class="prev" onclick="plusSlides(-1)">&#10094;</a>
                            <a class="next" onclick="plusSlides(1)">&#10095;</a>
                        </div>
                        <br>
                        <div style="text-align:center">
                            ${imageUrls.map((_, index) => `
                                <span class="dot" onclick="currentSlide(${index + 1})"></span>
                            `).join('')}
                        </div>
                    `;
                    showSlides(1); // Tampilkan slide pertama
                } else {
                    resultDiv.innerHTML += "<p style='color: red;'>Tidak ada gambar yang ditemukan.</p>";
                }
            } else {
                resultDiv.innerHTML = "<p style='color: red;'>Terjadi kesalahan saat memproses permintaan gambar.</p>";
            }
        })
        .catch(error => {
            loadingDiv.style.display = 'none';
            console.error('Error:', error);
            resultDiv.innerHTML = "<p style='color: red;'>Terjadi kesalahan saat menghubungi server untuk gambar.</p>";
        });
}

let slideIndex = 1;

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    const slides = document.getElementsByClassName("mySlides");
    const dots = document.getElementsByClassName("dot");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none"; // Sembunyikan semua slide
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", ""); // Hapus kelas aktif dari semua dot
    }
    slides[slideIndex - 1].style.display = "block"; // Tampilkan slide saat ini
    dots[slideIndex - 1].className += " active"; // Tambahkan kelas aktif ke dot saat ini
}

// Fungsi untuk menangani download Spotify
function handleSpotifyDownload(url, resultDiv, loadingDiv) {
  window.onload = loadComments;
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
    // Fungsi untuk menghubungi pemilik
    function contactOwner() {
        window.open('https://yudzxml.x-server.web.id/', '_blank');
    }

    // Memutar audio latar belakang
    var audio = document.getElementById('sound');

    document.addEventListener('click', function() {
        playAudio();
    });

    document.addEventListener('mousemove', function() {
        playAudio();
    });

    function playAudio() {
        audio.play().catch(function(error) {
            console.log("Audio tidak dapat diputar: ", error);
        });
    }

    // Menangani pengiriman komentar
    document.getElementById('submitComment').addEventListener('click', function() {
        var comment = document.getElementById('comment').value;
        if (comment) {
            var commentsList = document.getElementById('commentsList');
            var newComment = document.createElement('p');
            newComment.textContent = comment;
            commentsList.appendChild(newComment);
            document.getElementById('comment').value = ''; // Mengosongkan textarea setelah komentar dikirim
        } else {
            alert('Silakan masukkan komentar Anda.');
        }
    });
window.onload = loadComments;    