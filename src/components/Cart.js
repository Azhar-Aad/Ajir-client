import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  changeQuantity,
  clearCart,
} from "../features/cartSlice";
import { Container } from "reactstrap";

export default function Cart() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <Container style={{ padding: "40px" }}>
      <h2>🛒 My Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item._id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid #ddd",
                padding: "15px 0",
              }}
            >
              {/* PRODUCT INFO */}
              <div>
                <h5>{item.name}</h5>
                <p>Quantity: {item.quantity}</p>
              </div>

              {/* QUANTITY CONTROLS */}
              <div>
                <button
                  onClick={() =>
                    dispatch(
                      changeQuantity({
                        id: item._id,
                        quantity: item.quantity - 1,
                      })
                    )
                  }
                  disabled={item.quantity === 1}
                >
                  −
                </button>

                <span style={{ margin: "0 10px" }}>
                  {item.quantity}
                </span>

                <button
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

              {/* REMOVE */}
              <button
                style={{
                  backgroundColor: "#8C1C13",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  cursor: "pointer",
                }}
                onClick={() => dispatch(removeFromCart(item._id))}
              >
                Remove
              </button>
            </div>
          ))}

          {/* CART SUMMARY */}
          <div style={{ marginTop: "30px" }}>
            <h4>Total items: {totalItems}</h4>

            <button
              style={{
                marginTop: "15px",
                padding: "10px 20px",
                backgroundColor: "#4E1C10",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => dispatch(clearCart())}
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
    </Container>
  );
}
