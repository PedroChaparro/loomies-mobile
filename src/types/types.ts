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
};
