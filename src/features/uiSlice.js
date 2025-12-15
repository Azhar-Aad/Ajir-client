import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/*
  UI Slice Responsibilities:
  - Search text
  - Selected category & product
  - Order details
  - Logged-in user
*/

// 🌍 BACKEND URL
const BASE_URL = "https://ajir-server-v972.onrender.com";

/* =====================================================
   ASYNC THUNKS
===================================================== */

// 🔐 LOGIN
export const loginUser = createAsyncThunk(
  "ui/loginUser",
  async (loginData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/login`, {
        email: loginData.email.trim().toLowerCase(), // ✅ FIX
        password: loginData.password,
      });

      // Expected: { id, name, email }
      return res.data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);

// 📝 SIGNUP
export const signupUser = createAsyncThunk(
  "ui/signupUser",
  async (signupData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/signup`, {
        name: signupData.name.trim(),
        email: signupData.email.trim().toLowerCase(), // ✅ FIX
        password: signupData.password,
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Signup failed"
      );
    }
  }
);

/* =====================================================
   INITIAL STATE
===================================================== */

const initialState = {
  // UI
  searchText: "",
  selectedCategory: null,
  selectedProduct: null,

  // ORDER (used by Payment page)
  orderDetails: null,

  // AUTH
  user: null,

  loading: false,
  error: null,
};

/* =====================================================
   SLICE
===================================================== */

const uiSlice = createSlice({
  name: "ui",
  initialState,

  reducers: {
    // 🔍 SEARCH
    setSearchText(state, action) {
      state.searchText = action.payload;
    },

    // 📦 CATEGORY / PRODUCT
    setSelectedCategory(state, action) {
      state.selectedCategory = action.payload;
    },

    setSelectedProduct(state, action) {
      state.selectedProduct = action.payload;
    },

    // 🧾 ORDER
    setOrderDetails(state, action) {
      state.orderDetails = action.payload;
    },

    // 🧹 CLEAR ORDER AFTER SUCCESS
    clearOrder(state) {
      state.orderDetails = null;
    },

    // 🚪 LOGOUT
    logout(state) {
      state.user = null;
      state.orderDetails = null;
      state.selectedProduct = null;
      state.selectedCategory = null;
      state.error = null;
    },

    clearError(state) {
      state.error = null;
    },
  },

  /* =====================================================
     EXTRA REDUCERS
  ===================================================== */

  extraReducers: (builder) => {
    builder
      // 🔐 LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📝 SIGNUP
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

/* =====================================================
   EXPORTS
===================================================== */

export const {
  setSearchText,
  setSelectedCategory,
  setSelectedProduct,
  setOrderDetails,
  clearOrder,
  logout,
  clearError,
} = uiSlice.actions;

export default uiSlice.reducer;
