import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Login from "../Login";

const mockStore = configureStore([]);

describe("Login Component Tests", () => {
  let store;
  let mockOnSuccess;
  let mockOnSwitch;

  beforeEach(() => {
    store = mockStore({
      ui: { user: null },
    });

    mockOnSuccess = jest.fn();
    mockOnSwitch = jest.fn();

    // Mock fetch success response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({
          user: {
            id: 1,
            name: "Test User",
            email: "test@example.com",
          },
        }),
      })
    );
  });

  const renderLogin = () =>
    render(
      <Provider store={store}>
        <Login onLoginSuccess={mockOnSuccess} onSwitchToSignup={mockOnSwitch} />
      </Provider>
    );

  test("renders email, password, and login button", () => {
    renderLogin();

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("shows validation errors when submitting empty form", async () => {
    renderLogin();

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  test("submits form and triggers onLoginSuccess", async () => {
    renderLogin();

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "mypassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });

    const actions = store.getActions();
    expect(actions[0].type).toBe("ui/setUser");
    expect(actions[0].payload.email).toBe("test@example.com");
  });

  test("calls onSwitchToSignup when clicking Sign up", () => {
    renderLogin();

    const link = screen.getByText(/sign up/i);
    fireEvent.click(link);

    expect(mockOnSwitch).toHaveBeenCalled();
  });

  // 📌 Snapshot Test
  test("matches snapshot", () => {
    const { asFragment } = renderLogin();
    expect(asFragment()).toMatchSnapshot();
  });
});
