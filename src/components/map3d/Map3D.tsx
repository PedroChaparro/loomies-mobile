import React from 'react';
import { TileManager } from './TileManager';
import { Map3DEngine } from './Map3DEngine';

export const Map3D = () => {
  return (
    <>
      <Map3DEngine />
      <TileManager />
    </>
  );
};
