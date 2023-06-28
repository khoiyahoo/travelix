import { EServiceType } from "models/general";

export interface FindAll {
    serviceType: EServiceType;
    take: number;
    page: number;
    keyword?: string;
  }

  export interface Create {
    serviceType: EServiceType;
    minPrice: number;
    maxPrice: number;
    rate: number;
  }

  export interface Update {
    minPrice: number;
    maxPrice: number;
    rate: number;
  }

  export interface Commission {
    id?:number;
    serviceType: EServiceType;
    minPrice: number;
    maxPrice: number;
    rate: number;
  }
  