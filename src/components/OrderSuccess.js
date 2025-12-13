import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import "../index.css";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const [showCheck, setShowCheck] = useState(false);

  // ⭐ Trigger animation on load
  useEffect(() => {
    setTimeout(() => setShowCheck(true), 300);
  }, []);

  return (
    <div className="success-page">
      <div className="success-container">



         <img src={logo} alt="Ajir Logo" className="success-logo" />

        {/* ✅ Animated Check */}
        <div className={`check-wrapper ${showCheck ? "show" : ""}`}>
         <div className="check-circle">✓</div>

        </div>

       

        <h2 className="success-title">Order Confirmed!</h2>
        <p className="success-message">
          Your order has been placed successfully 🎉
        </p>

        <button className="btn-return" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </div>
  );
}
