const app = document.getElementById("app");
const loader = document.getElementById("loader");
function showLoading() { loader.classList.remove("hidden"); }
function hideLoading() { loader.classList.add("hidden"); }

let name = localStorage.getItem("user_name");

if (!name) {
    app.innerHTML = `
    <h2>Register your device w/ your name.</h2>
    <input id="nameInput" placeholder="Your name" />
    <br><button id="saveBtn">Continue</button>
    `;
    document.getElementById("saveBtn").addEventListener("click", saveName);
} else {
    toggle();
}

function saveName() {
    const input = document.getElementById("nameInput");
    if (!input.value.trim()) return;
    name = input.value.trim();
    localStorage.setItem("user_name", name);
    toggle();
}

async function toggle() {
    showLoading();
    try {
        const url = `https://script.google.com/macros/s/AKfycbxNgto_LczhGvpkIpkotKelcfLSmfltUQf0qAUnMtuVDK1HHnD2nByQRY0iqF8WbyqyMQ/exec?name=${encodeURIComponent(name)}`;
        const res = await fetch(url, {
            method: "GET",  // Changed to GET
            redirect: "follow"
        });
        const data = await res.json();
        showResult(data.status);
    } catch (err) {
        app.innerHTML = `<div class="status">Error: ${err.message}</div>`;
    } finally {
        hideLoading();
    }
}

function showResult(status) {
    app.innerHTML = `
    <div class="status">${status === "IN" ? "Signed IN" : "Signed OUT"}</div>
    <div class="message">You can close the tab now.</div>
    `;
}