import { useAuthState } from "react-firebase-hooks/auth";
import { Link, NavLink, useNavigate } from "react-router-dom";
import nusLogo from "../assets/nus-logo.jpg";
import { auth, logout } from "../firebase";
import { useNotify } from "./Notification";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/academics", label: "Academics" },
  { to: "/admission", label: "Admission" },
];

const linkClass = ({ isActive }) => "navbar__link" + (isActive ? " navbar__link--active" : "");

function NavBar() {
  const [user] = useAuthState(auth);
  const notify = useNotify();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    notify("info", "Logged out", "You have been logged out successfully.");
    navigate("/");
  };

  return (
    <header className="navbar">
      <Link to="/" className="navbar__brand" aria-label="NUS home">
        <img src={nusLogo} alt="NUS logo" />
      </Link>
      <nav className="navbar__links" aria-label="Main navigation">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
            {link.label}
          </NavLink>
        ))}
        <span className="navbar__divider" aria-hidden="true" />
        {user ? (
          <>
            <span className="navbar__user" title={user.email}>
              {user.displayName || user.email}
            </span>
            <button type="button" className="navbar__link navbar__button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/login" className={linkClass}>
            Login / Sign up
          </NavLink>
        )}
      </nav>
    </header>
  );
}

export default NavBar;
