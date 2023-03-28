import { Engine } from '@babylonjs/core';
import { useEngine } from '@babylonjs/react-native';
import React, { createContext } from 'react';

export const LoomieDetailsSceneContext = createContext({
  engine: undefined as Engine | undefined
});

interface IProps {
  children: React.ReactNode;
}

export const LoomieDetailsSceneProvider = ({ children }: IProps) => {
  // Note: It's needed to create the engine from the context to avoid
  // the engine misses when the user change the focus of the app
  // Eg. The user goes to the Loomie details page and then goes back
  // to ghe loomies list.
  const engine = useEngine();

  return (
    <LoomieDetailsSceneContext.Provider value={{ engine }}>
      {children}
    </LoomieDetailsSceneContext.Provider>
  );
};
