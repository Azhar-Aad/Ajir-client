import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { categories } from "../data/categories";
import { setSelectedCategory } from "../features/uiSlice";

import banner3 from "../images/b4.png";

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { searchText } = useSelector((state) => state.ui);

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="home">

      {/* ------------------ Banner ------------------ */}
      <div className="single-banner">
        <img src={banner3} alt="Ajir Banner" className="single-banner-image" />
      </div>

      {/* ------------------ Categories ------------------ */}
      <h2 className="home-title">Explore Categories</h2>
      <p className="home-subtitle">
        Choose a category to discover opportunities that match your interests.
      </p>

      <div className="category-list">
        {filteredCategories.map((cat) => (
          <div
            key={cat.id}
            className="category-card"
            onClick={() => navigate(`/category/${cat.name}`)}
          >
            <div className="category-icon">
              <cat.icon size={36} color="#4E1C10" />
            </div>
            <h4>{cat.name}</h4>
            <p>{cat.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
