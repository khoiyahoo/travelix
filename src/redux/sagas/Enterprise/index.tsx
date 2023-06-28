import { all } from "redux-saga/effects";
import getAllHotels from "./getAllHotels";
import getAllTours from "./getAllTours";

export const enterpriseSagas = function* root() {
  yield all([getAllTours(), getAllHotels()]);
};
