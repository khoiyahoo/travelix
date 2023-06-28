import { API } from "configs/constants";
import { FindAll } from "models/event";
import api from "services/configApi";

export class EventService {
  static async getAllEvents(data: FindAll): Promise<any> {
    return await api
      .get(API.NORMAL.EVENT.DEFAULT, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async getEvent(id: number): Promise<any> {
    return await api
      .get(API.NORMAL.EVENT.DETAIL_EVENT.replace(":id", `${id}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async findByCode(code: string): Promise<any> {
    return await api
      .get(API.NORMAL.EVENT.FIND_CODE.replace(":code", `${code}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
} 