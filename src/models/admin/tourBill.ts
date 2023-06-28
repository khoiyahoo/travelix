import { Tour, TourPrice } from "models/tour";
import { IParticipantInfo } from "models/tourBill";
import { User } from "models/user";

export enum ESortTourBillOption {
    LOWEST_REVENUE = 0,
    HIGHEST_REVENUE = 1,
  }
  export enum ERefundStatusOption {
    NOT_REFUND_YET = 0,
    REFUNDED= 1,
  }

export interface StatisticByUser {
    take: number;
    page: number;
    month: number;
    year: number;
    keyword?: string;
    sort?: number; //ESortTourBillOption
  }
  export interface StatisticByTour {
    take: number;
    page: number;
    month: number;
    year: number;
    keyword?: string;
  }
  export interface StatisticByTourOnSale {
    take: number;
    page: number;
    month: number;
    year: number;
  }

  export interface StatisticAllTourOnSale {
    take: number;
    page: number;
    keyword?: string;
    month: number;
    year: number;
    isReceivedRevenue: boolean;
  }
  export interface GetAllBillOfOneTourOnSale {
    take: number;
    page: number;
  }
  
  export interface IStatisticByUser {
    enterpriseInfo?: User;
    totalAmountAdult: number;
    totalAmountChild: number;
    numberOfBookings: number;
    revenue: number;
    commission: number;
  }

  export interface IStatisticByTour {
    tourInfo?: Tour;
    totalAmountAdult: number;
    totalAmountChild: number;
    numberOfBookings: number;
    revenue: number;
    commission: number;
  }

  export interface IStatisticByTourOnSale {
    tourOnSaleInfo?: TourPrice;
    totalAmountAdult: number;
    totalAmountChild: number;
    numberOfBookings: number;
    revenue: number;
    commission: number;
  }

  export interface IStatisticTourBill {
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



  export const sortRevenueOption = [
    { id: 0, name: "LOWEST REVENUE", value: -1, translation: "common_select_all" },
    { id: 1, name: "LOWEST REVENUE", value: ESortTourBillOption.LOWEST_REVENUE, translation: "admin_management_section_tour_bill_sort_option_title_lowest_revenue" },
    { id: 2, name: "HIGHEST REVENUE", value: ESortTourBillOption.HIGHEST_REVENUE, translation: "admin_management_section_tour_bill_sort_option_title_highest_revenue"},
  ]

  export interface FindAllOrderNeedRefund {
    take: number;
    page: number;
    month: number;
    year: number;
    refundStatus: number;         // refundStatus === -1  --> All
  }                               // refundStatus === 0   --> Not refunded yet
                                  // refundStatus === 1   --> Refunded

  export const refundStatusOption = [
    { id: 0, name: "ALL", value: -1, translation: "common_select_all" },
    { id: 1, name: "NOT REFUND YET", value: ERefundStatusOption.NOT_REFUND_YET, translation: "admin_management_section_tour_bill_sort_option_title_refund_yet" },
    { id: 2, name: "REFUND", value: ERefundStatusOption.REFUNDED, translation: "admin_management_section_tour_bill_sort_option_title_refund"},
  ]                         