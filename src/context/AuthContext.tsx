/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useEffect, useState } from 'react';
import { whoamiRequest } from '../services/session.services';
import { TUser } from '../types/types';

// Create the context and set the initial values
export const AuthContext = createContext({
  user: null as TUser | null,
  isLoading: false,
  setUser: (_user: TUser | null) => {},
  setIsLoading: (_isLoading: boolean) => {}
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
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

  useEffect(() => {
    setIsLoading(true);
    recoverUserSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, setIsLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
