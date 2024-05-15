import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  voc: { eng: [], chi: [] }, //{eng:["eng","eng"] , chi :["中文","中文"]}
  vocRemove: false,
  vocAmount: 8,
  vocChange: false,
  vocDefinition: "",
  vocSentence: "",
  vocDetail: { definition: "", sentence: "" },
};

const vocSlice = createSlice({
  name: "voc",
  initialState,
  reducers: {
    updateVoc(state, action) {
      state.voc.eng = action.payload.eng;
      state.voc.chi = action.payload.chi;
    },

    removeVocFromList(state, action) {
      const selectedWord = action.payload; //預期會是點到的那個單字資訊，VocObj ={eng:"eng",chi:"單字"}

      state.voc.eng = state.voc.eng.filter((voc) => voc !== selectedWord.eng);
      state.voc.chi = state.voc.chi.filter((voc) => voc !== selectedWord.chi);

      //有改變
      state.vocRemove = true;
    },

    vocRemoveRecover(state) {
      state.vocRemove = false;
    },

    changeAmount(state, action) {
      state.vocAmount = action.payload;
      state.voc.eng = [];
      state.voc.chi = [];
    },

    updateDefinition(state, action) {
      state.vocDefinition = action.payload;
    },

    updateSentence(state, action) {
      state.vocSentence = action.payload;
    },

    changeNewVoc(state) {
      state.voc.eng = [];
      state.voc.chi = [];
      state.vocChange = !state.vocChange;
    },

    updateDetail(state, action) {
      //期望我的action.payload是一個物件
      state.vocDetail.definition = action.payload.definition;
      state.vocDetail.sentence = action.payload.sentence;
    },
  },
});

export const vocActions = vocSlice.actions;
export default vocSlice;