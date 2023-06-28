import { API } from "configs/constants";
import { Cancel, Create, FindAll, IVerifyBookTour, ReSchedule, TourBill, Update } from "models/tourBill";
import api from "services/configApi";

export class TourBillService {
    static async create(data: Create): Promise<any> {
        return await api.post(API.NORMAL.TOUR_BILL.CREATE, data)
          .then((res) => {
            return Promise.resolve(res.data)
          })
          .catch((e) => {
            return Promise.reject(e?.response?.data);
          })
      }
      static async getAllTourBills(data: FindAll): Promise<any> {
        return await api.get(API.NORMAL.TOUR_BILL.DEFAULT, {params:data})
          .then((res) => {
            return Promise.resolve(res.data)
          })
          .catch((e) => {
            return Promise.reject(e?.response?.data);
          })
      }

      
    static async getTourBill(billId: number): Promise<any> {
      return await api.get(API.NORMAL.TOUR_BILL.GET_TOUR_BILL.replace(":id", `${billId}`))
        .then((res) => {
            return Promise.resolve(res.data)
        })
        .catch((e) => {
            return Promise.reject(e?.response?.data);
        })
    }

    static async getLastedTourBill(tourId: number): Promise<any> {
      return await api.get(API.NORMAL.TOUR_BILL.GET_LASTED_TOUR_BILL.replace(":id", `${tourId}`))
        .then((res) => {
            return Promise.resolve(res.data)
        })
        .catch((e) => {
            return Promise.reject(e?.response?.data);
        })
    }


    static async updateTourBill(billId: number, data: Update): Promise<any> {
      return await api.put(API.NORMAL.TOUR_BILL.UPDATE_TOUR_BILL.replace(":id", `${billId}`), data)
        .then((res) => {
            return Promise.resolve(res.data)
        })
        .catch((e) => {
            return Promise.reject(e?.response?.data);
        })
    }
    static async reSchedule(billId: number, data: ReSchedule): Promise<any> {
      return await api.put(API.NORMAL.TOUR_BILL.RESCHEDULE.replace(":id", `${billId}`), data)
        .then((res) => {
            return Promise.resolve(res.data)
        })
        .catch((e) => {
            return Promise.reject(e?.response?.data);
        })
    }


    static async payAgain(billId: number): Promise<any> {
      return await api.get(API.NORMAL.TOUR_BILL.PAY_AGAIN.replace(":id", `${billId}`))
        .then((res) => {
            return Promise.resolve(res.data)
        })
        .catch((e) => {
            return Promise.reject(e?.response?.data);
        })
    }

    static async cancelBookTour(billId: number, data: Cancel): Promise<any> {
      return await api
        .put(API.NORMAL.TOUR_BILL.CANCEL_BOOK_TOUR.replace(":id", `${billId}`), data )
        .then((res) => {
          return Promise.resolve(res.data.data);
        })
        .catch((e) => {
          return Promise.reject(e?.response?.data);
        });
    }
}