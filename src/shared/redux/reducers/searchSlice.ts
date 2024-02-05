import { createSlice } from "@reduxjs/toolkit";

const initState: any = {
  search: "",
};

export const searchSlice = createSlice({
  name: "search",
  initialState: initState,
  reducers: {
    setSearchSlice: (state, action) => {
      let tempObj = { ...state, ...action.payload };
      return tempObj;
    },
    resetSearchSlice: () => initState,
  },
});

export const { setSearchSlice, resetSearchSlice } = searchSlice.actions;

export default searchSlice.reducer;
