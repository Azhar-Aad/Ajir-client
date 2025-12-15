import React, { useEffect, useState } from "react";

const BASE_URL = "https://ajir-server-v972.onrender.com";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = "guest"; // later from auth

  useEffect(() => {
    fetch(`${BASE_URL}/orders/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="container mt-5">
        <h4>Loading orders...</h4>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mt-5">
        <h3>No orders saved yet 📦</h3>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Orders</h2>

      {orders.map((order) => (
        <div
          key={order._id}
          className="card mb-4 p-3"
          style={{ borderRadius: "12px" }}
        >
          {/* HEADER */}
          <div className="d-flex justify-content-between">
            <strong>Order ID:</strong> {order._id}
            <span className="badge bg-success">Confirmed</span>
          </div>

          <p className="text-muted">
            Order Date: {new Date(order.orderDate).toLocaleString()}
          </p>

          {/* PRODUCT */}
          <div className="d-flex align-items-center border-bottom py-3">
            <img
              src={order.product.image}
              alt={order.product.name}
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />

            <div style={{ flex: 1, marginLeft: "20px" }}>
              <h5>{order.product.name}</h5>
              <p>Price/day: {order.product.price} OMR</p>
              <p>Quantity: {order.quantity}</p>
            </div>

            <strong>
              {order.product.price * order.quantity} OMR
            </strong>
          </div>

          {/* RENTAL PERIOD */}
          <div className="mt-3">
            <strong>Rental Period:</strong>{" "}
            {order.rentalPeriod.from} → {order.rentalPeriod.to}
          </div>

          {/* DELIVERY */}
          <div className="mt-2">
            <strong>Delivery Area:</strong> {order.deliveryLocation}
            <br />
            <strong>Address:</strong> {order.buildingAddress}
          </div>

          {/* TOTAL */}
          <div className="mt-3">
            <h5>Total Price: {order.total} OMR</h5>
          </div>
        </div>
      ))}
    </div>
  );
}
