import { API } from "configs/constants";
import api from "../configApi";
import { FindAll, IRoomOtherPrice } from "models/enterprise/roomOtherPrice";


export class RoomOtherPriceService {
  static async findAll(id: number, data?: FindAll): Promise<any> {
    return await api
      .get(API.ENTERPRISE.ROOM_OTHER_PRICE.GET_ROOM_OTHER_PRICE.replace(":id",`${id}`), {params:data})
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async createOrUpdate(data: IRoomOtherPrice[]): Promise<any> {
    return await api
      .put(API.ENTERPRISE.ROOM_OTHER_PRICE.DEFAULT, data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async delete(id: number): Promise<any> {
    return await api
      .delete(API.ENTERPRISE.ROOM_OTHER_PRICE.GET_ROOM_OTHER_PRICE.replace(":id",`${id}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}