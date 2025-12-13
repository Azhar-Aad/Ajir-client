import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setOrderDetails } from "../features/uiSlice";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function Order() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ⭐ Get product from navigation state
  const location = useLocation();
  const product = location.state?.product;

  const user = useSelector((state) => state.ui.user);

  // ⭐ Validation Schema
  const validationSchema = Yup.object({
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^[0-9]{8,12}$/, "Enter a valid phone number"),
    civilId: Yup.string().nullable(),
    from: Yup.date().required("Start date is required"),
    to: Yup.date()
      .required("End date is required")
      .min(Yup.ref("from"), "End date must be after start date"),
    delivery: Yup.string().required("Delivery location is required"),
    address: Yup.string().required("Address is required"),
    quantity: Yup.number()
      .required("Quantity is required")
      .min(1, "Minimum quantity is 1"),
  });

  // ⭐ Formik BEFORE any conditional returns
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      civilId: "",
      from: new Date().toISOString().split("T")[0],
      to: new Date().toISOString().split("T")[0],
      delivery: "",
      address: "",
      note: "",
      quantity: 1,
    },
    validationSchema,
    onSubmit: (values) => {
      if (!product) {
        alert("Error: No product selected!");
        return;
      }

      const orderData = {
        ...values,
        product,
        total: product.price * values.quantity + 5 + 2,
      };

      dispatch(setOrderDetails(orderData));
      navigate("/payment");
    },
  });

  // ⭐ Auto-fill name & email (hook BEFORE conditional return)
  useEffect(() => {
    if (user) {
      formik.setFieldValue("name", user.name);
      formik.setFieldValue("email", user.email);
    }
    // eslint-disable-next-line
  }, [user]);

  // ⭐ Now we can safely conditionally return
  if (!product) {
    return (
      <div className="order-page">
        <p className="no-product">⚠ No product selected.</p>
      </div>
    );
  }

  return (
    <div className="order-page">
      <div className="order-container">
        <h2 className="order-title">Order</h2>

        <div className="order-product-summary">
          <img
            src={product.image}
            alt={product.category}
            className="order-product-image"
          />
          <div>
            <h4>{product.category}</h4>
            <p>Price/day: {product.price} OMR</p>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit} className="order-form">

          <label>Full Name</label>
          <input type="text" value={formik.values.name} readOnly />

          <label>Email</label>
          <input type="email" value={formik.values.email} readOnly />

          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
          />
          {formik.touched.phone && formik.errors.phone && (
            <p className="input-error">{formik.errors.phone}</p>
          )}

          <label>Civil ID</label>
          <input
            type="text"
            name="civilId"
            value={formik.values.civilId}
            onChange={formik.handleChange}
          />

          <label>Rental From</label>
          <input
            type="date"
            name="from"
            value={formik.values.from}
            onChange={formik.handleChange}
          />

          <label>To</label>
          <input
            type="date"
            name="to"
            value={formik.values.to}
            onChange={formik.handleChange}
          />

          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            min="1"
            value={formik.values.quantity}
            onChange={formik.handleChange}
          />

          <label>Delivery Location</label>
          <input
            type="text"
            name="delivery"
            value={formik.values.delivery}
            onChange={formik.handleChange}
          />

          <label>Building Address</label>
          <input
            type="text"
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
          />

          <label>Note</label>
          <textarea
            name="note"
            rows="2"
            value={formik.values.note}
            onChange={formik.handleChange}
          ></textarea>

          <button type="submit" className="btn-proceed">
            Proceed to Payment
          </button>
        </form>
      </div>
    </div>
  );
}
