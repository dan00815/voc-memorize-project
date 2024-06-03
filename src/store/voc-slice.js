import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  voc: { eng: [], chi: [], onHomePage: false },
  vocRemove: false,
  isClickable: false,
  vocAmount: 8,
  vocChange: false,
  isChangeable: false,
  vocDetail: { definition: "", sentence: "" },
  vocStorage: [], //voc: [{eng:"",chi:"中文"} , {eng:"",chi:"中文"}, {eng:"",chi:"中文"}]
};

const vocSlice = createSlice({
  name: "voc",
  initialState,
  reducers: {
    updateVoc(state, action) {
      state.voc.eng = action.payload.eng;
      state.voc.chi = action.payload.chi;

      state.isChangeable = false;
    },

    changeToHome(state) {},

    changeToBox(state) {
      state.voc.onHomePage = false;
    },

    removeVocFromList(state, action) {
      const selectedWord = action.payload;
      state.isClickable = true;
      state.vocRemove = true;

      if (state.voc.onHomePage) {
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
      state.isClickable = true;

      //存到firebase
      const newVocArray = [...state.vocStorage, selectedWord];
      state.vocStorage = newVocArray;

      //從HomePage的地方消除
      state.voc.eng = state.voc.eng.filter((voc) => voc !== selectedWord.eng);
      state.voc.chi = state.voc.chi.filter((voc) => voc !== selectedWord.chi);
    },

    recoverClickable(state) {
      state.isClickable = false;
      state.vocRemove = false;
    },

    changeAmount(state, action) {
      state.vocAmount = action.payload;
      state.isChangeable = true;
    },

    changeNewVoc(state) {
      state.vocChange = !state.vocChange;
      state.isChangeable = true;
    },

    updateDetail(state, action) {
      state.vocDetail.definition = action.payload.definition;
      state.vocDetail.sentence = action.payload.sentence;
    },

    resetVoc(state) {
      state.voc.onHomePage = true;
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
