/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useState } from 'react';
import { TUser } from '../typescript/types';

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

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, setIsLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
