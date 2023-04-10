import { navigate } from '@src/navigation/RootNavigation';

import { iPosition } from '@src/types/mapInterfaces';
import { Vector2 } from '@babylonjs/core';
import { requestWildLoomieExists } from '@src/services/map.services';
import { getLoomballsService } from '@src/services/user.services';

import { CONFIG } from '@src/services/config.services';
const { PLAYER_REACH_RADIUS } = CONFIG;

export const LoomieEnterCaptureView = async (
  userPosition: iPosition,
  loomiePosition: iPosition,
  loomieId: string,
  showToast: (_message: string) => void
) => {
  // check distance

  const from = new Vector2(loomiePosition.lon, loomiePosition.lat);
  const to = new Vector2(userPosition.lon, userPosition.lat);

  if (Vector2.Distance(from, to) >= PLAYER_REACH_RADIUS) {
    console.log('INFO: Too far away from Loomie ', Vector2.Distance(from, to));
    return;
  }

  // check loomie still exists

  if (!(await requestWildLoomieExists(loomieId))) {
    console.log("INFO: Loomie doesn't exists");
    return;
  }

  // check user has loomballs

  const loomballs = await getLoomballsService();
  if (!loomballs.length) {
    showToast("You don't have any Loomballs to catch this Loomie");
    return;
  }

  // Navigate to capture view

  navigate('Capture', { loomieId });
};
