import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setOrderDetails } from "../features/uiSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import "../index.css";
import { Label } from "reactstrap";

export default function Order() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const product = location.state?.product;
  const user = useSelector((state) => state.ui.user);

  /* ======================================
     ✅ YUP VALIDATION SCHEMA
  ====================================== */
  const validationSchema = Yup.object({
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^[0-9]{8}$/, "Phone number must be exactly 8 digits"),

    from: Yup.date()
      .required("Start date is required")
      .min(
        new Date(new Date().setHours(0, 0, 0, 0)),
        "Start date cannot be in the past"
      ),

    to: Yup.date()
      .required("End date is required")
      .min(Yup.ref("from"), "End date must be after start date"),

    quantity: Yup.number()
      .required("Quantity is required")
      .min(1, "Minimum quantity is 1")
      .max(20,"max is 20 items "),

    delivery: Yup.string().required("Delivery area is required").max(50),

    address: Yup.string()
      .required("Building address is required")
      .matches(/^[0-9]+$/, "Building address must contain numbers only")
      .max(15, "Building address cannot exceed 30 digits"),

    latitude: Yup.number().required("Please share your location"),
    longitude: Yup.number().required("Please share your location"),
  });

  /* ======================================
     ✅ FORMIK
  ====================================== */
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      civilId: "",
      from: moment().format("YYYY-MM-DD"),
      to: moment().format("YYYY-MM-DD"),
      quantity: 1,
      delivery: "",
      address: "",
      note: "",
      latitude: "",
      longitude: "",
      orderDate: moment().format("YYYY-MM-DD HH:mm:ss"),
    },

    validationSchema,

    onSubmit: (values) => {
      if (!product) return;

      const orderData = {
        ...values,
        product,
        total: product.price * values.quantity + 5 + 2,
      };

      dispatch(setOrderDetails(orderData));
      navigate("/payment");
    },
  });

  /* ======================================
     ✅ AUTO FILL USER INFO
  ====================================== */
  useEffect(() => {
    if (user) {
      formik.setFieldValue("name", user.name);
      formik.setFieldValue("email", user.email);
    }
    // eslint-disable-next-line
  }, [user]);

  /* ======================================
     ✅ GET USER LOCATION
  ====================================== */
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert("Location not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        formik.setFieldValue("latitude", pos.coords.latitude);
        formik.setFieldValue("longitude", pos.coords.longitude);
      },
      () => alert("Unable to get your location")
    );
  };

  if (!product) {
    return <p style={{ padding: "20px" }}>⚠ No product selected.</p>;
  }

  /* ======================================
     ✅ UI
  ====================================== */
  return (
    <div className="order-page">
      <div
        className="order-container"
        style={{ maxWidth: "520px", margin: "auto" }}
      >
        <h3 style={{ textAlign: "center" }}>Order Details</h3>

        {/* PRODUCT SUMMARY */}
        <div
          className="order-product-summary"
          style={{ display: "flex", gap: "12px", marginBottom: "10px" }}
        >
          <img
            src={product.image}
            alt={product.category}
            style={{ width: "80px", height: "60px", objectFit: "cover" }}
          />
          <div>
            <strong>{product.category}</strong>
            <p style={{ margin: 0, fontSize: "14px" }}>
              {product.price} OMR / day
            </p>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={formik.handleSubmit} className="order-form">
          <label>Full Name</label>
          <input value={formik.values.name} readOnly placeholder="Full Name" />
          <label>Email</label>
          <input value={formik.values.email} readOnly placeholder="Email" />

          {/* PHONE */}
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number (8 digits)"
            maxLength={8}
            inputMode="numeric"
            value={formik.values.phone}
            onChange={(e) => {
              if (/^[0-9]*$/.test(e.target.value)) {
                formik.setFieldValue("phone", e.target.value);
              }
            }}
          />
          {formik.errors.phone && (
            <small className="input-error">{formik.errors.phone}</small>
          )}

          {/* DATES */}
          <label>From</label>
          <input
            type="date"
            name="from"
            value={formik.values.from}
            onChange={formik.handleChange}
          />
          {formik.errors.from && (
            <small className="input-error">{formik.errors.from}</small>
          )}
          <label>To</label>
          <input
            type="date"
            name="to"
            value={formik.values.to}
            onChange={formik.handleChange}
          />
          {formik.errors.to && (
            <small className="input-error">{formik.errors.to}</small>
          )}

          {/* QUANTITY */}
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            min="1"
            value={formik.values.quantity}
            onChange={formik.handleChange}
          />

          {/* DELIVERY */}
          <label>Delivery Area</label>
          <input
            type="text"
            name="delivery"
            placeholder="Delivery Area"
            value={formik.values.delivery}
            onChange={formik.handleChange}
          />
          {formik.errors.delivery && (
            <small className="input-error">{formik.errors.delivery}</small>
          )}

          {/* ADDRESS (NUMBERS ONLY) */}
          <label>Building Address </label>
          <input
            type="text"
            name="address"
            placeholder="Building Address (numbers only)"
            maxLength={30}
            value={formik.values.address}
            onChange={(e) => {
              if (/^[0-9]*$/.test(e.target.value)) {
                formik.setFieldValue("address", e.target.value);
              }
            }}
          />
          {formik.errors.address && (
            <small className="input-error">{formik.errors.address}</small>
          )}
          <label>Note</label>
          <textarea
            name="note"
            rows="2"
            placeholder="Note (optional)"
            value={formik.values.note}
            onChange={formik.handleChange}
          />

          {/* LOCATION */}
          <button
            type="button"
            onClick={getUserLocation}
            className="btn-location"
          >
            📍 Share My Location
          </button>

          {formik.values.latitude && (
            <iframe
              title="map"
              width="100%"
              height="150"
              style={{ border: 0, marginTop: "10px" }}
              loading="lazy"
              src={`https://www.google.com/maps?q=${formik.values.latitude},${formik.values.longitude}&z=15&output=embed`}
            />
          )}

          <button
            type="submit"
            style={{
              marginTop: "15px",
              width: "100%",
              padding: "10px",
              background: "#4E1C10",
              color: "#fff",
              border: "none",
            }}
          >
            Proceed to Payment
          </button>
        </form>
      </div>
    </div>
  );
}
