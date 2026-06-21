let html5QrCode = null;
let isProcessing = false;
let localData = JSON.parse(localStorage.getItem('harian_offline_cache')) || [];
let scanHistory = JSON.parse(localStorage.getItem("scanHistory") || "[]");

window.onload = function() { 
    renderHistory();
    document.getElementById('local-slot').innerText = localData.length;
    muatDataDashboardAwal(); 
    startCamera(); 
};

function startCamera() {
    if(html5QrCode) return;
    html5QrCode = new Html5Qrcode("reader");
    html5QrCode.start({ facingMode: "environment" }, { fps: 10, qrbox: 200 }, (decodedText) => {
        if(!isProcessing) {
            isProcessing = true;
            html5QrCode.pause(true);
            saveResi(decodedText.trim());
        }
    }).catch(err => setLampuBca('merah', 'Kamera Gagal'));
}

async function saveResi(resi){
    let resiUpper = resi.toUpperCase();
    
    // Tambah ke local storage dulu
    if (!localData.includes(resi)) {
        localData.push(resi);
        localStorage.setItem('harian_offline_cache', JSON.stringify(localData));
        document.getElementById('local-slot').innerText = localData.length;
    }

    try {
        const r = await fetch(APP_URL, {
            method: "POST",
            mode: "cors",
            body: JSON.stringify({ action: "scanPengiriman", resi: resiUpper })
        });
        const json = await r.json();
        // Lanjutkan logika UI (success/duplicate) di sini...
    } catch(err) {
        setLampuBca('merah', 'Gagal Koneksi');
    } finally {
        setTimeout(() => { isProcessing = false; html5QrCode.resume(); }, 1500);
    }
}
