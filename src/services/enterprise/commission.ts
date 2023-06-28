import { API } from "configs/constants";
import api from "../configApi";
import { FindAll } from "models/enterprise/commission";

export class CommissionService {
  static async findAll(data: FindAll): Promise<any> {
    return await api
      .get(API.ENTERPRISE.COMMISSION.DEFAULT, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  
  static async findOne(id: number): Promise<any> {
    return await api
      .get(API.ENTERPRISE.COMMISSION.GET_ID.replace(":id", `${id}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }


}
