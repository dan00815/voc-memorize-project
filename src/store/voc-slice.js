import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  voc: { english: [], chinese: [], vocAmount: 8, storeIndex: 0 },
  vocDetail: { definition: "", sentence: "", english: "", chinese: "" },
  isChangeable: false,

  UIstate: {
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
  },

  vocChange: false,
  vocStorage: [],
  removeIndex: 0,
  editWord: {},
};

const vocSlice = createSlice({
  name: "voc",
  initialState,
  reducers: {
    updateVoc(state, action) {
      state.voc.english = action.payload.english;
      state.voc.chinese = action.payload.chinese;
      state.isChangeable = false;
    },

    changeAmount(state, action) {
      state.voc.vocAmount = action.payload;
      state.isChangeable = true;
    },

    changeNewVoc(state) {
      state.vocChange = !state.vocChange;
      state.isChangeable = true;
    },

    //移除跟儲存單字
    removeFromHome(state, action) {
      state.voc.english = state.voc.english.filter(
        (voc) => voc !== action.payload.english
      );
      state.voc.chinese = state.voc.chinese.filter(
        (voc) => voc !== action.payload.chinese
      );
    },

    removeFromBox(state, action) {
      state.removeIndex = state.vocStorage.findIndex(
        (word) => word.id === action.payload
      );

      state.vocStorage = state.vocStorage.filter(
        (voc) => voc.id !== action.payload
      );
    },

    updateStoreIndex(state, action) {
      state.voc.storeIndex = state.voc.english.findIndex((word) => {
        return word === action.payload.english;
      });
    },

    storeVocData(state, action) {
      state.vocStorage.push(action.payload);
    },

    // 發API失敗，errorhandle
    cancelStore(state, action) {
      const selectedWord = action.payload;
      state.voc.english.splice(state.voc.storeIndex, 0, selectedWord.english);
      state.voc.chinese.splice(state.voc.storeIndex, 0, selectedWord.chinese);
    },

    cancelRemove(state, action) {
      state.vocStorage.splice(state.removeIndex, 0, action.payload);
    },

    // 開modal跟edit頁面
    updateDetail(state, action) {
      state.vocDetail.definition = action.payload.definition;
      state.vocDetail.sentence = action.payload.sentence;
      state.vocDetail.english = action.payload.english;
      state.vocDetail.chinese = action.payload.chinese;
    },

    updateEditWord(state, action) {
      state.editWord = action.payload;
    },

    editVoc(state, action) {
      state.editWord = { ...state.editWord, ...action.payload };
    },

    storeEdit(state) {
      const editIndex = state.vocStorage.findIndex(
        (word) => word.id === state.editWord.id
      );
      state.vocStorage.splice(editIndex, 1, state.editWord);
    },

    resetVoc(state) {
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
