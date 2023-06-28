import { EServicePolicyType, EServiceType, OptionItem } from "./general";
import {User} from "./user";

export interface Tour {
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
  rate?: number;
  images: string[];
  creator: number;
  contact: string;
  owner?:number;
  isDeleted?: boolean;
  tourOnSales?: TourPrice[];
  tourPolicies?: TourPolicies[];
  tourSchedules?: TourSchedules[];
  languages?: Tour[];
  parentLanguage: number,
  language: string;
  numberOfReviewer: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface TourSchedules {
  id?: number
  startTime: number;
  endTime: number;
  description: string;
  day?: number;
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
  isReceivedRevenue?: boolean;
}

export interface TourPolicies {
  id: number;
  dayRange: number;
  moneyRate: number;
  policyType: EServicePolicyType;
  serviceId: number;
  serviceType: EServiceType;
}

export interface ScheduleItem {
    id?: number
    startTime: number;
    endTime: number;
    description: string;
  }
  export interface Schedule {
    id?: number
    tourId: number;
    day: number;
    schedule: ScheduleItem[];
  }

  export interface NormalGetTours {
    take: number;
    page: number;
    keyword?: string;
    dateSearch?: Date;
    sort?: number; 
  }
  export interface Image {
    altText: string;
    caption: string;
    key: number;
    src: string;
}

export interface HistoryBookTour {
    id: number;
    date: Date;
    tourId: number;
  }
  export interface BookTourReview {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    tourId: number;
    tourOnSaleId:number;
    price: number;
    discount:number;
    totalBill: number;
    numberOfAdult: number;
    numberOfChild: number;
    startDate: Date;
    specialRequest?: string;
    priceOfChild: number;
    priceOfAdult: number;
  }
  
export enum DETAIL_SECTION {
  section_overview = 'section_overview',
  section_term_condition = 'section_term_condition',
  section_reschedule_refund = 'section_reschedule_refund',
}