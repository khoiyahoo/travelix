import { IHotel } from "./hotel";
import { IRoom, Room } from "./room";
import { Stay } from "./stay";
export interface FindAll {
  take: number;
  page: number;
  keyword?: string;
}
export interface Create {
  stayId: number;
  rooms: {
    roomId: number;
    amount: number;
    price: number;
    bookedDate: Date;
  }[];
  startDate: Date;
  endDate: Date;
  price: number;
  discount: number;
  totalBill: number;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
}

export interface ReSchedule {
  stayId: number;
  rooms: {
    roomId: number;
    amount: number;
    price: number;
    discount: number;   //percent
    bookedDate: Date;
  }[];
  startDate: Date;
  endDate: Date;
  price: number;
  discount: number;     //money
  totalBill: number;
  moneyRefund: number;
  extraPay: number;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
}

export interface Update {
  paymentStatus: number;
}
export interface Cancel {
  moneyRefund: number;
}

export interface RoomBillConfirm {
  userId?: number;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  specialRequest: string;
  stay: Stay;
  rooms: Room[];
  startDate: Date;
  endDate: Date;
  price: number;
  discount: number;
  totalBill: number;
}
export interface RoomBillDetail {
  id?: number;
  amount?: number;
  bookedDate?: number;
  paymentStatus?: number;
  price?: number;
  roomData?: Room;
}
export interface RoomBill {
  id?: number;
  userId?: number;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  specialRequest: string;
  stayId: number;
  stayData: Stay;
  rooms: Room[];
  startDate: Date;
  endDate: Date;
  price: number;
  discount: number;
  totalBill: number;
  extraPay?: number;
  moneyRefund?: number;
  oldBillId?: number;
  oldBillData?: RoomBill;
  paymentStatus?: number;
  status?: number;
  roomBillDetail?: RoomBillDetail[];
  createdAt?: Date;
  isRefunded?: boolean;
}

export interface IRoomBillConfirm {
  hotel: IHotel;
  rooms: IRoom[];
  startDate: string;
  endDate: string;
}

export interface ICreateRoomBill {
  userId: number;
  userMail: string;
  hotelId: number;
  rooms: {
    roomId: string;
    amount: string;
    discount: number;
    price: number;
    bookedDates: Date;
    totalPrice: number;
  }[];
  bookedDates: string[];
  startDate: string;
  endDate: string;
  totalBill: number;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  bankName: string;
  bankAccountName: string;
  bankNumber: string;
  accountExpirationDate: Date;
  deposit: number;
}

export interface IVerifyBookRoom {
  code: string;
  billId: number;
}

export interface IHotelsRevenueByMonth {
  hotelIds: number[];
  month: number;
  year: number;
}

export interface IHotelsRevenueByYear {
  hotelIds: number[];
  year: number;
}
