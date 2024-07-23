import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  notification: null,
  error: { repeatError: null, audioError: null },
  progressBar: 1500,
  audio: false,
  pagintaion: { boxVoc: [], activePage: 1, perPageAmount: 6 },
  spinner: false,
  cardModeToggle: false,
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

    //依照media query的不同，更新分頁器的每頁呈現數量
    updataPerPageAmount(state, action) {
      state.pagintaion.perPageAmount = action.payload;
    },

    spinner(state) {
      state.spinner = true;
    },
    clearSpinner(state) {
      state.spinner = false;
    },

    changeCardMode(state) {
      state.cardModeToggle = !state.cardModeToggle;
    },

    resetCardMode(state) {
      state.cardModeToggle = false;
    },
  },
});

export const uiActions = ulSlice.actions;
export default ulSlice;
