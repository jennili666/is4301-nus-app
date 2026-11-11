import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth, registerWithEmailAndPassword, signInWithGoogle } from "../firebase";
import { getAuthErrorMessage, isValidEmail } from "../authErrors";
import { useNotify } from "../components/Notification";
import GoogleIcon from "../components/GoogleIcon";
import "./Auth.css";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const location = useLocation();
  const notify = useNotify();
  const mounted = useRef(true);
  const redirectTo = (location.state && location.state.from) || "/";

  useEffect(() => () => (mounted.current = false), []);

  useEffect(() => {
    if (!loading && user) navigate(redirectTo, { replace: true });
  }, [user, loading, navigate, redirectTo]);

  const validate = () => {
    if (!name.trim()) return "Please enter your full name.";
    if (!isValidEmail(email)) return getAuthErrorMessage({ code: "auth/invalid-email" });
    if (password.length < 6) return getAuthErrorMessage({ code: "auth/weak-password" });
    if (password !== confirm) return "The two passwords do not match.";
    return null;
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    const problem = validate();
    if (problem) {
      notify("error", "Cannot create account", problem);
      return;
    }
    setBusy(true);
    try {
      await registerWithEmailAndPassword(name.trim(), email, password);
      notify("success", "Account created", `Welcome to NUS, ${name.trim()}! You are now logged in.`);
    } catch (err) {
      console.error(err);
      notify("error", "Sign-up failed", getAuthErrorMessage(err, email.trim()));
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
      <h1>Sign up</h1>
      <p className="lead">Create an account with your email, or use your Google account.</p>
      <form className="auth__form" onSubmit={handleSignUp} noValidate>
        <label htmlFor="signup-name">Full name</label>
        <input id="signup-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" autoComplete="name" />
        <label htmlFor="signup-email">Email</label>
        <input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" autoComplete="email" />
        <label htmlFor="signup-password">Password</label>
        <input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" autoComplete="new-password" />
        <label htmlFor="signup-confirm">Confirm password</label>
        <input id="signup-confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter password" autoComplete="new-password" />
        <button type="submit" className="btn btn--primary" disabled={busy}>
          {busy ? "Please wait…" : "Create account"}
        </button>
      </form>
      <div className="auth__divider">
        <span>or</span>
      </div>
      <button type="button" className="btn btn--google" onClick={handleGoogle} disabled={busy}>
        <GoogleIcon /> Sign up with Google
      </button>
      <p className="auth__switch">
        Already have an account? <Link to="/login" state={location.state}>Log in</Link>
      </p>
    </section>
  );
}

export default SignUp;
