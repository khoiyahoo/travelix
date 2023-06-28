import { Tour } from "./tour";
import { User } from "./user";


export interface FindAllComment {
  serviceId: number;
  serviceType: number;
  take: number;
  page: number;
  keyword?: string;
}

export interface Create {
  content: string;
  rate: number;
  serviceId: number;
  serviceType: number;
  billId: number;
}
export interface Update {
  content: string;
  rate: number;
  images: string[];         // mảng url image cũ
  imagesDeleted: string[];  // mảng url image bị xóa
}

export interface Comment {
  id?: number;
  content: string;
  rate: number;
  serviceId?: number;
  serviceType?: number;
  tourId?: number;
  billId?: number;
  tourData?: Tour;
  roomId?: number;
  userId?: number;
  reviewer?: Reviewer;
  createdAt: Date;
  replyComment?: string;
  images: string[];
  replies?: Reply[];
}
//---------------------------------
export interface IGetAllTourComments {
  tourIds: number[];
}

export interface ICreateTourComment {
  id?: number;
  comment: string;
  rate: number;
  tourId: number;
  userId: number;

}

export interface IUpdateTourComment {
  comment: string;
  rate: number;
}

export interface Reply {
  id?: number;
  commentRepliedId: string;
  content?: string;
  createdAt?: Date;
  userId: number;
  reviewer: Reviewer;
}
export interface Reviewer {
  address?: string;
  avatar: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: number;
  userName?: string;
}
export interface HotelReviewer {
  address?: string;
  avatar: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: number;
  userName?: string;
}


export interface ReplyTourComment {
  commentId: number;
  content: string;
}

export interface UpdateReply {
  content: string;
}


export interface ICreateHotelComment {
  id?: number;
  comment: string;
  rate: number;
  hotelId: number;
  userId: number;
}

export interface IUpdateHotelComment {
  comment: string;
  rate: number;
}

export interface IReplyHotelComment {
  replyComment: string;
}

export interface IGetAllHotelComments {
  hotelIds: number[];
}

export interface IRequestDeleteHotelComment {
  reasonForDelete: string;
}

export interface IRequestDeleteTourComment {
  reasonForDelete: string;
}

export interface IDeclineDeleteTourComment {
  reasonForDecline: string;
}

export interface IDeclineDeleteHotelComment {
  reasonForDecline: string;
}