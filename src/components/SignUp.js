import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import logo from "../images/logo.png";
import bgImage from "../images/pattern.png";
import "../index.css";

export default function Signup({ onSignupSuccess, onSwitchToLogin }) {
  // ---------------------------------------------------
  // ⭐ FULL YUP VALIDATION SCHEMA (Strong & Professional)
  // ---------------------------------------------------
  const validationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(30, "Name cannot exceed 30 characters")
      .required("Name is required"),

    email: Yup.string()
      .trim()
      .email("Enter a valid email address")
      .required("Email is required"),

    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .max(20, "Password cannot exceed 20 characters")
      .matches(/[A-Z]/, "Must contain at least 1 uppercase letter")
      .matches(/[a-z]/, "Must contain at least 1 lowercase letter")
      .matches(/[0-9]/, "Must contain at least 1 number")
      .matches(/[@$!%*?&#]/, "Must contain at least 1 special character")
      .required("Password is required"),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords do not match")
      .required("Confirm your password"),

    agree: Yup.bool().oneOf(
      [true],
      "You must agree to the Terms & Policy"
    ),
  });

  // ---------------------------------------------------
  // ⭐ FORMIK
  // ---------------------------------------------------
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agree: false,
    },

    validationSchema: validationSchema,

    onSubmit: async (values) => {
      try {
        const response = await fetch("https://ajir-server-v972.onrender.com/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            password: values.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data.message);
          return;
        }

        onSignupSuccess();
      } catch (err) {
        console.error("Signup Error:", err);
        alert("Something went wrong!");
      }
    },
  });

  // ---------------------------------------------------
  // ⭐ UI OUTPUT
  // ---------------------------------------------------
  return (
    <div className="login-container">
      {/* LEFT SIDE */}
      <div className="login-left">
        <div className="login-logo-wrapper">
          <img src={logo} alt="Ajir Logo" className="login-logo-top" />
        </div>

        <div className="login-content">
          <h2 className="login-title">Get Started Now</h2>

          <form onSubmit={formik.handleSubmit} className="login-form">
            {/* NAME */}
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              {...formik.getFieldProps("name")}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="input-error">{formik.errors.name}</p>
            )}

            {/* EMAIL */}
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="input-error">{formik.errors.email}</p>
            )}

            {/* PASSWORD */}
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              {...formik.getFieldProps("password")}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="input-error">{formik.errors.password}</p>
            )}

            {/* CONFIRM PASSWORD */}
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Enter your password again"
              {...formik.getFieldProps("confirmPassword")}
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <p className="input-error">{formik.errors.confirmPassword}</p>
              )}

            {/* CHECKBOX */}
            <div className="checkbox-row">
              <input
                type="checkbox"
                name="agree"
                {...formik.getFieldProps("agree")}
              />
              <span>I agree to the terms & policy</span>
            </div>
            {formik.touched.agree && formik.errors.agree && (
              <p className="input-error">{formik.errors.agree}</p>
            )}

            <button type="submit">Signup</button>

            <div className="login-divider">or</div>

            {/* SWITCH TO LOGIN */}
            <p className="login-footer">
              Already have an account?{" "}
              <span className="login-link" onClick={onSwitchToLogin}>
                Sign in
              </span>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div
        className="login-right"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>
    </div>
  );
}
