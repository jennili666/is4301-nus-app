import { Link, NavLink } from "react-router-dom";
import nusLogo from "../assets/nus-logo.jpg";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/academics", label: "Academics" },
  { to: "/admission", label: "Admission" },
];

function NavBar() {
  return (
    <header className="navbar">
      <Link to="/" className="navbar__brand" aria-label="NUS home">
        <img src={nusLogo} alt="NUS logo" />
      </Link>
      <nav className="navbar__links" aria-label="Main navigation">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              "navbar__link" + (isActive ? " navbar__link--active" : "")
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export default NavBar;
