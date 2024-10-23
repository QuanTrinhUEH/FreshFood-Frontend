import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/userSlice.js';
import cartReducer from './slice/cartSlice.js';
import authReducer from './slice/authSlice.js';
export const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    auth: authReducer,
  },
});
