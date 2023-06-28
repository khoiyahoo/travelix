import { API } from "configs/constants";
import { IVerifySignup, LoginForm, User, RegisterForm, ChangePassForgotForm, UpdateUserProfile, ChangePassword, IUpdateUserBank } from "models/user";
import api from "./configApi";

export class UserService {
  static async login(data: LoginForm): Promise<any> {
    return await api
      .post(API.AUTH.LOGIN, data)
      .then((res) => {
        return Promise.resolve(res.data.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async getMe(): Promise<User> {
    return await api
      .get(API.AUTH.ME)
      .then((res) => {
        return Promise.resolve(res.data.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async register(data: RegisterForm) {
    return await api
      .post(API.AUTH.REGISTER, data)
      .then((res) => {
        return Promise.resolve(res.data.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async verifySignup(data: IVerifySignup): Promise<any> {
    return await api
      .post(API.AUTH.SEND_VERIFY_SIGNUP, data)
      .then((res) => {
        return Promise.resolve(res.data.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  
  static async reSendEmailVerifySignup(email: string) {
    return await api.put(API.AUTH.RESEND_VERIFY_SIGNUP, { email })
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async sendEmailForgotPassword(email: string) {
    return await api.put(API.AUTH.SEND_EMAIL_FORGOT_PASSWORD, {
      email
    })
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async changePassForgot(data: ChangePassForgotForm) {
    return await api.put(API.AUTH.FORGOT_PASSWORD, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getUserProfile(id: number): Promise<any> {
    return await api.get(API.AUTH.PROFILE.replace(":id", `${id}`))
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async updateUserProfile(id: number, data: UpdateUserProfile): Promise<any> {
    return await api.put(API.USER.UPDATE_PROFILE.replace(":id", `${id}`), data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async changePassword(data: ChangePassword): Promise<any> {
    return await api.put(`${API.USER.CHANGE_PASSWORD}`, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
  
  static async changeLanguage(language: string): Promise<any> {
    return await api.put(API.AUTH.CHANGE_LANGUAGE, {
      language
    })
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async updateBank(id: number, data: IUpdateUserBank): Promise<any> {
    return await api.put(API.USER.UPDATE_BANK.replace(":id", `${id}`), data)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
}
