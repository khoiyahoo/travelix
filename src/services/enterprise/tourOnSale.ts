import { API } from "configs/constants";
import api from "../configApi";

import { FindAll, TourPrice } from "models/enterprise";

export class TourOnSaleService {
    static async createOrUpdatePriceTour(data: TourPrice[]): Promise<any> {
        return await api
          .put(API.ENTERPRISE.TOUR_ON_SALE.DEFAULT, data)
          .then((res) => {
            return Promise.resolve(res.data);
          })
          .catch((e) => {
            return Promise.reject(e?.response?.data);
          });
      }
    
      static async updatePriceTour(id: number, data: TourPrice): Promise<any> {
        return await api
          .post(API.ENTERPRISE.TOUR_ON_SALE.DEFAULT.replace(":id",`${id}`), data)
          .then((res) => {
            return Promise.resolve(res.data);
          })
          .catch((e) => {
            return Promise.reject(e?.response?.data);
          });
      }

      static async findAll(id: number, data?: FindAll): Promise<any> {
        return await api
          .get(API.ENTERPRISE.TOUR_ON_SALE.FIND_TOUR_ON_SALE.replace(":id",`${id}`), {params:data})
          .then((res) => {
            return Promise.resolve(res.data);
          })
          .catch((e) => {
            return Promise.reject(e?.response?.data);
          });
      }


}
