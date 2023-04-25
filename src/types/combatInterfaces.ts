// state

export enum COMBAT_STATE {
  NONE,
  PLAYING,
  LOST,
  WON
}

// messages

export enum TYPE {
  // server -> client

  start,
  UPDATE_USER_LOOMIE,
  UPDATE_USER_LOOMIE_HP,
  UPDATE_GYM_LOOMIE,
  UPDATE_GYM_LOOMIE_HP,

  ERROR,
  COMBAT_TIMEOUT,
  GYM_ATTACK_CANDIDATE,
  GYM_ATTACK_DODGED,
  USER_LOOMIE_WEAKENED,
  USER_HAS_LOST,
  USER_ATTACK_DODGED,
  GYM_LOOMIE_WEAKENED,
  USER_HAS_WON,
  ESCAPE_COMBAT,

  // client -> server

  USER_USE_ITEM,
  USER_CHANGE_LOOMIE,
  USER_DODGE,
  USER_ATTACK,
  USER_ESCAPE_COMBAT
}

export interface iCombatMessage {
  type: string;
  message: string;
  payload?:
    | iPayload_START
    | iPayload_UPDATE_USER_LOOMIE_HP
    | iPayload_UPDATE_PLAYER_LOOMIE
    | iPayload_GYM_LOOMIE_WEAKENED
    | iPayload_USER_LOOMIE_WEAKENED;
}

export interface iPayload_START {
  alive_gym_loomies: number;
  alive_user_loomies: number;
  gym_loomie: iLoomie;
  player_loomie: iLoomie;
}

export interface iPayload_UPDATE_USER_LOOMIE_HP {
  hp: number;
  loomie_id: string;
  damage: number;
  was_critical: boolean;
}

export interface iPayload_UPDATE_PLAYER_LOOMIE {
  loomie: iLoomie;
}

export interface iPayload_USER_LOOMIE_WEAKENED {
  alive_user_loomies: number;
  loomie_id: string;
}

export interface iPayload_GYM_LOOMIE_WEAKENED {
  alive_gym_loomies: number;
  loomie_id: string;
}

export interface iLoomie {
  _id: string;
  attack: number;
  boosted_attack: number;
  boosted_defense: number;
  boosted_hp: number;
  defense: number;
  experience: number;
  hp: number;
  is_busy: boolean;
  level: number;
  max_hp: number;
  name: string;
  rarity: string;
  serial: number;
  types: string[];
}
