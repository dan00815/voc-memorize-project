import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  vocData: [],
  storeIndex: 0,
};

const homeVocSlice = createSlice({
  name: "homeVoc",
  initialState,
  reducers: {
    updateVocData(state, action) {
      state.vocData = action.payload;
    },

    store(state, action) {
      const selectedVoc = state.vocData.find(
        (word) => word.data.english === action.payload
      );

      if (selectedVoc.remember === true) {
        selectedVoc.remember = false;
      }

      selectedVoc.store = true;
    },

    removeStoreTag(state, action) {
      const selectedVoc = state.vocData.find(
        (word) => word.data.english === action.payload
      );
      selectedVoc.store = false;
    },

    remember(state, action) {
      const selectedVoc = state.vocData.find(
        (word) => word.data.english === action.payload
      );

      if (selectedVoc.remember) {
        selectedVoc.remember = false;
      } else {
        selectedVoc.remember = true;
      }
    },

    updateStoreIndex(state, action) {
      state.storeIndex = state.vocData.findIndex(
        (word) => word.data.english === action.payload
      );
    },

    // 發API失敗，errorhandle
    cancelStore(state, action) {
      const selectedWord = action.payload;
      state.vocData.splice(state.storeIndex, 0, selectedWord);
    },
  },
});

export const homeVocActions = homeVocSlice.actions;
export default homeVocSlice;
