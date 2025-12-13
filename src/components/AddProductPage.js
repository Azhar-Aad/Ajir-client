import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

const categoryOptions = [
  "Furniture",
  "Fashion",
  "Event Equipment",
  "Cleaning Equipment",
  "Electronics",
];

export default function AddProductPage() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [products, setProducts] = useState([]);

  // Load products
  useEffect(() => {
fetch("https://ajir-server.onrender.com/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  // Delete product
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    const res = await fetch(`https://ajir-server.onrender.com/admin/delete-product/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    alert(data.message);

    setProducts(products.filter((p) => p._id !== id));
  };

  // Validation Schema
  const validationSchema = Yup.object({
    category: Yup.string().required("Category is required"),
    rentalPlace: Yup.string().required("Rental place is required"),
    description: Yup.string().required("Description is required"),

    quantity: Yup.number()
      .typeError("Quantity must be a number")
      .required("Quantity is required")
      .min(1, "Minimum is 1"),

    price: Yup.number()
      .typeError("Price must be a number")
      .required("Price is required")
      .min(1, "Minimum is 1"),
  });

  // Formik
  const formik = useFormik({
    initialValues: {
      category: "",
      rentalPlace: "",
      description: "",
      quantity: "",
      price: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!image) {
        alert("Upload an image");
        return;
      }

      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64Image = reader.result;

        const res = await fetch("https://ajir-server.onrender.com/admin/add-product", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, image: base64Image }),
        });

        const data = await res.json();

        if (res.ok) {
          alert("Product added!");
          setProducts([...products, data.product]);
          formik.resetForm();
          setImage(null);
        } else {
          alert(data.message);
        }
      };

      reader.readAsDataURL(image);
    },
  });

  return (
    <div
      style={{
        display: "flex",
        gap: "30px",
        padding: "40px",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      {/* LEFT SIDE — ADD PRODUCT FORM */}
      <div
        className="add-product-card"
        style={{
          width: "350px",
          background: "#fff",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h2>Add Product</h2>

        <form onSubmit={formik.handleSubmit}>
          {/* CATEGORY */}
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formik.values.category}
            onChange={formik.handleChange}
          >
            <option value="">Select category</option>
            {categoryOptions.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* RENTAL PLACE */}
          <label htmlFor="rentalPlace">Rental place</label>
          <input
            id="rentalPlace"
            name="rentalPlace"
            value={formik.values.rentalPlace}
            onChange={formik.handleChange}
          />

          {/* DESCRIPTION */}
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
          />

          {/* QUANTITY */}
          <label htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            type="number"
            name="quantity"
            value={formik.values.quantity}
            onChange={formik.handleChange}
          />

          {/* PRICE */}
          <label htmlFor="price">Price/day</label>
          <input
            id="price"
            type="number"
            name="price"
            value={formik.values.price}
            onChange={formik.handleChange}
          />

          {/* IMAGE */}
          <label htmlFor="imageUpload">Upload Image</label>
          <input
            id="imageUpload"
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <button type="submit" style={{ marginTop: "15px" }}>
            Add Product
          </button>
        </form>
      </div>

      {/* RIGHT SIDE — PRODUCT LIST */}
      <div style={{ width: "480px" }}>
        <h2>Added Products</h2>

        {products.map((prod) => (
          <div
            key={prod._id}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px",
              background: "#fff",
              marginBottom: "15px",
              borderRadius: "10px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={prod.image}
              alt=""
              style={{
                width: "80px",
                height: "70px",
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />

            <p
              style={{
                flexGrow: 1,
                marginLeft: "15px",
                fontWeight: "600",
              }}
            >
              {prod.category}
            </p>

            <button
              style={{
                background: "#f5a623",
                color: "#fff",
                padding: "6px 12px",
                borderRadius: "5px",
                border: "none",
                marginRight: "10px",
              }}
              onClick={() => navigate(`/admin/edit-product/${prod._id}`)}
            >
              Edit
            </button>

            <button
              style={{
                background: "#d9534f",
                color: "#fff",
                padding: "6px 12px",
                borderRadius: "5px",
                border: "none",
              }}
              onClick={() => deleteProduct(prod._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
