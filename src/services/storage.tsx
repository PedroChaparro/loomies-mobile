import AsyncStorage from '@react-native-async-storage/async-storage';

// Save an item in the storage and returns a boolean indicating if there was an error
export const saveStorageData = async (
  key: string,
  value: string
): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(key, value);
    return false;
  } catch (error) {
    console.error(error);
    return true;
  }
};

// Get an item from the storage and returns a boolean indicating if there was an error
export const getStorageData = async (
  key: string
): Promise<[string, boolean]> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return [value ?? '', false];
  } catch (error) {
    console.error(error);
    return ['', true];
  }
};
