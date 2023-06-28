import { EUserType } from "models/user";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";
import {
  setAllHotelsReducer,
  setAllToursReducer,
} from "redux/reducers/Enterprise/actionTypes";
import { userLogoutRequest } from "redux/reducers/User/actionTypes";

export default function UseAuth() {
  const { user } = useSelector((state: ReducerType) => state.user);
  const router = useRouter();
  const dispatch = useDispatch();
  const logout = () => {
    router.push("/auth/login");
    dispatch(userLogoutRequest());
    dispatch(setAllToursReducer([]));
    dispatch(setAllHotelsReducer([]));
  };

  return {
    user,
    isLoggedIn: !!user,
    isEnterprise: user?.role === EUserType.ENTERPRISE,
    isAdmin: user?.role === EUserType.ADMIN,
    logout: logout,
  };
}
