import { EServiceType } from "models/general";

export interface FindAll {
    serviceType: EServiceType;
  }


  export interface Commission {
    id?:number;
    serviceType: EServiceType;
    minPrice: number;
    maxPrice: number;
    rate: number;
  }
  