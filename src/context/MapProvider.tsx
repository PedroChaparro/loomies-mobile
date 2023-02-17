import React, { createContext, useEffect, useState } from 'react';
import { iPosition } from '@src/services/geolocation';
import { iGridPosition } from '@src/components/map3d/mapInterfaces';

export const GRIDMAP_SIZE = 3; // only uneven numbers

interface iMapProvider {
  mapOrigin: iPosition | null;
  gridImageB64: Array<Array<string>>;
  externalSetGridImageB64: (_pos: iGridPosition, _base64: string) => void;
  getGridImageB64Pos: (_pos: iGridPosition) => string;
}

export const MapContext = createContext<iMapProvider | null>(null);

export const MapProvider = (props: { children: any }) => {
  const [mapOrigin, setMapOrigin] = useState<iPosition | null>(null);
  const [gridImageB64, setGridImageB64] = useState<Array<Array<string>>>([]);

  const externalSetGridImageB64 = (pos: iGridPosition, base64: string) => {
    setGridImageB64((map) => {
      map[pos.x][pos.y] = base64;
      return map;
    });
  };

  const getGridImageB64Pos = (pos: iGridPosition): string => {
    let base64 = '';
    setGridImageB64((map) => {
      base64 = map[pos.x][pos.y];
      return map;
    });
    console.log('query map in ', pos, ' result: ', base64.substr(0, 20));
    return base64;
  };

  useEffect(() => {
    // initialize gridmap
    setGridImageB64((_initialGrid) => {
      const grid: Array<Array<string>> = [];

      for (let i = 0; i < GRIDMAP_SIZE; i++) {
        grid.push([]);
        for (let j = 0; j < GRIDMAP_SIZE; j++) {
          grid[i].push('');
        }
      }

      console.log("GRID initialized");
      return grid;
    });
  }, []);

  return (
    <MapContext.Provider
      value={{
        mapOrigin,
        gridImageB64,
        externalSetGridImageB64,
        getGridImageB64Pos
      }}
    >
      {props.children}
    </MapContext.Provider>
  );
};
