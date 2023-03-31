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
