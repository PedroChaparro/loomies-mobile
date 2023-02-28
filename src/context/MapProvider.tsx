import React, { createContext, useEffect, useState, useRef } from 'react';
import { iPosition } from '@src/services/geolocation.services';
import { iMapBundleVertexData } from '@src/components/Map3D/mapMeshBuilder';
import { BBOX_SIZE } from '@src/services/mapAPI.services';

export interface iGridPosition {
  x: number;
  y: number;
}

export const GRIDMAP_SIZE = 3; // only uneven numbers

interface iMapProvider {
  getMapOrigin: () => iPosition | null;
  setMapOrigin: (_pos: iPosition) => void;
  updateCount: number;

  getMapApplyingOffset: () => iGridPosition | null;
  consumeMapApplyingOffset: () => void;

  getUpdatedTiles: () => iGridPosition[];
  removeFromUpdatedTiles: (_pos: iGridPosition) => void;

  getGridMeshAtPos: (_pos: iGridPosition) => iMapBundleVertexData | null;
  externalSetGridImageB64: (
    _pos: iGridPosition,
    _mapBundle: iMapBundleVertexData
  ) => void;
  offsetGrid: (_offset: iGridPosition) => void;
}

export const MapContext = createContext<iMapProvider>({
  getMapOrigin: () => null,
  setMapOrigin: (_pos: iPosition) => null,
  updateCount: 0,

  getMapApplyingOffset: () => null,
  consumeMapApplyingOffset: () => null,

  getUpdatedTiles: () => [],
  removeFromUpdatedTiles: (_pos: iGridPosition) => {
    return;
  },

  getGridMeshAtPos: (_pos: iGridPosition) => null,
  externalSetGridImageB64: (
    _pos: iGridPosition,
    _mapBundle: iMapBundleVertexData
  ) => {
    return;
  },
  offsetGrid: (_offset: iGridPosition) => {
    return;
  }
});

// in charge of caching map data in order to be reused

export const MapProvider = (props: { children: any }) => {
  const [updateCount, setUpdateCount] = useState<number>(0);
  const mapOrigin = useRef<iPosition | null>(null);

  const mapApplyingOffset = useRef<iGridPosition | null>(null);
  const gridImageB64 = useRef<Array<Array<iMapBundleVertexData | null>>>([]);
  const updatedTiles = useRef<iGridPosition[]>([]);

  // set vertex data
  const externalSetGridImageB64 = (
    pos: iGridPosition,
    mapBundle: iMapBundleVertexData
  ) => {
    gridImageB64.current[pos.x][pos.y] = mapBundle;
    console.log('settet grid ', pos, ' to ', !!mapBundle);

    // trigger update
    updatedTiles.current.push(pos);
    setUpdateCount((count) => {
      count += 1;
      count %= 100;
      return count;
    });
  };

  const getGridMeshAtPos = (
    pos: iGridPosition
  ): iMapBundleVertexData | null => {
    //console.log(
    //'query map in ',
    //pos,
    //' result: ',
    //!!gridImageB64.current[pos.x][pos.y]
    //);
    if (gridImageB64.current.length) return gridImageB64.current[pos.x][pos.y];
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

    console.log('old map origin ', mapOrigin.current);
    setMapOrigin({
      lon: mapOrigin.current.lon + BBOX_SIZE * 2 * offset.x,
      lat: mapOrigin.current.lat + BBOX_SIZE * 2 * offset.y
    });
    console.log('new map origin ', mapOrigin.current);

    mapApplyingOffset.current = offset;

    // make copy

    const gridCopy: Array<Array<iMapBundleVertexData | null>> = [];

    for (let i = 0; i < GRIDMAP_SIZE; i++) {
      gridCopy.push([]);
      for (let j = 0; j < GRIDMAP_SIZE; j++) {
        gridCopy[i].push(gridImageB64.current[i][j]);
        gridImageB64.current[i][j] = null;
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
          gridImageB64.current[newPos.x][newPos.y] = gridCopy[i][j];
          console.log(
            'offset accepted ',
            newPos,
            !!gridImageB64.current[newPos.x][newPos.y]
          );
        }

        // delete if outside
        else {
          console.log('offset outside of accepted range ', newPos);
        }
      }
    }
    console.log('=========\nWhat we have:');
    let str = '';
    for (let i = 0; i < GRIDMAP_SIZE; i++) {
      str = '';
      for (let j = 0; j < GRIDMAP_SIZE; j++) {
        str += (+!!gridImageB64.current[i][j]).toString();
      }
      console.log(str);
    }

    // trigger update
    setUpdateCount((count) => {
      count += 1;
      count %= 100;
      return count;
    });
  };

  // map origin

  const getMapOrigin = (): iPosition | null => {
    return mapOrigin.current;
  };

  const setMapOrigin = (pos: iPosition) => {
    mapOrigin.current = pos;
  };

  // map offset

  const getMapApplyingOffset = (): iGridPosition | null => {
    return mapApplyingOffset.current;
  };

  const consumeMapApplyingOffset = () => {
    mapApplyingOffset.current = null;
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

    console.log('GRID initialized');
    gridImageB64.current = grid;
  }, []);

  return (
    <MapContext.Provider
      value={{
        getMapOrigin,
        setMapOrigin,
        updateCount,

        getMapApplyingOffset,
        consumeMapApplyingOffset,

        getUpdatedTiles,
        removeFromUpdatedTiles,

        getGridMeshAtPos,
        externalSetGridImageB64,
        offsetGrid
      }}
    >
      {props.children}
    </MapContext.Provider>
  );
};
