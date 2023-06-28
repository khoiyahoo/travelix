export interface NormalGetRoom {
  take: number;
  page: number;
  stayId: number;
  startDate: Date;
  endDate: Date;
  numberOfAdult?: number;
  numberOfChildren?: number;
  numberOfRoom?: number;
  sort?: number;    //ESortOption
}

export interface Room {
  id?: number;
  amount?: number;
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
  prices?: {
    date?: Date,
    price?: number,
  }[];
}


export interface HistoryBookRoom {
  id: number;
  date: Date;
  roomId: number;
}

export interface ICreateRoom {
  title: string;
  description: string;
  tags: string[];
  images: string[];
  hotelId: number;
  discount: number;
  numberOfBed: number;
  numberOfRoom: number;
  mondayPrice: number;
  tuesdayPrice: number;
  wednesdayPrice: number;
  thursdayPrice: number;
  fridayPrice: number;
  saturdayPrice: number;
  sundayPrice: number;
}

export interface RoomPrice {
  id: number;
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
  other: string;
  roomId: string;
}
export interface IRoom {
  id?:number;
  title: string;
  description: string;
  discount?: number;
  tags: string[];
  images: string[];
  numberOfBed: number;
  numberOfRoom: number;
  hotelId?: number;
  amount?: number;
  priceDetail?: any;
}

export interface EditRoomInformation {
  id?:number;
  title: string;
  description: string;
  tags: string[];
  images: string[];
  numberOfBed: number;
  numberOfRoom: number;
}
export interface EditRoomPrice{
  id?: number;
  discount?: number;
  mondayPrice: number;
  tuesdayPrice: number;
  wednesdayPrice: number;
  thursdayPrice: number;
  fridayPrice: number;
  saturdayPrice: number;
  sundayPrice: number;
}
export interface EGetPrice {
  date: Date;
  roomId: number;
}

export interface ECreateRoomOtherPrice {
  date: Date;
  price: number;
  roomId: number;
}