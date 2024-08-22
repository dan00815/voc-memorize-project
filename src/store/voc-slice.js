import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { vocUrl } from "../asset/url";

export const fetchVocData = createAsyncThunk(
  "voc/fetchData",
  async (_, thankAPI) => {
    const token = thankAPI.getState().login.info.token;

    try {
      const res = await axios.get(vocUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const vocData = res.data.data;
      const vocAmount = res.data.vocStorage;

      return { vocData, vocAmount };
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }
);

const initialState = {
  vocDetail: { definition: "", example: "", english: "", chinese: "" },

  status: "idle",
  vocData: [],
  vocAmount: 0,
  editWord: { info: null, tags: [] },
  selectedCardStack: [], //渲染指定類別的單字
  removeIndex: 0,
  tagsInput: "",
};

const vocSlice = createSlice({
  name: "voc",
  initialState,
  reducers: {
    logout(state) {
      state.status = "idle";
      state.vocData = [];
      state.vocAmount = 0;
    },

    removeFromBox(state, action) {
      // 找index是避免呼叫API失敗時要將其放回原本位置
      state.removeIndex = state.selectedCardStack.vocabularies.findIndex(
        (voc) => voc.vocId === action.payload
      );

      // 在selectedCardStack刪除
      state.selectedCardStack.vocabularies =
        state.selectedCardStack.vocabularies.filter(
          (voc) => voc.vocId !== action.payload
        );
    },

    storeVocData(state, action) {
      const NotagIndex = state.vocData.findIndex(
        (stack) => stack.name === "__NoTag"
      );

      if (NotagIndex !== -1) {
        state.vocData = state.vocData.map((stack, index) =>
          index === NotagIndex
            ? {
                ...stack,
                vocabularies: [...stack.vocabularies, action.payload],
              }
            : stack
        );
      }
    },

    cancelRemove(state, action) {
      state.selectedCardStack.splice(state.removeIndex, 0, action.payload);
    },

    // 開modal
    updateDetail(state, action) {
      state.vocDetail.definition = action.payload.definition;
      state.vocDetail.example = action.payload.example;
      state.vocDetail.english = action.payload.english;
      state.vocDetail.chinese = action.payload.chinese;
    },

    updateEditWord(state, action) {
      state.editWord.info = action.payload;
    },

    editVoc(state, action) {
      state.editWord.info = { ...state.editWord.info, ...action.payload };
    },

    // edit立即看到更新後畫面
    storeEdit(state) {
      const editIndex = state.selectedCardStack.vocabularies.findIndex(
        (word) => word.vocId === state.editWord.info.vocId
      );
      state.selectedCardStack.vocabularies.splice(
        editIndex,
        1,
        state.editWord.info
      );
    },

    updateSelectedStack(state, action) {
      state.selectedCardStack = action.payload;
    },

    updateTagsInput(state, action) {
      const inputTags = action.payload.trim();
      state.tagsInput = inputTags;
    },

    updateTags(state, action) {
      const selectedTags = state.vocData
        .filter((stack) =>
          stack.vocabularies.some((voc) => voc.english.includes(action.payload))
        )
        .map((item) => item.name);

      state.editWord.tags = selectedTags;
    },

    // 要直接看到反饋的話，直接把標籤放進editWord的Tags
    addTags(state, action) {
      const tagName = action.payload;
      const includeNoTag = state.editWord.tags.includes("__NoTag");

      if (includeNoTag) {
        state.editWord.tags = [tagName];
      } else state.editWord.tags = [...state.editWord.tags, tagName];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVocData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchVocData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.vocData = action.payload.vocData;
        state.vocAmount = action.payload.vocAmount;
        console.log("更新成功");
      })
      .addCase(fetchVocData.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const vocActions = vocSlice.actions;
export default vocSlice;
