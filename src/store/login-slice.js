import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  info: {
    isAuth: false,
    name: "",
    vocStorage: 0,
  },

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

    logout(state, action) {
      state.info.isAuth = action.payload;

      if (state.info.isAuth === false) {
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
