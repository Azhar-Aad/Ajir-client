// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Row, Col } from "reactstrap";

// export default function AdminProductsPage() {
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);

//   // Load products
//   useEffect(() => {
//     fetch("http://localhost:5000/products")
//       .then((res) => res.json())
//       .then((data) => setProducts(data));
//   }, []);

//   // Delete product
//   const deleteProduct = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this product?")) return;

//     const res = await fetch(`http://localhost:5000/admin/delete-product/${id}`, {
//       method: "DELETE",
//     });

//     const data = await res.json();
//     alert(data.message);

//     // Refresh list
//     setProducts(products.filter((p) => p._id !== id));
//   };

//   return (
//     <div className="page-center">
//       <div className="product-list-card">
//         <h2 style={{ marginBottom: "20px", color: "#4E1C10" }}>Products</h2>

//         {products.length === 0 ? (
//           <p style={{ textAlign: "center", color: "#777" }}>No products found.</p>
//         ) : (
//           products.map((prod) => (
//             <Row
//               key={prod._id}
//               className="product-item"
//               style={{
//                 border: "1px solid #ddd",
//                 borderRadius: "10px",
//                 padding: "15px",
//                 marginBottom: "15px",
//                 background: "#fff",
//                 alignItems: "center",
//               }}
//             >
//               {/* Product Image */}
//               <Col md="3" sm="4" xs="12" style={{ textAlign: "center" }}>
//                 <img
//                   src={prod.image}
//                   alt={prod.productName}
//                   className="mini-product-image"
//                   style={{
//                     width: "120px",
//                     height: "120px",
//                     objectFit: "cover",
//                     borderRadius: "8px",
//                   }}
//                 />
//               </Col>

//               {/* Product Info */}
//               <Col md="5" sm="8" xs="12">
//                 <p
//                   className="product-name"
//                   style={{
//                     fontWeight: "600",
//                     fontSize: "18px",
//                     marginBottom: "4px",
//                     color: "#4E1C10",
//                   }}
//                 >
//                   {prod.productName}
//                 </p>
//                 <p style={{ margin: 0, color: "#666" }}>
//                   <strong>Category:</strong> {prod.category}
//                 </p>
//                 <p style={{ margin: 0, color: "#666" }}>
//                   <strong>Price/day:</strong> {prod.price} OMR
//                 </p>
//               </Col>

//               {/* Actions */}
//               <Col
//                 md="4"
//                 sm="12"
//                 className="product-actions"
//                 style={{ textAlign: "right" }}
//               >
//                 <button
//                   className="edit-btn"
//                   onClick={() => navigate(`/admin/edit-product/${prod._id}`)}
//                   style={{
//                     background: "#e0b85a",
//                     color: "#4E1C10",
//                     padding: "8px 16px",
//                     borderRadius: "6px",
//                     border: "none",
//                     cursor: "pointer",
//                     marginRight: "10px",
//                     fontWeight: "600",
//                   }}
//                 >
//                   Edit
//                 </button>

//                 <button
//                   className="delete-btn"
//                   onClick={() => deleteProduct(prod._id)}
//                   style={{
//                     background: "#c0392b",
//                     color: "#fff",
//                     padding: "8px 16px",
//                     borderRadius: "6px",
//                     border: "none",
//                     cursor: "pointer",
//                     fontWeight: "600",
//                   }}
//                 >
//                   Delete
//                 </button>
//               </Col>
//             </Row>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }
