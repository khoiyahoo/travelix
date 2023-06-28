import { EUserType } from "models/user";

export interface FindAll {
    take: number;
    page: number;
    keyword?: string;
  }

export interface ChangeRole {
    userId: number;
    role: EUserType;
}

export interface User {
    id?:number;
    address?: string;
    username: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: number;
    isDeleted?: boolean;
}