/*
 * Tile Manager:
 * Check empty tiles and ensures tiles are loaded when needed
 */

import React, { useEffect, useContext, useRef } from 'react';

import { iGym, iMapObject } from '@src/types/mapInterfaces';
import { UserPositionContext } from '@src/context/UserPositionProvider';
import { MapContext } from '@src/context/MapProvider';
import {
  requestNearGyms,
  requestWildLoomies
} from '@src/services/map.services';
import * as Babylon from '@babylonjs/core';
import { ModelContext } from '@src/context/ModelProvider';
import { TWildLoomies } from '@src/types/types';
import { useInterval } from '@src/hooks/useInterval';
import {
  instantiatedEntriesRotate,
  instantiatedEntriesTranslate
} from './utilsVertex';

const DELAY_FETCH_WILD_LOOMIES = 4000; // 4 seconds

export const MapElementManager: React.FC<{ scene: Babylon.Scene | null }> = (
  props
) => {
  const { instantiateModel } = useContext(ModelContext);
  const {
    setGyms,
    getGyms,

    setWildLoomies,
    getWildLoomies,

    updateCountTiles,
    coordsGlobalToMap
  } = useContext(MapContext);
  const { userPosition } = useContext(UserPositionContext);
  const mapGyms = useRef<iMapObject[]>([]);
  const mapWildLoomies = useRef<iMapObject[]>([]);
  const readyToDrawElements = useRef<boolean>(false);

  // fetch gyms

  const fetchGyms = async () => {
    if (!userPosition) return;

    const gyms: iGym[] | null = await requestNearGyms(userPosition);

    if (gyms != null) {
      setGyms(gyms);
      drawGyms();

      // allow drawing loomies after drawing gyms
      if (!readyToDrawElements.current) {
        readyToDrawElements.current = true;
        fetchWildLoomies();
      }
    }
  };

  // fetch near wild loomies

  const fetchWildLoomies = async () => {
    if (!userPosition) return;

    const wildLoomies: TWildLoomies[] | null = await requestWildLoomies(
      userPosition
    );

    if (wildLoomies != null) {
      setWildLoomies(wildLoomies);
      drawWildLoomies();
    }
  };

  // create and update gym models

  const drawGyms = async () => {
    if (!props.scene) return;
    const scene = props.scene;
    const newGyms = getGyms();

    // clean old gyms
    const uniqueObjs: Array<iMapObject> = [];
    mapGyms.current = mapGyms.current.filter((obj) => {
      // delete if not exists or if it has already been added
      if (
        !newGyms.filter((gym) => {
          return gym.id == obj.id;
        }).length ||
        uniqueObjs.filter((gym) => {
          return gym.id == obj.id;
        }).length
      ) {
        obj.mesh.dispose();
        return false;
      }

      uniqueObjs.push(obj);
      return true;
    });

    // create new ones
    newGyms.forEach(async (gym) => {
      // already exists
      const existingObj = mapGyms.current.filter((obj) => {
        return gym.id == obj.id;
      });
      if (existingObj.length) {
        instantiatedEntriesTranslate(
          existingObj[0].mesh,
          coordsGlobalToMap(existingObj[0].origin)
        );
        return;
      }

      // clone model mesh
      const mesh = await instantiateModel('MAP_GYM', scene);
      if (!mesh) return;

      // position and rotation
      instantiatedEntriesTranslate(mesh, coordsGlobalToMap(gym.origin));
      instantiatedEntriesRotate(mesh, Math.random() * 2 * Math.PI);

      mapGyms.current.push({
        mesh: mesh,
        origin: gym.origin,
        id: gym.id
      });
    });
  };

  // create and update Loomies models

  const drawWildLoomies = async () => {
    if (!props.scene) return;
    const scene = props.scene;
    const newLoomies = getWildLoomies();

    // clean old loomies
    const uniqueObjs: Array<iMapObject> = [];
    mapWildLoomies.current = mapWildLoomies.current.filter((obj) => {
      // delete if not exists or if it has already been added
      if (
        !newLoomies.filter((loomie) => {
          return loomie._id == obj.id;
        }).length ||
        uniqueObjs.filter((loomie) => {
          return loomie.id == obj.id;
        }).length
      ) {
        obj.mesh.dispose();
        return false;
      }

      uniqueObjs.push(obj);
      return true;
    });

    // create new ones
    newLoomies.forEach(async (loomie) => {
      // already exists
      const existingObj = mapWildLoomies.current.filter((obj) => {
        return loomie._id == obj.id;
      });
      if (existingObj.length) {
        instantiatedEntriesTranslate(
          existingObj[0].mesh,
          coordsGlobalToMap(existingObj[0].origin)
        );
        return;
      }

      // clone model mesh
      const mesh = await instantiateModel(loomie.serial.toString(), scene);
      if (!mesh) return;

      // position and rotation
      instantiatedEntriesTranslate(
        mesh,
        coordsGlobalToMap({ lat: loomie.latitude, lon: loomie.longitude })
      );
      instantiatedEntriesRotate(mesh, Math.random() * 2 * Math.PI);

      mapWildLoomies.current.push({
        mesh: mesh,
        origin: {
          lat: loomie.latitude,
          lon: loomie.longitude
        },
        id: loomie._id
      });
    });
  };

  useEffect(() => {
    // update object coordinates

    mapGyms.current.forEach((obj) => {
      instantiatedEntriesTranslate(obj.mesh, coordsGlobalToMap(obj.origin));
    });

    mapWildLoomies.current.forEach((obj) => {
      instantiatedEntriesTranslate(obj.mesh, coordsGlobalToMap(obj.origin));
    });

    // update gyms when tiles change

    fetchGyms();
  }, [updateCountTiles]);

  // update at start
  useInterval(() => {
    if (readyToDrawElements.current) fetchWildLoomies();
  }, DELAY_FETCH_WILD_LOOMIES);

  return <></>;
};
