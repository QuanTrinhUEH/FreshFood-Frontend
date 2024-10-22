import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: [],
  reducers: {
    addToCart: (state, action) => {
      const existingIndex = state.findIndex(item => item.itemName === action.payload.itemName);
      if (existingIndex >= 0) {
        state[existingIndex] = action.payload;
      } else {
        state.push(action.payload);
      }
    },
    removeFromCart: (state, action) => {
      return state.filter(item => item.itemName !== action.payload);
    },
    clearCart: () => [],
    updateQuantity: (state, action) => {
      const { itemName, quantity } = action.payload;
      const item = state.find(item => item.itemName === itemName);
      if (item) {
        item.quantity = quantity;
        item.price = item.originalPrice * quantity;
      }
    },
  },
});

export const { addToCart, removeFromCart, clearCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
