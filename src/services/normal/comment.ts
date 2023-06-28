import { API } from "configs/constants";
import { Create, FindAllComment, ICreateHotelComment, ICreateTourComment, IReplyHotelComment, IUpdateHotelComment, IUpdateTourComment, ReplyTourComment, Update, UpdateReply } from "models/comment";
import api from "services/configApi";

export class CommentService {
  static async findAll(data: FindAllComment): Promise<any> {
    return await api.get(API.NORMAL.COMMENT.DEFAULT, {params: data})
        .then((res) => {
          return Promise.resolve(res.data)
        })
        .catch((e) => {
          return Promise.reject(e?.response?.data);
        })
    }

    static async createComment(data: FormData): Promise<any> {
      return await api.post(API.NORMAL.COMMENT.DEFAULT, data)
        .then((res) => {
          return Promise.resolve(res.data)
        })
        .catch((e) => {
          return Promise.reject(e?.response?.data);
        })
    }

    static async updateComment(commentId: number, data: FormData): Promise<any> {
      return await api.put(API.NORMAL.COMMENT.UPDATE_COMMENT.replace(":id", `${commentId}`), data)
        .then((res) => {
          return Promise.resolve(res.data)
        })
        .catch((e) => {
          return Promise.reject(e?.response?.data);
        })
    }

    static async deleteComment(commentId: number): Promise<any> {
      return await api.delete(API.NORMAL.COMMENT.DELETE_COMMENT.replace(":id", `${commentId}`))
        .then((res) => {
          return Promise.resolve(res.data)
        })
        .catch((e) => {
          return Promise.reject(e?.response?.data);
        })
    }

    static async replyComment(data: ReplyTourComment): Promise<any> {
      return await api.post(API.NORMAL.COMMENT.REPLY, data)
        .then((res) => {
          return Promise.resolve(res.data)
        })
        .catch((e) => {
          return Promise.reject(e?.response?.data);
        })
    }

    static async updateReplyComment(id: number, data: UpdateReply): Promise<any> {
      return await api.put(API.NORMAL.COMMENT.UPDATE_REPLY.replace(":id", `${id}`), data)
        .then((res) => {
          return Promise.resolve(res.data)
        })
        .catch((e) => {
          return Promise.reject(e?.response?.data);
        })
    }

//---------------------------------

      static async getHotelComments(hotelId: number): Promise<any> {
        return await api.get(API.NORMAL.COMMENT.HOTEL_COMMENT.GET_COMMENT.replace(":id", `${hotelId}`))
            .then((res) => {
              return Promise.resolve(res.data)
            })
            .catch((e) => {
              return Promise.reject(e?.response?.data);
            })
        }
    
        static async createCommentHotel(data: ICreateHotelComment): Promise<any> {
            return await api.post(API.NORMAL.COMMENT.HOTEL_COMMENT.CREATE, data)
              .then((res) => {
                return Promise.resolve(res.data)
              })
              .catch((e) => {
                return Promise.reject(e?.response?.data);
              })
          }
    
        static async updateCommentHotel(commentId: number, data: IUpdateHotelComment): Promise<any> {
            return await api.put(API.NORMAL.COMMENT.HOTEL_COMMENT.UPDATE.replace(":id", `${commentId}`), data)
              .then((res) => {
                return Promise.resolve(res.data)
              })
              .catch((e) => {
                return Promise.reject(e?.response?.data);
              })
          }
    
        static async deleteCommentHotel(commentId: number): Promise<any> {
            return await api.put(API.NORMAL.COMMENT.HOTEL_COMMENT.DELETE.replace(":id", `${commentId}`))
              .then((res) => {
                return Promise.resolve(res.data)
              })
              .catch((e) => {
                return Promise.reject(e?.response?.data);
              })
          }
          
        static async replyHotelComment(commentId: number, data: IReplyHotelComment): Promise<any> {
            return await api.put(API.NORMAL.COMMENT.HOTEL_COMMENT.REPLY.replace(":id", `${commentId}`), data)
              .then((res) => {
                return Promise.resolve(res.data)
              })
              .catch((e) => {
                return Promise.reject(e?.response?.data);
              })
          }
}