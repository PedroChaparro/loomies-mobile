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
