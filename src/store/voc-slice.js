import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  voc: { english: [], chinese: [], vocAmount: 8, deleteIndex: 0 },
  vocDetail: { definition: "", sentence: "" },
  UIstate: {
    onHomePage: false,
    vocRemove: false,
    isClickable: false,
    isChangeable: false,
  },
  vocChange: false,
  vocStorage: [],
  token: null,
};

const vocSlice = createSlice({
  name: "voc",
  initialState,
  reducers: {
    updateVoc(state, action) {
      state.voc.english = action.payload.english;
      state.voc.chinese = action.payload.chinese;
      state.UIstate.isChangeable = false;
    },

    changeToBox(state) {
      state.UIstate.onHomePage = false;
    },

    removeVocFromList(state, action) {
      const selectedWord = action.payload;
      state.UIstate.isClickable = true;
      state.UIstate.vocRemove = true;

      if (state.UIstate.onHomePage) {
        state.voc.english = state.voc.english.filter(
          (voc) => voc !== selectedWord.english
        );
        state.voc.chinese = state.voc.chinese.filter(
          (voc) => voc !== selectedWord.chinese
        );
      } else {
        state.vocStorage = state.vocStorage.filter(
          (voc) => voc.english !== selectedWord
        );
      }
    },

    store(state, action) {
      const selectedWord = action.payload;
      state.UIstate.isClickable = true;

      state.voc.deleteIndex = state.voc.english.findIndex(
        (word) => word === selectedWord.english
      );

      //從HomePage的地方消除
      state.voc.english = state.voc.english.filter(
        (voc) => voc !== selectedWord.english
      );
      state.voc.chinese = state.voc.chinese.filter(
        (voc) => voc !== selectedWord.chinese
      );
    },

    reverseDelete(state, action) {
      const selectedWord = action.payload;

      state.voc.english.splice(state.voc.deleteIndex, 0, selectedWord.english);
      state.voc.chinese.splice(state.voc.deleteIndex, 0, selectedWord.chinese);
    },

    storeNewVocData(state, action) {
      state.vocStorage.push(action.payload);
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
      state.voc.english = [];
      state.voc.chinese = [];
    },

    replaceVoc(state, action) {
      state.vocStorage = action.payload;
    },
  },
});

export const vocActions = vocSlice.actions;
export default vocSlice;
