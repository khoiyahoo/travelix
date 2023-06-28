import { API } from "configs/constants";
import { ETour, EUpdateTour, IHotel } from "models/enterprise";
import { ICreateHotel, IUpdateHotel } from "models/hotel";
import api from "../configApi";
import { FindAll } from "models/enterprise/stay";

export class HotelService {
  static async findAll(data: FindAll): Promise<any> {
    return await api
      .get(API.ENTERPRISE.STAY.DEFAULT, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }



  //--------------------------------------------------------
  static async createHotel(data: ICreateHotel): Promise<any> {
    return await api
      .post(API.ENTERPRISE.HOTEL.CREATE_HOTEL, data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async updateHotel(hotelId: number, data: IHotel): Promise<any> {
    return await api
      .put(API.ENTERPRISE.HOTEL.UPDATE_HOTEL.replace(":id", `${hotelId}`), data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async deleteHotel(hotelId: number): Promise<any> {
    return await api
      .put(API.ENTERPRISE.HOTEL.DELETE_HOTEL.replace(":id", `${hotelId}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async getHotels(userId: number): Promise<any> {
    return await api
      .get(API.ENTERPRISE.HOTEL.GET_HOTELS.replace(":id", `${userId}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async temporarilyStopWorking(hotelId: number): Promise<any> {
    return await api.put(API.ENTERPRISE.HOTEL.STOP_WORKING.replace(":id", `${hotelId}`))
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async workAgain(hotelId: number): Promise<any> {
    return await api.put(API.ENTERPRISE.HOTEL.WORK_AGAIN.replace(":id", `${hotelId}`))
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
  static async searchHotel(userId: number, name: string): Promise<any> {
    return await api.get(`/v1.0/hotel/enterprise-search-hotels/user/${userId}/hotel/${name}`)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
}
