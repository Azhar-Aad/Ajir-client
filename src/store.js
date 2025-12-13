import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./features/uiSlice";
import wishlistReducer from "./features/wishlistSlice";
import cartReducer from "./features/cartSlice";


const store = configureStore({
  reducer: {
    ui: uiReducer,
    wishlist: wishlistReducer,
    cart: cartReducer,


  },
});

export default store;
