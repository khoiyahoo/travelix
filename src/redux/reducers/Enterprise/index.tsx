import produce from "immer";
import { OptionItem } from "models/general";
import * as types from "./actionTypes";
import { CreateStay } from "models/enterprise/stay";

export interface ITour {
  id?: number;
  title: string;
  city: string;
  district: string;
  commune: string;
  moreLocation?: string;
  contact: string;
  description: string;
  highlight: string;
  suitablePerson: OptionItem<string>[];
  quantity: number;
  numberOfDays: number;
  numberOfNights: number;
  termsAndCondition: string;
  images?: File[];
  rate?: number;
  isTemporary?: boolean;
  isTemporarilyStopWorking?: boolean;
  isDelete?: boolean;
}
export interface IHotel {
  id?: number;
  name: string;
  description: string;
  checkInTime: string;
  checkOutTime: string;
  location: string;
  tags: string[];
  images: string[];
  creator: number;
  isTemporarilyStopWorking?: boolean;
}

export interface IRoom {
  title: string;
  description: string;
  discount: number;
  tags: string;
  images: string;
  numberOfBed: number;
  numberOfRoom: number;
  mondayPrice: number;
  tuesdayPrice: number;
  wednesdayPrice: number;
  thursdayPrice: number;
  fridayPrice: number;
  saturdayPrice: number;
  sundayPrice: number;
  hotelId: number;
  isTemporarilyStopWorking?: boolean;
}

export interface EnterpriseState {
  allTours: ITour[];
  allHotels: IHotel[];
  tourInformation: ITour;
  stayInformation: CreateStay;
}

const initial: EnterpriseState = {
  allTours: [],
  allHotels: [],
  tourInformation: null,
  stayInformation: null,
};

export const enterpriseReducer = (state = initial, action: any) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.SET_TOURS_REDUCER:
        draft.allTours = action.data;
        break;
      case types.SET_HOTELS_REDUCER:
        draft.allHotels = action.data;
        break;
      case types.SET_TOUR_INFORMATION_REDUCER:
        draft.tourInformation = action.data;
        break;
      case types.SET_STAY_INFORMATION_REDUCER:
        draft.stayInformation = action.data;
        break;
      default:
        return state;
    }
  });
