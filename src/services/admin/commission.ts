import { API } from "configs/constants";
import api from "../configApi";
import { Create, FindAll, Update } from "models/admin/commission";

export class CommissionService {
  static async findAll(data: FindAll): Promise<any> {
    return await api
      .get(API.ADMIN.COMMISSION.DEFAULT, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  
  static async findOne(id: number): Promise<any> {
    return await api
      .get(API.ADMIN.COMMISSION.GET_ID.replace(":id", `${id}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async create(data: Create): Promise<any> {
    return await api
      .post(API.ADMIN.COMMISSION.DEFAULT, data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async update(id: number, data: Update): Promise<any> {
    return await api
      .put(API.ADMIN.COMMISSION.GET_ID.replace(":id", `${id}`), data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async delete(id: number): Promise<any> {
    return await api
      .delete(API.ADMIN.COMMISSION.GET_ID.replace(":id", `${id}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}
