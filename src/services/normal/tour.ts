import { API } from "configs/constants";
import { NormalGetTours } from "models/tour";
import api from "services/configApi";

export class TourService {
  static async getAllTours(data: NormalGetTours): Promise<any> {
    return await api
      .get(API.NORMAL.TOUR.DEFAULT, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async getTour(id: number): Promise<any> {
    return await api
      .get(API.NORMAL.TOUR.DETAIL_TOUR.replace(":id", `${id}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

}


