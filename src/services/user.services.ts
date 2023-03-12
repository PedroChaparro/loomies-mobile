/* eslint-disable @typescript-eslint/no-explicit-any */
import Axios from 'axios';
import { CONFIG } from './config.services';
const { API_URL } = CONFIG;
import LoomiesMock from './user_loomies.mock.json';

// Returns if user was created or not and a boolean indicating if there was an error
export const signupRequest = async (
  email: string,
  username: string,
  password: string
): Promise<[any, boolean]> => {
  try {
    const response = await Axios.post(`${API_URL}/signup`, {
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
export const getLoomiesRequest = async (): Promise<[any, boolean]> => {
  // TODO: Fetch the API when the endpoint is ready
  return [LoomiesMock, false];
};
