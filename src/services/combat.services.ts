import Axios from 'axios';
import { refreshRequest } from './session.services';
import { getStorageData } from './storage.services';
import { iPosition } from '@src/types/mapInterfaces';
import { iRequestCombatRegister } from '@src/types/requestInterfaces';
import { CONFIG } from './config.services';
const { API_URL } = CONFIG;

// Register a combat

export const requestCombatRegister = async (
  userPos: iPosition,
  gymId: string,
  failed = false
): Promise<iRequestCombatRegister | null> => {
  try {
    const [accessToken, error] = await getStorageData('accessToken');
    if (error || !accessToken) return null;

    const response = await Axios.post(
      `${API_URL}/combat/register`,
      {
        gym_id: gymId,
        latitude: userPos.lat,
        longitude: userPos.lon
      },
      {
        headers: {
          'Access-Token': accessToken
        }
      }
    );

    // cast check
    const rawData: object = response.data;
    if ((rawData as iRequestCombatRegister) === undefined) {
      return null;
    }

    const data: iRequestCombatRegister = rawData as iRequestCombatRegister;
    return data;
  } catch (err) {
    console.error(err);

    if (Axios.isAxiosError(err) && err.response?.status === 401 && !failed) {
      await refreshRequest();
      return await requestCombatRegister(userPos, gymId, true);
    }

    if (Axios.isAxiosError(err)) {
      return null;
    }

    return null;
  }
};
