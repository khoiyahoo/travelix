import { EDiscountType } from "models/general";

export interface FindAll {
    take: number;
    page: number;
    keyword?: string;
  }


export interface IEvent {
  id?: number;
  name: string;
  description: string;
  startTime: Date;
  endTime: Date;
  code: string;
  hotelIds?: number[];
  tourIds?: number[];
  numberOfCodes: number;
  discountType?: EDiscountType;
  discountValue?: number;
  minOrder?: number;
  maxDiscount?: number;
  isQuantityLimit?: boolean;
  language?: string;  
  banner?: string;
  languages?: IEvent[];

}

export interface Create {
  name: string;
  description: string;
  startTime: Date;
  endTime: Date;
  code: string;
  hotelIds: number[];
  tourIds: number[];
  numberOfCodes: number;
  discountType: EDiscountType;
  discountValue: number;
  minOrder: number;
  maxDiscount: number;
  isQuantityLimit: boolean;
}

export interface Update {
  name: string;
  description: string;
  startTime: Date;
  endTime: Date;
  code: string;
  policy: string;
  hotelIds: number[];
  tourIds: number[];
  numberOfCodes: number;
  discountType: EDiscountType;
  discountValue: number;
  minOrder: number;
  maxDiscount: number;
  isQuantityLimit: boolean;
  language?: string;
}