import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import loginSlice from "./reducers/loginSlice";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import authModalSlice from "./reducers/authModalSlice";
import cartSlice from "./reducers/cartSlice";
import searchSlice from "./reducers/searchSlice";
import planSlice from "./reducers/planModalSlice";
import breadCrumbSlice from "./reducers/breadCrumbSlice";
import sidebarSlice from "./reducers/sideBarSlice";

const createNoopStorage = () => {
  return {
    getItem(_key: any) {
      return Promise.resolve(null);
    },
    setItem(_key: any, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: any) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const rootReducer = combineReducers({
  login: loginSlice,
  auth: authModalSlice,
  cart: cartSlice,
  search: searchSlice,
  plan: planSlice,
  breadcrumb: breadCrumbSlice,
  sidebar: sidebarSlice,
});

const persistConfig: any = {
  key: "root",
  storage: storage,
  whitelist: ["login", "cart", "breadcrumb"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store: any = configureStore({
  reducer: {
    root: persistedReducer,
  },
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

export { store, persistor };
