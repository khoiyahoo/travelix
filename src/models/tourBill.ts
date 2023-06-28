import { TourPrice } from "./tour";
import { Tour } from "./tour";

export interface Create {
  tourId: number;
  tourOnSaleId: number;
  amountChild: number;
  amountAdult: number;
  price: number;
  discount: number;
  totalBill: number;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
}
export interface IParticipantInfo {
  fullName: string;
  phoneNumber: string;
}
export interface Update {
  paymentStatus?: number;
  participantsInfo?: IParticipantInfo[];

}

export interface ReSchedule {
  tourId: number;
  tourOnSaleId: number;
  amountChild: number;
  amountAdult: number;
  price: number;
  moneyRefund: number;
  extraPay: number;
  discount: number;
  totalBill: number;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
}

export interface Cancel {
  moneyRefund: number;
}
export interface FindAll {
  take: number;
  page: number;
  keyword?: string;
}

export interface TourBill {
  id?:number;
  tourOnSaleId?: number;
  amountChild?: number;
  amountAdult?: number;
  price?: number;
  discount?: number;
  totalBill?: number;
  tourData?: Tour;
  createdAt?: Date;
  tourOnSaleData?: TourPrice;
  participantsInfo?: IParticipantInfo[];
  status?: number;
  paymentStatus?: number;
  isRefunded?: boolean;
  email?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  specialRequest?: string;
  oldBillData?: TourBill;
  oldBillId?: number;
  extraPay?: number;
  moneyRefund?: number;
}

export interface IVerifyBookTour {
  code: string;
  billId: number;
}

export interface IToursRevenueByMonth {
  tourIds: number[];
  month: number;
  year: number;
}

export interface IToursRevenueByYear {
  tourIds: number[];
  year: number;
}

export interface EGetAllTourBillsAnyDate {
  tourIds: number[];
  date: Date;
}