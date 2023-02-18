import React, { createContext, useEffect, useState, useRef } from 'react';
import { iPosition } from '@src/services/geolocation';
import { VertexData } from '@babylonjs/core';

export interface iGridPosition {
  x: number;
  y: number;
}

export const GRIDMAP_SIZE = 3; // only uneven numbers

interface iMapProvider {
  mapOrigin: iPosition | null;
  //gridImageB64: Array<Array<string>>;

  //updatedTiles: iGridPosition[];
  removeFromUpdatedTiles: (_pos: iGridPosition) => void;
  updateCount: number;
  getUpdatedTiles: () => iGridPosition[];

  externalSetGridImageB64: (_pos: iGridPosition, _base64: string) => void;
  getGridImageB64Pos: (_pos: iGridPosition) => string;
}

export const MapContext = createContext<iMapProvider | null>(null);

export const MapProvider = (props: { children: any }) => {
  const [mapOrigin, setMapOrigin] = useState<iPosition | null>(null);
  //const [gridImageB64, setGridImageB64] = 
  const gridImageB64 = useRef<Array<Array<string>>>([]);
  //const gridImageB64 = useRef<Array<Array<VertexData[]>>>([]);
  
  const [updateCount, setUpdateCount] = useState<number>(0);
  //const [updatedTiles, setUpdatedTiles] = useState<iGridPosition[]>([]);
  const updatedTiles = useRef<iGridPosition[]>([]);

  const externalSetGridImageB64 = (pos: iGridPosition, base64: string) => {

    gridImageB64.current[pos.x][pos.y] = base64;

    // record updated tiles
    updatedTiles.current.push(pos);

    // trigger update
    setUpdateCount((count) => {
      count += 1;
      count %= 100;
      return count;
    });
  };

  const getGridImageB64Pos = (pos: iGridPosition): string => {
    console.log('query map in ', pos, ' result: ', gridImageB64.current[pos.x][pos.y].substr(0, 20));
    return gridImageB64.current[pos.x][pos.y];
  };

  const getUpdatedTiles = (): iGridPosition[] => {

    return updatedTiles.current;
    //let upTiles: iGridPosition[] = [];

    //setUpdatedTiles((tiles) => {
      //upTiles = tiles;
      //console.log("Gonna return ", upTiles)
      //return tiles;
    //});

    //console.log("Gonna actual return ", upTiles)
    //return upTiles;
  };



  const removeFromUpdatedTiles = (pos: iGridPosition) => {
    const tileIndex = updatedTiles.current.indexOf(pos);

    if (tileIndex > -1) updatedTiles.current.splice(tileIndex, 1);


    //setUpdatedTiles((tiles) => {

      //return tiles;
    //});
  }

  useEffect(() => {
    // initialize gridmap
    //setGridImageB64((_initialGrid) => {
      const grid: Array<Array<string>> = [];

      for (let i = 0; i < GRIDMAP_SIZE; i++) {
        grid.push([]);
        for (let j = 0; j < GRIDMAP_SIZE; j++) {
          grid[i].push('');
        }
      }

      console.log("GRID initialized");
      gridImageB64.current = grid;
    //});
  }, []);

  return (
    <MapContext.Provider
      value={{
        mapOrigin,
        //gridImageB64,
        externalSetGridImageB64,
        getGridImageB64Pos,
        //updatedTiles,
        removeFromUpdatedTiles,
        updateCount,
        getUpdatedTiles
      }}
    >
      {props.children}
    </MapContext.Provider>
  );
};
