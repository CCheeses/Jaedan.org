const app = document.getElementById("app");
const loader = document.getElementById("loader");
function showLoading() { loader.classList.remove("hidden"); }
function hideLoading() { loader.classList.add("hidden"); }

let deviceId = localStorage.getItem("device_id");
if (!deviceId) { deviceId = crypto.randomUUID(); localStorage.setItem("device_id", deviceId); }
let name = localStorage.getItem("user_name");

if (!name) {
    app.innerHTML = `
    <h2>Register your device w/ your name.</h2>
    <input id="nameInput" placeholder="Your name" />
    <br><button onclick="saveName()">Continue</button>
    `;
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
    const res = await fetch("https://script.google.com/macros/s/AKfycbzMtUP1uJr2ISH22hd3RZJE-C9pusbMuxnqnl66KYFYDbF_jq7skqPSscYssOdJdxmC/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId, name })
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