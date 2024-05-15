import { configureStore } from "@reduxjs/toolkit";

import ulSlice from "./ui-slice";
import vocSlice from "./voc-slice";
import dictiSlice from "./dictionary-slice";

const store = configureStore({
  reducer: {
    ui: ulSlice.reducer,
    voc: vocSlice.reducer,
    dictionary: dictiSlice.reducer,
  },
});

export default store;
