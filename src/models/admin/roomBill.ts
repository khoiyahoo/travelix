import { Room } from "models/room";
import { User } from "models/user";

export enum ESortRoomBillOption {
    LOWEST_REVENUE = 0,
    HIGHEST_REVENUE,
  }
  export enum ERefundStatusOption {
    NOT_REFUND_YET = 0,
    REFUNDED= 1,
  }
  export const sortRevenueOption = [
    { id: 0, name: "LOWEST REVENUE", value: -1, translation: "common_select_all" },
    { id: 1, name: "LOWEST REVENUE", value: ESortRoomBillOption.LOWEST_REVENUE, translation: "admin_management_section_tour_bill_sort_option_title_lowest_revenue" },
    { id: 2, name: "HIGHEST REVENUE", value: ESortRoomBillOption.HIGHEST_REVENUE, translation: "admin_management_section_tour_bill_sort_option_title_highest_revenue"},
  ]
  export interface StatisticAllUsers {
    take: number;
    page: number;
    month: number;
    year: number;
    keyword?: string;
    sort?: number; //ESortRoomBillOption
  }
  
  export interface StatisticOneUser {
    take: number;
    page: number;
    keyword?: string;
    month: number;
    year: number;
  }
  
  export interface StatisticOneStay {
    take: number;
    page: number;
    month: number;
    year: number;
  }
  
  export interface StatisticOneRoom {
    month: number;
    year: number;
  }


  export interface ListRoomDetails {
    commission:number;
    numberOfBookings: number;
    revenue: number;
    totalNumberOfRoom: number;
  }

  export interface IStatisticAllUser {
    id?: number;
    username: string;
    address: string;
    phoneNumber: string;
    listRoomBillDetails: ListRoomDetails[];
    createdAt: Date;
  }

  export interface StayInfo {
    id?: number;
    name?: string;
    type?: number;
  }

  export interface IStatisticOneUser {
    commission:number;
    numberOfBookings: number;
    revenue: number;
    totalNumberOfRoom: number;
    stayInfo: StayInfo;
  }

  export interface IStatisticOneStay {
    commission:number;
    numberOfBookings: number;
    revenue: number;
    totalNumberOfRoom: number;
    roomInfo: Room;
  }

  export interface IStatisticOneRoom {
    commission:number;
    numberOfBookings: number;
    revenue: number;
    totalNumberOfRoom: number;
    bookedDate: Date;
  }

  export interface FindAllOrderNeedRefund {
    take: number;
    page: number;
    month: number;
    year: number;
    refundStatus: number;         // refundStatus === -1  --> All
  }                               // refundStatus === 0   --> Not refunded yet
                                  // refundStatus === 1   --> Refunded
export interface FindAllStayRevenue {
  take: number;
  page: number;
  keyword?: string; // stay name
  month: number;
  year: number;
  section: number; // 1, 2
  isReceivedRevenue: boolean;
}
export enum ESectionRevenue {
  SECTION_ONE = 1,
  SECTION_TWO = 2,
}

  export const refundStatusOption = [
    { id: 0, name: "ALL", value: -1, translation: "common_select_all" },
    { id: 1, name: "NOT REFUND YET", value: ERefundStatusOption.NOT_REFUND_YET, translation: "admin_management_section_tour_bill_sort_option_title_refund_yet" },
    { id: 2, name: "REFUND", value: ERefundStatusOption.REFUNDED, translation: "admin_management_section_tour_bill_sort_option_title_refund"},
  ]       
  
  export const sectionRevenue = [
    { id: 1, name: "SECTION 1", value: ESectionRevenue.SECTION_ONE, translation: "admin_management_section_tour_bill_sort_option_title_section_one" },
    { id: 2, name: "SECTION 2", value: ESectionRevenue.SECTION_TWO, translation: "admin_management_section_tour_bill_sort_option_title_section_two"},
  ]                         