import { createSlice } from "@reduxjs/toolkit";

const initState: any = {
  isShown: true,
};

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: initState,
  reducers: {
    setSidebarStatus: (state, action) => {
      let tempObj = { ...state, ...action.payload };
      return tempObj;
    },
    resetSidebarStatus: () => initState,
  },
});

export const { setSidebarStatus, resetSidebarStatus } = sidebarSlice.actions;

export default sidebarSlice.reducer;
