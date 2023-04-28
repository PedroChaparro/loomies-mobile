import {
  TWildLoomies,
  TGymInfo,
  TReward,
  TItem,
  TLoomball
} from '@src/types/types';

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
  message: string;
  was_captured: boolean;
}

export interface iRequestCombatRegister {
  error: boolean;
  message: string;
  combat_token: string;
}

export interface iRequestUserItems {
  error: boolean;
  message: string;
  items: TItem[];
  loomballs: TLoomball[];
}
