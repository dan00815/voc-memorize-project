import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  onHomePage: false,
  isClickable: false,
  hintState: {
    vocRemove: false,
    removeError: false,
    vocStore: false,
    storeError: false,
    amountError: false,
    registerSuccess: false,
  },
};

const hintSlice = createSlice({
  name: "hint",
  initialState,
  reducers: {
    changeToHome(state) {
      state.onHomePage = true;
    },
    changeToBox(state) {
      state.onHomePage = false;
    },

    removeVoc(state) {
      state.isClickable = true;
      state.hintState.vocRemove = true;
    },

    storeVoc(state) {
      state.isClickable = true;
      state.hintState.vocStore = true;
    },

    registerSuccess(state) {
      state.hintState.registerSuccess = true;
      state.isClickable = true;
    },

    recoverStore(state, action) {
      state.hintState.storeError = action.payload;
    },
    clearStoreError(state) {
      state.hintState.storeError = false;
    },
    recoverRemove(state, action) {
      state.hintState.removeError = action.payload;
    },
    clearRemoveError(state) {
      state.hintState.removeError = false;
    },

    amountError(state) {
      state.hintState.amountError = true;
      state.isClickable = true;
    },

    // 恢復可點擊狀態
    recoverClickable(state) {
      state.isClickable = false;
      state.hintState.vocRemove = false;
      state.hintState.vocStore = false;
      state.hintState.amountError = false;
      state.hintState.registerSuccess = false;
    },
  },
});

export const hintActions = hintSlice.actions;
export default hintSlice;
