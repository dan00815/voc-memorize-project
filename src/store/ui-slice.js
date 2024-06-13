import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  notification: null,
  error: { amountError: null, repeatError: null, audioError: null },
  isClickable: false,
  progressBar: 1500,
  audio: false,
  pagintaion: { boxVoc: [], activePage: 1, perPageAmount: 6 },
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

    showAmountError(state, action) {
      state.isClickable = true;
      state.error.amountError = action.payload;
    },

    clearAmountError(state) {
      state.isClickable = false;
      state.error.amountError = null;
    },

    showRepeatError(state, action) {
      state.error.repeatError = action.payload;
    },

    clearRepeatError(state) {
      state.error.repeatError = null;
    },

    showAudioError(state, action) {
      state.error.audioError = action.payload;
    },

    clearAudioError(state) {
      state.error.audioError = null;
    },

    ProgressEvent(state) {
      state.progressBar = state.progressBar - 150;
    },

    recoverProgress(state) {
      state.progressBar = 1500;
    },

    openAudio(state) {
      state.audio = true;
    },
    closeAudio(state) {
      state.audio = false;
    },

    updatedActivePage(state, action) {
      state.pagintaion.activePage = action.payload;
    },

    updatePageVoc(state, action) {
      state.pagintaion.boxVoc = action.payload;
    },
  },
});

export const uiActions = ulSlice.actions;
export default ulSlice;
