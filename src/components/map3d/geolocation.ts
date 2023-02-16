import { PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

import { iPosition } from './mapInterfaces';

export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Geolocation Permission',
        message: 'Access location required',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK'
      }
    );
    console.log('granted', granted);
    if (granted === 'granted') {
      console.log('You can use Geolocation');
      return true;
    } else {
      console.log('You cannot use Geolocation');
      return false;
    }
  } catch (err) {
    return false;
  }
};

export const getPosition = async (): Promise<iPosition | null> => {
  const locationPermission: boolean = await requestLocationPermission();
  if (!locationPermission) return null;

  const opt = { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 };

  const getCurrentPosition = () =>
    new Promise((resolve, error) =>
      Geolocation.getCurrentPosition(resolve, error, opt)
    );

  try {
    const position: any = await getCurrentPosition();
    return {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }
  } catch (error) {
    const geoError = error as Geolocation.GeoError
    if (geoError)
      console.log(geoError.code, geoError.message);
    return null;
  }

};
