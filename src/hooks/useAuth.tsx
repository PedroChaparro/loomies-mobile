import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { loginRequest } from '../services/session.services';
import {
  removeStorageData,
  saveStorageData
} from '../services/storage.services';
import { useToastAlert } from './useToastAlert';
import { navigate } from '@src/navigation/RootNavigation';

export const useAuth = () => {
  const { user, setUser, isLoading, setIsLoading } = useContext(AuthContext);
  const { showErrorToast, showSuccessToast } = useToastAlert();

  // Check if the user is authenticated ()
  const isAuthenticated = (): boolean => {
    return !!user && !isLoading;
  };

  // Make the login request and update the user state
  const login = async (
    username: string,
    password: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<[any, boolean]> => {
    setIsLoading(true);

    const [response, error] = await loginRequest(username, password);

    if (!error) {
      const { accessToken, refreshToken, user } = response;

      // TODO: Handle the error if the tokens are not saved
      await saveStorageData('accessToken', accessToken);
      await saveStorageData('refreshToken', refreshToken);
      setUser(user);
    }

    setIsLoading(false);
    return [response, error];
  };

  const logout = async () => {
    const wasRefreshTokenRemoved = await removeStorageData('refreshToken');
    if (!wasRefreshTokenRemoved) {
      showErrorToast('There was an error logging out. Please try again.');
    }

    // We don't care if the access token was removed or not because it will be
    // expired anyway and we are nullifying the user state so the user cannot
    // access any protected route
    await removeStorageData('accessToken');
    setUser(null);
    setIsLoading(false);
    navigate('Login', null);
    showSuccessToast('You have been logged out successfully');
  };

  return { isLoading, isAuthenticated, login, logout };
};
