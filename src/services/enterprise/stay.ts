import { API } from "configs/constants";
import api from "../configApi";
import { FindAll } from "models/enterprise/stay";

export class StayService {
  static async findAll(data: FindAll): Promise<any> {
    return await api
      .get(API.ENTERPRISE.STAY.DEFAULT, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async createStayInformation(data: FormData): Promise<any> {
    return await api
      .post(API.ENTERPRISE.STAY.DEFAULT, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async updateStayInformation(stayId: number, data: FormData): Promise<any> {
    return await api
      .put(API.ENTERPRISE.STAY.GET_STAY.replace(":id", `${stayId}`), data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async getOneStay(stayId: number, language?: string): Promise<any> {
    return await api
      .get(API.ENTERPRISE.STAY.GET_STAY.replace(":id", `${stayId}`), {
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

  static async delete(stayId: number): Promise<any> {
    return await api
      .delete(API.ENTERPRISE.STAY.DELETE_STAY.replace(":id", `${stayId}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}