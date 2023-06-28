export interface FindAll {
    take: number;
    page: number;
    keyword?: string;
}


export interface SendOffer {
  email: string;
}


export interface IStaff {
  id?: number;
  username: string;
  lastName: string;
  firstName: string;
  address?:string;
  becomeStaffDate?: Date;
  role?:number;
  isVerified?: boolean;
  isDeleted?: boolean;
  phoneNumber?: string; 
}
export enum ESortStaffRevenueOption {
  LOWEST_BILL = 0,
  HIGHEST_BILL = 1,
  LOWEST_REVENUE = 2,
  HIGHEST_REVENUE =3,
}
export interface StatisticTourBill {
  take: number;
  page: number;
  month: number;
  year: number;
  sort: number;    //ESortStaffRevenueOption
}
export interface StatisticRoomBill {
  take: number;
  page: number;
  month: number;
  year: number;
  sort: number;    //ESortStaffRevenueOption
}
export const sortStaffOption = [
  { id: 1, name: "LOWEST BILL", value: ESortStaffRevenueOption.LOWEST_BILL, translation: "sort_option_title_lowest_bill" },
  { id: 2, name: "HIGHEST BILL", value: ESortStaffRevenueOption.HIGHEST_BILL, translation: "sort_option_title_highest_bill"},
  { id: 3, name: "LOWEST REVENUE", value: ESortStaffRevenueOption.LOWEST_REVENUE, translation: "sort_option_title_lowest_revenue"},
  { id: 4, name: "HIGHEST REVENUE", value: ESortStaffRevenueOption.HIGHEST_REVENUE, translation: "sort_option_title_highest_revenue"},

]