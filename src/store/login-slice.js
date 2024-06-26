import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  info: {
    isAuth: false,
    name: "",
    vocStorage: 0,
  },

  loading: false,
  errorLoginMsg: null,
  errorRegisterMsg: null,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    loading(state) {
      state.loading = true;
    },

    clearLoading(state) {
      state.loading = false;
    },

    updateLoginState(state, action) {
      state.loading = false;

      state.info = action.payload;
    },

    updateLoginError(state, action) {
      state.loading = false;
      state.errorLoginMsg = action.payload;
    },

    updateRegisterError(state, action) {
      state.loading = false;
      state.errorRegisterMsg = action.payload;
    },

    clearError(state) {
      state.errorLoginMsg = null;
      state.errorRegisterMsg = null;
    },

    updateAuth(state, action) {
      state.info.isAuth = action.payload;

      if (state.info.isAuth === false) {
        window.alert("您已經登出");
      }
    },
  },
});

export const loginActions = loginSlice.actions;
export default loginSlice;
