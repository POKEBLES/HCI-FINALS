const pw = document.getElementById("pw");
const eye = document.querySelector(".eye");
const toast = document.getElementById("toast");
const registerBtn = document.querySelector(".btn-primary");
const profileShortcutTrigger = document.getElementById("profileShortcutTrigger");
const profileShortcutBtn = document.getElementById("profileShortcutBtn");

if (eye && pw) {
  eye.addEventListener("click", () => {
    pw.type = pw.type === "password" ? "text" : "password";
  });
}

if (registerBtn && toast) {
  registerBtn.addEventListener("click", () => {
    // UI-only feedback
    toast.classList.add("toast--show");
    setTimeout(() => toast.classList.remove("toast--show"), 1800);
  });
}

if (profileShortcutTrigger && profileShortcutBtn) {
  profileShortcutTrigger.addEventListener("click", () => {
    const isHidden = profileShortcutBtn.hasAttribute("hidden");

    if (isHidden) {
      profileShortcutBtn.removeAttribute("hidden");
    } else {
      profileShortcutBtn.setAttribute("hidden", "");
    }

    profileShortcutTrigger.setAttribute("aria-expanded", String(isHidden));
  });

  profileShortcutBtn.addEventListener("click", () => {
    window.location.href = "profile.html";
  });
}