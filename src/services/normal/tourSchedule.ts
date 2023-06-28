import { API } from "configs/constants";
import api from "services/configApi";

export class TourScheduleService {
  static async getTourSchedule(tourId: number): Promise<any> {
    return await api
      .get(API.NORMAL.TOUR_SCHEDULE.GET_TOUR_SCHEDULE.replace(":tourId", `${tourId}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

}
