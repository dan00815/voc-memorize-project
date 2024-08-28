import { configureStore, combineReducers } from "@reduxjs/toolkit";

import ulSlice from "./ui-slice";
import vocSlice from "./voc-slice";
import dictiSlice from "./dictionary-slice";
import loginSlice from "./login-slice";
import hintSlice from "./hint-slice";
import homeVocSlice from "./homePageVoc.slice";

import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer, PERSIST } from "redux-persist";

const rootReducer = combineReducers({
  ui: ulSlice.reducer,
  voc: vocSlice.reducer,
  dictionary: dictiSlice.reducer,
  login: loginSlice.reducer,
  hint: hintSlice.reducer,
  homeVoc: homeVocSlice.reducer,
});

//login slice會永久儲存在localstorage
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["login"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [PERSIST],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };
