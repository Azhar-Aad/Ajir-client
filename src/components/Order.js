import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setOrderDetails } from "../features/uiSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";


export default function Order() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();
  const product = location.state?.product;

  const user = useSelector((state) => state.ui.user);

  // ---------------- VALIDATION ----------------
  const validationSchema = Yup.object({
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^[0-9]{8,12}$/, "Enter a valid phone number"),

    from: Yup.date().required("Start date is required"),
    to: Yup.date()
      .required("End date is required")
      .min(Yup.ref("from"), "End date must be after start date"),

    delivery: Yup.string().required("Delivery area is required"),
    address: Yup.string().required("Address is required"),

    quantity: Yup.number().min(1).required("Quantity is required"),

    latitude: Yup.number().required("Please share your location"),
    longitude: Yup.number().required("Please share your location"),
  });

  // ---------------- FORMIK ----------------
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      civilId: "",
      from: moment().format("YYYY-MM-DD"),
      to: moment().format("YYYY-MM-DD"),
      delivery: "",
      address: "",
      note: "",
      quantity: 1,
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

  // ---------------- AUTO FILL USER ----------------
  useEffect(() => {
    if (user) {
      formik.setFieldValue("name", user.name);
      formik.setFieldValue("email", user.email);
    }
    // eslint-disable-next-line
  }, [user]);

  // ---------------- GET LOCATION ----------------
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

  // ---------------- UI ----------------
  return (
    <div className="order-page">
      <div className="order-container" style={{ maxWidth: "520px", margin: "auto" }}>
        <h3 style={{ textAlign: "center" }}>Order Details</h3>

        {/* PRODUCT */}
        <div className="order-product-summary" style={{ display: "flex", gap: "10px" }}>
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

        <form onSubmit={formik.handleSubmit} className="order-form">

          <input value={formik.values.name} readOnly placeholder="Full Name" />
          <input value={formik.values.email} readOnly placeholder="Email" />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formik.values.phone}
            onChange={formik.handleChange}
          />
          {formik.errors.phone && <small className="input-error">{formik.errors.phone}</small>}

          <input
            type="date"
            name="from"
            value={formik.values.from}
            onChange={formik.handleChange}
          />

          <input
            type="date"
            name="to"
            value={formik.values.to}
            onChange={formik.handleChange}
          />

          <input
            type="number"
            name="quantity"
            min="1"
            placeholder="Quantity"
            value={formik.values.quantity}
            onChange={formik.handleChange}
          />

          <input
            type="text"
            name="delivery"
            placeholder="Delivery Area"
            value={formik.values.delivery}
            onChange={formik.handleChange}
          />

          <input
            type="text"
            name="address"
            placeholder="Building Address"
            value={formik.values.address}
            onChange={formik.handleChange}
          />

          <textarea
            name="note"
            rows="2"
            placeholder="Note (optional)"
            value={formik.values.note}
            onChange={formik.handleChange}
          />

          {/* LOCATION UI (SMALL & FRIENDLY) */}
          <div style={{ marginTop: "10px" }}>
           <button
  type="button"
  onClick={getUserLocation}
  className="btn-location"
>
  📍 Share My Location
</button>

           

            {formik.values.latitude && (
              <div
                style={{
                  marginTop: "8px",
                  padding: "8px",
                  background: "#f6f6f6",
                  borderRadius: "6px",
                  textAlign: "center",
                  fontSize: "13px",
                }}
              >
                <br />
               
                <iframe
                  title="map"
                  width="100%"
                  height="150"
                  style={{ border: 0, marginTop: "6px" }}
                  loading="lazy"
                  src={`https://www.google.com/maps?q=${formik.values.latitude},${formik.values.longitude}&z=15&output=embed`}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            style={{
              marginTop: "12px",
              width: "100%",
              padding: "10px",
              color:'#f6f6f6',
              background:"#4E1C10"
            }}
              className="form-control"

          >
            Proceed to Payment
          </button>
        </form>
      </div>
    </div>
  );
}
