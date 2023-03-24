import Axios from 'axios';

import { iRequestGym, iRequestNearGyms, iRequestNearLoomies } from '@src/types/requestInterfaces';
import { iGym, iPosition } from '@src/types/mapInterfaces';
import { getStorageData } from './storage.services';
import { CONFIG } from './config.services';
import { TWildLoomies } from '@src/types/types';
const { API_URL } = CONFIG;

// Returns an array of iGyms

export const requestNearGyms = async (
  userPos: iPosition
): Promise<iGym[] | null> => {
  try {
    // get access token from the storage
    const [accessToken, error] = await getStorageData('accessToken');
    if (error || !accessToken) {
      return null;
    }

    // make request
    const response = await Axios.post(
      `${API_URL}/near_gyms`,
      {
        latitude: userPos.lat,
        longitude: userPos.lon
      },
      {
        headers: {
          'Access-Token': accessToken
        }
      }
    );

    // cast check
    const rawData: object = response.data;
    if ((rawData as iRequestNearGyms) === undefined) {
      return null;
    }

    const data: iRequestNearGyms = rawData as iRequestNearGyms;

    // transform to local data structure
    const gyms: iGym[] = data.nearGyms.map<iGym>((value: iRequestGym) => {
      return {
        origin: {
          lat: value.latitude,
          lon: value.longitude
        },
        name: value.name,
        id: value._id
      };
    });

    return gyms;
  } catch (error) {
    return null;
  }
};

// Returns an array of iGyms

export const requestWildLoomies = async (
  userPos: iPosition
): Promise<TWildLoomies[] | null> => {
  try {
    // get access token from the storage
    const [accessToken, error] = await getStorageData('accessToken');
    if (error || !accessToken) {
      return null;
    }

    // make request
    const response = await Axios.post(
      `${API_URL}/near_loomies`,
      {
        latitude: userPos.lat,
        longitude: userPos.lon
      },
      {
        headers: {
          'Access-Token': accessToken
        }
      }
    );

    // cast check
    const rawData: object = response.data;
    if ((rawData as iRequestNearLoomies) === undefined) {
      return null;
    }

    const data: iRequestNearLoomies = rawData as iRequestNearLoomies;

    // return wild loomies
    return data.loomies;
  } catch (error) {
    return null;
  }
};
