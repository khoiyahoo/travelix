import { Policy } from "models/enterprise/policy";
import { EServicePolicyType, EBillStatus } from "models/general";

export class BillHelper {
  static isCanReScheduleOrCancelBooking(billStatus: number, useDate: Date, policyType: EServicePolicyType, policies: Policy[]) {
    if (billStatus !== EBillStatus.NOT_CONTACTED_YET && billStatus !== EBillStatus.CONTACTED) return false;
    if (!policies?.length) return true;
    const diffTime = (new Date(useDate).valueOf() - new Date().valueOf()) / (1000 * 60 * 60 * 24);
    if (diffTime < 0) return false;
    let isCan = false;
    policies.map((item) => {
      if (item.policyType === policyType && diffTime >= item.dayRange) isCan = true;
    });
    return isCan;
  }

  // static isCancelBooking(useDate: Date, policies: Policy[]) {
  //   if (!policies?.length) return true;
  //   const diffTime = (new Date(useDate).valueOf() - new Date().valueOf()) / (1000 * 60 * 60 * 24);
  //   if (diffTime < 0) return false;
  //   let isCan = false;
  //   policies.map((item) => {
  //     if (item.policyType === EServicePolicyType.REFUND && diffTime >= item.dayRange) isCan = true;
  //   });
  //   return isCan;
  // }

  // static getReScheduleRate(useDate: Date, policies: Policy[]) {
  //   if (!policies?.length) return 100;
  //   const diffTime = (new Date(useDate).valueOf() - new Date().valueOf()) / (1000 * 60 * 60 * 24);
  //   if (diffTime < 0) return 0;
  //   let rate = 0;
  //   policies.map((item) => {
  //     if (item.policyType === EServicePolicyType.RESCHEDULE && diffTime >= item.dayRange) rate = item.moneyRate;
  //   });
  //   return rate;
  // }

  static getRefundRate(useDate: Date, policyType: EServicePolicyType, policies: Policy[]) {
    if (!policies?.length) return 100;
    const diffTime = (new Date(useDate).valueOf() - new Date().valueOf()) / (1000 * 60 * 60 * 24);
    if (diffTime < 0) return 0;
    let rate = 0;
    policies.map((item) => {
      if (item.policyType === policyType && diffTime >= item.dayRange) rate = item.moneyRate;
    });
    return rate;
  }
}
