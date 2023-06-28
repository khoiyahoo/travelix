import { API } from "configs/constants";
import { Cancel, Create, FindAll, IVerifyBookRoom, ReSchedule, Update } from "models/roomBill";
import api from "services/configApi";

export class RoomBillService {

  static async findAll(data: FindAll): Promise<any> {
    return await api.get(API.NORMAL.ROOMBILL.DEFAULT, {params:data})
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
  
  static async findOne(id: number): Promise<any> {
    return await api.get(`${API.NORMAL.ROOMBILL.DEFAULT}/${id}`)
      .then((res) => {
          return Promise.resolve(res.data)
      })
      .catch((e) => {
          return Promise.reject(e?.response?.data);
      })
  }

  static async getLastedRoomBill(id: number): Promise<any> {
    return await api.get(API.NORMAL.ROOMBILL.GET_LASTED_ROOM_BILL.replace(":id", `${id}`))
      .then((res) => {
          return Promise.resolve(res.data)
      })
      .catch((e) => {
          return Promise.reject(e?.response?.data);
      })
  }
  
  static async create(data: Create): Promise<any> {
    return await api
      .post(API.NORMAL.ROOMBILL.CREATE, data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  
  static async reSchedule(billId: number, data: ReSchedule): Promise<any> {
    return await api.put(API.NORMAL.ROOMBILL.RESCHEDULE.replace(":id", `${billId}`), data)
      .then((res) => {
          return Promise.resolve(res.data)
      })
      .catch((e) => {
          return Promise.reject(e?.response?.data);
      })
  }

  static async update(billId: number, data: Update): Promise<any> {
    return await api
      .put(API.NORMAL.ROOMBILL.UPDATE.replace(":id", `${billId}`), data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async getAllRoomBills(userId: number): Promise<any> {
    return await api
      .get(API.NORMAL.ROOMBILL.GET_ALL_ROOMBILL.replace(":id", `${userId}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async verifyBookRoom(data: IVerifyBookRoom): Promise<any> {
    return await api
      .post(API.NORMAL.ROOMBILL.VERIFY_BOOKROOM, data)
      .then((res) => {
        return Promise.resolve(res.data.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async cancelBookRoom(billId: number, data: Cancel): Promise<any> {
    return await api
      .put(API.NORMAL.ROOMBILL.CANCEL_BOOK_ROOM.replace(":id", `${billId}`), data)
      .then((res) => {
        return Promise.resolve(res.data.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}
