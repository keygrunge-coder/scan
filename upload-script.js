async function uploadKeSheet(data) {
    await fetch(APP_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({ action: "uploadManual", data: data })
    });
    alert("Berhasil!");
}
