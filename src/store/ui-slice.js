import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  notification: null,
  error: null,
  repeatError: null,
  progressBar: 1500,
};

const ulSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    showNotification(state, action) {
      state.notification = {
        status: action.payload.status,
        title: action.payload.title,
      };
    },

    showError(state, action) {
      state.error = {
        status: action.payload.status,
        message: action.payload.msg,
      };
    },

    clearError(state) {
      state.error = null;
    },

    showRepeatError(state, action) {
      state.repeatError = action.payload;
    },
    clearRepeatError(state) {
      state.repeatError = null;
    },

    ProgressEvent(state) {
      state.progressBar = state.progressBar - 150;
    },

    recoverProgress(state) {
      state.progressBar = 1500;
    },
  },
});
//1500

export const uiActions = ulSlice.actions;
export default ulSlice;
