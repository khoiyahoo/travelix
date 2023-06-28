import { images } from "configs/images";

export enum EKey {
  TOKEN = "token",
  REFRESH_TOKEN = "refresh_token",
}
export interface SortItem {
  sortedField: string;
  isDescending: boolean;
}
export interface Meta {
  take: number;
  itemCount: number;
  page: number;
  pageCount: number;
}
export interface DataPagination<T> {
  data: T[];
  meta: Meta;
}
export interface OptionItem<T = number> {
  id?: T | string;
  name: string;
  translation?: string;
  img?: string;
  value?: T | T[] | string;
}

export interface OptionItemT<T> {
  id: T;
  name: string;
  translation?: string;
}

export const sortType: OptionItem[] = [
  { id: 1, name: "Lowest price", value: "Lowest price" },
  { id: 2, name: "Highest price", value: "Highest price" },
  { id: 3, name: "Highest rating", value: "Highest rating" },
];

export const languagesType: OptionItem[] = [
  { id: 1, name: "English", value: "English" },
  { id: 2, name: "Vietnamese", value: "Vietnamese" },
];

export const currencyType: OptionItem[] = [
  { id: 1, name: "VND", value: "vi" },
  { id: 2, name: "USD", value: "en" },
]

export enum EServicePolicyType {
  RESCHEDULE = 1,
  REFUND = 2
}

export enum EServiceType {
  TOUR = 1,
  HOTEL = 2
}


export const policyType = [
  { id: 1, name: "RESCHEDULE", value: EServicePolicyType.RESCHEDULE },
  { id: 2, name: "REFUND", value: EServicePolicyType.REFUND},
]

export const serviceType = [
  { id: 1, name: "TOUR", value: EServiceType.TOUR },
  { id: 2, name: "HOTEL", value: EServiceType.HOTEL},
]



export const userType = [
  { id: 1, name: "Super Admin" },
  { id: 2, name: "Admin" },
  { id: 3, name: "Enterprise" },
  { id: 4, name: "Staff" },
  { id: 5, name: "User" },
]

export enum EPaymentStatus {
  NOT_PAID = 0,
  PAID = 1,
  CANCEL = 3,
  FAILED = 4,
}

export enum EBillStatus {
  RESCHEDULED = 0,
  CANCELED = 1,
  NOT_CONTACTED_YET = 2,
  CONTACTED = 3,
  USED = 4,
  NOT_USE =5,
}

export const billStatusType = [
  { id: 0, name: "All", value: -1, translation: "common_select_all" },
  { id: 1, name: "Reschedule", value: EBillStatus.RESCHEDULED, translation: "bill_status_reschedule" },
  { id: 2, name: "Canceled", value: EBillStatus.CANCELED, translation: "bill_status_canceled"},
  { id: 3, name: "Not contacted yet", value: EBillStatus.NOT_CONTACTED_YET, translation: "bill_status_not_contact_yet"},
  { id: 4, name: "Contacted", value: EBillStatus.CONTACTED, translation: "bill_status_contacted"},
  { id: 5, name: "Used", value: EBillStatus.USED, translation: "bill_status_used"},
  { id: 6, name: "Not used", value: EBillStatus.NOT_USE, translation: "bill_status_not_use"},
]

export const rateOption = [
  { id: 0, name: "All", value: -1, translation: "common_select_all" },
  { id: 1, name: "1 STAR", value: EBillStatus.RESCHEDULED, translation: "rate_option_1" },
  { id: 2, name: "2 STAR", value: EBillStatus.CANCELED, translation: "rate_option_2"},
  { id: 2, name: "3 STAR", value: EBillStatus.CANCELED, translation: "rate_option_3"},
  { id: 3, name: "4 STAR", value: EBillStatus.NOT_CONTACTED_YET, translation: "rate_option_4"},
  { id: 4, name: "5 STAR", value: EBillStatus.CONTACTED, translation: "rate_option_5"},
]

export enum EDiscountType {
  MONEY = 1,
  PERCENT = 2
}

export const discountType = [
  { id: 1, name: "MONEY", value: EDiscountType.MONEY },
  { id: 2, name: "PERCENT", value: EDiscountType.PERCENT},
]

export enum EBankType {
   INTERNAL = 1,
   INTERNATIONAL = 2
}

export enum Lang {
  VI = 'vi',
  EN = 'en'
}

export enum EStatusService {
  ACTIVE = 0,
  IN_ACTIVE = 1,
}
export interface LangSupport {
  key: Lang,
  name: string,
  img: string
}

export const langSupports: LangSupport[] = [
  {
    key: Lang.VI,
    name: 'Tiếng Việt',
    img: images.vietnam.src
  },
  {
    key: Lang.EN,
    name: 'English',
    img: images.anh.src
  }
]

export const langOptions: OptionItem<string>[] = [
  {
    id: Lang.VI,
    name: 'Tiếng Việt',
    img: images.vietnam.src,
  },
  {
    id: Lang.EN,
    name: 'English',
    img: images.anh.src,
  }
]

export enum ESortOption {
  LOWEST_PRICE = 0,
  HIGHEST_PRICE = 1,
  HIGHEST_RATE = 2,
}

export const sortOption = [
  { id: 1, name: "LOWEST PRICE", value: ESortOption.LOWEST_PRICE, translation: "sort_option_title_lowest_price" },
  { id: 2, name: "HIGHEST PRICE", value: ESortOption.HIGHEST_PRICE, translation: "sort_option_title_highest_price"},
  { id: 3, name: "HIGHEST RATE", value: ESortOption.HIGHEST_RATE, translation: "sort_option_title_highest_rate"},
]

export interface SortItem {
  sortedField: string;
  isDescending: boolean;
}

export interface TableHeaderLabel {
  name: string;
  label: string;
  sortable: boolean;
  align?: 'center'
  | 'inherit'
  | 'justify'
  | 'left'
  | 'right'
}

export const bankInternational: OptionItem[] = [
  { id: 1, name: "VISA", value: "VISA" },
  { id: 2, name: "MASTER CARD", value: "MASTER CARD" },
  { id: 3, name: "JCB", value: "JCB" },
  { id: 4, name: "UNION PAY", value: "UNION PAY" },
  { id: 5, name: "AMERICAN EXPRESS", value: "AMERICAN EXPRESS" },
];