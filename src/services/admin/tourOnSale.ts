import { API } from "configs/constants";
import { FindAllOrderNeedRefund, GetAllBillOfOneTourOnSale, StatisticByTour, StatisticByTourOnSale, StatisticByUser } from "models/admin/tourBill";
import api from "services/configApi";

export class TourOnSaleService {

  static async updateReceivedRevenue(id: number): Promise<any> {
    return await api
      .put(API.ADMIN.TOUR_ON_SALE.GET_ID.replace(":id", `${id}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}
