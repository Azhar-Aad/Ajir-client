import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/uiSlice";
import { useNavigate } from "react-router-dom";
import { Container } from "reactstrap";

export default function Profile() {
  const user = useSelector((state) => state.ui.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Container style={{ padding: "40px", textAlign: "center" }}>
        <h3>You are not logged in</h3>
      </Container>
    );
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    window.location.reload(); // reset app state
  };

  return (
    <Container style={{ maxWidth: "500px", marginTop: "40px" }}>
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "30px",
          textAlign: "center",
        }}
      >
        <h2>👤 My Profile</h2>
        <hr />

        <p>
          <strong>Name:</strong> {user.name}
        </p>

        <p>
          <strong>Email:</strong> {user.email}
        </p>

        <button
          onClick={handleLogout}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#4E1C10",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </Container>
  );
}
