import { combineReducers } from "redux";
import { StatusState, statusReducer } from "./Status";
import { userReducer, UserState } from "./User";
import { enterpriseReducer, EnterpriseState } from "./Enterprise";
import { normalReducer, NormalState } from "./Normal";

const createRootReducer = () => {
  const reducers = combineReducers({
    status: statusReducer,
    user: userReducer,
    enterprise: enterpriseReducer,
    normal: normalReducer,
  });
  return reducers;
};

export interface ReducerType {
  status: StatusState;
  user: UserState;
  enterprise: EnterpriseState;
  normal: NormalState;
}

export default createRootReducer;
