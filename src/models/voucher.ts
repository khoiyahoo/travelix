import { EDiscountType } from "./general";

export interface FindAll {
    take: number;
    page: number;
    keyword?: string;
    owner?: number;
    serviceType: number;  //EServiceType
    serviceId: number;
  }


export interface Voucher {
    id?: number;
    startTime: Date;
    endTime: Date;
    hotelIds: number[];
    tourIds: number[];
    numberOfCodes: number;
    discountType?: EDiscountType;
    discountValue?: number;
    minOrder?: number;
    maxDiscount?: number;
    isQuantityLimit?: boolean;
    owner?: number;
}

export interface GetVoucherValue {
  voucherValue: number;
  discountType: EDiscountType;
}