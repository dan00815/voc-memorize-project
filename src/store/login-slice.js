import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  info: {
    isLogin: false,
    name: "",
    token: null,
  },

  firstLogin: false,
  errorLoginMsg: null,
  errorRegisterMsg: null,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    updateLoginState(state, action) {
      state.info = action.payload;
      state.firstLogin = true;
    },

    firstLoginToTrue(state) {
      state.firstLogin = true;
    },

    firstLoginToFalse(state) {
      state.firstLogin = false;
    },

    updateLoginError(state, action) {
      state.errorLoginMsg = action.payload;
    },
    updateRegisterError(state, action) {
      state.errorRegisterMsg = action.payload;
    },

    clearError(state) {
      state.errorLoginMsg = null;
      state.errorRegisterMsg = null;
    },

    logout(state) {
      state.info.isLogin = false;
      state.info.token = null;
    },
  },
});

export const loginActions = loginSlice.actions;
export default loginSlice;
