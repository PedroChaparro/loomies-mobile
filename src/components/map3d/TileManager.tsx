import React, { useEffect, useContext } from 'react';

import { BBOX_SIZE, fetchMap } from './mapFetch';
import { iMap } from './mapInterfaces';
import { UserPositionContext } from '@src/context/UserPositionProvider';
//import { iPosition } from '@src/services/geolocation';
import { GRIDMAP_SIZE } from '@src/context/MapProvider';
import { MapContext, iGridPosition } from '@src/context/MapProvider';
import { iMapBundleVertexData, mapToVertexData } from './mapMeshBuilder';

export interface iQueuedTile {
  pos: iGridPosition;
  map: iMap;
  xml?: string | null;
}

export const TileManager = () => {
  // track position
  const { userPosition, cachedUserPosition } = useContext(UserPositionContext);
  const {
    getMapOrigin,
    setMapOrigin,
    getGridMeshAtPos,
    externalSetGridImageB64,
    offsetGrid
  } = useContext(MapContext);

  const collectFetchedMapInfo = async () => {
    const mapOrigin = getMapOrigin();
    if (!mapOrigin) return;

    // check grid is initialized
    const offset = (GRIDMAP_SIZE - 1) / 2;

    // iterate trought tiles
    for (let i = 0; i < GRIDMAP_SIZE; i++) {
      for (let j = 0; j < GRIDMAP_SIZE; j++) {
        // check if it is missing

        console.log('Check tile ', i, ' ', j, ' ', userPosition);

        if (getGridMeshAtPos({ x: i, y: j })) continue;

        (async () => {
          try {
            console.log('Empty tile ', i, ' ', j);
            //if (!userPosition) return;

            // fetch OSM map
            const map: iMap = await fetchMap(mapOrigin, {
              x: i - offset,
              y: j - offset
            });
            console.log('FETCHED 1 ===========================');

            // convert to mapBundle
            const mapBundle: iMapBundleVertexData = mapToVertexData(map);
            console.log('FETCHED 2 ===========================');

            // push to context
            externalSetGridImageB64(
              { x: i, y: GRIDMAP_SIZE - 1 - j },
              mapBundle
            );
            console.log('FETCHED 3 ===========================');
          } catch (error) {
            console.log("Couldn't fetch map");
          }
        })();
      }
    }
  };

  useEffect(() => {
    //console.log('User position changed');
    if (!userPosition) return;
    if (!cachedUserPosition) return;

    // set map origin if it doesn't exists
    if (!getMapOrigin()) {
      if (setMapOrigin) setMapOrigin(cachedUserPosition);
    }
    const mapOrigin = getMapOrigin();
    if (!mapOrigin) return;

    // TODO: check it's outside boundaries
    const userOffset: iGridPosition = {
      x: 0,
      y: 0
    };

    const margin = BBOX_SIZE / 8;

    if (userPosition.lon > mapOrigin.lon + BBOX_SIZE + margin) {
      userOffset.x = 1;
    } else if (userPosition.lon < mapOrigin.lon - BBOX_SIZE - margin) {
      userOffset.x = -1;
    }
    if (userPosition.lat > mapOrigin.lat + BBOX_SIZE + margin) {
      userOffset.y = 1;
    } else if (userPosition.lat < mapOrigin.lat - BBOX_SIZE - margin) {
      userOffset.y = -1;
    }

    if (userOffset.x || userOffset.y) {
      console.log('OUT OF BOUNDARIES ', userOffset);
      // offset the whole source grid
      offsetGrid(userOffset);
    }

    // check for grid changes
    collectFetchedMapInfo();
  }, [userPosition]);

  return <></>;
};
