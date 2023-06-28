import { Tour, TourPrice } from "models/tour";
import { IParticipantInfo } from "models/tourBill";

export interface Filter {
  isPast: boolean;
}

export interface FindAll {
  take: number;
  page: number;
  keyword?: string;
  tourId: number; // tourId === -1  --> All
  tourOnSaleIds: number[]; // [-1] --> All
  status: number; // tourId === -1  --> All    -   EBillStatus
}

export interface TourBill {
  id?: number;
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
  email?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  specialRequest?: string;
}
export interface FindAllStaffBill {
  take: number;
  page: number;
  month: number;
  year: number;
  tourId: number;         // tourId === -1  --> All
  status: number;         // status === -1  --> All    -   EBillStatus
}
export interface UpdateStatus {
  status: number;
}

export interface StatisticAll {
  take: number;
  page: number;
  keyword?: string;
  month: number;
  year: number;
}

export interface StatisticTourOnSale {
  take: number;
  page: number;
}


export interface ITourStatistic {
  tourId: number;
  numberOfBookings: number;
  totalAmountChild: number;
  totalAmountAdult: number;
  revenue: number;
  commission: number;
  tourInfo: Tour;
}

export interface ITourOnSaleStatistic {
  tourId: number;
  numberOfBookings: number;
  totalAmountChild: number;
  totalAmountAdult: number;
  revenue: number;
  commission: number;
  tourOnSaleInfo: TourPrice;
}
