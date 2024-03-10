import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const product = action.payload;
      const existingIndex = state.cart.findIndex(
        (item) => item._id === product._id
      );
      if (existingIndex !== -1) {
        state.cart[existingIndex].orderedQuantity += 1;
      } else {
        state.cart.push({ ...product, orderedQuantity: 1 });
      }
    },
    decreaseQuantity(state, action) {
      const product = action.payload;
      const existingIndex = state.cart.findIndex(
        (item) => item._id === product._id
      );
      if (existingIndex !== -1) {
        if (state.cart[existingIndex].orderedQuantity > 1) {
          state.cart[existingIndex].orderedQuantity -= 1;
        } else {
          state.cart.splice(existingIndex, 1);
        }
      }
    },
    clearCart(state, action) {
      state.cart = [];
    },
  },
});

export const { addToCart, decreaseQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
