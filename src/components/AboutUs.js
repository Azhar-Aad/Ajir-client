import React from "react";
import logo from "../images/logo.png";

export default function AboutUs() {
  return (
    <div className="about-page">
      <div className="about-container">
        <img src={logo} alt="Ajir Logo" className="about-logo" />

        <h2 className="about-title">What is Ajir?</h2>

        <p className="about-description">
          <strong>Ajir</strong> is the first Omani digital platform of its kind.
          It provides a special space for every product owner who wishes to
          invest in the leasing sector. The platform rents open spaces for
          brands and projects to register with their identities, to display
          their products for sale or for rent. It also provides product delivery
          and return services, and secure payment solutions to ensure a smooth
          and trustworthy experience for all users.
        </p>

        <p className="about-description">
          By connecting local entrepreneurs, brands, and businesses, Ajir aims
          to empower innovation and collaboration across Oman’s retail and
          service landscape.
        </p>
      </div>
    </div>
  );
}
