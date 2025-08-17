import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  shippingCost: 0, // Added shipping cost to state
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(
        (item) => item._id === action.payload._id
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      // Update shipping cost when items change
      state.shippingCost = calculateShippingCost(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      state.shippingCost = calculateShippingCost(state.items);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item._id === id);
      if (item) {
        item.quantity = quantity;
      }
      state.shippingCost = calculateShippingCost(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      state.shippingCost = 0;
    },
    updateShippingCost: (state, action) => {
      state.shippingCost = action.payload;
    },
  },
});

// Helper function to calculate shipping cost
function calculateShippingCost(items) {
  if (items.length === 0) return 0;
  // Example shipping calculation: $5 base + $1 per item
  return 5 + items.reduce((sum, item) => sum + item.quantity, 0);
}

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
export const selectCartItemCount = (state) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);
export const selectShippingCost = (state) => state.cart.shippingCost;
export const selectCartTotalWithShipping = (state) =>
  selectCartTotal(state) + selectShippingCost(state);

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  updateShippingCost,
} = cartSlice.actions;

export default cartSlice.reducer;
