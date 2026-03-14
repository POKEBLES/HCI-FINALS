const toast = document.getElementById("toast");
const profileDisplay = document.getElementById("profileDisplay");
const profileEditForm = document.getElementById("profileEditForm");

const editProfileBtn = document.getElementById("editProfileBtn");
const updateProfileBtn = document.getElementById("updateProfileBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

const profileNameText = document.getElementById("profileNameText");
const profileEmailText = document.getElementById("profileEmailText");
const displayName = document.getElementById("displayName");
const displayDob = document.getElementById("displayDob");
const displayGender = document.getElementById("displayGender");
const displayDescription = document.getElementById("displayDescription");

const editName = document.getElementById("editName");
const editEmail = document.getElementById("editEmail");
const editMonth = document.getElementById("editMonth");
const editDay = document.getElementById("editDay");
const editYear = document.getElementById("editYear");
const editGender = document.getElementById("editGender");
const editDescription = document.getElementById("editDescription");

const changePhotoBtn = document.getElementById("changePhotoBtn");
const addContactBtn = document.getElementById("addContactBtn");
const importContactsBtn = document.getElementById("importContactsBtn");
const addBirthdayBtn = document.getElementById("addBirthdayBtn");
const addEventBtn = document.getElementById("addEventBtn");
const continueBtn = document.getElementById("continueBtn");
const logoutBtn = document.getElementById("logoutBtn");
const faqButtons = document.querySelectorAll(".faq-item");
const feedbackMessage = document.getElementById("feedbackMessage");
const sendFeedbackBtn = document.getElementById("sendFeedbackBtn");

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

function setEditMode(isEditing) {
  profileDisplay.classList.toggle("is-hidden", isEditing);
  profileEditForm.classList.toggle("is-open", isEditing);
}

editProfileBtn.addEventListener("click", () => {
  setEditMode(true);
});

updateProfileBtn.addEventListener("click", () => {
  setEditMode(true);
});

cancelEditBtn.addEventListener("click", () => {
  setEditMode(false);
});

profileEditForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const updatedName = editName.value.trim() || "Sarah Johnson";
  const updatedEmail = editEmail.value.trim() || "sarah.johnson@email.com";
  const updatedDob = `${editMonth.value} ${editDay.value}, ${editYear.value}`;
  const updatedGender = editGender.value;
  const updatedDescription = editDescription.value.trim() || "No description yet.";

  profileNameText.textContent = updatedName;
  profileEmailText.textContent = updatedEmail;
  displayName.textContent = updatedName;
  displayDob.textContent = updatedDob;
  displayGender.textContent = updatedGender;
  displayDescription.textContent = updatedDescription;

  setEditMode(false);
  showToast("Profile updated successfully!");
});

changePhotoBtn.addEventListener("click", () => {
  showToast("Change photo (simulated)");
});

addContactBtn.addEventListener("click", () => {
  showToast("Add contact (simulated)");
});

importContactsBtn.addEventListener("click", () => {
  showToast("Import started (simulated)");
});

addBirthdayBtn.addEventListener("click", () => {
  showToast("Reminder added (simulated)");
});

addEventBtn.addEventListener("click", () => {
  showToast("Reminder added (simulated)");
});

continueBtn.addEventListener("click", () => {
  showToast("Continue profile setup (simulated)");
});

logoutBtn.addEventListener("click", (event) => {
  event.preventDefault();
  showToast("Logged out (simulated)");
});

faqButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showToast("Opening help article (simulated)");
  });
});

sendFeedbackBtn.addEventListener("click", () => {
  feedbackMessage.value = "";
  showToast("Feedback sent (simulated)");
});

setEditMode(false);
