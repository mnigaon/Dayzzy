import "./Logoslider.css";
import appleLogo from "../assets/apple.png";
import microsoftLogo from "../assets/microsoft.png";
import googleLogo from "../assets/google.png";
import amazonLogo from "../assets/amazon.png";
import facebookLogo from "../assets/facebook.png";
import netflixLogo from "../assets/netflix.png";
import samsungLogo from "../assets/samsung.png";

function Logoslider() {
  const logos = [
    appleLogo,
    microsoftLogo,
    googleLogo,
    amazonLogo,
    facebookLogo,
    netflixLogo,
    samsungLogo,
  ];

  return (
    <section className="testimonial">
      <p className="testimonial-text">
        Trusted by over 75% of the Fortune 500
      </p>
      <div className="logo-slider">
        <div className="slider-track">
          {logos.concat(logos).map((logo, index) => (
            <div className="logo-item" key={index}>
              <img src={logo} alt={`logo-${index}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Logoslider;