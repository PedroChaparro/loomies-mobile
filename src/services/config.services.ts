import Config from 'react-native-config';

const TSL = Config.TSL == 'true';

export const CONFIG = {
  API_URL: TSL
    ? `https://${Config.API_URL}:${Config.PORT}`
    : `http://${Config.API_URL}:${Config.PORT}`,
  WS_URL: TSL
    ? `wss://${Config.API_URL}:${Config.PORT}`
    : `ws://${Config.API_URL}:${Config.PORT}`,
  MAP_DEBUG: Config.MAP_DEBUG == 'true',
  GAME_MIN_REQUIRED_EXPERIENCE: Config.GAME_MIN_REQUIRED_EXPERIENCE,
  GAME_EXPERIENCE_FACTOR: Config.GAME_EXPERIENCE_FACTOR,
  PLAYER_REACH_RADIUS: Config.PLAYER_REACH_RADIUS
    ? parseFloat(Config.PLAYER_REACH_RADIUS)
    : 0.008
};
