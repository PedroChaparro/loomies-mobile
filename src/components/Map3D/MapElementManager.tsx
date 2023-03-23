/*
 * Tile Manager:
 * Check empty tiles and ensures tiles are loaded when needed
 */

import React, { useEffect, useContext, useRef } from 'react';

import { iGym, iMapObject } from '@src/types/mapInterfaces';
import { UserPositionContext } from '@src/context/UserPositionProvider';
import { MapContext } from '@src/context/MapProvider';
import { getNearGyms } from '@src/services/map.services';
import * as Babylon from '@babylonjs/core';
import { ModelContext } from '@src/context/ModelProvider';

export const MapElementManager: React.FC<{ scene: Babylon.Scene | null }> = (
  props
) => {
  const { instantiateModel } = useContext(ModelContext);
  const {
    setGyms,
    getGyms,
    updateCountGym,
    updateCountTiles,
    coordsGlobalToMap
  } = useContext(MapContext);
  const { userPosition } = useContext(UserPositionContext);
  const mapGyms = useRef<iMapObject[]>([]);

  const fetchGyms = async () => {
    if (!userPosition) return;

    const gyms: iGym[] | null = await getNearGyms(userPosition);

    if (gyms != null) {
      setGyms(gyms);
    }
  };

  // import the gym model

  const drawGyms = async () => {
    if (!props.scene) return;
    const scene = props.scene;
    const newGyms = getGyms();

    // clean old gyms
    const addedGyms: Array<iMapObject> = [];
    mapGyms.current = mapGyms.current.filter((obj) => {
      // delete if not exists or if it has already been added
      if (
        !newGyms.filter((gym) => {
          return gym.id == obj.id;
        }).length ||
        addedGyms.filter((gym) => {
          return gym.id == obj.id;
        }).length
      ) {
        obj.mesh.dispose();
        return false;
      }

      addedGyms.push(obj);
      return true;
    });

    // create new ones
    newGyms.forEach(async (gym) => {
      // already exists
      const existingGym = mapGyms.current.filter((obj) => {
        return gym.id == obj.id;
      });
      if (existingGym.length) {
        existingGym[0].mesh.position = coordsGlobalToMap(existingGym[0].origin);
        return;
      }

      // clone model mesh
      const mesh = await instantiateModel('MAP_GYM', scene);
      if (!mesh) return;

      mesh.position = coordsGlobalToMap(gym.origin);
      mapGyms.current.push({
        mesh: mesh,
        origin: gym.origin,
        id: gym.id
      });
    });
  };

  // update gyms when tiles change
  useEffect(() => {
    // update object coordinates
    mapGyms.current.forEach((obj) => {
      obj.mesh.position = coordsGlobalToMap(obj.origin);
    });

    fetchGyms();
  }, [updateCountTiles]);

  useEffect(() => {
    drawGyms();
  }, [updateCountGym]);

  // update at start
  useEffect(() => {
    //importModels();
  }, []);

  return <></>;
};
