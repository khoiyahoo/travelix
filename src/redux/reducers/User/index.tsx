import produce from "immer";
import { User } from "models/user";
import * as types from "./actionTypes";

export interface UserState {
  user?: User,
  verifiedSuccess?: boolean
}

const initial: UserState = {
  user: null,
};

export const userReducer = (state = initial, action: any) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.USER_LOGIN_REDUCER:
        draft.user = action.data;
        break;
      case types.USER_LOGOUT_REDUCER:
        draft.user = null;
        break;
      default:
        return state;
    }
  });
