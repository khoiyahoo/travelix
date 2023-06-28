import { Room } from "models/room";
import { RoomBillDetail } from "models/roomBill";
import { Stay } from "models/stay";

export interface FindAll {
    take: number;
    page: number;
    keyword?: string;
    stayId: number;
    roomId?: number;        // null --> All
    date?: Date;            // null --> All
    status: number;         // status === -1  --> All    -   EBillStatus
  }

  export interface BookedInfo {
    
      title?: string; 
      amount?: number;
    
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

  export interface StatisticOneStay {
    take: number;
    page: number;
    month: number;
    year: number;
  }
  
  export interface StatisticRoom {
    month: number;
    year: number;
  }
  
  export interface IStayStatistic {
    stayId: number;
    numberOfBookings: number;
    totalNumberOfRoom: number;
    revenue: number;
    commission: number;
    stayInfo: Stay;
  }

  export interface IStayDetailStatistic {
    roomId: number;
    numberOfBookings: number;
    totalNumberOfRoom: number;
    revenue: number;
    commission: number;
    roomInfo: Room;
  }

  export interface IRoomDetailStatistic {
    bookedDate: Date;
    numberOfBookings: number;
    totalNumberOfRoom: number;
    revenue: number;
    commission: number;
  }

  export interface RoomBill {
    id?: number;
    userId?: number;
    email: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    specialRequest: string;
    stayData: Stay;
    startDate: Date;
    endDate: Date;
    price: number;
    discount: number;
    totalBill: number;
    extraPay?: number;
    moneyRefund?: number;
    oldBillId?: number;
    oldBillData?: RoomBill;
    rooms: Room[];
    paymentStatus?: number;
    status?: number;
    createdAt?: Date;
    commission?: number;
    commissionRate?: number;
    roomBillDetail?: RoomBillDetail[];
    bookedRoomsInfo?: BookedInfo[];
  }

  export interface FindAllStaffBill {
    take: number;
    page: number;
    stayId: number;
    month: number;
    year: number;
    status: number;         // status === -1  --> All    -   EBillStatus
  }
  