import { PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export interface iPosition {
  lat: number;
  lon: number;
}

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
    if (granted === 'granted') {
      return true;
    } else {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const position: any = await getCurrentPosition();
    return {
      lat: position.coords.latitude,
      lon: position.coords.longitude
    };
  } catch (error) {
    const geoError = error as Geolocation.GeoError;
    if (geoError) console.log(geoError.code, geoError.message);
    return null;
  }
};
