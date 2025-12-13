import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  changeQuantity,
  clearCart,
} from "../features/cartSlice";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);

  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="container mt-5">
        <h3>Your cart is empty 🛒</h3>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>My Cart</h2>

      {cartItems.map((item) => (
        <div
          key={item._id}
          className="d-flex align-items-center justify-content-between border-bottom py-3"
        >
          {/* IMAGE */}
          <img
            src={item.image}
            alt={item.category}
            style={{
              width: "90px",
              height: "90px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />

          {/* DETAILS */}
          <div style={{ flex: 1, marginLeft: "20px" }}>
            <h5>{item.category}</h5>
            <p className="text-muted">{item.rentalPlace}</p>
            <p>
              <strong>{item.price} OMR / day</strong>
            </p>
          </div>

          {/* QUANTITY */}
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-dark"
              onClick={() =>
                dispatch(
                  changeQuantity({
                    id: item._id,
                    quantity: item.quantity - 1,
                  })
                )
              }
              disabled={item.quantity <= 1}
            >
              -
            </button>

            <strong>{item.quantity}</strong>

            <button
              className="btn btn-outline-dark"
              onClick={() =>
                dispatch(
                  changeQuantity({
                    id: item._id,
                    quantity: item.quantity + 1,
                  })
                )
              }
            >
              +
            </button>
          </div>

          {/* ITEM TOTAL */}
          <div style={{ width: "120px", textAlign: "center" }}>
            <strong>{item.price * item.quantity} OMR</strong>
          </div>

          {/* REMOVE */}
          <button
            className="btn btn-danger"
            onClick={() => dispatch(removeFromCart(item._id))}
          >
            Remove
          </button>
        </div>
      ))}

      {/* SUMMARY */}
      <div className="mt-4">
        <h5>Total items: {totalItems}</h5>
        <h4>Total price: {totalPrice} OMR</h4>
      </div>

      {/* ACTIONS */}
      <div className="mt-3 d-flex gap-3">
        <button
          className="btn btn-secondary"
          onClick={() => dispatch(clearCart())}
        >
          Clear Cart
        </button>

        <button
          className="btn btn-dark"
          onClick={() => navigate("/order")}
        >
          Proceed to Order
        </button>
      </div>
    </div>
  );
}
