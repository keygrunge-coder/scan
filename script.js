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
            "Scanner library tidak ditemukan";
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

    const resiUpper = resi.toUpperCase();

    document.getElementById("status-message").innerText =
        "Mengirim: " + resiUpper;

    try {

        const response = await fetch(APP_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "scanPengiriman",
                resi: resiUpper
            })
        });

        const result = await response.json();

        console.log("RESULT:", result);

        if (result.status === "success") {
            document.getElementById("status-message").innerText =
                "BERHASIL: " + resiUpper;
        } 
        else if (result.status === "duplicate_updated") {
            document.getElementById("status-message").innerText =
                "DUPLIKAT: " + resiUpper;
        } 
        else if (result.status === "already_marked_as_duplicate") {
            document.getElementById("status-message").innerText =
                "SUDAH DOUBLE: " + resiUpper;
        } 
        else {
            document.getElementById("status-message").innerText =
                "ERROR STATUS: " + result.status;
        }

    } catch (err) {

        console.error(err);

        document.getElementById("status-message").innerText =
            "Gagal koneksi ke server";

    } finally {

        setTimeout(() => {

            isProcessing = false;

            if (html5QrCode) {
                html5QrCode.resume();
            }

        }, 1500);
    }
}
