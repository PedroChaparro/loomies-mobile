import React from 'react';
import { TileManager } from './TileManager';
import { Map3DEngine } from './Map3DEngine';
import { UserPositionProvider } from '@src/context/UserPositionProvider';

export const Map3D = () => {
  return (
    <>
      <UserPositionProvider>
        <Map3DEngine />
        <TileManager />
      </UserPositionProvider>
    </>
  );
};
