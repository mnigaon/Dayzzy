//src/components/Headerr.jsx
import { Link } from "react-router-dom";
import "./Headerr.css";

function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        {/* Left: Logo */}
        <Link to="/" className="logo">
          TASKY
        </Link>

        {/* Right: Nav */}
        <nav className="nav">
          <Link to="/contact" className="nav-link">
            Contact Sales
          </Link>
          <Link to="/auth" className="nav-button">
            Go To My Account
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
