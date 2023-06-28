import { API } from "configs/constants";
import { FindAllOrderNeedRefund, FindAllStayRevenue, StatisticAllUsers, StatisticOneRoom, StatisticOneStay, StatisticOneUser } from "models/admin/roomBill";
import api from "services/configApi";

export class RoomBillService {

  static async orderRefundFindAll(data: FindAllOrderNeedRefund): Promise<any> {
    return await api
      .get(API.ADMIN.STATISTIC.STAY.ORDER_REFUND, {params: data})
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async updateRefund(id: number): Promise<any> {
    return await api
      .put(API.ADMIN.STATISTIC.STAY.ORDER_REFUND_ONE.replace(":id", `${id}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  
  static async statisticAllUsers(data: StatisticAllUsers): Promise<any> {
    return await api
      .get(API.ADMIN.STATISTIC.STAY.STATISTIC, {params: data})
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async statisticOneUser(id: number, data: StatisticOneUser): Promise<any> {
    return await api
      .get(API.ADMIN.STATISTIC.STAY.STATISTIC_USER.replace(":id", `${id}`), {params: data})
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async statisticOneStay(id: number, data: StatisticOneStay): Promise<any> {
    return await api
      .get(API.ADMIN.STATISTIC.STAY.STATISTIC_STAY.replace(":id", `${id}`), {params: data})
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async statisticOneRoom(id: number, data: StatisticOneRoom): Promise<any> {
    return await api
      .get(API.ADMIN.STATISTIC.STAY.STATISTIC_ROOM.replace(":id", `${id}`), {params: data})
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async findAllStayRevenue(data: FindAllStayRevenue): Promise<any> {
    return await api
      .get(API.ADMIN.STATISTIC.STAY.FIND_ALL_REVENUE, {params: data})
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async updateReceivedRevenue(id: number): Promise<any> {
    return await api
      .put(API.ADMIN.STATISTIC.STAY.STATISTIC_STAY.replace(":id", `${id}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}
