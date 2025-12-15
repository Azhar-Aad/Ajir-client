import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useFormik } from "formik";

const BASE_URL = "https://ajir-server-v972.onrender.com";

export default function Payment() {
  const navigate = useNavigate();
  const order = useSelector((state) => state.ui.orderDetails);

  useEffect(() => {
    if (!order) navigate("/");
  }, [order, navigate]);

  const formik = useFormik({
    initialValues: {
      nameOnCard: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },

    onSubmit: async () => {
      try {
        const total = order.product.price * order.quantity + 7;

        /* ========== CREATE ORDER ========== */
        const orderRes = await fetch(`${BASE_URL}/order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: "guest",
            name: order.name,
            email: order.email,
            phone: order.phone,
            product: order.product,
            rentalPeriod: { from: order.from, to: order.to },
            quantity: order.quantity,
            deliveryLocation: order.deliveryLocation,
            buildingAddress: order.buildingAddress,
            location: {
              latitude: order.latitude,
              longitude: order.longitude,
            },
            total,
          }),
        });

        const orderData = await orderRes.json();
        if (!orderRes.ok) {
          alert("Order failed");
          return;
        }

        /* ========== PAYMENT ========== */
        await fetch(`${BASE_URL}/payment/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: orderData.orderId,
            paymentMethod: "CARD",
            status: "SUCCESS",
          }),
        });

        /* ========== SUCCESS ========== */
        navigate("/success", { state: { orderId: orderData.orderId } });

      } catch (err) {
        console.error(err);
        alert("Something went wrong");
      }
    },
  });

  if (!order) return null;

  const total = order.product.price * order.quantity + 7;

  return (
    <form onSubmit={formik.handleSubmit}>
      <h2>Pay {total} OMR</h2>
      <input placeholder="Name on card" {...formik.getFieldProps("nameOnCard")} />
      <input placeholder="Card number" {...formik.getFieldProps("cardNumber")} />
      <input placeholder="MM/YY" {...formik.getFieldProps("expiryDate")} />
      <input placeholder="CVV" {...formik.getFieldProps("cvv")} />
      <button type="submit">Pay {total} OMR</button>
    </form>
  );
}
