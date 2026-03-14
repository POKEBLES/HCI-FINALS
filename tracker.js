const trackerItems = [
  {
    id: "mom-birthday",
    recipient: "Mom",
    recipientEmail: "mom@example.com",
    occasion: "Birthday",
    deliveryType: "Scheduled",
    scheduleLabel: "May 18, 2026 · 9:00 AM",
    status: "scheduled",
    theme: "birthday",
    previewTag: "Birthday",
    previewTitle: "Wish you joy",
    previewNote: "A sweet birthday card is ready.",
    message: "Happy Birthday, Mom! Wishing you a day full of love, laughter, and your favorite moments.",
    sortTime: "2026-05-18T09:00:00"
  },
  {
    id: "alex-thankyou",
    recipient: "Alex",
    recipientEmail: "alex@email.com",
    occasion: "Thank You",
    deliveryType: "Send now",
    scheduleLabel: "Apr 22, 2026 · 3:18 PM",
    status: "viewed",
    theme: "thanks",
    previewTag: "Thank You",
    previewTitle: "You made a difference",
    previewNote: "Sent and opened today.",
    message: "Thank you for the support this week. I truly appreciated your help and kindness.",
    sortTime: "2026-04-22T15:18:00"
  },
  {
    id: "team-anniversary",
    recipient: "Team",
    recipientEmail: "team@company.com",
    occasion: "Work Anniversary",
    deliveryType: "Scheduled",
    scheduleLabel: "Apr 30, 2026 · 8:30 AM",
    status: "sent",
    theme: "milestone",
    previewTag: "Congrats",
    previewTitle: "Cheers to milestones",
    previewNote: "Delivered on schedule.",
    message: "Celebrating another great milestone together. Thank you for the work, energy, and heart you bring.",
    sortTime: "2026-04-30T08:30:00"
  },
  {
    id: "grandma-getwell",
    recipient: "Grandma",
    recipientEmail: "grandma@email.com",
    occasion: "Get Well Soon",
    deliveryType: "Send now",
    scheduleLabel: "Prepared today · 11:30 AM",
    status: "draft",
    theme: "care",
    previewTag: "Care",
    previewTitle: "Warm wishes",
    previewNote: "Ready to send whenever you are.",
    message: "Sending love and healing wishes your way. Hope each day brings more comfort and strength.",
    sortTime: "2026-05-14T11:30:00"
  },
  {
    id: "nina-congrats",
    recipient: "Nina",
    recipientEmail: "nina@email.com",
    occasion: "Congratulations",
    deliveryType: "Scheduled",
    scheduleLabel: "May 22, 2026 · 7:00 AM",
    status: "scheduled",
    theme: "congrats",
    previewTag: "Congrats",
    previewTitle: "You did it!",
    previewNote: "Queued for early morning delivery.",
    message: "Congratulations on your big achievement! So proud of you and excited for what comes next.",
    sortTime: "2026-05-22T07:00:00"
  },
  {
    id: "lea-birthday",
    recipient: "Cousin Lea",
    recipientEmail: "lea@email.com",
    occasion: "Birthday",
    deliveryType: "Send now",
    scheduleLabel: "Apr 12, 2026 · 6:42 PM",
    status: "viewed",
    theme: "birthday",
    previewTag: "Birthday",
    previewTitle: "Celebrate today",
    previewNote: "Opened shortly after delivery.",
    message: "Happy Birthday! Hope your day is packed with joy, cake, and the people who matter most.",
    sortTime: "2026-04-12T18:42:00"
  }
];

const statusConfig = {
  draft: {
    label: "Draft",
    description: "Prepared but not sent yet.",
    stage: 1,
    icon: '<svg class="tracker-status__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18l4-4 3 3 5-6"></path></svg>'
  },
  scheduled: {
    label: "Scheduled",
    description: "Scheduled for automatic delivery.",
    stage: 2,
    icon: '<svg class="tracker-status__icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"></circle><path d="M12 8v4l2.5 1.5"></path></svg>'
  },
  sent: {
    label: "Sent",
    description: "Delivered to the recipient inbox.",
    stage: 3,
    icon: '<svg class="tracker-status__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5 11-11"></path></svg>'
  },
  viewed: {
    label: "Viewed",
    description: "Opened by the recipient.",
    stage: 4,
    icon: '<svg class="tracker-status__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"></path><circle cx="12" cy="12" r="2.5"></circle></svg>'
  }
};

const trackerList = document.getElementById("trackerList");
const trackerEmptyState = document.getElementById("trackerEmptyState");
const trackerResultCount = document.getElementById("trackerResultCount");
const trackerSearch = document.getElementById("trackerSearch");
const trackerSort = document.getElementById("trackerSort");
const trackerFilters = Array.from(document.querySelectorAll(".tracker-filter"));
const toast = document.getElementById("toast");
const logoutBtn = document.getElementById("logoutBtn");

const trackerModal = document.getElementById("trackerModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalTitle = document.getElementById("trackerModalTitle");
const modalThumbnail = document.getElementById("modalThumbnail");
const modalRecipientName = document.getElementById("modalRecipientName");
const modalRecipientEmail = document.getElementById("modalRecipientEmail");
const modalOccasion = document.getElementById("modalOccasion");
const modalDeliveryType = document.getElementById("modalDeliveryType");
const modalMessagePreview = document.getElementById("modalMessagePreview");
const timelineSteps = Array.from(document.querySelectorAll(".tracker-timeline__step"));

const statDraft = document.getElementById("statDraft");
const statScheduled = document.getElementById("statScheduled");
const statSent = document.getElementById("statSent");
const statViewed = document.getElementById("statViewed");
const trackerOverviewNote = document.getElementById("trackerOverviewNote");

let activeFilter = "all";
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

function getFilteredItems() {
  const searchTerm = trackerSearch.value.trim().toLowerCase();
  const sortOrder = trackerSort.value;

  const visibleItems = trackerItems
    .filter((item) => activeFilter === "all" || item.status === activeFilter)
    .filter((item) => {
      if (!searchTerm) {
        return true;
      }

      return (
        item.recipient.toLowerCase().includes(searchTerm) ||
        item.occasion.toLowerCase().includes(searchTerm)
      );
    })
    .sort((left, right) => {
      const leftTime = new Date(left.sortTime).getTime();
      const rightTime = new Date(right.sortTime).getTime();
      return sortOrder === "oldest" ? leftTime - rightTime : rightTime - leftTime;
    });

  return visibleItems;
}

function createThumbnailMarkup(item, large = false) {
  const sizeClass = large ? " tracker-thumb--large" : "";
  return `
    <div class="tracker-thumb tracker-thumb--${item.theme}${sizeClass}">
      <span class="tracker-thumb__tag">${item.previewTag}</span>
      <strong class="tracker-thumb__title">${item.previewTitle}</strong>
      <p class="tracker-thumb__note">${item.previewNote}</p>
    </div>
  `;
}

function renderTrackerItems() {
  const visibleItems = getFilteredItems();

  trackerResultCount.textContent = `${visibleItems.length} tracked card${visibleItems.length === 1 ? "" : "s"}`;

  if (!visibleItems.length) {
    trackerList.innerHTML = "";
    trackerEmptyState.hidden = false;
    return;
  }

  trackerEmptyState.hidden = true;

  trackerList.innerHTML = visibleItems
    .map((item) => {
      const status = statusConfig[item.status];
      const cancelButton = item.status === "scheduled"
        ? `<button class="tracker-cancel-btn" type="button" data-action="cancel" data-id="${item.id}">Cancel schedule</button>`
        : "";

      return `
        <article class="tracker-item" data-id="${item.id}">
          <div class="tracker-item__preview">
            ${createThumbnailMarkup(item)}
          </div>

          <div class="tracker-item__meta">
            <div class="tracker-item__top">
              <div>
                <h3 class="tracker-item__recipient">${item.recipient}</h3>
                <p class="tracker-item__occasion">${item.occasion}</p>
              </div>
              <span class="tracker-status tracker-status--${item.status}">
                ${status.icon}
                ${status.label}
              </span>
            </div>

            <div class="tracker-item__details">
              <span class="tracker-meta-chip">${item.deliveryType}</span>
              <span class="tracker-item__schedule">${item.scheduleLabel}</span>
            </div>
          </div>

          <div class="tracker-item__actions">
            <button class="btn-secondary tracker-row-btn tracker-row-btn--primary" type="button" data-action="details" data-id="${item.id}">View details</button>
            <button class="btn-secondary tracker-row-btn" type="button" data-action="edit" data-id="${item.id}">Edit</button>
            ${cancelButton}
          </div>
        </article>
      `;
    })
    .join("");
}

function updateOverview() {
  const counts = trackerItems.reduce(
    (accumulator, item) => {
      accumulator[item.status] += 1;
      return accumulator;
    },
    { draft: 0, scheduled: 0, sent: 0, viewed: 0 }
  );

  statDraft.textContent = counts.draft;
  statScheduled.textContent = counts.scheduled;
  statSent.textContent = counts.sent;
  statViewed.textContent = counts.viewed;

  const latestViewed = [...trackerItems]
    .filter((item) => item.status === "viewed")
    .sort((left, right) => new Date(right.sortTime) - new Date(left.sortTime))[0];

  trackerOverviewNote.textContent = latestViewed
    ? `${latestViewed.recipient} viewed your ${latestViewed.occasion.toLowerCase()} card recently.`
    : "You will see recent card activity here.";
}

function openDetails(itemId) {
  const item = trackerItems.find((entry) => entry.id === itemId);

  if (!item) {
    return;
  }

  const status = statusConfig[item.status];

  modalTitle.textContent = `${item.occasion} for ${item.recipient}`;
  modalThumbnail.innerHTML = createThumbnailMarkup(item, true);
  modalRecipientName.textContent = item.recipient;
  modalRecipientEmail.textContent = item.recipientEmail;
  modalOccasion.textContent = item.occasion;
  modalDeliveryType.textContent = `${item.deliveryType} · ${status.label}`;
  modalMessagePreview.textContent = item.message;

  timelineSteps.forEach((step, index) => {
    step.classList.remove("is-complete", "is-current");

    if (index + 1 < status.stage) {
      step.classList.add("is-complete");
    }

    if (index + 1 === status.stage) {
      step.classList.add("is-current");
    }
  });

  trackerModal.hidden = false;
  document.body.classList.add("tracker-modal-open");
}

function closeDetails() {
  trackerModal.hidden = true;
  document.body.classList.remove("tracker-modal-open");
}

trackerFilters.forEach((filterButton) => {
  filterButton.addEventListener("click", () => {
    activeFilter = filterButton.dataset.filter;

    trackerFilters.forEach((button) => {
      button.classList.toggle("is-active", button === filterButton);
    });

    renderTrackerItems();
  });
});

trackerSearch.addEventListener("input", renderTrackerItems);
trackerSort.addEventListener("change", renderTrackerItems);

trackerList.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-action]");

  if (!actionButton) {
    return;
  }

  const { action, id } = actionButton.dataset;

  if (action === "details") {
    openDetails(id);
    return;
  }

  if (action === "edit") {
    showToast("Edit card (simulated)");
    return;
  }

  if (action === "cancel") {
    showToast("Schedule canceled (simulated)");
  }
});

closeModalBtn.addEventListener("click", closeDetails);
trackerModal.addEventListener("click", (event) => {
  if (event.target.matches("[data-close-modal='true']")) {
    closeDetails();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !trackerModal.hidden) {
    closeDetails();
  }
});

logoutBtn.addEventListener("click", (event) => {
  event.preventDefault();
  showToast("Logged out (simulated)");
});

renderTrackerItems();
updateOverview();