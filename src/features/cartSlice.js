import { createSlice } from "@reduxjs/toolkit";

// Load saved data
const storedCart = localStorage.getItem("cartItems");
const storedOrders = localStorage.getItem("orders");

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    items: storedCart ? JSON.parse(storedCart) : [],

    // ⭐ Order history
    orders: storedOrders ? JSON.parse(storedOrders) : [],
  },

  reducers: {
    // -------------------------
    // ADD TO CART
    // -------------------------
    addToCart(state, action) {
      const product = action.payload;

      const existingItem = state.items.find(
        (item) => item._id === product._id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }

      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    // -------------------------
    // REMOVE FROM CART
    // -------------------------
    removeFromCart(state, action) {
      state.items = state.items.filter(
        (item) => item._id !== action.payload
      );

      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    // -------------------------
    // CHANGE QUANTITY
    // -------------------------
    changeQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i._id === id);

      if (item && quantity > 0) {
        item.quantity = quantity;
      }

      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    // -------------------------
    // PLACE ORDER ⭐⭐⭐
    // -------------------------
    placeOrder(state, action) {
      const orderDetails = {
        id: Date.now(), // order id
        items: state.items,
        totalPrice: action.payload.totalPrice,
        customer: action.payload.customer,
        date: new Date().toISOString(),
        status: "Confirmed",
      };

      // Save order
      state.orders.push(orderDetails);
      localStorage.setItem("orders", JSON.stringify(state.orders));

      // Clear cart
      state.items = [];
      localStorage.removeItem("cartItems");
    },

    // -------------------------
    // CLEAR CART
    // -------------------------
    clearCart(state) {
      state.items = [];
      localStorage.removeItem("cartItems");
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  changeQuantity,
  placeOrder,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
