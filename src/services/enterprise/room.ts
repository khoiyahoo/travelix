import { API } from "configs/constants";
import { EGetRoomsAvailable } from "models/enterprise";
import { ECreateRoomOtherPrice, EditRoomInformation, EditRoomPrice, ICreateRoom } from "models/room";
import api from "../configApi";
import { CreateOrUpdateCheckRoom, FindAll, FindOne } from "models/enterprise/room";

export class RoomService {
  static async findAll(data: FindAll): Promise<any> {
    return await api
      .get(API.ENTERPRISE.ROOM.DEFAULT, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async create(data: FormData): Promise<any> {
    return await api
      .post(API.ENTERPRISE.ROOM.DEFAULT, data, {
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

  static async getRoom(roomId, data?: FindOne): Promise<any> {
    return await api
      .get(API.ENTERPRISE.ROOM.GET_ROOM.replace(":id", `${roomId}`), {params: data})
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async update(roomId: number, data?: FormData): Promise<any> {
    return await api
      .put(API.ENTERPRISE.ROOM.GET_ROOM.replace(":id", `${roomId}`), data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async createOrUpdateCheckRoom(data?: CreateOrUpdateCheckRoom): Promise<any> {
    return await api
      .put(API.ENTERPRISE.ROOM.CHECK_ROOM, data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  //--------------------------------------
  static async createRoom(data: ICreateRoom): Promise<any> {
    return await api
      .post(API.ENTERPRISE.ROOM.CREATE_ROOM, data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async getAllRooms(hotelId: number): Promise<any> {
    return await api
      .get(API.ENTERPRISE.ROOM.GET_ALL_ROOM.replace(":id", `${hotelId}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async getAllRoomsAvailable(data: EGetRoomsAvailable): Promise<any> {
    return await api
      .post(API.ENTERPRISE.ROOM.GET_ROOMS_AVAILABLE, data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async updateInformation(roomId: number, data: EditRoomInformation): Promise<any> {
    return await api
      .put(API.ENTERPRISE.ROOM.UPDATE_INFORMATION.replace(":id", `${roomId}`), data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async updatePrice(roomId: number, data: EditRoomPrice): Promise<any> {
    return await api
      .put(API.ENTERPRISE.ROOM.UPDATE_PRICE.replace(":id", `${roomId}`), data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async deleteRoom(roomId: number): Promise<any> {
    return await api
      .put(API.ENTERPRISE.ROOM.DELETE.replace(":id", `${roomId}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async temporarilyStopWorkingRoom(roomId: number): Promise<any> {
    return await api
      .put(API.ENTERPRISE.ROOM.STOP_WORKING.replace(":id", `${roomId}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async workAgain(roomId: number): Promise<any> {
    return await api
      .put(API.ENTERPRISE.ROOM.WORK_AGAIN.replace(":id", `${roomId}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async getRoomOtherPrice(roomId: number): Promise<any> {
    return await api
      .get(API.ENTERPRISE.ROOM.GET_ROOM_OTHER_PRICE.replace(":id", `${roomId}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async createRoomOtherPrice(data: ECreateRoomOtherPrice): Promise<any> {
    return await api
      .post(API.ENTERPRISE.ROOM.CREATE_ROOM_OTHER_PRICE, data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async updateRoomOtherPrice(id: number, data: ECreateRoomOtherPrice): Promise<any> {
    return await api
      .put(API.ENTERPRISE.ROOM.UPDATE_ROOM_OTHER_PRICE.replace(":id", `${id}`), data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async deleteRoomOtherPrice(id: number): Promise<any> {
    return await api
      .put(API.ENTERPRISE.ROOM.DELETE_ROOM_OTHER_PRICE.replace(":id", `${id}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}
