import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

const BASE_URL = "https://ajir-server-v972.onrender.com";

export default function Payment() {
  const navigate = useNavigate();
  const order = useSelector((state) => state.ui.orderDetails);
  const userId = "guest";

  useEffect(() => {
    if (!order) navigate("/");
  }, [order, navigate]);

  const validationSchema = Yup.object({
    nameOnCard: Yup.string().required(),
    cardNumber: Yup.string().matches(/^[0-9]{16}$/).required(),
    expiryDate: Yup.string().matches(/^(0[1-9]|1[0-2])\/\d{2}$/).required(),
    cvv: Yup.string().matches(/^[0-9]{3}$/).required(),
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
        const subtotal = order.product.price * order.quantity;
        const total = subtotal + 5 + 2;

        /* ================= CREATE ORDER ================= */
        const orderRes = await fetch(`${BASE_URL}/order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,

            name: order.name,
            email: order.email,
            phone: order.phone,

            product: {
              _id: order.product._id,
              category: order.product.category,
              price: order.product.price,
              image: order.product.image,
            },

            rentalPeriod: {
              from: order.from,
              to: order.to,
            },

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
          alert(orderData.message || "Order failed");
          return;
        }

        /* ================= PAYMENT ================= */
        const payRes = await fetch(`${BASE_URL}/payment/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: orderData.orderId,
            paymentMethod: "CARD",
            status: "SUCCESS",
          }),
        });

        if (!payRes.ok) {
          alert("Payment failed");
          return;
        }

        /* ================= SUCCESS ================= */
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
      <button type="submit">Pay</button>
    </form>
  );
}
