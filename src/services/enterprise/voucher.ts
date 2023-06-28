import { API } from "configs/constants";
import api from "../configApi";
import { Create, FindAll, Update } from "models/enterprise/voucher";

export class VoucherService {
  static async findAll(data: FindAll): Promise<any> {
    return await api
      .get(API.ENTERPRISE.VOUCHER.DEFAULT, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  
  static async findOne(id: number): Promise<any> {
    return await api
      .get(`${API.ENTERPRISE.VOUCHER.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async create(data: FormData): Promise<any> {
    return await api
      .post(API.ENTERPRISE.VOUCHER.DEFAULT, data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async update(id: number, data: FormData): Promise<any> {
    return await api
      .put(`${API.ENTERPRISE.VOUCHER.DEFAULT}/${id}`, data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async delete(id: number): Promise<any> {
    return await api
      .delete(API.ENTERPRISE.VOUCHER.DELETE_VOUCHER.replace(":id", `${id}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}
