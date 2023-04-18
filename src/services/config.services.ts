import { API_URL, MAP_DEBUG, PLAYER_REACH_RADIUS } from '@env';

export const CONFIG = {
  API_URL,
  MAP_DEBUG: MAP_DEBUG == 'true',
  PLAYER_REACH_RADIUS: parseFloat(PLAYER_REACH_RADIUS)
};
