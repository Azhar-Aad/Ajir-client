import React, { useState } from "react";

export default function Admin() {
  const [product, setProduct] = useState({
    category: "",
    place: "",
    description: "",
    quantity: 1,
    price: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImage = (e) => {
    setProduct({ ...product, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Product Added:", product);
  };

  return (
    <div className="admin-page">
      <h2 className="admin-title">Add Product</h2>
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Category:</label>
          <select name="category" value={product.category} onChange={handleChange}>
            <option value="">Select Category</option>
            <option value="Furniture">Furniture</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
          </select>
        </div>

        <div className="form-group">
          <label>Rental Place:</label>
          <select name="place" value={product.place} onChange={handleChange}>
            <option value="">Select Place</option>
            <option value="Muscat">Muscat</option>
            <option value="Nizwa">Nizwa</option>
            <option value="Sohar">Sohar</option>
          </select>
        </div>

        <div className="form-group">
          <label>Product Description:</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            rows="4"
          ></textarea>
        </div>

        <div className="form-row">
          <div className="form-group half">
            <label>Quantity:</label>
            <input
              type="number"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
              min="1"
            />
          </div>

          <div className="form-group half">
            <label>Price per day:</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              placeholder="e.g. 5 OMR"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Upload Image:</label>
          <input type="file" accept="image/*" onChange={handleImage} />
        </div>

        <button type="submit" className="btn-submit">Add</button>
      </form>
    </div>
  );
}
