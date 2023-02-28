import React from 'react';
import { TileManager } from './TileManager';
import { Map3DEngine } from './Map3DEngine';
import { UserPositionProvider } from '@src/context/UserPositionProvider';
import { SensorProvider } from '@src/context/SensorProvider';

export const Map3D = () => {
  return (
    <UserPositionProvider>
      <SensorProvider>
        <Map3DEngine />
        <TileManager />
      </SensorProvider>
    </UserPositionProvider>
  );
};
