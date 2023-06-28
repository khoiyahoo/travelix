import axios from "axios";
import { API } from "configs/constants";
import { Tour } from "models/tour";
import api from "./configApi";

export class BankService {
  static async getBanks(): Promise<any> {
    return await axios
      .get(`https://api.vietqr.io/v2/banks`)
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((e) => {
        return Promise.reject(e);
      });
  }
}
