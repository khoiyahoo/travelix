import { API } from "configs/constants";
import {
  IDeclineDeleteHotelComment,
  IDeclineDeleteTourComment,
} from "models/comment";
import api from "services/configApi";

export class CommentService {
  static async getTourCommentsNeedDelete(): Promise<any> {
    return await api
      .get(API.ADMIN.COMMENT.TOUR_COMMENT.GET_COMMENT_NEED_DELETE)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async declineDeleteCommentTour(commentId: number, data: IDeclineDeleteTourComment): Promise<any> {
    return await api
      .put(API.ADMIN.COMMENT.TOUR_COMMENT.DECLINE_DELETE_COMMENT.replace(":id", `${commentId}`), data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async deleteCommentTour(commentId: number): Promise<any> {
    return await api
      .put(API.ADMIN.COMMENT.TOUR_COMMENT.DELETE.replace(":id", `${commentId}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async getHotelCommentsNeedDelete(): Promise<any> {
    return await api
      .get(API.ADMIN.COMMENT.HOTEL_COMMENT.GET_COMMENT_NEED_DELETE)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async declineDeleteCommentHotel(commentId: number, data: IDeclineDeleteHotelComment): Promise<any> {
    return await api
      .put(API.ADMIN.COMMENT.HOTEL_COMMENT.DECLINE_DELETE_COMMENT.replace(":id", `${commentId}`), data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async deleteCommentHotel(commentId: number): Promise<any> {
    return await api
      .put(API.ADMIN.COMMENT.HOTEL_COMMENT.DELETE.replace(":id", `${commentId}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}
