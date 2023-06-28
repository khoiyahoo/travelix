import { API } from "configs/constants";
import api from "../configApi";
import { FindAll } from "models/admin/event";

export class EventService {
  static async findAll(data: FindAll): Promise<any> {
    return await api
      .get(API.ADMIN.EVENT.DEFAULT, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  
  static async findOne(id: number, language?: string): Promise<any> {
    return await api
      .get(`${API.ADMIN.EVENT.DEFAULT}/${id}`, {
        params: {
          language
        }
      })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async create(data: FormData): Promise<any> {
    return await api
      .post(API.ADMIN.EVENT.DEFAULT, data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async update(id: number, data: FormData): Promise<any> {
    return await api
      .put(`${API.ADMIN.EVENT.DEFAULT}/${id}`, data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async delete(id: number): Promise<any> {
    return await api
      .delete(API.ADMIN.EVENT.DELETE_EVENT.replace(":id", `${id}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}
