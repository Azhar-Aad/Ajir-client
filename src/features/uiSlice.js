import { createSlice } from "@reduxjs/toolkit";

/*
  UI Slice Responsibilities:
  - Search text
  - Selected category & product
  - Order details
  - Logged-in user (profile info)
*/

const initialState = {
  searchText: "",
  selectedProduct: null,
  selectedCategory: null,
  orderDetails: null,

  // ⭐ Logged-in user object
  // { id, name, email }
  user: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,

  reducers: {
    // -----------------------
    // SEARCH
    // -----------------------
    setSearchText(state, action) {
      state.searchText = action.payload;
    },

    // -----------------------
    // CATEGORY / PRODUCT
    // -----------------------
    setSelectedCategory(state, action) {
      state.selectedCategory = action.payload;
    },

    setSelectedProduct(state, action) {
      state.selectedProduct = action.payload;
    },

    // -----------------------
    // ORDER
    // -----------------------
    setOrderDetails(state, action) {
      state.orderDetails = action.payload;
    },

    // -----------------------
    // AUTH / USER
    // -----------------------
    setUser(state, action) {
      state.user = action.payload; // ⭐ save logged user
    },

    logout(state) {
      state.user = null;
      state.orderDetails = null;
      state.selectedProduct = null;
      state.selectedCategory = null;
    },
  },
});

// -----------------------
// EXPORT ACTIONS
// -----------------------
export const {
  setSearchText,
  setSelectedCategory,
  setSelectedProduct,
  setOrderDetails,
  setUser,
  logout,
} = uiSlice.actions;

// -----------------------
// EXPORT REDUCER
// -----------------------
export default uiSlice.reducer;
