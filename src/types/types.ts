export type TUser = {
  username: string;
  email: string;
};

export type TCaughtLoomies = {
  _id: string;
  serial: number;
  name: string;
  types: Array<string>;
  rarity: string;
  hp: number;
  attack: number;
  defense: number;
  is_busy: boolean;
  owner: string;
  level: number;
  experience: number;
};

export type TCaughtLoomieToRender = {
  _id: string;
  serial: number;
  name: string;
  types: Array<string>;
  rarity: string;
  hp: number;
  attack: number;
  defense: number;
  is_busy: boolean;
  owner: string;
  level: number;
  experience: number;
  // Property to render the sword icon in the loomie card
  is_in_team?: boolean;
  // Property to render a red border around the loomie card
  is_selected?: boolean;
};

export type TWildLoomies = {
  _id: string;
  serial: number;
  name: string;
  types: string[];
  rarity: string;
  hp: number;
  attack: number;
  defense: number;
  zone_id: string;
  latitude: number;
  longitude: number;
  generated_at: number; // timestamp
};

export type TGymLoomieProtector = {
  _id: string;
  serial: number;
  name: string;
  level: number;
};

export interface TGymInfo {
  _id: string;
  name: string;
  owner: string;
  protectors: TGymLoomieProtector[];
  was_reward_claimed: boolean;
}

// Shared interface between the items and the loomballs
export type TInventoryItem = {
  _id: string;
  serial: number;
  type: string;
  name: string;
  quantity: number;
};

export type TItem = {
  _id: string;
  serial: number;
  name: string;
  description: string;
  target: string;
  is_combat_item: boolean;
  quantity: number;
};

export type TLoombal = {
  _id: string;
  serial: number;
  name: string;
  quantity: number;
};

export type TReward = {
  id: string;
  serial: number;
  name: string;
  quantity: number;
};
