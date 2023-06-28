import { API } from "configs/constants";
import api from "../configApi";
import { FindAll, SendOffer, StatisticRoomBill, StatisticTourBill} from "models/enterprise/staff";

export class StaffService {
  static async findAll(data: FindAll): Promise<any> {
    return await api
      .get(API.ENTERPRISE.STAFF.DEFAULT, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async sendOffer(data: SendOffer): Promise<any> {
    return await api
      .post(API.ENTERPRISE.STAFF.SEND_OFFER, data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async acceptOffer(id: number): Promise<any> {
    return await api
      .put(API.ENTERPRISE.STAFF.ACCEPT_OFFER.replace(":id", `${id}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async cancelOffer(id: number): Promise<any> {
    return await api
      .delete(API.ENTERPRISE.STAFF.CANCEL_OFFER.replace(":id", `${id}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async getAllOffers(data: FindAll): Promise<any> {
    return await api
      .get(API.ENTERPRISE.STAFF.GET_OFFERS, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async delete(id: number): Promise<any> {
    return await api
      .delete(API.ENTERPRISE.STAFF.DELETE_STAFF.replace(":id", `${id}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async statisticTourBill(data: StatisticTourBill): Promise<any> {
    return await api
      .get(API.ENTERPRISE.STAFF.STATISTIC_TOUR, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async statisticRoomBill(data: StatisticRoomBill): Promise<any> {
    return await api
      .get(API.ENTERPRISE.STAFF.STATISTIC_ROOM, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}
