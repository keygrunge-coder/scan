// Sama seperti script.js, tapi pastikan action-nya berbeda
async function prosesScan(resi) {
    // ... logic setup ...
    await fetch(APP_URL, {
        method: "POST",
        body: JSON.stringify({ action: "uploadManual", resi: resi, source: "retur" })
    });
    // ... logic update UI ...
}
