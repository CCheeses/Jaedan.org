// Function to get the value of a specific cookie by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Check if the accessGranted cookie is set
const accessGranted = getCookie("accessGranted");

// If the cookie is not set, redirect to the login page
if (!accessGranted) {
    window.location.href = "/surprise/";
} else {
    document.getElementById("body").style = "display: block";
}