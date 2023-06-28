import createSagaMiddleware from "redux-saga";
import createRootReducer from "./reducers";
import { rootSaga } from "./sagas";
import { configureStore } from "@reduxjs/toolkit";
import middlewares from "./middlewares";
import { createWrapper } from "next-redux-wrapper";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: createRootReducer(),
  middleware: (getDefaultMiddleware) => {
    return [...getDefaultMiddleware({ thunk: false, serializableCheck: false }), sagaMiddleware, ...middlewares()];
  },
  devTools: process.env.NODE_ENV !== "production",
});

export const makeStore = (context) => {

  sagaMiddleware.run(rootSaga);

  return store;
};

export const wrapper = createWrapper(makeStore, {debug: false});
