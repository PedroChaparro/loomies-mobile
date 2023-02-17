import React from 'react';
import { useEffect, useState, useRef } from 'react';

import { fetchMap } from './mapFetch';
import { mapToSVG } from './mapSvgRenderer';
import { SvgWrapper } from './SvgWrapper';
import { getPosition } from './geolocation';
import { iGridPosition, iPosition, iMap } from './mapInterfaces';

const GRIDMAP_SIZE = 3; // only uneven numbers

export const Map3D = () => {
  // track position
  const userPrevPosition = useRef<iPosition | null>(null);
  const userPosition = useRef<iPosition | null>(null);

  const gridImageB64 = useRef<Array<Array<string>>>([]);
  //const [gridImageB64, setGridImageB64] = useState<Array<Array<string>>>([]);
  const [listSvgWrappers, setListSvgComponents] = useState<string[]>([]);

  const gridIsComplete = useRef<boolean>(false);
  const posScanningTile = useRef<iGridPosition>({
    x: 0,
    y: 0
  });

  const buildGrid = async () => {
    if (gridIsComplete.current) return;

    // iterate through tiles in grid

    const offset = (GRIDMAP_SIZE - 1) / 2;

    for (let i = 0; i < GRIDMAP_SIZE; i++) {
      for (let j = 0; j < GRIDMAP_SIZE; j++) {
        //
        // check if a tile is empty

        if (gridImageB64.current[i][j] === '') {
          console.log('Check tile ', i, ' ', j, ' ', userPosition.current);
          if (!userPosition.current) continue;
          console.log('Empty tile ', i, ' ', j);

          // set scannig tile
          posScanningTile.current = {
            x: i,
            y: j
          };

          // get OSM map
          const map: iMap = await fetchMap(userPosition.current, {
            x: i - offset,
            y: j - offset
          });
          console.log('this: ', i - offset, j - offset);

          // convert to svg image
          const svg = mapToSVG(map);

          // empty list then set it again
          setListSvgComponents([]);
          setListSvgComponents([svg]);

          return;
        }
      }
    }
  };

  useEffect(() => {
    // initialize gridmap
    for (let i = 0; i < GRIDMAP_SIZE; i++) {
      gridImageB64.current.push([]);
      for (let j = 0; j < GRIDMAP_SIZE; j++) {
        gridImageB64.current[i].push('');
      }
    }

    (async () => {
      // get position
      const position = await getPosition();
      userPosition.current = position;
      console.log('Position: ', position);

      // build grid
      console.log('R callling');
      await buildGrid();
      console.log('R callling ended');
    })();
  }, []);

  const storeImageBase64 = (base64: string) => {
    setListSvgComponents([]);
    gridImageB64.current[posScanningTile.current.x][posScanningTile.current.y] =
      base64;

    // continue
    (async () => {
      buildGrid();
    })();

    // print what we have
    let complete = true;
    for (let i = 0; i < GRIDMAP_SIZE; i++) {
      let str = '';
      for (let j = 0; j < GRIDMAP_SIZE; j++) {
        complete = complete && gridImageB64.current[i][j] !== '';
        str += (gridImageB64.current[i][j] !== '') + ' ';
      }
      console.log(str);
    }

    if (complete) {
      console.log('COMPLETE\n');
      for (let i = 0; i < GRIDMAP_SIZE; i++) {
        for (let j = 0; j < GRIDMAP_SIZE; j++) {
          console.log('');
          console.log('');
          console.log(gridImageB64.current[i][j]);
        }
      }
    }
  };

  return (
    <>
      {listSvgWrappers.map((svg: string, i: number) => (
        <SvgWrapper xml={svg} key={i} storeImageBase64={storeImageBase64} />
      ))}
    </>
  );
};
