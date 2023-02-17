import React, { createContext, useEffect, useState } from 'react';
import { iPosition, getPosition } from '@src/services/geolocation';

//interface iUserPositionContext {
  //userPosition: iPosition | null;
//}

export const UserPositionContext = createContext<iPosition | null>(null);

export const UserPositionProvider = (props: { children: any }) => {
  const [userPosition, setUserPosition] = useState<iPosition | null>(null);

  const updateUserPosition = async () => {
    console.log("Checking pos");
    // try to request position
    const newPos = await getPosition();
    if (newPos) setUserPosition(newPos);

    // wait 5 seconds
    await delay(5000);
    updateUserPosition();
  };

  useEffect(() => {
    // start loop
    updateUserPosition();
  }, []);

  return (
    <UserPositionContext.Provider value={ userPosition }>
      {props.children}
    </UserPositionContext.Provider>
  );
};

const delay = (ms: number): Promise<void> =>
  new Promise((resolve): void => {
    setTimeout(resolve, ms);
  });
