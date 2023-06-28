import { EDiscountType } from "models/general";

export interface Voucher {
  id?: number;
  startTime: Date;
  endTime: Date;
  hotelIds: number[];
  tourIds: number[];
  numberOfCodes: number;
  numberOfCodesUsed?: number;
  discountType?: EDiscountType;
  discountValue?: number;
  minOrder?: number;
  maxDiscount?: number;
  isQuantityLimit?: boolean;
}

export interface FindAll {
  take: number;
  page: number;
  keyword?: string;
}


export interface Create {
  startTime: Date;
  endTime: Date;
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
  startTime: Date;
  endTime: Date;
  hotelIds: number[];
  tourIds: number[];
  numberOfCodes: number;
  discountType: EDiscountType;
  discountValue: number;
  minOrder: number;
  maxDiscount: number;
  isQuantityLimit: boolean;
}
