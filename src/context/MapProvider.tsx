import React, { createContext, useEffect, useState, useRef } from 'react';
import { iPosition } from '@src/services/geolocation';
import { iMapBundleVertexData } from '@src/components/map3d/mapMeshBuilder';

export interface iGridPosition {
  x: number;
  y: number;
}

export const GRIDMAP_SIZE = 3; // only uneven numbers

interface iMapProvider {
  mapOrigin: iPosition | null;
  updateCount: number;

  getUpdatedTiles: () => iGridPosition[];
  removeFromUpdatedTiles: (_pos: iGridPosition) => void;

  getGridImageB64Pos: (_pos: iGridPosition) => iMapBundleVertexData | null;
  externalSetGridImageB64: (
    _pos: iGridPosition,
    _mapBundle: iMapBundleVertexData
  ) => void;
}

export const MapContext = createContext<iMapProvider | null>(null);

export const MapProvider = (props: { children: any }) => {
  const [mapOrigin, setMapOrigin] = useState<iPosition | null>(null);
  const [updateCount, setUpdateCount] = useState<number>(0);

  const gridImageB64 = useRef<Array<Array<iMapBundleVertexData | null>>>([]);
  const updatedTiles = useRef<iGridPosition[]>([]);

  const externalSetGridImageB64 = (
    pos: iGridPosition,
    mapBundle: iMapBundleVertexData
  ) => {
    gridImageB64.current[pos.x][pos.y] = mapBundle;

    // record updated tiles
    updatedTiles.current.push(pos);

    // trigger update
    setUpdateCount((count) => {
      count += 1;
      count %= 100;
      return count;
    });
  };

  const getGridImageB64Pos = (
    pos: iGridPosition
  ): iMapBundleVertexData | null => {
    console.log(
      'query map in ',
      pos,
      ' result: ',
      !!gridImageB64.current[pos.x][pos.y]
    );
    return gridImageB64.current[pos.x][pos.y];
  };

  const getUpdatedTiles = (): iGridPosition[] => {
    return updatedTiles.current;
  };

  const removeFromUpdatedTiles = (pos: iGridPosition) => {
    const tileIndex = updatedTiles.current.indexOf(pos);
    if (tileIndex > -1) updatedTiles.current.splice(tileIndex, 1);
  };

  useEffect(() => {
    // initialize gridmap
    const grid: Array<Array<iMapBundleVertexData | null>> = [];

    for (let i = 0; i < GRIDMAP_SIZE; i++) {
      grid.push([]);
      for (let j = 0; j < GRIDMAP_SIZE; j++) {
        grid[i].push(null);
      }
    }

    console.log('GRID initialized');
    gridImageB64.current = grid;
  }, []);

  return (
    <MapContext.Provider
      value={{
        mapOrigin,
        updateCount,

        getUpdatedTiles,
        removeFromUpdatedTiles,

        getGridImageB64Pos,
        externalSetGridImageB64
      }}
    >
      {props.children}
    </MapContext.Provider>
  );
};
