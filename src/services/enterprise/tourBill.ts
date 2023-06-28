import { API } from "configs/constants";
import { Filter, FindAll, FindAllStaffBill, StatisticAll, StatisticTourOnSale, UpdateStatus } from "models/enterprise/tourBill";
import { EGetAllTourBillsAnyDate, IToursRevenueByMonth, IToursRevenueByYear, IVerifyBookTour, TourBill } from "models/tourBill";
import api from "services/configApi";

export class TourBillService {
  static async getFilters(data: Filter): Promise<any> {
    return await api
      .get(API.ENTERPRISE.TOUR_BILL.FILTER, {params: data})
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async findAll(data: FindAll): Promise<any> {
    return await api
      .get(API.ENTERPRISE.TOUR_BILL.DEFAULT, {params: data})
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async findOne(billId: number): Promise<any> {
    return await api
      .get(API.ENTERPRISE.TOUR_BILL.GET_ONE.replace(":id", `${billId}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async updateStatus(billId: number, data: UpdateStatus): Promise<any> {
    return await api
      .put(API.ENTERPRISE.TOUR_BILL.UPDATE_STATUS.replace(":id", `${billId}`), data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async statisticAll(data: StatisticAll): Promise<any> {
    return await api
      .get(API.ENTERPRISE.TOUR_BILL.STATISTIC, {params: data})
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async statisticOneTour(tourId: number, data: StatisticAll): Promise<any> {
    return await api
      .get(`${API.ENTERPRISE.TOUR_BILL.STATISTIC}/${tourId}`, {params: data})
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async GetAllBillOfOneTourOnSale(tourOnSaleId: number, data: StatisticTourOnSale): Promise<any> {
    return await api
      .get(`${API.ENTERPRISE.TOUR_BILL.GET_ALL_BILL_STATISTICS}/${tourOnSaleId}`, {params: data})
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async findAllStaffBill(staffId: number, data: FindAllStaffBill): Promise<any>{
    return await api
      .get(API.ENTERPRISE.TOUR_BILL.STATISTIC_STAFF_TOUR.replace(":id", `${staffId}`), {params: data})
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  //**************************************** */
  static async getRevenueOfToursByMonth(data: IToursRevenueByMonth): Promise<any> {
    return await api
      .post(API.ENTERPRISE.TOUR_BILL.GET_TOURS_REVENUE_BY_MONTH, data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  
  static async getRevenueOfToursByYear(data: IToursRevenueByYear): Promise<any> {
    return await api
      .post(API.ENTERPRISE.TOUR_BILL.GET_TOURS_REVENUE_BY_YEAR, data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async getAllBillOfAnyTour(tourId: number): Promise<any> {
    return await api
      .get(API.ENTERPRISE.TOUR_BILL.GET_ALL_BILLS_OF_ANY_TOUR.replace(":id", `${tourId}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  
  static async getAllTourBillsAnyDate(data: EGetAllTourBillsAnyDate): Promise<any> {
    return await api
      .post(API.ENTERPRISE.TOUR_BILL.GET_BILLS_ANY_DATE, data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}
