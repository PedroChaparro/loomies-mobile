/* eslint-disable @typescript-eslint/no-explicit-any */
import Axios from 'axios';
import { CONFIG } from './config';
import { getStorageData } from './storage';
const { API_URL } = CONFIG;

// Returns the user data and a boolean indicating if there was an error
export const loginRequest = async (
  email: string,
  password: string
): Promise<[any, boolean]> => {
  try {
    const response = await Axios.post(`${API_URL}/login`, {
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

export const whoamiRequest = async (): Promise<[any, boolean]> => {
  try {
    // Recover the access token from the storage
    const [accessToken, error] = await getStorageData('accessToken');
    if (error || !accessToken) {
      return [null, true];
    }

    // Make the request with the Access-Token header
    const response = await Axios.get(`${API_URL}/whoami`, {
      headers: {
        'Access-Token': accessToken
      }
    });

    return [response.data, false];
  } catch (error) {
    if (Axios.isAxiosError(error)) {
      return [error.response?.data, true];
    }

    return [null, true];
  }
};
