/* eslint-disable @typescript-eslint/no-explicit-any */
import Axios from 'axios';
import { CONFIG } from './config.services';
import { refreshRequest } from './session.services';
import { getStorageData } from './storage.services';
const { API_URL } = CONFIG;

// Returns if user was created or not and a boolean indicating if there was an error
export const signupRequest = async (
  email: string,
  username: string,
  password: string
): Promise<[any, boolean]> => {
  try {
    const response = await Axios.post(`${API_URL}/user/signup`, {
      email,
      username,
      password
    });

    return [response.data, false];
  } catch (error) {
    // Return the custom error message if exists
    if (Axios.isAxiosError(error)) {
      return [error.response?.data, true];
    }

    return [null, true];
  }
};

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

export const codeValidationRequest = async (
  email: string,
  validationCode: string
): Promise<[any, boolean]> => {
  try {
    const response = await Axios.post(`${API_URL}/user/validate`, {
      email,
      validationCode
    });
    return [response.data, false];
  } catch (error) {
    // Return the custom error message if exists
    if (Axios.isAxiosError(error)) {
      return [error.response?.data, true];
    }

    return [null, true];
  }
};

export const newCodeRequest = async (
  email: string
): Promise<[any, boolean]> => {
  try {
    const response = await Axios.post(`${API_URL}/user/validate/code`, {
      email
    });
    return [response.data, false];
  } catch (error) {
    // Return the custom error message if exists
    if (Axios.isAxiosError(error)) {
      return [error.response?.data, true];
    }

    return [null, true];
  }
};

export const getItemsService = async (
  callNumber = 1
): Promise<[any, boolean]> => {
  try {
    const [accessToken, error] = await getStorageData('accessToken');
    if (error || !accessToken) return [null, true];

    const response = await Axios.get(`${API_URL}/user/items`, {
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
      return await getItemsService(2);
    }

    if (Axios.isAxiosError(err)) {
      return [err.response?.data, true];
    }

    return [null, true];
  }
};

export const resetCodePasswordRequest = async (
  email: string
): Promise<[any, boolean]> => {
  try {
    const response = await Axios.post(`${API_URL}/user/password/code`, {
      email
    });
    return [response.data, false];
  } catch (error) {
    // Return the custom error message if exists
    if (Axios.isAxiosError(error)) {
      return [error.response?.data, true];
    }

    return [null, true];
  }
};

export const resetPasswordRequest = async (
  resetPassCode: string,
  email: string,
  password: string
): Promise<[any, boolean]> => {
  try {
    const response = await Axios.put(`${API_URL}/user/password`, {
      resetPassCode,
      email,
      password
    });
    return [response.data, false];
  } catch (error) {
    // Return the custom error message if exists
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
