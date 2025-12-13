import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function WishlistPage() {
  const wishlist = useSelector((state) => state.wishlist.items);

  return (
    <div className="container p-4">
      <h2>Your Wishlist</h2>

      {wishlist.length === 0 ? (
        <h4 className="mt-4">No items added yet.</h4>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {wishlist.map((item) => (
            <div
              key={item._id}
              className="card p-3"
              style={{ borderRadius: "10px" }}
            >
              <img
                src={item.image}
                alt={item.category}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />

              <h5 className="mt-2">{item.category}</h5>
              <p className="text-muted">{item.price} OMR</p>

              {/* ⭐ Correct navigation */}
              <Link to={`/product/${item._id}`} className="btn btn-dark mt-2">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
