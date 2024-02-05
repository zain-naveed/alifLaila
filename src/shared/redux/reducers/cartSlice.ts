import { createSlice } from "@reduxjs/toolkit";

const initState: any = {
  count: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState: initState,
  reducers: {
    setCartSlice: (state, action) => {
      let tempObj = { ...state, ...action.payload };
      return tempObj;
    },
    resetCart: () => initState,
  },
});

export const { setCartSlice, resetCart } = cartSlice.actions;

export default cartSlice.reducer;
