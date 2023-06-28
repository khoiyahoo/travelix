import { API } from "configs/constants";
import api from "../configApi";
import { findAll } from 'models/enterprise/tourSchedule';
import { CreateMultipleSchedule } from "models/enterprise";

export class TourScheduleService {
  static async findAll(data: findAll): Promise<any> {
    return await api
      .get(API.ENTERPRISE.TOUR_SCHEDULE.DEFAULT, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async createOrUpdateScheduleTour(data: CreateMultipleSchedule): Promise<any> {
    return await api
      .put(API.ENTERPRISE.TOUR_SCHEDULE.DEFAULT, data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async deleteSchedule(tourId: number, day: number): Promise<any> {
    return await api
      .delete(`${API.ENTERPRISE.TOUR_SCHEDULE.DEFAULT}/multi/${tourId}/${day}`)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async deleteScheduleItem(id: number): Promise<any> {
    return await api
      .delete(API.ENTERPRISE.TOUR_SCHEDULE.DELETE_SCHEDULE_ITEM.replace(":id", `${id}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}
