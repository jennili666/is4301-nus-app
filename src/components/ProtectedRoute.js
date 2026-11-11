import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";

// Only renders the page for logged-in users; everyone else is sent to /login.
function ProtectedRoute({ children, pageName }) {
  const [user, loading] = useAuthState(auth);
  const location = useLocation();

  if (loading) {
    return <section className="card loading">Checking your login status…</section>;
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname, pageName }} />;
  }
  return children;
}

export default ProtectedRoute;
