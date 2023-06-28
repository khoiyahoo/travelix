import { OptionItem } from "./general";

export interface ETour {
  id?: number;
  title: string;
  description: string;
  city?: OptionItem;
  district?: OptionItem;
  commune?: OptionItem;
  moreLocation?: string;
  cityStart?: OptionItem;
  districtStart?: OptionItem;
  communeStart?: OptionItem;
  moreLocationStart?: string;
  highlight?: string;
  termsAndCondition?: string;
  suitablePerson?: string;
  numberOfDays?: number;
  numberOfNights?: number;
  numberOfTookPlaceTours?: number;
  numberOfUpcomingTours?: number;
  maxPrice?: number;
  minPrice?: number;
  rate?: number;
  images: File[];
  creator: number;
  contact: string;
  tourOnSales?: TourPrice[];
  languages?: ETour[];
  parentLanguage: number,
  language: string;
  isCanDelete?: boolean;
  isDeleted?: boolean;
  numberOfReviewer?: number;
}

export interface ScheduleItem {
  id?: number
  day?: number;
  startTime: number;
  endTime: number;
  description: string;
}
export interface CreateMultipleSchedule {
  id?: number
  tourId: number;
  day: number;
  language?: string;
  schedule: ScheduleItem[];
}


export interface TourPrice {
  id?:number;
  tourId?: number;
  discount: number;
  quantity: number;
  quantityOrdered?: number;
  startDate: Date;
  childrenAgeMin: number;
  childrenAgeMax: number;
  childrenPrice: number;
  adultPrice: number;
  currency: string;
}
export interface FindAll {
  take: number;
  page: number;
  isPast: boolean;
}

export interface UpdateTourInformation {
  title: string;
  numberOfDays: number;
  numberOfNights: number;
  city: string;
  district: string;
  commune: string;
  moreLocation: string;
  contact: string;
  description: string;
  suitablePerson: string;
  highlight: string;
  termsAndCondition: string;
  language: string;
  images: string[];
  imagesDeleted: string[];
}

export interface EUpdateTour {
  id?: number;
  title: string;
  description: string;
  businessHours: string[];
  location: string;
  price: number;
  discount: number;
  tags: string[];
  images: string[];
  contact: string;
  isTemporarilyStopWorking?: boolean;
}

export interface AdminGetTours {
  take: number;
  page: number;
  keyword?: string;
  status?: number;
}

export interface EGetRoomsAvailable {
  hotelId: number;
  startDate: Date;
  endDate: Date;
}
export interface EGetAllRoomBillsAnyDate {
  hotelId: number;
  date: Date;
}

export interface IHotel {
  id?: number;
  name: string;
  description: string;
  checkInTime: string;
  checkOutTime: string;
  location: string;
  contact?: string;
  tags: string[];
  images: string[];
  creator?: number;
  isTemporarilyStopWorking?: boolean;
}


// ======================== v1.2 ===================
export interface TourInformation {
  id?: number;
  title: string;
  quantity: string;
  numberOfDays: number;
  numberOfNights: number;
  city: string;
  district: string;
  commune: string;
  moreLocation: string;
  contact: string;
  description: string;
  suitablePerson: string;
  highlight: string;
  termsAndCondition: string;
}