/*
 * Map provider:
 * Stores and manages all map data in order to be reused
 */

import React, {
  createContext,
  useEffect,
  useState,
  useRef,
  ReactNode
} from 'react';
import { iPosition } from '@src/services/geolocation.services';
import { iMapBundleVertexData } from '@src/components/Map3D/utilsMapBuilder';
import { BBOX_SIZE } from '@src/services/mapAPI.services';
import { iGym } from '@src/types/mapInterfaces';
import { Vector3 } from '@babylonjs/core';
import { PLANE_SIZE } from '@src/components/Map3D/Map3DEngine';
import { TWildLoomies } from '@src/types/types';

export interface iGridPosition {
  x: number;
  y: number;
}

export const GRIDMAP_SIZE = 3; // only uneven numbers

interface iMapProvider {
  getMapOrigin: () => iPosition | null;
  setMapOrigin: (_pos: iPosition) => void;
  coordsGlobalToMap: (_pos: iPosition) => Vector3;
  updateCountTiles: number;

  getMapApplyingOffset: () => iGridPosition | null;
  consumeMapApplyingOffset: () => void;

  getUpdatedTiles: () => iGridPosition[];
  removeFromUpdatedTiles: (_pos: iGridPosition) => void;

  getGridMeshAtPos: (_pos: iGridPosition) => iMapBundleVertexData | null;
  externalSetTile: (
    _pos: iGridPosition,
    _mapBundle: iMapBundleVertexData
  ) => void;
  offsetGrid: (_offset: iGridPosition) => void;

  // map elements
  getGyms: () => iGym[];
  setGyms: (_newGyms: iGym[]) => void;

  getWildLoomies: () => TWildLoomies[];
  setWildLoomies: (_newWildLoomies: TWildLoomies[]) => void;
}

export const MapContext = createContext<iMapProvider>({
  getMapOrigin: () => null,
  setMapOrigin: (_pos: iPosition) => null,
  coordsGlobalToMap: (_pos: iPosition) => {
    return new Vector3(0, 0, 0);
  },
  updateCountTiles: 0,

  getMapApplyingOffset: () => null,
  consumeMapApplyingOffset: () => null,

  getUpdatedTiles: () => [],
  removeFromUpdatedTiles: (_pos: iGridPosition) => {
    return;
  },

  getGridMeshAtPos: (_pos: iGridPosition) => null,
  externalSetTile: (_pos: iGridPosition, _mapBundle: iMapBundleVertexData) => {
    return;
  },
  offsetGrid: (_offset: iGridPosition) => {
    return;
  },

  // map elements
  getGyms: () => [],
  setGyms: (_newGyms: iGym[]) => null,

  getWildLoomies: () => [],
  setWildLoomies: (_newWildLoomies: TWildLoomies[]) => null
});

export const MapProvider = (props: { children: ReactNode }) => {
  const mapOrigin = useRef<iPosition | null>(null);

  const mapApplyingOffset = useRef<iGridPosition | null>(null);
  const gridTiles = useRef<Array<Array<iMapBundleVertexData | null>>>([]);
  const updatedTiles = useRef<iGridPosition[]>([]);
  const [updateCountTiles, setUpdateCountTiles] = useState<number>(0);

  const gyms = useRef<iGym[]>([]);
  const wildLoomies = useRef<TWildLoomies[]>([]);

  // set vertex data
  const externalSetTile = (
    pos: iGridPosition,
    mapBundle: iMapBundleVertexData
  ) => {
    gridTiles.current[pos.x][pos.y] = mapBundle;

    // trigger update
    updatedTiles.current.push(pos);
    setUpdateCountTiles((count) => {
      count += 1;
      count %= 100;
      return count;
    });
  };

  const getGridMeshAtPos = (
    pos: iGridPosition
  ): iMapBundleVertexData | null => {
    if (gridTiles.current.length) return gridTiles.current[pos.x][pos.y];
    else return null;
  };

  // updated tiles
  const getUpdatedTiles = (): iGridPosition[] => {
    return updatedTiles.current;
  };

  const removeFromUpdatedTiles = (pos: iGridPosition) => {
    const tileIndex = updatedTiles.current.indexOf(pos);
    if (tileIndex > -1) updatedTiles.current.splice(tileIndex, 1);
  };

  const offsetGrid = (offset: iGridPosition) => {
    if (!mapOrigin.current) return;

    // update map origin

    setMapOrigin({
      lon: mapOrigin.current.lon + BBOX_SIZE * 2 * offset.x,
      lat: mapOrigin.current.lat + BBOX_SIZE * 2 * offset.y
    });

    mapApplyingOffset.current = offset;

    // make copy

    const gridCopy: Array<Array<iMapBundleVertexData | null>> = [];

    for (let i = 0; i < GRIDMAP_SIZE; i++) {
      gridCopy.push([]);
      for (let j = 0; j < GRIDMAP_SIZE; j++) {
        gridCopy[i].push(gridTiles.current[i][j]);
        gridTiles.current[i][j] = null;
      }
    }

    // move by offset

    const newPos: iGridPosition = { x: 0, y: 0 };
    for (let i = 0; i < GRIDMAP_SIZE; i++) {
      for (let j = 0; j < GRIDMAP_SIZE; j++) {
        newPos.x = i - offset.x;
        newPos.y = j - offset.y;

        if (
          newPos.x >= 0 &&
          newPos.x < GRIDMAP_SIZE &&
          newPos.y >= 0 &&
          newPos.y < GRIDMAP_SIZE
        ) {
          gridTiles.current[newPos.x][newPos.y] = gridCopy[i][j];
        }
      }
    }

    console.log('INFO: Tile map grid status:');
    let str = '';
    for (let i = 0; i < GRIDMAP_SIZE; i++) {
      str = '';
      for (let j = 0; j < GRIDMAP_SIZE; j++) {
        str += (+!!gridTiles.current[i][j]).toString();
      }
      console.log(str);
    }

    // trigger update
    setUpdateCountTiles((count) => {
      count += 1;
      return count % 100;
    });
  };

  // map origin

  const getMapOrigin = (): iPosition | null => {
    return mapOrigin.current;
  };

  const setMapOrigin = (pos: iPosition) => {
    mapOrigin.current = pos;
  };

  const coordsGlobalToMap = (pos: iPosition) => {
    if (!mapOrigin.current) return new Vector3(0, 0, 0);
    return new Vector3(
      ((pos.lon - mapOrigin.current.lon) / (BBOX_SIZE * 2)) * PLANE_SIZE,
      0,
      ((pos.lat - mapOrigin.current.lat) / (BBOX_SIZE * 2)) * PLANE_SIZE
    );
  };

  // map offset

  const getMapApplyingOffset = (): iGridPosition | null => {
    return mapApplyingOffset.current;
  };

  const consumeMapApplyingOffset = () => {
    mapApplyingOffset.current = null;
  };

  // gyms

  const getGyms = (): iGym[] => {
    return gyms.current;
  };

  const setGyms = (newGyms: iGym[]) => {
    gyms.current = newGyms;
  };

  // wild loomies

  const getWildLoomies = (): TWildLoomies[] => {
    return wildLoomies.current;
  };

  const setWildLoomies = (newWildLoomies: TWildLoomies[]) => {
    wildLoomies.current = newWildLoomies;
  };

  // initialize gridmap

  useEffect(() => {
    const grid: Array<Array<iMapBundleVertexData | null>> = [];

    for (let i = 0; i < GRIDMAP_SIZE; i++) {
      grid.push([]);
      for (let j = 0; j < GRIDMAP_SIZE; j++) {
        grid[i].push(null);
      }
    }

    gridTiles.current = grid;
  }, []);

  return (
    <MapContext.Provider
      value={{
        getMapOrigin,
        setMapOrigin,
        coordsGlobalToMap,
        updateCountTiles,

        getMapApplyingOffset,
        consumeMapApplyingOffset,

        getUpdatedTiles,
        removeFromUpdatedTiles,

        getGridMeshAtPos,
        externalSetTile,
        offsetGrid,

        setGyms,
        getGyms,

        setWildLoomies,
        getWildLoomies
      }}
    >
      {props.children}
    </MapContext.Provider>
  );
};
