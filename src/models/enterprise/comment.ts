import { Stay } from "models/stay";
import { Tour, TourPrice } from "models/tour";
import { TourBill } from "models/tourBill";
import { User } from "models/user";

export interface FindAll {
    serviceId: number;
    serviceType: number;
    rate: number;       // rate = -1  --> All
    take: number;
    page: number;
    keyword?: string;
  }
  
  export interface Reply {
    id?: number;
    commentRepliedId: string;
    content?: string;
    createdAt?: Date;
    userId: number;
    reviewer: User;
  }

  export interface Comment {
    id?: number;
    reviewer?: User;
    images?: string[];
    rate?: number;
    content?: string;
    replies?: Reply[];
    tourBillData?: TourBill;
    tourOnSaleData?: TourPrice;
    createdAt?: Date;
    tourInfo?: Tour;
    stayInfo?: Stay;
  }