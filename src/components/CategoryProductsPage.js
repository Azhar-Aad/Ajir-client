import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function CategoryProductsPage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`https://ajir-server.onrender.com/products/category/${name}`)
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [name]);

  return (
    <div className="product-section">
      <h2 className="home-title">{name}</h2>

      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="product-grid">
        {products.length === 0 ? (
          <p>No products added in this category yet.</p>
        ) : (
          products.map((prod) => (
            <div
              key={prod._id}
              className="product-card"
              onClick={() => navigate(`/product/${prod._id}`)}
            >
              <img src={prod.image} className="product-image" />
              <h4>{prod.category}</h4>
              <p>{prod.price} OMR / day</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
