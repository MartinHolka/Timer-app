import { useState } from "react";
import "../styles/Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={`navbar${isOpen ? " navbar-open" : ""}`}>
      <div className="navbar-icon" onClick={toggleNavbar}>
        {isOpen ? "X" : <span className="menu-icon" />}
      </div>
      {isOpen && <ul className="navbar-links">
        <li><a className="link" href="/">Home</a></li>
        <li><a className="link" href="/login">Log in</a></li>
        <li><a className="link" href="/signup">Sign up</a></li>
        </ul>}
    </nav>
  );
};
export default Navbar;
