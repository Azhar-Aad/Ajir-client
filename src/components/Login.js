import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { setUser } from "../features/uiSlice";

import logo from "../images/logo.png";
import bgImage from "../images/pattern.png";
import "../index.css";

export default function Login({ onLoginSuccess, onSwitchToSignup }) {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),

    onSubmit: async (values) => {
      try {
        const res = await fetch("http://localhost:5000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await res.json();

        if (res.ok) {
          dispatch(
            setUser({
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
            })
          );

          onLoginSuccess();
        } else {
          alert(data.message);
        }
      } catch (err) {
        alert("Network error. Please try again.");
      }
    },
  });

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-logo-wrapper">
          <img src={logo} alt="Ajir Logo" className="login-logo-top" />
        </div>

        <div className="login-content">
          <h2 className="login-title">Welcome back!</h2>
          <p className="login-subtitle">
            Enter your credentials to access your account
          </p>

          <form onSubmit={formik.handleSubmit} className="login-form">

            {/* EMAIL */}
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              data-testid="email-input"
              type="email"
              name="email"
              placeholder="Enter your email"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="input-error">{formik.errors.email}</p>
            )}

            {/* PASSWORD */}
            <label htmlFor="password">Password</label>
            <input
              id="password"
              data-testid="password-input"
              type="password"
              name="password"
              placeholder="Enter your password"
              {...formik.getFieldProps("password")}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="input-error">{formik.errors.password}</p>
            )}

            <button
              type="submit"
              data-testid="login-button"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Logging in..." : "Login"}
            </button>

            <div className="login-divider">or</div>

            <p className="login-footer">
              Don’t have an account?{" "}
              <span
                className="login-link"
                data-testid="signup-switch"
                onClick={onSwitchToSignup}
              >
                Sign up
              </span>
            </p>
          </form>
        </div>
      </div>

      <div
        className="login-right"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>
    </div>
  );
}

// Default props for safety
Login.defaultProps = {
  onLoginSuccess: () => {},
  onSwitchToSignup: () => {},
};
