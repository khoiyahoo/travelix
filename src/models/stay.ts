import { EServicePolicyType, EServiceType } from "./general";

export interface NormalGetStay {
    take: number;
    page: number;
    keyword?: string;
    numberOfAdult?: number;
    numberOfChildren?: number;
    startDate?: Date;
    endDate?: Date;
    numberOfRoom?: number;
    sort?: number;    //ESortOption
  } 
  export interface ILocation {
    id: number;
    name: string;
  }
   export interface Stay {
    id?: number;
    name: string;
    type: number;       //StayType
    city: ILocation;
    district: ILocation;
    commune: ILocation;
    moreLocation: string;
    contact: string;
    checkInTime: number;
    checkOutTime: number;
    description: string;
    convenient: string[];
    highlight: string;
    termsAndCondition: string;
    images: string[];
    minPrice?:number;
    maxPrice?: number;
    languages?: Stay[];
    language?: string;
    isDeleted?: boolean;
    rate?: number;
    numberOfReviewer?: number;
    stayPolicies?: StayPolicies[];
    owner?: number;
  }

  export interface StayPolicies {
    id: number;
    dayRange: number;
    moneyRate: number;
    policyType: EServicePolicyType;
    serviceId: number;
    serviceType: EServiceType;
  }