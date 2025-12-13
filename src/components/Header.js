import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSearchText } from "../features/uiSlice";
import { setWishlist } from "../features/wishlistSlice";
import { User, Heart, ShoppingCart } from "lucide-react";
import { Container } from "reactstrap";
import logo from "../images/logo.png";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ⭐ Redux States
  const searchText = useSelector((state) => state.ui.searchText);
  const wishlistCount = useSelector((state) => state.wishlist.items.length);
  const cartCount = useSelector((state) => state.cart.items.length); // ⭐ ADDED

  const userId = "guest";

  // ⭐ Load Wishlist on Header Mount
  useEffect(() => {
    async function fetchWishlist() {
      try {
        const res = await fetch(`http://localhost:5000/wishlist/${userId}`);
        const data = await res.json();
        dispatch(setWishlist(data));
      } catch (err) {
        console.error("Wishlist load error:", err);
      }
    }
    fetchWishlist();
  }, [dispatch]);

  return (
    <>
      {/* ⭐ TOP BROWN LINE */}
      <div
        style={{
          width: "100%",
          height: "38px",
          backgroundColor: "#4E1C10",
        }}
      ></div>

      {/* MAIN HEADER */}
      <header
        style={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #ddd",
          padding: "10px 0",
        }}
      >
        <Container
          fluid
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* LEFT SIDE */}
          <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
            <Link to="/">
              <img
                src={logo}
                alt="Ajir Logo"
                style={{ height: "60px", width: "60px", cursor: "pointer" }}
              />
            </Link>

            <nav>
              <ul
                style={{
                  display: "flex",
                  gap: "25px",
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  fontSize: "16px",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                <li onClick={() => navigate("/")}>Home</li>
                <li onClick={() => navigate("/admin-login")}>Admin</li>
                <li onClick={() => navigate("/aboutus")}>About Us</li>
              </ul>
            </nav>
          </div>

          {/* SEARCH BAR */}
          <div style={{ flexGrow: 1, maxWidth: "450px", marginLeft: "40px" }}>
            <input
              type="text"
              placeholder="Search..."
              style={{
                width: "100%",
                padding: "10px 15px",
                borderRadius: "30px",
                border: "1px solid #ccc",
                outline: "none",
                fontSize: "15px",
              }}
              value={searchText}
              onChange={(e) => dispatch(setSearchText(e.target.value))}
            />
          </div>

          {/* RIGHT ICONS */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "22px",
              fontSize: "18px",
            }}
          >
            {/* USER */}
            <User
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/profile")}
            />

            {/* WISHLIST */}
            <div
              style={{ position: "relative", cursor: "pointer" }}
              onClick={() => navigate("/wishlist")}
            >
              <Heart />

              {wishlistCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    backgroundColor: "red",
                    color: "white",
                    borderRadius: "50%",
                    padding: "2px 6px",
                    fontSize: "10px",
                    fontWeight: "bold",
                  }}
                >
                  {wishlistCount}
                </span>
              )}
            </div>

            {/* ⭐ CART WITH BADGE ⭐ */}
            <div
              style={{ position: "relative", cursor: "pointer" }}
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart />

              {cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    backgroundColor: "#1A5319",
                    color: "white",
                    borderRadius: "50%",
                    padding: "2px 6px",
                    fontSize: "10px",
                    fontWeight: "bold",
                  }}
                >
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </Container>
      </header>
    </>
  );
}

