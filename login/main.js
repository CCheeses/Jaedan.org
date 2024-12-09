document.getElementById("passwordInput").addEventListener("keydown", function(event) {
  if (event.key === "Enter")
  {
    checkPassword();
  }
})

document.getElementById("submitbutton").onclick = checkPassword;

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

function checkPassword() {
  var pwd = sha256(document.getElementById("passwordInput").value.trim());
  if (pwd === "c3e6d4b792ed9902b00c75b7dc75246f5b1f78e03adef3c24a9dcfcc39ea28f0") {
    document.cookie = "accessGranted=true; max-age=3600; path=/";
    window.location.href = "/surprise/";
  } else {
    document.getElementById("result").innerHTML = "Incorrect password!";
    console.log(pwd + " " + document.getElementById("passwordInput").value.trim())
  }
}