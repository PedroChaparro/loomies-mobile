/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useEffect, useState } from 'react';
import { whoamiRequest } from '../services/session.services';
import { removeStorageData } from '@src/services/storage.services';
import { TUser } from '../types/types';
import { navigate } from '@src/navigation/RootNavigation';
import { useToastAlert } from '@src/hooks/useToastAlert';

// Create the context and set the initial values
export const AuthContext = createContext({
  user: null as TUser | null,
  isLoading: false,
  setUser: (_user: TUser | null) => {},
  setIsLoading: (_isLoading: boolean) => {},
  logoutService: () => {}
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { showSuccessToast, showErrorToast } = useToastAlert();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<TUser | null>(null);

  // Recover the user session from the tokens when the app starts\
  const recoverUserSession = async () => {
    const [response, error] = await whoamiRequest();

    if (!error) {
      setUser(response.user);
    }

    setIsLoading(false);
  };

  // Logout the user
  const logoutService = async () => {
    const wasRefreshTokenRemoved = await removeStorageData('refreshToken');
    if (!wasRefreshTokenRemoved) {
      showErrorToast('There was an error logging out. Please try again.');
    }

    const wasAccessTokenRemoved = await removeStorageData('accessToken');
    if (!wasAccessTokenRemoved) {
      showErrorToast('There was an error logging out. Please try again.');
    }

    setUser(null);
    setIsLoading(false);
    navigate('Login', null);
    showSuccessToast('You have been logged out successfully');
  };

  useEffect(() => {
    setIsLoading(true);
    recoverUserSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, setUser, setIsLoading, logoutService }}
    >
      {children}
    </AuthContext.Provider>
  );
};
