import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toggleWishlist } from "../features/wishlistSlice"; // ✅ FIX

import { Heart } from "lucide-react";

const BASE_URL = "https://ajir-server.onrender.com";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const wishlist = useSelector((state) => state.wishlist.items);
  const cartItems = useSelector((state) => state.cart.items);

  const [product, setProduct] = useState(null);

  // TEMP USER
  const userId = "guest";

  // ---------------- LOAD PRODUCT ----------------
  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await axios.get(`${BASE_URL}/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Load error:", err);
      }
    }
    loadProduct();
  }, [id]);

  const isInWishlist = wishlist.some((p) => p._id === id);
  const isInCart = cartItems.some((p) => p._id === id);

  // ---------------- ORDER ----------------
  const handleOrder = () => {
    navigate("/order", { state: { product } });
  };

  // ---------------- TOGGLE WISHLIST ----------------
  const handleToggleWishlist = () => {
    dispatch(toggleWishlist({ userId, productId: id }));
  };


  if (!product) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-5">
      <div className="row">
        {/* IMAGE */}
        <div className="col-md-5 text-center">
          <img
            src={product.image}
            alt={product.category}
            style={{
              width: "100%",
              height: "360px",
              objectFit: "cover",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          />
        </div>

        {/* DETAILS */}
        <div className="col-md-7">
          <h3
            style={{
              color: "#8C1C13",
              fontWeight: "700",
              marginBottom: "15px",
              fontSize: "26px",
            }}
          >
            {product.category}
          </h3>

          <div style={{ lineHeight: "1.9", fontSize: "16px" }}>
            <p><strong>Rental place:</strong> {product.rentalPlace}</p>
            <p><strong>Status:</strong> Available</p>
            <p><strong>Price/day:</strong> {product.price} OMR</p>
          </div>

          {/* DESCRIPTION */}
          <div style={{ marginTop: "20px" }}>
            <strong style={{ fontSize: "17px" }}>Product description:</strong>
            <ul style={{ marginTop: "8px", paddingLeft: "18px" }}>
              {product.description.split("\n").map((line, index) => (
                <li key={index}>{line}</li>
              ))}
            </ul>
          </div>

          {/* ACTIONS */}
          <div className="mt-4 d-flex align-items-center gap-4">
            <button
              onClick={handleOrder}
              className="btn px-4 py-2"
              style={{
                borderRadius: "8px",
                backgroundColor: "#8C1C13",
                border: "none",
                color: "white",
                fontSize: "16px",
              }}
            >
              Order
            </button>

            {/* WISHLIST */}
            <div
              onClick={handleToggleWishlist}
              style={{ cursor: "pointer" }}
            >
              <Heart
                size={32}
                color={isInWishlist ? "red" : "#B92B27"}
                fill={isInWishlist ? "red" : "none"}
                strokeWidth={2.2}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
