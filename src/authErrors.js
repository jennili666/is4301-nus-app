const WRONG_CREDENTIALS =
  "The email or password is incorrect, or no account exists. Check your details, sign up, or use Sign in with Google.";

const messages = {
  "auth/invalid-email": () =>
    "The email address is not valid. Please use the format name@example.com.",
  "auth/missing-password": () => "Please enter your password.",
  "auth/user-not-found": () => WRONG_CREDENTIALS,
  "auth/wrong-password": () => WRONG_CREDENTIALS,
  "app/google-account": (email) =>
    `${email} is registered with Google. Please use "Sign in with Google" instead.`,
  "auth/invalid-credential": () => WRONG_CREDENTIALS,
  "auth/invalid-login-credentials": () => WRONG_CREDENTIALS,
  "auth/too-many-requests": () =>
    "Too many failed attempts. This account is temporarily locked; please wait a few minutes and try again.",
  "auth/user-disabled": () => "This account has been disabled. Please contact the administrator.",
  "auth/email-already-in-use": (email) =>
    `An account already exists for ${email}. Please log in instead.`,
  "auth/weak-password": () => "The password is too weak. Use at least 6 characters.",
  "auth/popup-closed-by-user": () => "Google sign-in was cancelled before it finished.",
  "auth/cancelled-popup-request": () => "Google sign-in was cancelled before it finished.",
  "auth/popup-blocked": () =>
    "The Google sign-in pop-up was blocked by the browser. Please allow pop-ups and try again.",
  "auth/network-request-failed": () =>
    "Network error: cannot reach the login server. Check your internet connection and try again.",
  "auth/operation-not-allowed": () =>
    "This sign-in method is not enabled for the app in Firebase.",
  "auth/unauthorized-domain": () =>
    "This website is not authorised for Google sign-in (add it under Firebase Authentication > Settings).",
};

export function isAmbiguousCredentialError(err) {
  const code = (err && err.code) || "";
  const message = (err && err.message) || "";
  return (
    code === "auth/invalid-credential" ||
    code === "auth/invalid-login-credentials" ||
    message.includes("INVALID_LOGIN_CREDENTIALS")
  );
}

export function getAuthErrorMessage(err, email = "") {
  const code = isAmbiguousCredentialError(err) ? "auth/invalid-credential" : err && err.code;
  const build = messages[code];
  if (build) return build(email || "this email");
  return `Something went wrong (${code || "unknown error"}). Please try again.`;
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
