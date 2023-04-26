import Axios from 'axios';
import { iRequestUserItems } from '@src/types/requestInterfaces';
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
): Promise<iRequestUserItems | null> => {
  try {
    const [accessToken, error] = await getStorageData('accessToken');
    if (error || !accessToken) return null;

    const response = await Axios.get(`${API_URL}/user/items`, {
      headers: {
        'Access-Token': accessToken
      }
    });

    // cast check
    const rawData: object = response.data;
    if ((rawData as iRequestUserItems) === undefined) {
      throw 'Error: getItemsService cast error';
    }

    // return items
    const items: iRequestUserItems = rawData as iRequestUserItems;
    return items;
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
      return null;
    }

    return null;
  }
};

export const getLoomballsService = async (): Promise<TLoomball[]> => {
  try {
    const data = await getItemsService();
    if (!data) throw 'Error: getLoomballsService when getting items';
    return data.loomballs;
  } catch (e) {
    console.error(e);
  }

  return [];
};
