import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* --- Column 1: Quick Links --- */}
        <div className="footer-column">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/aboutus">About Us</Link></li>
            <li>How It Works</li>
            <li>Contact</li>
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* --- Column 2: Services --- */}
        <div className="footer-column">
          <h3>Services</h3>
          <ul>
            <li>Product Leasing</li>
            <li>Product Sales</li>
            <li>Delivery & Returns</li>
            <li>Secure Payments</li>
          </ul>
        </div>

        {/* --- Column 3: Contact --- */}
        <div className="footer-column">
          <h3>Contact Us</h3>
          <ul className="footer-contact">
            <li><MapPin size={18}/> Sultanate of Oman</li>
            <li><Mail size={18}/> info@ajir.om</li>
            <li><Phone size={18}/> +968 9XXXXXXX</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} <strong>Ajir</strong>. All rights reserved.
      </div>
    </footer>
  );
}
