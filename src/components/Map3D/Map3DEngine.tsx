/*
 * Map 3D Engine:
 * Manages all 3D objects in the map
 * Manages the Babylon 3D engine
 */

import React, { useEffect, useState, useRef, useContext } from 'react';
import { SafeAreaView, View, Button } from 'react-native';
import { EngineView, useEngine } from '@babylonjs/react-native';

import * as Babylon from '@babylonjs/core';
import { Tools } from '@babylonjs/core/Misc';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import '@babylonjs/loaders/glTF';

import { SensorContext } from '@src/context/SensorProvider';
import { UserPositionContext } from '@src/context/UserPositionProvider';

import { GRIDMAP_SIZE, iGridPosition } from '@src/context/MapProvider';
import { BBOX_SIZE } from '@src/services/mapAPI.services';
import { MapContext } from '@src/context/MapProvider';
import { createGradientPlane } from './utilsVertex';
import { iMapBundleVertexData, generateRoad } from './utilsMapBuilder';

// modules
import { MapElementManager } from '@src/components/MapElementManager/MapElementManager';

// debug
import { CONFIG } from '@src/services/config.services';
import { ModelContext } from '@src/context/ModelProvider';
import { APP_SCENE, BabylonContext } from '@src/context/BabylonProvider';
const { MAP_DEBUG } = CONFIG;
const DEBUG_MOVE_DISTANCE = 0.0002;

// drawing constants
export const PLANE_SIZE = 20;
const GROUND_SCALE = 4;
const ROAD_HEIGHT = 0.07;
const ROAD_BORDER_HEIGHT = 0.05;
const CIRCLE_INDICATOR_HEIGHT = 0.09;

const COLOR_BACKGROUND_BOT = [0.74, 1, 0.42];
const COLOR_BACKGROUND_TOP = [0.03, 0.53, 0.18];

const COLOR_ROAD_BORDER = '#658298';
const COLOR_ROAD_FILL = '#FFFFFF';

// animation constants
const ANI_LERP_SPEED = 0.2;
const ANI_LERP_MERGE_DISTANCE_POSITION = 0.1;
const ANI_LERP_MERGE_DISTANCE_ROTATION = Tools.ToRadians(1);

export const Map3DEngine = () => {
  // user position debug method
  const { userPosition, debugMovePosition } = useContext(UserPositionContext);
  const { deviceYaw } = useContext(SensorContext);

  // map info
  const {
    getMapOrigin,
    removeFromUpdatedTiles,

    updateCountTiles,
    getUpdatedTiles,
    getGridMeshAtPos,

    getMapApplyingOffset,
    consumeMapApplyingOffset
  } = useContext(MapContext);

  // engine related
  const {
    engine,
    sceneMap,

    cameraMap,
    getCurrentScene
  } = useContext(BabylonContext);

  // map drawing
  const { cloneModel } = useContext(ModelContext);
  const playerNode = useRef<Babylon.Mesh>();
  const playerNodeTargetPos = useRef<Babylon.Vector3>(Vector3.Zero());
  const meshGrid = useRef<Array<Array<Babylon.Mesh | null>>>([]);

  // startup
  useEffect(() => {
    if (meshGrid.current.length) return;
    if (!engine) return;
    if (!sceneMap) return;

    console.log('INFO: Setting up scene');

    // create player
    const playerRootMesh: Babylon.Mesh = Babylon.MeshBuilder.CreateBox(
      'playerRootMesh',
      { size: 1 },
      sceneMap
    );
    playerRootMesh.visibility = 0;
    playerNode.current = playerRootMesh;

    // create lights
    const light = new HemisphericLight(
      'light',
      new Vector3(5, 10, 0),
      sceneMap
    );
    light.intensity = 0.9;

    // config camera

    if (sceneMap.activeCamera) {
      const camera = sceneMap.activeCamera as ArcRotateCamera;
      camera.checkCollisions = false;
      camera.panningSensibility = 0;

      // limit camera zoom
      if (!MAP_DEBUG) {
        camera.lowerRadiusLimit = 20;
        camera.upperRadiusLimit = 30;
      } else camera.lowerRadiusLimit = 10;

      // limit camera angle
      camera.lowerBetaLimit = (Math.PI * 1) / 16;
      camera.upperBetaLimit = Math.PI / 4;

      camera.setTarget(Babylon.Vector3.Zero());
      camera.alpha = Math.PI / 8;
      camera.beta = Math.PI / 8;
      camera.radius = 10;

      // lock to player
      camera.lockedTarget = playerNode.current;
    }

    // create ground plane
    const planeGround = createGradientPlane(
      PLANE_SIZE * GROUND_SCALE,
      new Babylon.Color3(...COLOR_BACKGROUND_BOT),
      new Babylon.Color3(...COLOR_BACKGROUND_TOP),
      sceneMap
    );
    planeGround.position.y = 0;
    planeGround.rotation.x = Math.PI / 2;
    planeGround.isPickable = false;

    // initialize gridmap
    const gridOffset = (GRIDMAP_SIZE - 1) / 2 + 0.5;

    for (let i = 0; i < GRIDMAP_SIZE; i++) {
      meshGrid.current.push([]);
      for (let j = 0; j < GRIDMAP_SIZE; j++) {
        meshGrid.current[i].push(null);

        // draw debug boundarie separators
        if (MAP_DEBUG) {
          const boundariesPath = [
            new Vector3(
              (i - gridOffset) * PLANE_SIZE,
              3,
              (j - gridOffset) * PLANE_SIZE
            ),
            new Vector3(
              (i - gridOffset + 1) * PLANE_SIZE,
              3,
              (j - gridOffset) * PLANE_SIZE
            ),
            new Vector3(
              (i - gridOffset + 1) * PLANE_SIZE,
              3,
              (j - gridOffset + 1) * PLANE_SIZE
            ),
            new Vector3(
              (i - gridOffset) * PLANE_SIZE,
              3,
              (j - gridOffset + 1) * PLANE_SIZE
            ),
            new Vector3(
              (i - gridOffset) * PLANE_SIZE,
              3,
              (j - gridOffset) * PLANE_SIZE
            )
          ];
          Babylon.MeshBuilder.CreateTube(
            'tube',
            { path: boundariesPath, radius: 1 },
            sceneMap
          );
        }
      }
    }

    // load player model
    (async () => {
      try {
        console.log('A1');
        const playerModel = await cloneModel('MAP_PLAYER', sceneMap);
        const circleIndicatorModel = await cloneModel(
          'MAP_CIRCLE_INDICATOR',
          sceneMap
        );

        console.log('A2');
        if (playerModel && playerNode.current) {
          playerModel.setParent(playerNode.current);
        }
        console.log('A3');

        if (circleIndicatorModel && playerNode.current) {
          circleIndicatorModel.position.y = CIRCLE_INDICATOR_HEIGHT;
          circleIndicatorModel.setParent(playerNode.current);
        }
        console.log('A4');
      } catch (error) {
        console.log("ERROR: Couldn't load model.");
      }
    })();

    // (debug) map axes
    if (MAP_DEBUG) new Babylon.AxesViewer(sceneMap, 5);

    console.log('INFO: Finished setting up scene');
  }, [sceneMap]);

  const UpdateTileMesh = () => {
    // everything is initialized
    if (!sceneMap) return;
    if (!meshGrid.current.length) return;

    // apply offset if any
    const offset: iGridPosition | null = getMapApplyingOffset();
    if (offset) {
      offset.x = -offset.x;
      offset.y = -offset.y;

      const newPos: iGridPosition = { x: 0, y: 0 };
      let mesh: Babylon.Mesh | null;

      // make copy
      const gridCopy: Array<Array<Babylon.Mesh | null>> = [];

      for (let i = 0; i < GRIDMAP_SIZE; i++) {
        gridCopy.push([]);
        for (let j = 0; j < GRIDMAP_SIZE; j++) {
          gridCopy[i].push(meshGrid.current[i][j]);
          meshGrid.current[i][j] = null;
        }
      }

      // apply offset
      for (let i = 0; i < GRIDMAP_SIZE; i++) {
        for (let j = 0; j < GRIDMAP_SIZE; j++) {
          mesh = gridCopy[i][j];
          if (!mesh) continue;

          newPos.x = i + offset.x;
          newPos.y = j + offset.y;

          if (
            newPos.x >= 0 &&
            newPos.x < GRIDMAP_SIZE &&
            newPos.y >= 0 &&
            newPos.y < GRIDMAP_SIZE
          ) {
            mesh.position = new Vector3(
              mesh.position.x + PLANE_SIZE * offset.x,
              0,
              mesh.position.z + PLANE_SIZE * offset.y
            );

            // reparent
            meshGrid.current[newPos.x][newPos.y] = gridCopy[i][j];
          }

          // delete if outside
          else {
            mesh.dispose();
          }
        }
      }

      // consume
      consumeMapApplyingOffset();

      // update player position
      updatePlayerPos(true);
    }

    // iterate through updated tiles

    let mapBundle: iMapBundleVertexData | null;
    const gridOffset = (GRIDMAP_SIZE - 1) / 2 + 0.5;

    getUpdatedTiles().forEach((tilePos: iGridPosition) => {
      // Delete current tile mesh if exists
      const oldMesh = meshGrid.current[tilePos.x][tilePos.y];
      if (oldMesh) {
        oldMesh.dispose();
      }

      // Source vertexData exists
      mapBundle = getGridMeshAtPos(tilePos);
      if (!mapBundle) return;

      // Create different elements

      // ROADS
      const roads = generateRoad(mapBundle.roads, COLOR_ROAD_FILL, sceneMap);
      roads.position.y = ROAD_HEIGHT;

      // ROADS BORDER
      const roadsBorder = generateRoad(
        mapBundle.roadsBorder,
        COLOR_ROAD_BORDER,
        sceneMap
      );
      roadsBorder.position.y = ROAD_BORDER_HEIGHT;

      // merge them
      const finalMergedMesh = Babylon.Mesh.MergeMeshes(
        [roads, roadsBorder],
        true,
        true,
        undefined,
        false,
        true
      );
      if (finalMergedMesh) {
        finalMergedMesh.position = new Vector3(
          (tilePos.x - gridOffset) * PLANE_SIZE,
          0,
          (tilePos.y - gridOffset) * PLANE_SIZE
        );
        finalMergedMesh.isPickable = false;
      }

      // store
      meshGrid.current[tilePos.x][tilePos.y] = finalMergedMesh;

      // finish ticket
      removeFromUpdatedTiles(tilePos);
    });
  };

  // move player physical representation in the map
  const updatePlayerPos = (absolute = false) => {
    if (!userPosition) return;
    const mapOrigin = getMapOrigin();
    if (!mapOrigin) return;
    if (!playerNode.current) return;

    // translate smoothly to new position

    if (absolute) {
      const currPos = playerNode.current.position;
      const targPos = playerNodeTargetPos.current;
      const newPos = new Vector3(
        ((userPosition.lon - mapOrigin.lon) / (BBOX_SIZE * 2)) * PLANE_SIZE,
        0,
        ((userPosition.lat - mapOrigin.lat) / (BBOX_SIZE * 2)) * PLANE_SIZE
      );

      playerNode.current.position = new Vector3(
        newPos.x + (currPos.x - targPos.x),
        0,
        newPos.z + (currPos.z - targPos.z)
      );

      playerNodeTargetPos.current = newPos;
    }

    // set lerp target position
    else {
      playerNodeTargetPos.current = new Vector3(
        ((userPosition.lon - mapOrigin.lon) / (BBOX_SIZE * 2)) * PLANE_SIZE,
        0,
        ((userPosition.lat - mapOrigin.lat) / (BBOX_SIZE * 2)) * PLANE_SIZE
      );
    }
  };

  // update animations every frame
  const frameUpdate = () => {
    if (!playerNode.current) return;

    // position
    const currPos = playerNode.current.position;
    const targPos = playerNodeTargetPos.current;

    if (Vector3.Distance(currPos, targPos) < ANI_LERP_MERGE_DISTANCE_POSITION) {
      playerNode.current.position = targPos;
    } else {
      playerNode.current.position = Vector3.Lerp(
        currPos,
        targPos,
        ANI_LERP_SPEED
      );
    }

    // rotation
    if (
      Math.abs(playerNode.current.rotation.y - deviceYaw) <
      ANI_LERP_MERGE_DISTANCE_ROTATION
    ) {
      playerNode.current.rotation.y = deviceYaw;
    } else {
      playerNode.current.rotation.y = Tools.ToRadians(
        Babylon.Scalar.LerpAngle(
          Tools.ToDegrees(playerNode.current.rotation.y),
          Tools.ToDegrees(deviceYaw),
          ANI_LERP_SPEED
        )
      );
    }
  };

  // move / rotate player
  useEffect(() => {
    if (sceneMap) {
      const handler = () => {
        frameUpdate();
      };
      sceneMap.registerBeforeRender(handler);

      return () => {
        sceneMap.unregisterBeforeRender(handler);
      };
    }
  }, [playerNodeTargetPos.current, deviceYaw, sceneMap]);

  // update meshes
  useEffect(() => {
    UpdateTileMesh();
  }, [updateCountTiles]);

  // update player position
  useEffect(() => {
    updatePlayerPos();
  }, [userPosition]);

  // check tiles at creation
  useEffect(() => {
    console.log('Initial useEeffect');
    UpdateTileMesh();
  }, []);

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'red' }}>
        <View style={{ flex: 1 }}>
          {!!MAP_DEBUG && (
            <>
              <Button
                title={'Move x+'}
                onPress={() => {
                  debugMovePosition({ lon: DEBUG_MOVE_DISTANCE, lat: 0 });
                }}
              />
              <Button
                title={'Move x-'}
                onPress={() => {
                  debugMovePosition({ lon: -DEBUG_MOVE_DISTANCE, lat: 0 });
                }}
              />
              <Button
                title={'Move y+'}
                onPress={() => {
                  debugMovePosition({ lon: 0, lat: DEBUG_MOVE_DISTANCE });
                }}
              />
              <Button
                title={'Move y-'}
                onPress={() => {
                  debugMovePosition({ lon: 0, lat: -DEBUG_MOVE_DISTANCE });
                }}
              />
            </>
          )}
          <View style={{ flex: 1 }}>
            {getCurrentScene() == APP_SCENE.MAP && (
              <EngineView camera={cameraMap} displayFrameRate={MAP_DEBUG} />
            )}
          </View>
        </View>
      </SafeAreaView>
      {!!sceneMap && <MapElementManager scene={sceneMap} />}
    </>
  );
};
