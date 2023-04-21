import { TWildLoomies, TGymInfo, TReward } from '@src/types/types';

export interface iRequestGym {
  _id: string;
  latitude: number;
  longitude: number;
  name: string;
}

export interface iRequestNearGyms {
  error: boolean;
  message: string;
  nearGyms: iRequestGym[];
}

export interface iRequestInfoGym {
  error: boolean;
  message: string;
  gym: TGymInfo;
}

export interface iRequestRewards {
  error: boolean;
  message: string;
  reward: TReward;
}

export interface iRequestNearLoomies {
  error: boolean;
  message: string;
  loomies: TWildLoomies[];
}

export interface iRequestWildLoomieExists {
  error: boolean;
  message: string;
  loomie_id: string;
}

export interface iRequestCaptureLoomieAttempt {
  error: boolean;
  capture: boolean;
  message: string;
}
