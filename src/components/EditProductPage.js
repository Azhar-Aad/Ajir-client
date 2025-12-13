import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState("");
  const [newImage, setNewImage] = useState(null);

  // Load existing product
  useEffect(() => {
    fetch("http://localhost:5000/products/" + id)
      .then((res) => res.json())
      .then((data) => {
        formik.setValues({
          category: data.category,
          rentalPlace: data.rentalPlace,
          description: data.description,
          quantity: data.quantity,
          price: data.price,
        });
        setCurrentImage(data.image);
      });
  }, [id]);

  // Validation
  const validationSchema = Yup.object({
    category: Yup.string().required(),
    rentalPlace: Yup.string().required(),
    description: Yup.string().required(),
    quantity: Yup.number().required().min(1),
    price: Yup.number().required().min(1),
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
      let finalImage = currentImage;

      if (newImage) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          finalImage = reader.result;
          submitUpdate(values, finalImage);
        };
        reader.readAsDataURL(newImage);
      } else {
        submitUpdate(values, finalImage);
      }
    },
  });

  // Submit update request
  const submitUpdate = async (values, img) => {
    const res = await fetch("http://localhost:5000/admin/update-product/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, image: img }),
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) navigate("/admin/add-product"); // ⭐ redirect to Add Product page
  };

  return (
    <div className="page-center">
      <div className="add-product-card" style={{ maxWidth: "450px" }}>
        <h2>Edit Product</h2>

        <form onSubmit={formik.handleSubmit}>

          {/* Category */}
          <label>Category</label>
          <select name="category" value={formik.values.category} onChange={formik.handleChange}>
            <option value="">Select</option>
            <option value="Furniture">Furniture</option>
            <option value="Fashion">Fashion</option>
            <option value="Tools">Tools</option>
            <option value="Event Equipment">Event Equipment</option>
            <option value="Electronics">Electronics</option>
            <option value="Sport Equipment">Sport Equipment</option>
            <option value="Photography Equipment">Photography Equipment</option>
            <option value="Cleaning Equipment">Cleaning Equipment</option>
          </select>

          {/* Rental Place */}
          <label>Rental Place</label>
          <input
            type="text"
            name="rentalPlace"
            value={formik.values.rentalPlace}
            onChange={formik.handleChange}
          />

          {/* Description */}
          <label>Description</label>
          <textarea
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            rows="4"
          />

          {/* Quantity */}
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formik.values.quantity}
            onChange={formik.handleChange}
          />

          {/* Price */}
          <label>Price (OMR/day)</label>
          <input
            type="number"
            name="price"
            value={formik.values.price}
            onChange={formik.handleChange}
          />

          {/* Current Image */}
          <label>Current Image</label>
          <img
            src={currentImage}
            style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "10px" }}
          />

          {/* New Image */}
          <label>Upload New Image (Optional)</label>
          <input type="file" onChange={(e) => setNewImage(e.target.files[0])} />

          <button type="submit" style={{ marginTop: "20px" }}>
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
}
