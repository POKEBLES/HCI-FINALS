const pw = document.getElementById("pw");
const eye = document.querySelector(".eye");
const toast = document.getElementById("toast");
const loginBtn = document.getElementById("loginBtn");
const forgotPassword = document.getElementById("forgotPassword");

let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("toast--show");

  if (toastTimer) {
    clearTimeout(toastTimer);
  }

  toastTimer = setTimeout(() => {
    toast.classList.remove("toast--show");
  }, 1800);
}

eye.addEventListener("click", () => {
  pw.type = pw.type === "password" ? "text" : "password";
});

loginBtn.addEventListener("click", () => {
  showToast("Logged in successfully!");
});

forgotPassword.addEventListener("click", (event) => {
  event.preventDefault();
  showToast("Reset link sent (simulated)");
});
