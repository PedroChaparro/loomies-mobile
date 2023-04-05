import React from 'react';
import { TileManager } from './TileManager';
import { Map3DEngine } from './Map3DEngine';
import { UserPositionProvider } from '@src/context/UserPositionProvider';
import { SensorProvider } from '@src/context/SensorProvider';

interface IProps {
  gymCallback(): void;
}

export const Map3D = ({ gymCallback }: IProps) => {
  return (
    <UserPositionProvider>
      <SensorProvider>
        <Map3DEngine gymCallback={gymCallback} />
        <TileManager />
      </SensorProvider>
    </UserPositionProvider>
  );
};
