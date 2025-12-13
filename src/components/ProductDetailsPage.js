import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { setWishlist } from "../features/wishlistSlice";
import { addToCart } from "../features/cartSlice";
import { Heart } from "lucide-react";   // ⭐ ICON IMPORT

export default function ProductDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const wishlist = useSelector((state) => state.wishlist.items);
  const cartItems = useSelector((state) => state.cart.items);

  const [product, setProduct] = useState(null);
  const userId = "guest";

  // ⭐ Load product details
  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`http://localhost:5000/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Load error:", err);
      }
    }
    loadProduct();
  }, [id]);

  const isInWishlist = wishlist.some((p) => p._id === id);
  const isInCart = cartItems.some((p) => p._id === id);

  // ⭐ Navigate to order page
  const handleOrder = () => {
    navigate("/order", { state: { product } });
  };

  // ⭐ Toggle wishlist
  const toggleWishlist = async () => {
    try {
      const res = await fetch("http://localhost:5000/wishlist/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId: id }),
      });

      const updated = await res.json();
      dispatch(setWishlist(updated));
    } catch (err) {
      console.error("Wishlist Error:", err);
    }
  };

  // ⭐ Add to cart
  const handleAddCart = () => {
    dispatch(addToCart(product));
    alert("Added to Cart!");
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="container mt-5">
      <div className="row">

        {/* LEFT SIDE IMAGE */}
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

        {/* RIGHT SIDE DETAILS */}
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
            <p><strong>Product status:</strong> Available</p>
            <p><strong>Price/day:</strong> {product.price} OMR</p>
          </div>

          {/* DESCRIPTION */}
          <div style={{ marginTop: "20px" }}>
            <strong style={{ fontSize: "17px" }}>Product description:</strong>

            <ul
              style={{
                marginTop: "8px",
                paddingLeft: "18px",
                lineHeight: "1.7",
              }}
            >
              {product.description.split("\n").map((line, index) => (
                <li key={index}>{line}</li>
              ))}
            </ul>
          </div>

          {/* BUTTONS */}
          <div className="mt-4 d-flex flex-wrap gap-4">

            {/* ⭐ ORDER BUTTON */}
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

           {/* ⭐ WISHLIST ICON BUTTON (NO CIRCLE) */}
<div
  onClick={toggleWishlist}
  style={{
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "0.2s ease",
  }}
>
  <Heart
    size={32}
    color={isInWishlist ? "red" : "#B92B27"}
    fill={isInWishlist ? "red" : "none"}
    strokeWidth={2.2}
    style={{ transition: "0.2s ease" }}
  />
</div>

            

          </div>
        </div>
      </div>
    </div>
  );
}
