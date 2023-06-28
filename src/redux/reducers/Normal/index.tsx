import produce from "immer";
import { Comment } from "models/comment";
import { TourBill } from "models/tourBill";
import * as types from "./actionTypes";
import { TourPrice } from "models/tour";
import { Stay } from "models/stay";
import { Room } from "models/room";

export interface ITour {
  id?: number;
  title: string;
  description: string;
  businessHours: string[];
  location: string;
  price: number;
  discount: number;
  tags: string[];
  images: string[];
  creator: number;
  contact: string;
  rate?: number;
  isDeleted?: boolean;
  numberOfReviewer?: number;
  isTemporarilyStopWorking?: boolean;
}

export interface IHotel {
  id?: number;
  name: string;
  description: string;
  checkInTime: string;
  checkOutTime: string;
  location: string;
  contact: string;
  tags: string[];
  images: string[];
  creator: number;
  rate?: number;
  numberOfReviewer?: number;
  isTemporarilyStopWorking?: boolean;
}

export interface IRoom {
  id?: number;
  title: string;
  description: string;
  discount?: number;
  tags: string[];
  images: string[];
  numberOfBed: number;
  numberOfRoom: number;
  stayId?: number;
  amount?: number;
  priceDetail?: any;
}

export interface IRoomBillConfirm {
  stay: Stay;
  rooms: Room[];
  startDate: Date;
  endDate: Date;
}
export interface IConfirmBookTour {
  tourId: number;
  tourOnSaleId: number;
  amountAdult: number;
  amountChildren: number;
  startDate: Date;
  totalPrice: number;
  priceAdult: number;
  priceChildren: number;
  discount: number;
  owner: number;
}

export interface IConfirmBookTourReview {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  tourId: number;
  tourOnSaleId: number;
  price: number;
  discount: number;
  totalBill: number;
  numberOfAdult: number;
  numberOfChild: number;
  startDate: Date;
  specialRequest?: number;
  priceOfChild: number;
  priceOfAdult: number;
}
export interface IConfirmBookRoom {
  userId: number;
  userMail: string;
  hotelId: number;
  rooms: {
    roomId: string;
    title: string;
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
}
export interface ITourBill {
  userId: number;
  userMail: string;
  tourId: number;
  amount: number;
  price: number;
  discount: number;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  verifyCode: string;
}
export interface ICreateRoomBill {
  id?: number;
  userId: number;
  userMail: string;
  hotelId: number;
  rooms: {
    roomId: string;
    amount: string;
    discount: number;
    price: number;
    bookedDate: Date;
    totalPrice: number;
  }[];
  bookedDates: string;
  startDate: Date;
  endDate: Date;
  totalBill: number;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  verifyCode: string;
}

export interface IUserInformationBookRoom {
  userId: number;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  specialRequest?: string;
}
export interface NormalState {
  allTours: ITour[];
  allHotels: IHotel[];
  roomBillConfirm: IRoomBillConfirm;
  allTourBills: ITourBill[];
  allRoomBills: ICreateRoomBill[];
  confirmBookTour: IConfirmBookTour;
  confirmBookTourReview: IConfirmBookTourReview;
  confirmBookRoom: IConfirmBookRoom;
  getUserInformationBookRoom: IUserInformationBookRoom;
  getSelectChangeDate: TourPrice;
}

const initial: NormalState = {
  allTours: [],
  allHotels: [],
  roomBillConfirm: null,
  allTourBills: [],
  allRoomBills: [],
  confirmBookTour: null,
  confirmBookTourReview: null,
  confirmBookRoom: null,
  getUserInformationBookRoom: null,
  getSelectChangeDate: null,
};

export const normalReducer = (state = initial, action: any) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.SET_NORMAL_TOURS_REDUCER:
        draft.allTours = action.data;
        break;
      case types.SET_NORMAL_HOTELS_REDUCER:
        draft.allHotels = action.data;
        break;
      case types.SET_ROOM_BILL_CONFIRM_REDUCER:
        draft.roomBillConfirm = action.data;
        break;
      case types.SET_TOUR_BILLS_REDUCER:
        draft.allTourBills = action.data;
        break;
      case types.SET_ROOM_BILLS_REDUCER:
        draft.allRoomBills = action.data;
        break;
      case types.SET_CONFIRM_BOOK_TOUR_REDUCER:
        draft.confirmBookTour = action.data;
        break;
      case types.SET_CONFIRM_BOOK_TOUR_REVIEW_REDUCER:
        draft.confirmBookTourReview = action.data;
        break;
      case types.SET_CONFIRM_BOOK_ROOM_REDUCER:
        draft.confirmBookRoom = action.data;
        break;
      case types.SET_USER_INFORMATION_BOOK_ROOM_REDUCER:
        draft.getUserInformationBookRoom = action.data;
        break;
      case types.SET_SELECT_CHANGE_DATE_REDUCER:
        draft.getSelectChangeDate = action.data;
        break;
      default:
        return state;
    }
  });
