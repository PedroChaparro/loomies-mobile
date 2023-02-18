import React, { useEffect, useRef, useContext } from 'react';

import { fetchMap } from './mapFetch';
import { iMap } from './mapInterfaces';
import { UserPositionContext } from '@src/context/UserPositionProvider';
import { iPosition } from '@src/services/geolocation';
import { GRIDMAP_SIZE } from '@src/context/MapProvider';
import { MapContext, iGridPosition } from '@src/context/MapProvider';
import { iMapBundleVertexData, mapToVertexData } from './mapMeshBuilder';

export interface iQueuedTile {
  pos: iGridPosition;
  map: iMap;
  xml?: string | null;
}

export const TileManager = () => {
  const mapInfo = useContext(MapContext);

  // track position
  const userCachedPosition = useRef<iPosition | null>(null);
  const userPosition = useContext(UserPositionContext);

  const collectFetchedMapInfo = async () => {
    // return if context not found
    if (!mapInfo) return;

    // check grid is initialized
    //if (map)
    const offset = (GRIDMAP_SIZE - 1) / 2;

    // iterate trought tiles
    for (let i = 0; i < GRIDMAP_SIZE; i++) {
      for (let j = 0; j < GRIDMAP_SIZE; j++) {
        // check if it is missing

        console.log('Check tile ', i, ' ', j, ' ', userPosition);

        if (mapInfo?.getGridImageB64Pos({ x: i, y: j })) continue;

        (async () => {
          try {
            console.log('Empty tile ', i, ' ', j);
            if (!userPosition) return;

            // fetch OSM map
            const map: iMap = await fetchMap(userPosition, {
              x: i - offset,
              y: j - offset
            });
            console.log('FETCHED ===========================');

            // convert to mapBundle
            const mapBundle: iMapBundleVertexData = mapToVertexData(map);

            // push to context
            mapInfo?.externalSetGridImageB64({ x: i, y: j }, mapBundle);
          } catch (error) {
            console.log("Couldn't fetch map");
          }
        })();
      }
    }
  };

  useEffect(() => {
    console.log('User position changed');
    if (!userPosition) return;

    // TODO: check it's outside boundaries
    let userOffset: iGridPosition = {
      x: 0,
      y: 0
    };
    //if (userPosition.)

    // build grid
    console.log('R callling');
    collectFetchedMapInfo();
  }, [userPosition]);

  return <></>;
};
