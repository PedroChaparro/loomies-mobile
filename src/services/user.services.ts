/* eslint-disable @typescript-eslint/no-explicit-any */
import Axios from 'axios';
import { CONFIG } from './config.services';
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
