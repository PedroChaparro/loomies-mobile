/* eslint-disable @typescript-eslint/no-explicit-any */
import Axios from 'axios';
import { CONFIG } from './config.services';
import { getStorageData, saveStorageData } from './storage.services';
const { API_URL } = CONFIG;

// Returns the user data and a boolean indicating if there was an error
export const loginRequest = async (
  email: string,
  password: string
): Promise<[any, boolean]> => {
  console.log({ API_URL });
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

// Returns the user data (sending the access token) and a boolean indicating if there was an error
export const whoamiRequest = async (
  callNumber = 1
): Promise<[any, boolean]> => {
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
    // If the error is 401 and it's the first call, try to refresh the access token and make the request again
    if (
      Axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      callNumber === 1
    ) {
      await refreshRequest();
      return await whoamiRequest(2);
    }

    // Return the custom error message if exists and the error is not 401 (unauthorized)
    if (Axios.isAxiosError(error)) {
      return [error.response?.data, true];
    }

    return [null, true];
  }
};

// Returns a new access token and a boolean indicating if there was an error
// Use this function when you require to send the Access-Token header but the token
// is expired.
export const refreshRequest = async (): Promise<[any, boolean]> => {
  console.log('Refreshing the access token...');

  try {
    // Get the refresh token from the storage
    const [refreshToken, error] = await getStorageData('refreshToken');
    if (error || !refreshToken) {
      return [null, true];
    }

    // Make the request with the Refresh-Token header
    const response = await Axios.get(`${API_URL}/refresh`, {
      headers: {
        'Refresh-Token': refreshToken
      }
    });

    // Save the new access token in the storage
    const { accessToken } = response.data;
    await saveStorageData('accessToken', accessToken);

    // Return the response message (just in case)
    return [response.data, false];
  } catch (error) {
    if (Axios.isAxiosError(error)) {
      console.log({ error: error.response?.data });
      return [error.response?.data, true];
    }

    return [null, true];
  }
};
