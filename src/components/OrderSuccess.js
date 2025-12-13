import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../images/logo.png"; // your Ajir logo

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="success-page">
      <div className="success-container">
        <img src={logo} alt="Ajir Logo" className="success-logo" />

        <h2 className="success-title">Thank you for choosing Ajir! 🙌</h2>
        <p className="success-message">
          Your order has been received successfully.
        </p>
        <p className="success-subtext">
          We’re delighted to have you join our platform, which provides a special
          space for every business owner or brand to showcase or rent their
          products.  
          <br />
          Please check your email to follow up on your order status.
        </p>

        <button className="btn-return" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </div>
  );
}
