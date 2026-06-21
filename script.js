let html5QrCode = null;
let isProcessing = false;

window.onload = function () {
    startCamera();
};

function startCamera() {

    if (html5QrCode) return;

    if (typeof Html5Qrcode === "undefined") {
        console.error("Html5Qrcode belum dimuat");
        document.getElementById("status-message").innerText =
            "Library scanner belum dimuat";
        return;
    }

    html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(
        { facingMode: "environment" },
        {
            fps: 10,
            qrbox: 200
        },
        (decodedText) => {

            if (isProcessing) return;

            isProcessing = true;

            html5QrCode.pause(true);

            saveResi(decodedText.trim());

        }
    ).catch(err => {

        console.error(err);

        document.getElementById("status-message").innerText =
            "Kamera gagal diakses";
    });
}

async function saveResi(resi) {

    document.getElementById("status-message").innerText =
        "Mengirim: " + resi;

    try {

        const response = await fetch(APP_URL, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "scanPengiriman",
                resi: resi.toUpperCase()
            })
        });

        const result = await response.json();

        console.log(result);

        document.getElementById("status-message").innerText =
            "Berhasil: " + resi;

    } catch (err) {

        console.error(err);

        document.getElementById("status-message").innerText =
            "Gagal koneksi";

    } finally {

        setTimeout(() => {

            isProcessing = false;

            if (html5QrCode) {
                html5QrCode.resume();
            }

        }, 1500);
    }
}
