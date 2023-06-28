import { Tour } from "models/tour";

export class TourHelper {
    static isValidInformation(tour: Tour) {
        return !!tour?.title && !!tour?.contact && !!tour?.city && !!tour?.district && !!tour?.commune 
        && !!tour?.moreLocation && !!tour?.suitablePerson && !!tour?.languages && !!tour?.description && !!tour?.highlight && !!tour?.termsAndCondition
        && !!tour?.images
      }
}