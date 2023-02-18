import Axios from 'axios';
import { CONFIG } from './config';
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
