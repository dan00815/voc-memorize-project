import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  show: false,
  word: {
    eng: "",
    chi: "",
    definition: null,
    translateDefi: null,
    sentence: null,
    translateSen: null,
  },
  hasResult: false,
  error: null,
};

const dictiSlice = createSlice({
  name: "dictionary",
  initialState,
  reducers: {
    showDictionary(state) {
      if (state.show === false) {
        state.hasResult = false;
        state.error = null;
        state.word.eng = "";
      }

      state.show = !state.show;
    },

    updatedWord(state, action) {
      state.error = null;
      state.word = {
        eng: action.payload.eng,
        chi: action.payload.chi,
        definition: action.payload.definition,
        translateDefi: action.payload.translateDefi,
        sentence: action.payload.sentence,
        translateSen: action.payload.translateSen,
      };

      state.hasResult = true;
    },

    clearResult(state) {
      state.hasResult = false;
    },

    errorHandle(state) {
      state.word.eng = "";
      state.hasResult = false;
      state.error = true;
    },

    resetDictionary(state) {
      state.show = false;
      state.word.eng = "";
      state.hasResult = false;
      state.error = null;
    },
  },
});

export const dictiActions = dictiSlice.actions;
export default dictiSlice;
