import React, { createContext, useEffect, useState } from 'react';
import { iPosition, getPosition } from '@src/services/geolocation.services';
import { CONFIG } from '@src/services/config.services';
const { MAP_DEBUG } = CONFIG;

export interface iUserPositionContext {
  userPosition: iPosition | null;
  cachedUserPosition: iPosition | null;
  debugMovePosition: (_deltaPos: iPosition) => void;
}

export const UserPositionContext = createContext<iUserPositionContext>({
  userPosition: null,
  cachedUserPosition: null,
  debugMovePosition: (_deltaPos: iPosition) => {
    return;
  }
});

export const UserPositionProvider = (props: { children: any }) => {
  const [cachedUserPosition, setCachedUserPosition] =
    useState<iPosition | null>(null);
  const [userPosition, setUserPosition] = useState<iPosition | null>(null);

  const updateUserPosition = async () => {
    console.log('Checking pos');
    // try to request position
    const newPos = await getPosition();
    if (newPos) {
      setUserPosition(newPos);

      if (!cachedUserPosition) setCachedUserPosition(newPos);
    }

    // wait 5 seconds
    if (MAP_DEBUG) return;

    await delay(5000);
    updateUserPosition();
  };

  const debugMovePosition = async (deltaPos: iPosition) => {
    console.log('New position ', userPosition);
    setUserPosition((pos) => {
      if (pos) {
        return {
          lon: pos.lon + deltaPos.lon,
          lat: pos.lat + deltaPos.lat
        };
      }
      return pos;
    });
    console.log('New position ', userPosition);
  };

  useEffect(() => {
    // start loop
    updateUserPosition();
  }, []);

  return (
    <UserPositionContext.Provider
      value={{ userPosition, cachedUserPosition, debugMovePosition }}
    >
      {props.children}
    </UserPositionContext.Provider>
  );
};

const delay = (ms: number): Promise<void> =>
  new Promise((resolve): void => {
    setTimeout(resolve, ms);
  });
