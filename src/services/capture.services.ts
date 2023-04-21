import Axios from 'axios';

import { iRequestCaptureLoomieAttempt } from '@src/types/requestInterfaces';
import { iPosition } from '@src/types/mapInterfaces';
import { getStorageData } from './storage.services';
import { CONFIG } from './config.services';
import { refreshRequest } from './session.services';
const { API_URL } = CONFIG;

// throw ball service

export const enum CAPTURE_RESULT {
  CAPTURED,
  ESCAPED,
  NOTFOUND
}

export const requestCaptureLoomieAttempt = async (
  userPos: iPosition,
  loomieId: string,
  loomballId: string,
  failed = false
): Promise<CAPTURE_RESULT> => {
  try {
    // get access token from the storage
    const [accessToken, error] = await getStorageData('accessToken');
    if (error || !accessToken) {
      return CAPTURE_RESULT.NOTFOUND;
    }

    // make request
    const response = await Axios.post(
      `${API_URL}/loomies/capture`,
      {
        latitude: userPos.lat,
        longitude: userPos.lon,
        loomie_id: loomieId,
        loomball_id: loomballId
      },
      {
        headers: {
          'Access-Token': accessToken
        }
      }
    );

    // cast check
    const rawData: object = response.data;
    if ((rawData as iRequestCaptureLoomieAttempt) === undefined) {
      return CAPTURE_RESULT.NOTFOUND;
    }

    const data: iRequestCaptureLoomieAttempt =
      rawData as iRequestCaptureLoomieAttempt;
    return data.capture ? CAPTURE_RESULT.CAPTURED : CAPTURE_RESULT.ESCAPED;
  } catch (error) {
    // If 401, try to refresh the access token and retry the request
    if (
      Axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      !failed
    ) {
      await refreshRequest();
      return await requestCaptureLoomieAttempt(userPos, loomieId, loomballId);
    }

    // fallback to not found
    return CAPTURE_RESULT.NOTFOUND;
  }
};
