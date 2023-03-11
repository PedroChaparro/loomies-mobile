/*
 * Tile Manager:
 * Check empty tiles and ensures tiles are loaded when needed
 */

import React, { useEffect, useContext } from 'react';

import { BBOX_SIZE, fetchMap } from '@src/services/mapAPI.services';

import { iMap } from '@src/types/mapInterfaces';
import { UserPositionContext } from '@src/context/UserPositionProvider';
import { GRIDMAP_SIZE } from '@src/context/MapProvider';
import { MapContext, iGridPosition } from '@src/context/MapProvider';
import { iMapBundleVertexData, mapToVertexData } from './utilsMapBuilder';

const BOUNDARY_MARGIN = BBOX_SIZE / 8;

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

        if (getGridMeshAtPos({ x: i, y: j })) continue;

        (async () => {
          try {
            console.log('INFO: Empty tile found at ', i, ' ', j);

            // fetch OSM map
            const map: iMap = await fetchMap(mapOrigin, {
              x: i - offset,
              y: GRIDMAP_SIZE - 1 - j - offset // compensate for inversed z
            });

            // convert to mapBundle
            const mapBundle: iMapBundleVertexData = mapToVertexData(map);

            // push to context
            externalSetGridImageB64({ x: i, y: j }, mapBundle);
          } catch (error) {
            console.log("ERROR: Couldn't fetch map");
          }
        })();
      }
    }
  };

  // calculate user offset from central tile
  useEffect(() => {
    if (!userPosition) return;
    if (!cachedUserPosition) return;

    // set map origin if it doesn't exists
    if (!getMapOrigin()) {
      if (setMapOrigin) setMapOrigin(cachedUserPosition);
    }
    const mapOrigin = getMapOrigin();
    if (!mapOrigin) return;

    let outOfBoundaries = false;
    const userOffset: iGridPosition = {
      x: 0,
      y: 0
    };

    if (userPosition.lon > mapOrigin.lon + BBOX_SIZE + BOUNDARY_MARGIN) {
      userOffset.x = Math.floor(
        (userPosition.lon - (mapOrigin.lon - BBOX_SIZE)) / (BBOX_SIZE * 2)
      );
      outOfBoundaries = true;
    } else if (userPosition.lon < mapOrigin.lon - BBOX_SIZE - BOUNDARY_MARGIN) {
      userOffset.x = -Math.floor(
        (mapOrigin.lon + BBOX_SIZE - userPosition.lon) / (BBOX_SIZE * 2)
      );
      outOfBoundaries = true;
    }

    if (userPosition.lat > mapOrigin.lat + BBOX_SIZE + BOUNDARY_MARGIN) {
      userOffset.y = Math.floor(
        (userPosition.lat - (mapOrigin.lat - BBOX_SIZE)) / (BBOX_SIZE * 2)
      );
      outOfBoundaries = true;
    } else if (userPosition.lat < mapOrigin.lat - BBOX_SIZE - BOUNDARY_MARGIN) {
      userOffset.y = -Math.floor(
        (mapOrigin.lat + BBOX_SIZE - userPosition.lat) / (BBOX_SIZE * 2)
      );
      outOfBoundaries = true;
    }

    if (outOfBoundaries) {
      // offset the whole source grid
      offsetGrid(userOffset);
    }

    // check for grid changes
    collectFetchedMapInfo();
  }, [userPosition]);

  return <></>;
};
