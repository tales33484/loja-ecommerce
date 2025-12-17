import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shippingAddress: {},
  shippingValue: 0,
  shippingReady: false, // 👈 CONTROLE DE SEGURANÇA
  billingAddress: {},
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
    },

    saveShippingValue: (state, action) => {
      state.shippingValue = action.payload;
    },

    saveShippingReady: (state, action) => {
      state.shippingReady = action.payload;
    },

    saveBillingAddress: (state, action) => {
      state.billingAddress = action.payload;
    },

    clearCheckout: (state) => {
      state.shippingAddress = {};
      state.shippingValue = 0;
      state.shippingReady = false;
      state.billingAddress = {};
    },
  },
});

export const {
  saveShippingAddress,
  saveShippingValue,
  saveShippingReady,
  saveBillingAddress,
  clearCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
