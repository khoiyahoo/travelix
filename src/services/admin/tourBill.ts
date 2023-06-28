import { API } from "configs/constants";
import { FindAllOrderNeedRefund, GetAllBillOfOneTourOnSale, StatisticAllTourOnSale, StatisticByTour, StatisticByTourOnSale, StatisticByUser } from "models/admin/tourBill";
import api from "services/configApi";

export class TourBillService {

  static async orderRefundFindAll(data: FindAllOrderNeedRefund): Promise<any> {
    return await api
      .get(API.ADMIN.STATISTIC.TOUR.ORDER_REFUND, {params: data})
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async updateRefund(id: number): Promise<any> {
    return await api
      .put(API.ADMIN.STATISTIC.TOUR.ORDER_REFUND_ONE.replace(":id", `${id}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async statisticByUser(data: StatisticByUser): Promise<any> {
    return await api
      .get(API.ADMIN.STATISTIC.TOUR.DEFAULT, {params: data})
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async statisticByTour(enterpriseId: number, data: StatisticByTour): Promise<any>{
    return await api
      .get(API.ADMIN.STATISTIC.TOUR.GET_TOUR.replace(":id", `${enterpriseId}`), {params: data})
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async statisticByTourOnSale(tourId: number, data: StatisticByTourOnSale): Promise<any>{
    return await api
      .get(API.ADMIN.STATISTIC.TOUR.GET_TOUR_ON_SALE.replace(":id", `${tourId}`), {params: data})
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async getAllBillOfOneTourOnSale(tourOnSaleId: number, data: GetAllBillOfOneTourOnSale): Promise<any>{
    return await api
      .get(API.ADMIN.STATISTIC.TOUR.GET_TOUR_ON_SALE_BILL.replace(":id", `${tourOnSaleId}`), {params: data})
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async statisticAllTourOnSale(data: StatisticAllTourOnSale): Promise<any>{
    return await api
      .get(API.ADMIN.STATISTIC.TOUR.TOUR_ON_SALE, {params: data})
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

}
