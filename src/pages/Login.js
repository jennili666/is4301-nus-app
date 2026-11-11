import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle } from "../firebase";
import { getAuthErrorMessage, isValidEmail } from "../authErrors";
import { useNotify } from "../components/Notification";
import GoogleIcon from "../components/GoogleIcon";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const location = useLocation();
  const notify = useNotify();
  const mounted = useRef(true);
  const redirectTo = (location.state && location.state.from) || "/";
  const blockedPage = location.state && location.state.pageName;

  useEffect(() => () => (mounted.current = false), []);

  useEffect(() => {
    if (!loading && user) navigate(redirectTo, { replace: true });
  }, [user, loading, navigate, redirectTo]);

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      notify("error", "Missing details", "Please enter both your email address and password.");
      return;
    }
    if (!isValidEmail(email)) {
      notify("error", "Invalid email", getAuthErrorMessage({ code: "auth/invalid-email" }));
      return;
    }
    setBusy(true);
    try {
      const signedIn = await logInWithEmailAndPassword(email, password);
      notify("success", "Login successful", `Welcome back, ${signedIn.displayName || signedIn.email}!`);
    } catch (err) {
      console.error(err);
      notify("error", "Login failed", getAuthErrorMessage(err, email.trim()));
    } finally {
      if (mounted.current) setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    try {
      const signedIn = await signInWithGoogle();
      notify("success", "Signed in with Google", `Welcome, ${signedIn.displayName || signedIn.email}!`);
    } catch (err) {
      console.error(err);
      notify("error", "Google sign-in failed", getAuthErrorMessage(err));
    } finally {
      if (mounted.current) setBusy(false);
    }
  };

  return (
    <section className="auth card">
      <h1>Login</h1>
      <p className="lead">Log in with your email or Google account.</p>
      {blockedPage && (
        <div className="auth__notice" role="status">
          Please log in to access the <strong>{blockedPage}</strong> page.
        </div>
      )}
      <form className="auth__form" onSubmit={handleLogin} noValidate>
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          autoComplete="email"
        />
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete="current-password"
        />
        <button type="submit" className="btn btn--primary" disabled={busy}>
          {busy ? "Please wait…" : "Login"}
        </button>
      </form>
      <div className="auth__divider">
        <span>or</span>
      </div>
      <button type="button" className="btn btn--google" onClick={handleGoogle} disabled={busy}>
        <GoogleIcon /> Sign in with Google
      </button>
      <p className="auth__switch">
        Don't have an account? <Link to="/signup" state={location.state}>Sign up</Link>
      </p>
    </section>
  );
}

export default Login;
