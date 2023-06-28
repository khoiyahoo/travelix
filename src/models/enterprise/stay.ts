export enum EStayStatusFilter {
    ALL = -1,
    ACTIVED = 0,
    IN_ACTIVED = 1,
  }
  export enum StayType {
    HOTEL = 1,
    HOMES_TAY = 2,
    RESORT = 3,
  }
export interface FindAll {
    take: number;
    page: number;
    keyword?: string;
    status: EStayStatusFilter;
    type?: number;    //StayType --> null ~ all
  }
  export interface ILocation {
    id: number;
    name: string;
  }

  export interface CreateStay {
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
    rate?:number;
    numberOfReviewer?: number;
  }