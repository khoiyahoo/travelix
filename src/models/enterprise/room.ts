export enum ERoomStatusFilter {
    ALL = -1,
    ACTIVED = 0,
    IN_ACTIVED = 1,
  }
export interface FindAll {
    stayId?: number;
    take: number;
    page: number;
    keyword?: string;
    status: ERoomStatusFilter;
  }
  export interface Room {
    id?: number;
    title: string;
    description: string;
    utility: string[];
    numberOfAdult: number;
    numberOfChildren: number;
    numberOfBed: number;
    numberOfRoom: number;
    discount: number;
    mondayPrice: number;
    tuesdayPrice: number;
    wednesdayPrice: number;
    thursdayPrice: number;
    fridayPrice: number;
    saturdayPrice: number;
    sundayPrice: number;
    isDeleted?: boolean;
    languages?: Room[];
    language?: string;
    images?: string[];
  }
  export interface FindOne {
    stayId: number;
    language?: string;
  }

  export interface CreateOrUpdateCheckRoom {
    date: Date;
    amount: number;
    stayId: number;
    roomId: number;
  }