import { createSlice } from "@reduxjs/toolkit";
import { forms } from "shared/modal/auth/constants";
import { roles } from "shared/utils/enum";

const initState: any = {
  showModal: false,
  activeModal: forms.welcome,
  role: roles.reader,
  prevModal: forms.welcome,
};

export const AuthSlice = createSlice({
  name: "auth",
  initialState: initState,
  reducers: {
    setAuthReducer: (state, action) => {
      let tempObj = { ...state, ...action.payload };
      return tempObj;
    },
    resetAuthReducer: () => initState,
  },
});

export const { setAuthReducer, resetAuthReducer } = AuthSlice.actions;

export default AuthSlice.reducer;
