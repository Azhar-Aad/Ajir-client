import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Payment() {
  const navigate = useNavigate();

  // ⭐ Get order details from Redux
  const order = useSelector((state) => state.ui.orderDetails);

  // 🚨 Prevent direct access
  useEffect(() => {
    if (!order) navigate("/");
  }, [order]);

  const [form, setForm] = useState({
    nameOnCard: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ⭐ Calculate total
  const subtotal = (order?.product?.price || 0) * (order?.quantity || 1);
  const insurance = 5;
  const delivery = 2;
  const total = subtotal + insurance + delivery;

  // ⭐ Handle Payment
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1️⃣ Save order to backend
    const orderRes = await fetch("https://ajir-server.onrender.com/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });

    const orderData = await orderRes.json();

    if (!orderRes.ok) {
      alert(orderData.message);
      return;
    }

    const createdOrderId = orderData.orderId;

    // 2️⃣ Save payment to backend
    const payRes = await fetch("https://ajir-server.onrender.com/payment/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: createdOrderId,
        ...form,
      }),
    });

    const payData = await payRes.json();

    if (!payRes.ok) {
      alert(payData.message);
      return;
    }

    // 3️⃣ Navigate to success page
    navigate("/success");
  };

  if (!order) return null;

  return (
    <div className="payment-page">
      <div className="payment-container">
        
        {/* ORDER SUMMARY */}
        <div className="summary-section">
          <h3 className="summary-title">Order Summary:</h3>

          <div className="summary-content">
            <img
              src={order.product.image}
              alt="Product"
              className="summary-image"
            />

            <div className="summary-details">
              <h4>{order.product.productName}</h4>

              <p>Sub Total: <strong>{subtotal} OMR</strong></p>
              <p>Quantity: {order.quantity}</p>
              <p>Insurance: <strong>{insurance} OMR</strong></p>
              <p>Delivery Fees: <strong>{delivery} OMR</strong></p>

              <p className="total">
                Total Price: <strong>{total} OMR</strong>
              </p>
            </div>
          </div>
        </div>

        {/* PAYMENT FORM */}
        <div className="form-section">
          <h3 className="form-title">Payment Form</h3>

          <form onSubmit={handleSubmit} className="payment-form">
            <label>Name on Card</label>
            <input
              type="text"
              name="nameOnCard"
              value={form.nameOnCard}
              onChange={handleChange}
              required
            />

            <label>Card Number</label>
            <input
              type="text"
              name="cardNumber"
              maxLength="16"
              value={form.cardNumber}
              onChange={handleChange}
              required
            />

            <div className="form-row">
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={form.expiryDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>CVV</label>
                <input
                  type="password"
                  name="cvv"
                  maxLength="4"
                  value={form.cvv}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-pay">
              PAY
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
