import { OptionItem } from "./general";

export interface User {
    id: number;
    username: string;
    passWord: string;
    role: number;
    avatar: any;
    firstName: string;
    lastName: string;
    address: string;
    phoneNumber: string;
    introduction: string;
    isDelete: boolean;
    isVerified: boolean;
    enterpriseId?: number;
}

export interface LoginForm {
  username: string,
  password: string,
  role?: number,
}

export interface RegisterForm {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  confirmPassword: string;
  role: number;
  phoneNumber: string;
}
export interface ChangePassForgotForm {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
}

export interface UpdateUserProfile {
  avatar: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
}

export interface ChangePassword {
  userId: number;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export enum EUserType {
  SUPER_ADMIN = 1,  
  ADMIN = 2,
  ENTERPRISE = 3,
  STAFF = 4,
  USER = 5
}

export const adminTypes: OptionItem[] = [
  {
      id: EUserType.ADMIN,
      name: 'Admin'
  },
  {
      id: EUserType.USER,
      name: 'User'
  }
]

export interface IVerifySignup {
  code: string,
  userId: number
}

export interface IUpdateUserBank {
  bankType?: number;
  bankCode?: {
    id?: number;
    name?: string;
  };
  bankName?: {
    id?: number;
    name?:string;
  };
  bankCardNumber?: string;
  bankUserName?: string;
  releaseDate?: Date;
  expirationDate?: Date;
  cvcOrCvv?: string;
  bankEmail?: string;
  bankCountry?: string;
  bankProvinceOrCity?: string;
  bankUserAddress?: string;
}