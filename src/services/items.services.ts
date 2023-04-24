import Axios from 'axios';
import { getStorageData } from './storage.services';
import { CONFIG } from './config.services';
import { refreshRequest } from './session.services';
import { TLoomball } from '@src/types/types';
const { API_URL } = CONFIG;

//Call the endpoint to use an item out of combat
export const useItemOutCombat = async (
  itemId: string,
  loomieId: string,
  callNumber = 1
): Promise<[any, boolean]> => {
  try {
    const [accessToken, error] = await getStorageData('accessToken');
    if (error || !accessToken) return [null, true];

    const response = await Axios.post(
      `${API_URL}/items/use`,
      {
        item_id: itemId,
        loomie_id: loomieId
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
      return await useItemOutCombat(itemId, loomieId, 2);
    }

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

export const getLoomballsService = async (): Promise<TLoomball[]> => {
  try {
    const [items, err] = await getItemsService();
    if (err) throw err;

    // cast check
    const rawData: object = items['loomballs'];
    if ((rawData as TLoomball[]) === undefined) {
      throw 'Error: getLoomballsService cast error';
    }

    // return loomballs available to player
    const loomballs: TLoomball[] = rawData as TLoomball[];

    return loomballs;
  } catch (e) {
    console.error(e);
  }

  return [];
};
