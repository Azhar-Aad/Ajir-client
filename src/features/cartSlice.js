import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🌍 Render backend URL
const BASE_URL = "https://ajir-server.onrender.com";

// -------------------------
// LOAD FROM LOCAL STORAGE
// -------------------------
const storedCart = localStorage.getItem("cartItems");
const storedOrders = localStorage.getItem("orders");

// -------------------------
// ASYNC THUNK: PLACE ORDER
// -------------------------
export const placeOrderToServer = createAsyncThunk(
  "cart/placeOrderToServer",
  async (orderData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/order`, orderData);
      return res.data; // { orderId, message }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Order failed"
      );
    }
  }
);

// -------------------------
// SLICE
// -------------------------
const cartSlice = createSlice({
  name: "cart",

  initialState: {
    items: storedCart ? JSON.parse(storedCart) : [],
    orders: storedOrders ? JSON.parse(storedOrders) : [],

    loading: false,
    error: null,
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
    // CLEAR CART
    // -------------------------
    clearCart(state) {
      state.items = [];
      localStorage.removeItem("cartItems");
    },
  },

  // -------------------------
  // EXTRA REDUCERS (ORDER)
  // -------------------------
  extraReducers: (builder) => {
    builder
      // PLACE ORDER
      .addCase(placeOrderToServer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrderToServer.fulfilled, (state, action) => {
        state.loading = false;

        const orderDetails = {
          id: action.payload.orderId,
          items: state.items,
          date: new Date().toISOString(),
          status: "Confirmed",
        };

        state.orders.push(orderDetails);
        localStorage.setItem("orders", JSON.stringify(state.orders));

        // Clear cart after success
        state.items = [];
        localStorage.removeItem("cartItems");
      })
      .addCase(placeOrderToServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// -------------------------
// EXPORT ACTIONS
// -------------------------
export const {
  addToCart,
  removeFromCart,
  changeQuantity,
  clearCart,
} = cartSlice.actions;

// -------------------------
// EXPORT REDUCER
// -------------------------
export default cartSlice.reducer;
