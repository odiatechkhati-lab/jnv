import {
  loginForm,
  registerForm,
  resetForm,
  logoutButton,
  bindTabInteractions,
  setActiveTab,
  setAuthView,
  showNotification,
  hideNotification,
  setFormLoading,
  updateProfileSummary,
  focusFirstField,
  readFragmentParams,
} from "./ui.js";
import {
  getInitialSession,
  onAuthStateChange,
} from "./supabaseClient.js";
import {
  fetchCurrentUser,
  sendPasswordResetEmail,
  signInWithPassword,
  signOutUser,
  signUpWithProfile,
} from "./auth.js";

function sanitizeEmail(value) {
  return value.trim().toLowerCase();
}

function sanitizeText(value) {
  return value.trim();
}

async function handleSession(session) {
  if (!session) {
    setAuthView(false);
    return;
  }

  setAuthView(true);

  try {
    const user = await fetchCurrentUser();
    updateProfileSummary(user);
  } catch (error) {
    console.error("Unable to fetch current user", error);
    showNotification("Signed in but failed to load profile details.", "error");
  }
}

function handleRedirectFragments() {
  const params = readFragmentParams();
  const message = params.get("message");
  const errorDescription = params.get("error_description");
  const type = params.get("type");

  if (errorDescription) {
    showNotification(decodeURIComponent(errorDescription), "error");
    return;
  }

  if (message) {
    showNotification(decodeURIComponent(message), "success");
    return;
  }

  if (type === "recovery") {
    showNotification(
      "Password reset link confirmed. Update your password in the Supabase-hosted form.",
      "info"
    );
  }
}

function extractFormValues(form) {
  const formData = new FormData(form);
  return Object.fromEntries(formData.entries());
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  hideNotification();
  setFormLoading(loginForm, true);

  const { email = "", password = "" } = extractFormValues(loginForm);

  try {
    await signInWithPassword({
      email: sanitizeEmail(email),
      password: sanitizeText(password),
    });
    showNotification("Welcome back!", "success");
  } catch (error) {
    showNotification(error.message || "Unable to sign in.", "error");
  } finally {
    setFormLoading(loginForm, false);
  }
});

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  hideNotification();
  setFormLoading(registerForm, true);

  const {
    fullName = "",
    email = "",
    password = "",
    gradYear = "",
    program = "",
  } = extractFormValues(registerForm);

  try {
    await signUpWithProfile({
      fullName: sanitizeText(fullName),
      email: sanitizeEmail(email),
      password: sanitizeText(password),
      gradYear: sanitizeText(gradYear),
      program: sanitizeText(program),
    });
    showNotification(
      "Account created! Check your inbox to confirm your email before signing in.",
      "success"
    );
    registerForm.reset();
    setActiveTab("login-panel");
    focusFirstField(loginForm);
  } catch (error) {
    showNotification(error.message || "Unable to create account.", "error");
  } finally {
    setFormLoading(registerForm, false);
  }
});

resetForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  hideNotification();
  setFormLoading(resetForm, true);

  const { email = "" } = extractFormValues(resetForm);

  try {
    await sendPasswordResetEmail(sanitizeEmail(email));
    showNotification("Password reset email sent!", "success");
    resetForm.reset();
  } catch (error) {
    showNotification(error.message || "Unable to send password reset email.", "error");
  } finally {
    setFormLoading(resetForm, false);
  }
});

logoutButton.addEventListener("click", async () => {
  hideNotification();

  try {
    await signOutUser();
    showNotification("Signed out successfully.", "success");
    setAuthView(false);
  } catch (error) {
    showNotification(error.message || "Unable to sign out.", "error");
  }
});

(async function bootstrap() {
  bindTabInteractions();
  handleRedirectFragments();

  try {
    const session = await getInitialSession();
    await handleSession(session);
  } catch (error) {
    console.error("Failed to bootstrap auth state", error);
    showNotification("Unable to connect to Supabase. Check your credentials.", "error");
  }

  onAuthStateChange((_event, session) => {
    handleSession(session);
  });
})();
