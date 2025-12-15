import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

const BASE_URL = "https://ajir-server-v972.onrender.com";

export default function Payment() {
  const navigate = useNavigate();
  const order = useSelector((state) => state.ui.orderDetails);

  useEffect(() => {
    if (!order) navigate("/");
  }, [order, navigate]);

  const validationSchema = Yup.object({
    nameOnCard: Yup.string().required("Required"),
    cardNumber: Yup.string()
      .matches(/^[0-9]{16}$/, "16 digits required")
      .required("Required"),
    expiryDate: Yup.string()
      .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "MM/YY")
      .required("Required"),
    cvv: Yup.string()
      .matches(/^[0-9]{3}$/, "3 digits")
      .required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      nameOnCard: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
    validationSchema,

    onSubmit: async () => {
      try {
        const orderRes = await fetch(`${BASE_URL}/order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: "guest",
            ...order,
            rentalPeriod: { from: order.from, to: order.to },
            total,
          }),
        });

        const orderData = await orderRes.json();
        if (!orderRes.ok) return alert("Order failed");

        const payRes = await fetch(`${BASE_URL}/payment/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: orderData.orderId,
            paymentMethod: "CARD",
            status: "SUCCESS",
          }),
        });

        if (!payRes.ok) return alert("Payment failed");

        navigate("/success", { state: { orderId: orderData.orderId } });
      } catch (err) {
        console.error(err);
        alert("Something went wrong");
      }
    },
  });

  if (!order) return null;

  /* ===== CALCULATIONS ===== */
  const rentalDays = Math.max(
    1,
    Math.ceil(
      (new Date(order.to) - new Date(order.from)) /
        (1000 * 60 * 60 * 24)
    )
  );

  const perDay = order.product.price;
  const subtotal = perDay * order.quantity * rentalDays;
  const fees = 7;
  const total = subtotal + fees;

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* ===== ORDER SUMMARY ===== */}
        <div style={cardStyle}>
          <h3 style={titleStyle}>Order Summary</h3>

          <img
            src={order.product.image}
            alt={order.product.category}
            style={imageStyle}
          />

          <p><strong>Product:</strong> {order.product.category}</p>
          <p><strong>Price/day:</strong> {perDay} OMR</p>
          <p><strong>Quantity:</strong> {order.quantity}</p>
          <p><strong>Days:</strong> {rentalDays}</p>

          <hr />

          <p><strong>Subtotal:</strong> {subtotal} OMR</p>
          <p><strong>Service Fees:</strong> {fees} OMR</p>

          <h3 style={{ color: "#1A5319" }}>
            Total: {total} OMR
          </h3>
        </div>

        {/* ===== PAYMENT FORM ===== */}
        <div style={cardStyle}>
          <h3 style={titleStyle}>Payment Details</h3>

          <form onSubmit={formik.handleSubmit}>
            <label>Name on Card</label>
            <input {...formik.getFieldProps("nameOnCard")} style={inputStyle} />

            <label>Card Number</label>
            <input
              {...formik.getFieldProps("cardNumber")}
              maxLength={16}
              style={inputStyle}
            />

            <label>Expiry (MM/YY)</label>
            <input {...formik.getFieldProps("expiryDate")} style={inputStyle} />

            <label>CVV</label>
            <input
              {...formik.getFieldProps("cvv")}
              maxLength={3}
              style={inputStyle}
            />

            <button type="submit" style={payButton}>
              Pay {total} OMR
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ===== STYLES ===== */

const pageStyle = {
  minHeight: "100vh",
  background: "#f8f9fa",
  padding: "40px 0",
};

const containerStyle = {
  maxWidth: "1000px",
  margin: "auto",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "30px",
};

const cardStyle = {
  background: "#fff",
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const titleStyle = {
  color: "#8C1C13",
  marginBottom: "15px",
};

const imageStyle = {
  width: "100%",
  height: "200px",
  objectFit: "cover",
  borderRadius: "10px",
  marginBottom: "15px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "6px 0 12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const payButton = {
  marginTop: "15px",
  width: "100%",
  padding: "12px",
  background: "#8C1C13",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  cursor: "pointer",
};
