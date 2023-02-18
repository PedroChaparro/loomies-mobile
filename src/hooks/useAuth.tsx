import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { loginRequest } from '../services/session';

export const useAuth = () => {
  const { user, setUser, isLoading, setIsLoading } = useContext(AuthContext);

  // Check if the user is authenticated ()
  const isAuthenticated = (): boolean => {
    return !!user && !isLoading;
  };

  // Make the login request and update the user state
  const login = async (username: string, password: string): Promise<void> => {
    setIsLoading(true);

    const [response, error] = await loginRequest(username, password);

    if (!error) {
      const { accessToken, refreshToken, user } = response;
      console.log({ accessToken, refreshToken });
      setUser(user);
    }

    setIsLoading(false);
  };

  return { isLoading, isAuthenticated, login };
};
