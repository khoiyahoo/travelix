import { API } from "configs/constants";
import { EGetAllRoomBillsAnyDate } from "models/enterprise";
import { FindAll, FindAllStaffBill, StatisticAll, StatisticOneStay, StatisticRoom, UpdateStatus } from "models/enterprise/roomBill";
import { IHotelsRevenueByMonth, IHotelsRevenueByYear } from "models/roomBill";
import api from "services/configApi";

export class RoomBillService {
  static async findAll(data: FindAll): Promise<any> {
    return await api
      .get(API.ENTERPRISE.ROOM_BILL.DEFAULT, {params: data})
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async findOne(billId: number): Promise<any> {
    return await api
      .get(API.ENTERPRISE.ROOM_BILL.GET_ONE.replace(":id", `${billId}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async getFilters(): Promise<any> {
    return await api
      .get(API.ENTERPRISE.ROOM_BILL.FILTER)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async changeStatus(billId: number, data: UpdateStatus): Promise<any> {
    return await api
      .put(API.ENTERPRISE.ROOM_BILL.GET_ONE.replace(":id", `${billId}`), data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  
  static async statisticAll(data: StatisticAll): Promise<any> {
    return await api
      .get(API.ENTERPRISE.ROOM_BILL.STATISTIC, {params: data})
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async statisticOneStay(id: number, data: StatisticOneStay): Promise<any> {
    return await api
      .get(API.ENTERPRISE.ROOM_BILL.STATISTIC_ONE.replace(":id", `${id}`), {params: data})
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async statisticOneRoom(id: number, data: StatisticRoom): Promise<any> {
    return await api
      .get(API.ENTERPRISE.ROOM_BILL.STATISTIC_ROOM.replace(":id", `${id}`), {params: data})
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async findAllStaffBill(staffId: number, data: FindAllStaffBill): Promise<any>{
    return await api
      .get(API.ENTERPRISE.ROOM_BILL.STATISTIC_STAFF_ROOM.replace(":id", `${staffId}`), {params: data})
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  ///////////////////////////////////////////////////////
  static async getRevenueOfHotelsByMonth(data: IHotelsRevenueByMonth): Promise<any> {
    return await api
      .post(API.ENTERPRISE.ROOMBILL.GET_HOTELS_REVENUE_BY_MONTH, data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  
  static async getRevenueOfHotelsByYear(data: IHotelsRevenueByYear): Promise<any> {
    return await api
      .post(API.ENTERPRISE.ROOMBILL.GET_HOTELS_REVENUE_BY_YEAR, data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  
  static async getAllBillOfAnyRoom(roomId: number): Promise<any> {
    return await api
      .get(API.ENTERPRISE.ROOMBILL.GET_ALL_BILLS_OF_ANY_ROOM.replace(":id", `${roomId}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  
  static async getAllRoomBillsAnyDate(data: EGetAllRoomBillsAnyDate): Promise<any> {
    return await api
      .post(API.ENTERPRISE.ROOMBILL.GET_BILLS_ANY_DATE, data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}
