import { all } from "redux-saga/effects";
import { enterpriseSagas } from "./Enterprise";
import { userSagas } from "./User";


// Register all your watchers
export const rootSaga = function* root() {
  yield all([userSagas(), enterpriseSagas()]);
  
};
