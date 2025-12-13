import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

// Mock Login Component
jest.mock("./components/Login", () => ({ onLoginSuccess, onSwitchToSignup }) => (
  <div>
    <h1>Login Page</h1>
    <button data-testid="login-success" onClick={onLoginSuccess}>
      Login Success
    </button>
    <button data-testid="go-signup" onClick={onSwitchToSignup}>
      Go to Signup
    </button>
  </div>
));

// Mock Signup Component
jest.mock("./components/SignUp", () => ({ onSignupSuccess, onSwitchToLogin }) => (
  <div>
    <h1>Signup Page</h1>
    <button data-testid="go-login" onClick={onSwitchToLogin}>
      Go to Login
    </button>
  </div>
));

// Mock Main App Components
jest.mock("./components/Header", () => () => <div>Header</div>);
jest.mock("./components/Footer", () => () => <div>Footer</div>);
jest.mock("./components/Home", () => () => <div>Home Page</div>);

describe("App Component Tests", () => {
  test("renders Login page initially", () => {
    render(<App />);
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  test("switches to Signup page when clicking Go to Signup", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("go-signup"));
    expect(screen.getByText("Signup Page")).toBeInTheDocument();
  });

  test("switches back to Login when clicking Go to Login on Signup", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("go-signup"));
    fireEvent.click(screen.getByTestId("go-login"));
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  test("shows main app (Header + Home + Footer) after login success", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("login-success"));

    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Home Page")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });
});
