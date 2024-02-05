import { createSlice } from "@reduxjs/toolkit";

const initState: any = {
  showModal: false,
  reachLimit: false,
};

export const planSlice = createSlice({
  name: "plan",
  initialState: initState,
  reducers: {
    setShowPlanModal: (state, action) => {
      let tempObj = { ...state, ...action.payload };
      return tempObj;
    },
    resetPlanReducer: () => initState,
  },
});

export const { setShowPlanModal, resetPlanReducer } = planSlice.actions;

export default planSlice.reducer;
