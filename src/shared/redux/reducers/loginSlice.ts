import { createSlice } from "@reduxjs/toolkit";
import { kidAccountRole } from "shared/utils/enum";

const initState: any = {
  user: {},
  currentLevel: null,
  currentPlan: null,
  remainingCoins: null,
  token: null,
  isLoggedIn: false,
  kidRole: kidAccountRole.individual,
  endpoint: "",
};

export const userSlice = createSlice({
  name: "loginUser",
  initialState: initState,
  reducers: {
    setLoginUser: (state, action) => {
      let tempObj = { ...state, ...action.payload };
      return tempObj;
    },
    resetLoginUser: () => initState,
  },
});

export const { setLoginUser, resetLoginUser } = userSlice.actions;

export default userSlice.reducer;
