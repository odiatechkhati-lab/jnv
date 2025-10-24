export const loginForm = document.querySelector("#login-form");
export const registerForm = document.querySelector("#register-form");
export const resetForm = document.querySelector("#reset-form");
export const authSection = document.querySelector("#auth-section");
export const profileSection = document.querySelector("#profile-section");
export const logoutButton = document.querySelector("#logout-button");
export const tabButtons = document.querySelectorAll(".tab");
export const tabPanels = document.querySelectorAll(".tabpanel");
export const notification = document.querySelector("#notification");
export const footerYear = document.querySelector("#footer-year");
export const profileSummary = document.querySelector("#profile-summary");

footerYear.textContent = new Date().getFullYear();

export function setActiveTab(panelId) {
  tabButtons.forEach((button) => {
    const isActive = button.dataset.target === panelId;
    button.classList.toggle("tab--active", isActive);
    button.setAttribute("aria-selected", String(isActive));
    button.setAttribute("tabindex", isActive ? "0" : "-1");
  });

  tabPanels.forEach((panel) => {
    const shouldShow = panel.id === panelId;
    panel.hidden = !shouldShow;
  });
}

export function bindTabInteractions() {
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => setActiveTab(button.dataset.target));
  });
}

export function showNotification(message, variant = "info") {
  notification.textContent = message;
  notification.dataset.variant = variant;
  notification.hidden = false;
}

export function hideNotification() {
  notification.hidden = true;
  notification.textContent = "";
  notification.dataset.variant = "info";
}

export function setAuthView(isAuthenticated) {
  authSection.hidden = Boolean(isAuthenticated);
  profileSection.hidden = !Boolean(isAuthenticated);

  if (!isAuthenticated) {
    profileSummary.innerHTML = "";
  }
}

export function setFormLoading(form, isLoading) {
  const controls = form.querySelectorAll("input, button, select, textarea");
  controls.forEach((control) => {
    control.disabled = isLoading;
  });

  const submitButton = form.querySelector('[type="submit"]');
  if (submitButton) {
    if (isLoading) {
      submitButton.dataset.originalLabel = submitButton.dataset.originalLabel || submitButton.textContent;
      submitButton.textContent = "Please wait…";
    } else if (submitButton.dataset.originalLabel) {
      submitButton.textContent = submitButton.dataset.originalLabel;
    }
  }
}

export function updateProfileSummary(user) {
  profileSummary.innerHTML = "";

  if (!user) {
    const paragraph = document.createElement("p");
    paragraph.textContent = "We could not load your profile.";
    profileSummary.append(paragraph);
    return;
  }

  const entries = [
    ["Email", user.email],
    ["Full name", user.user_metadata?.full_name],
    ["Program", user.user_metadata?.program],
    ["Graduation year", user.user_metadata?.grad_year],
  ].filter(([, value]) => Boolean(value));

  if (entries.length === 0) {
    const paragraph = document.createElement("p");
    paragraph.textContent =
      "You're signed in. Add more fields to your Supabase user metadata to display them here.";
    profileSummary.append(paragraph);
    return;
  }

  entries.forEach(([label, value]) => {
    const term = document.createElement("dt");
    term.textContent = label;
    const detail = document.createElement("dd");
    detail.textContent = value;
    profileSummary.append(term, detail);
  });
}

export function focusFirstField(form) {
  const field = form.querySelector("input, select, textarea");
  if (field) {
    field.focus();
  }
}

export function readFragmentParams() {
  if (!window.location.hash) {
    return new URLSearchParams();
  }

  const params = new URLSearchParams(window.location.hash.slice(1));
  window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
  return params;
}
