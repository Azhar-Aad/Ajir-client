import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

const BASE_URL = "https://ajir-server.onrender.com";

export default function Payment() {
  const navigate = useNavigate();
  const order = useSelector((state) => state.ui.orderDetails);
  const userId = "guest";

  // 🚫 Redirect if no order
  useEffect(() => {
    if (!order) navigate("/");
  }, [order, navigate]);

  /* ================= YUP VALIDATION ================= */
  const validationSchema = Yup.object({
    nameOnCard: Yup.string()
      .min(3, "Too short")
      .max(30, "Too long")
      .required("Name on card is required"),

    cardNumber: Yup.string()
      .matches(/^[0-9]{16}$/, "Card number must be 16 digits")
      .required("Card number is required"),

    expiryDate: Yup.string()
      .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format MM/YY")
      .required("Expiry date is required"),

    cvv: Yup.string()
      .matches(/^[0-9]{3}$/, "CVV must be 3 digits")
      .required("CVV is required"),
  });

  /* ================= FORMIK ================= */
  const formik = useFormik({
    initialValues: {
      nameOnCard: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
    validationSchema,

    onSubmit: async (values) => {
      if (!order) return;

      const subtotal = order.product.price * order.quantity;
      const total = subtotal + 5 + 2;

      // 1️⃣ CREATE ORDER
      const orderRes = await fetch(`${BASE_URL}/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          name: order.name,
          email: order.email,
          phone: order.phone,
          civilId: order.civilId,

          product: {
            _id: order.product._id,
            category: order.product.category,
            price: order.product.price,
            image: order.product.image,
          },

          from: order.from,
          to: order.to,
          delivery: order.deliveryLocation,
          address: order.buildingAddress,
          quantity: order.quantity,
          total,
          latitude: order.latitude,
          longitude: order.longitude,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        alert(orderData.message);
        return;
      }

      // 2️⃣ PAYMENT
      const payRes = await fetch(`${BASE_URL}/payment/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderData.orderId,
          ...values,
        }),
      });

      if (!payRes.ok) {
        alert("Payment failed");
        return;
      }

      navigate("/success");
    },
  });

  if (!order) return null;

  const subtotal = order.product.price * order.quantity;
  const total = subtotal + 5 + 2;

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", padding: "40px 0" }}>
      <div style={{ maxWidth: "1000px", margin: "auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>

        {/* ORDER SUMMARY */}
        <div style={cardStyle}>
          <h3 style={{ color: "#8C1C13" }}>Order Summary</h3>
          <img src={order.product.image} alt="Product" style={imageStyle} />
          <p><strong>Category:</strong> {order.product.category}</p>
          <p><strong>Price/day:</strong> {order.product.price} OMR</p>
          <p><strong>Quantity:</strong> {order.quantity}</p>
          <p><strong>Rental:</strong> {order.from} → {order.to}</p>
          <h4>Total: <span style={{ color: "#1A5319" }}>{total} OMR</span></h4>
        </div>

        {/* PAYMENT FORM */}
        <div style={cardStyle}>
          <h3 style={{ color: "#8C1C13" }}>Payment Details</h3>

          <form onSubmit={formik.handleSubmit}>
            <label>Name on Card</label>
            <input {...formik.getFieldProps("nameOnCard")} style={inputStyle} />
            {formik.touched.nameOnCard && formik.errors.nameOnCard && (
              <small className="input-error">{formik.errors.nameOnCard}</small>
            )}

            <label>Card Number</label>
            <input
              {...formik.getFieldProps("cardNumber")}
              maxLength={16}
              inputMode="numeric"
              style={inputStyle}
            />
            {formik.touched.cardNumber && formik.errors.cardNumber && (
              <small className="input-error">{formik.errors.cardNumber}</small>
            )}

            <label>Expiry (MM/YY)</label>
            <input
              {...formik.getFieldProps("expiryDate")}
              maxLength={5}
              style={inputStyle}
            />
            {formik.touched.expiryDate && formik.errors.expiryDate && (
              <small className="input-error">{formik.errors.expiryDate}</small>
            )}

            <label>CVV</label>
            <input
              {...formik.getFieldProps("cvv")}
              maxLength={3}
              inputMode="numeric"
              style={inputStyle}
            />
            {formik.touched.cvv && formik.errors.cvv && (
              <small className="input-error">{formik.errors.cvv}</small>
            )}

            <button type="submit" style={payButton}>
              Pay {total} OMR
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const cardStyle = {
  background: "#fff",
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const imageStyle = {
  width: "100%",
  height: "220px",
  objectFit: "cover",
  borderRadius: "10px",
  marginBottom: "15px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "6px 0 10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const payButton = {
  marginTop: "20px",
  width: "100%",
  padding: "12px",
  background: "#8C1C13",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
};
