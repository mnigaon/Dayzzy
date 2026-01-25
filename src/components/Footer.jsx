import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <h2 className="footer-logo">TASKY</h2>
        <div className="social-links">
          <a href="#" aria-label="Instagram">📷</a>
          <a href="#" aria-label="Twitter">🐦</a>
          <a href="#" aria-label="GitHub">🐙</a>
          <a href="#" aria-label="LinkedIn">🔗</a>
        </div>
      </div>
      <div className="footer-right">
        <div className="footer-links">
          <div className="link-group">
            <h4>Features</h4>
            <ul>
              <li><a href="#">Task Management</a></li>
              <li><a href="#">Team Collaboration</a></li>
              <li><a href="#">Analytics</a></li>
            </ul>
          </div>
          <div className="link-group">
            <h4>Learn More</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Pricing</a></li>
            </ul>
          </div>
          <div className="link-group">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
