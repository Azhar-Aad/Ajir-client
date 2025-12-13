import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// COMPONENTS
import Header from "./components/Header";
import Home from "./components/Home";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Signup from "./components/SignUp";
import Order from "./components/Order";
import Payment from "./components/Payment";
import OrderSuccess from "./components/OrderSuccess";
import AdminLogin from "./components/AdminLogin";
import AddProductPage from "./components/AddProductPage";
import AboutUs from "./components/AboutUs";
import WishlistPage from "./components/WishlistPage";
import CategoryProductsPage from "./components/CategoryProductsPage";
import ProductDetailsPage from "./components/ProductDetailsPage";
import EditProductPage from "./components/EditProductPage";
import Profile from "./components/Profile";
import OrdersPage from "./components/OrdersPage";
// GLOBAL CSS
import "./index.css";

// BOOTSTRAP
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <Router>
      <div className="app-container">
        {!isLoggedIn ? (
          // -------------------------
          // LOGIN / SIGNUP MODE
          // -------------------------
          showSignup ? (
            <Signup
              onSignupSuccess={() => setShowSignup(false)}
              onSwitchToLogin={() => setShowSignup(false)}
            />
          ) : (
            <Login
              onLoginSuccess={() => setIsLoggedIn(true)}
              onSwitchToSignup={() => setShowSignup(true)}
            />
          )
        ) : (
          // -------------------------
          // MAIN APP (AFTER LOGIN)
          // -------------------------
          <>
            <Header />

            <main className="main-content">
              <Routes>

                {/* ADMIN SECTION */}
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/admin/add-product" element={<AddProductPage />} />
                <Route path="/admin/edit-product/:id" element={<EditProductPage />} />

                {/* MAIN PAGES */}
                <Route path="/" element={<Home />} />
                <Route path="/aboutus" element={<AboutUs />} />

                {/* PRODUCTS */}
                <Route path="/category/:name" element={<CategoryProductsPage />} />
                <Route path="/product/:id" element={<ProductDetailsPage />} />

                {/* ORDER FLOW */}
                <Route path="/order" element={<Order />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/success" element={<OrderSuccess />} />

                {/* WISHLIST */}
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders" element={<OrdersPage />} />




              </Routes>
            </main>
<br/>
            <Footer />
          </>
        )}
      </div>
    </Router>
  );
}
