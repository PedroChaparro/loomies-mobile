import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { loginRequest } from '../services/session';
import { saveStorageData } from '../services/storage';

export const useAuth = () => {
  const { user, setUser, isLoading, setIsLoading } = useContext(AuthContext);

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

  return { isLoading, isAuthenticated, login };
};
