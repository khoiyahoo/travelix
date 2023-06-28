import { API } from "configs/constants";
import { ChangeRole, FindAll } from "models/admin/user";
import { IVerifySignup, LoginForm, User, RegisterForm, ChangePassForgotForm, UpdateUserProfile, ChangePassword } from "models/user";
import api from "services/configApi";

export class UserService {
  static async getAllUsers(data: FindAll): Promise<any> {
    return await api.get(API.ADMIN.USER.DEFAULT, { params: data })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
  static async changeRole(data: ChangeRole): Promise<any> {
    return await api.put(API.ADMIN.USER.CHANGE_ROLE,data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async delete(id: number): Promise<any> {
    return await api
      .put(API.ADMIN.USER.DELETE.replace(":id", `${id}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}
