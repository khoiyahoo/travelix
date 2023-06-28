import { API } from "configs/constants";
import { FindAll } from "models/voucher";
import api from "services/configApi";

export class VoucherService {
  static async getAllVouchers(data: FindAll): Promise<any> {
    return await api
      .get(API.NORMAL.VOUCHER.DEFAULT, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async getVoucher(id: number): Promise<any> {
    return await api
      .get(API.NORMAL.VOUCHER.DETAIL_VOUCHER.replace(":id", `${id}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
} 