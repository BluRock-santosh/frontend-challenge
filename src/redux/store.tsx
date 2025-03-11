import { combineReducers, configureStore } from "@reduxjs/toolkit";
import certificateSlice from "./certificateSlice";

const rootReducer = combineReducers({
  [certificateSlice.name]: certificateSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
