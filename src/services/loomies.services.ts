import Axios from 'axios';
import { getStorageData } from './storage.services';
import { CONFIG } from './config.services';
import { refreshRequest } from './session.services';
const { API_URL } = CONFIG;

// Get the user loomies
export const getLoomiesRequest = async (
  callNumber = 1
): Promise<[any, boolean]> => {
  try {
    const [accessToken, error] = await getStorageData('accessToken');
    if (error || !accessToken) return [null, true];

    const response = await Axios.get(`${API_URL}/user/loomies`, {
      headers: {
        'Access-Token': accessToken
      }
    });

    return [response.data, false];
  } catch (err) {
    if (
      Axios.isAxiosError(err) &&
      err.response?.status === 401 &&
      callNumber === 1
    ) {
      await refreshRequest();
      return await getLoomiesRequest(2);
    }

    if (Axios.isAxiosError(err)) {
      return [err.response?.data, true];
    }

    return [null, true];
  }
};

export const getLoomieTeamService = async (
  callNumber = 1
): Promise<[any, boolean]> => {
  try {
    const [accessToken, error] = await getStorageData('accessToken');
    if (error || !accessToken) return [null, true];

    const response = await Axios.get(`${API_URL}/user/loomie-team`, {
      headers: {
        'Access-Token': accessToken
      }
    });

    return [response.data, false];
  } catch (err) {
    if (
      Axios.isAxiosError(err) &&
      err.response?.status === 401 &&
      callNumber === 1
    ) {
      await refreshRequest();
      return await getLoomieTeamService(2);
    }

    if (Axios.isAxiosError(err)) {
      return [err.response?.data, true];
    }

    return [null, true];
  }
};

export const fuseLoomies = async (
  loomie1: string,
  loomie2: string,
  callNumber = 1
): Promise<[any, boolean]> => {
  try {
    const [accessToken, error] = await getStorageData('accessToken');
    if (error || !accessToken) return [null, true];

    const response = await Axios.post(
      `${API_URL}/loomies/fuse`,
      {
        loomie_id_1: loomie1,
        loomie_id_2: loomie2
      },
      {
        headers: {
          'Access-Token': accessToken
        }
      }
    );
    return [response.data, false];
  } catch (error) {
    // Return the custom error message if exists
    if (
      Axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      callNumber === 1
    ) {
      await refreshRequest();
      return await fuseLoomies(loomie1, loomie2, 2);
    }

    if (Axios.isAxiosError(error)) {
      return [error.response?.data, true];
    }

    return [null, true];
  }
};

export const putLoomieTeam = async (
  loomies: string[],
  callNumber = 1
): Promise<[any, boolean]> => {
  try {
    const [accessToken, error] = await getStorageData('accessToken');
    if (error || !accessToken) return [null, true];

    // Axios request with json body and headers
    const response = await Axios.put(
      `${API_URL}/user/loomie-team`,
      {
        loomie_team: loomies
      },
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
      callNumber === 1
    ) {
      await refreshRequest();
      return await putLoomieTeam(loomies, 2);
    }

    if (Axios.isAxiosError(err)) {
      return [err.response?.data, true];
    }

    return [null, true];
  }
};
