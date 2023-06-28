import { enterpriseRoutes } from './../../routes/routers';
import { API } from "configs/constants";
import { ETour, EUpdateTour, AdminGetTours, TourInformation, UpdateTourInformation, TourPrice } from "models/enterprise";
import { CreateMultipleSchedule } from "models/enterprise";
import { User } from "models/user";
import api from "../configApi";

export class TourService {
  static async createTour(data: FormData): Promise<any> {
    return await api
      .post(API.ENTERPRISE.TOUR.DEFAULT, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async getTours(data: AdminGetTours): Promise<any> {
    return await api
      .get(API.ENTERPRISE.TOUR.DEFAULT, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async getOneTour(tourId: number, language?: string): Promise<any> {
    return await api
      .get(API.ENTERPRISE.TOUR.GET_ONE_TOUR.replace(":id", `${tourId}`), {
      params: {
        language
      }
    })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async  updateTourInformation(tourId: number, data: FormData): Promise<any> {
    return await api
      .put(API.ENTERPRISE.TOUR.UPDATE_TOUR.replace(":id", `${tourId}`), data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async delete(tourId: number): Promise<any> {
    return await api
      .delete(API.ENTERPRISE.TOUR.DELETE_TOUR.replace(":id", `${tourId}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }



//===========================================================

  static async updateTour(tourId: number, data: EUpdateTour): Promise<any> {
    return await api
      .put(API.ENTERPRISE.TOUR.UPDATE_TOUR.replace(":id", `${tourId}`), data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }



  // static async getTours(userId: number): Promise<any> {
  //   return await api
  //     .get(API.ENTERPRISE.TOUR.GET_TOURS.replace(":id", `${userId}`))
  //     .then((res) => {
  //       return Promise.resolve(res.data);
  //     })
  //     .catch((e) => {
  //       return Promise.reject(e?.response?.data);
  //     });
  // }

  static async temporarilyStopWorking(tourId: number): Promise<any> {
    return await api
      .put(API.ENTERPRISE.TOUR.STOP_WORKING.replace(":id", `${tourId}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async workAgain(tourId: number): Promise<any> {
    return await api
      .put(API.ENTERPRISE.TOUR.WORK_AGAIN.replace(":id", `${tourId}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async searchTour(userId: number, name: string): Promise<any> {
    return await api
      .get(`/v1.0/tour/enterprise-search-tours/user/${userId}/tour/${name}`)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}
