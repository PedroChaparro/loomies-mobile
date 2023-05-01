import Axios from 'axios';
import { CONFIG } from './config.services';
import { getStorageData } from './storage.services';
import { refreshRequest } from './session.services';
const { API_URL } = CONFIG;

export const UpdateGymProtectorsService = async (
  gymId: string,
  protectors: string[],
  wasRetried = false
): Promise<[any, boolean]> => {
  try {
    const [accessToken, error] = await getStorageData('accessToken');
    if (error || !accessToken) return [null, true];

    const response = await Axios.put(
      `${API_URL}/gyms/update-protectors`,
      { gym_id: gymId, protectors },
      {
        headers: {
          'Access-Token': accessToken
        }
      }
    );

    return [response.data, false];
  } catch (err) {
    if (
      Axios.isAxiosError(err) &&
      err.response?.status === 401 &&
      !wasRetried
    ) {
      await refreshRequest();
      return await UpdateGymProtectorsService(gymId, protectors, true);
    }

    if (Axios.isAxiosError(err)) {
      return [err.response?.data, true];
    }

    return [null, true];
  }
};
