import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  info: {
    isLogin: false,
    name: "",
    token: null,
  },

  firstLogin: false,
  registerInfo: false,
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

      if (state.info.isLogin === false) {
        window.alert("您已經登出");
      }
    },

    //註冊成功的通知與清除
    registerInfo(state) {
      state.registerInfo = true;
    },
    clearInfo(state) {
      state.registerInfo = false;
    },
  },
});

export const loginActions = loginSlice.actions;
export default loginSlice;
