import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🌍 Render backend URL
const BASE_URL = "https://ajir-server-v972.onrender.com";

// -----------------------
// ASYNC THUNKS
// -----------------------

// GET WISHLIST FOR USER
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/wishlist/${userId}`);
      return res.data; // array of products
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch wishlist"
      );
    }
  }
);

// TOGGLE WISHLIST (ADD / REMOVE)
export const toggleWishlist = createAsyncThunk(
  "wishlist/toggleWishlist",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/wishlist/toggle`, {
        userId,
        productId,
      });
      return res.data; // updated wishlist
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Wishlist update failed"
      );
    }
  }
);

// -----------------------
// INITIAL STATE
// -----------------------
const initialState = {
  items: [],
  loading: false,
  error: null,
};

// -----------------------
// SLICE
// -----------------------
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,

  reducers: {
    clearWishlist(state) {
      state.items = [];
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // FETCH WISHLIST
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // TOGGLE WISHLIST
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

// -----------------------
// EXPORT ACTIONS
// -----------------------
export const { clearWishlist } = wishlistSlice.actions;

// -----------------------
// EXPORT REDUCER
// -----------------------
export default wishlistSlice.reducer;
