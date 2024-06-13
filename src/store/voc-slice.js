import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  voc: { eng: [], chi: [], vocAmount: 8 },
  vocDetail: { definition: "", sentence: "" },
  UIstate: {
    onHomePage: false,
    vocRemove: false,
    isClickable: false,
    isChangeable: false,
  },
  vocChange: false,
  vocStorage: [],
};

const vocSlice = createSlice({
  name: "voc",
  initialState,
  reducers: {
    updateVoc(state, action) {
      state.voc.eng = action.payload.eng;
      state.voc.chi = action.payload.chi;
      state.UIstate.isChangeable = false;
    },

    changeToBox(state) {
      state.UIstate.onHomePage = false;
    },

    removeVocFromList(state, action) {
      const selectedWord = action.payload;
      state.UIstate.isClickable = true;
      state.UIstate.vocRemove = true;

      //在主頁就刪掉隨機單字，不在主頁就從BOX刪掉單字
      if (state.UIstate.onHomePage) {
        state.voc.eng = state.voc.eng.filter((voc) => voc !== selectedWord.eng);
        state.voc.chi = state.voc.chi.filter((voc) => voc !== selectedWord.chi);
      } else {
        state.vocStorage = state.vocStorage.filter(
          (voc) => voc.eng !== selectedWord.eng
        );
      }
    },

    store(state, action) {
      const selectedWord = action.payload;
      state.UIstate.isClickable = true;

      //存到firebase
      const newVocArray = [...state.vocStorage, selectedWord];
      state.vocStorage = newVocArray;

      //從HomePage的地方消除
      state.voc.eng = state.voc.eng.filter((voc) => voc !== selectedWord.eng);
      state.voc.chi = state.voc.chi.filter((voc) => voc !== selectedWord.chi);
    },

    recoverClickable(state) {
      state.UIstate.isClickable = false;
      state.UIstate.vocRemove = false;
    },

    changeAmount(state, action) {
      state.voc.vocAmount = action.payload;
      state.UIstate.isChangeable = true;
    },

    changeNewVoc(state) {
      state.vocChange = !state.vocChange;
      state.UIstate.isChangeable = true;
    },

    updateDetail(state, action) {
      state.vocDetail.definition = action.payload.definition;
      state.vocDetail.sentence = action.payload.sentence;
    },

    resetVoc(state) {
      state.UIstate.onHomePage = true;
      state.voc.eng = [];
      state.voc.chi = [];
    },

    replaceVoc(state, action) {
      state.vocStorage = action.payload || [];
    },
  },
});

export const vocActions = vocSlice.actions;
export default vocSlice;
