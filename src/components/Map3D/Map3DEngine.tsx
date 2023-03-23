/*
 * Map 3D Engine:
 * Manages all 3D objects in the map
 * Manages the Babylon 3D engine
 */

import React, {
  FunctionComponent,
  useEffect,
  useState,
  useRef,
  useContext
} from 'react';
import { SafeAreaView, View, Button, ViewProps } from 'react-native';
import { EngineView, useEngine } from '@babylonjs/react-native';

import * as Babylon from '@babylonjs/core';
import { Tools } from '@babylonjs/core/Misc';
import { Scene } from '@babylonjs/core/scene';
import { Camera } from '@babylonjs/core/Cameras/camera';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import '@babylonjs/loaders/glTF';

import { SensorContext } from '@src/context/SensorProvider';
import { LoadModel, MODEL } from '@src/services/modelLoader.services';
import { UserPositionContext } from '@src/context/UserPositionProvider';

import { GRIDMAP_SIZE, iGridPosition } from '@src/context/MapProvider';
import { BBOX_SIZE } from '@src/services/mapAPI.services';
import { MapContext } from '@src/context/MapProvider';
import { createGradientPlane } from './utilsVertex';
import { iMapBundleVertexData, generateRoad } from './utilsMapBuilder';

// debug
import { CONFIG } from '@src/services/config.services';
const { MAP_DEBUG } = CONFIG;
const DEBUG_MOVE_DISTANCE = 0.0002;

// drawing constants
export const PLANE_SIZE = 20;
const GROUND_SCALE = 3.5;
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

export const Map3DEngine: FunctionComponent<ViewProps> = () => {
  // user position debug method
  const { userPosition, debugMovePosition } = useContext(UserPositionContext);
  const { deviceYaw } = useContext(SensorContext);

  // map info
  const {
    getMapOrigin,
    updateCountTiles,
    getUpdatedTiles,
    getMapApplyingOffset,
    consumeMapApplyingOffset,
    removeFromUpdatedTiles,
    getGridMeshAtPos
  } = useContext(MapContext);

  // engine related
  const engine = useEngine();
  const [camera, setCamera] = useState<Camera>();
  const [scene, setScene] = useState<Scene>();

  // map drawing
  const playerNode = useRef<Babylon.Mesh>();
  const playerNodeTargetPos = useRef<Babylon.Vector3>(Vector3.Zero());
  const meshGrid = useRef<Array<Array<Babylon.Mesh | null>>>([]);

  // expose methods such as
  // - draw object in pos
  // - click on object
  // - modify object list

  // startup
  useEffect(() => {
    if (meshGrid.current.length) return;
    if (!engine) return;
    const scene = new Scene(engine);
    if (!scene) return;

    console.log('INFO: Creating scene');

    // create player
    const playerRootMesh: Babylon.Mesh = Babylon.MeshBuilder.CreateBox(
      'playerRootMesh',
      { size: 1 },
      scene
    );
    playerRootMesh.isVisible = false;
    playerNode.current = playerRootMesh;

    // create lights
    const light = new HemisphericLight('light', new Vector3(5, 10, 0), scene);
    light.intensity = 0.9;

    // create camera
    scene.createDefaultCamera(true, true, true);

    if (scene.activeCamera) {
      const camera = scene.activeCamera as ArcRotateCamera;
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

      setCamera(scene.activeCamera);

      // lock to player
      camera.lockedTarget = playerNode.current;
    }

    // create ground plane
    const planeGround = createGradientPlane(
      PLANE_SIZE * GROUND_SCALE,
      new Babylon.Color3(...COLOR_BACKGROUND_BOT),
      new Babylon.Color3(...COLOR_BACKGROUND_TOP),
      scene
    );
    planeGround.position.y = 0;
    planeGround.rotation.x = Math.PI / 2;

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
            scene
          );
        }
      }
    }

    // load player model
    (async () => {
      try {
        await LoadModel(MODEL.MAP_PLAYER, scene);
        await LoadModel(MODEL.MAP_CIRCLE_INDICATOR, scene);

        const playerModel = scene.getTransformNodeByName('root_player');
        const circleIndicatorModel = scene.getTransformNodeByName(
          'root_circle_indicator'
        );

        if (playerModel && playerNode.current) {
          playerModel.setParent(playerNode.current);
        }

        if (circleIndicatorModel && playerNode.current) {
          circleIndicatorModel.position.y = CIRCLE_INDICATOR_HEIGHT;
          circleIndicatorModel.setParent(playerNode.current);
        }
      } catch (error) {
        console.log("ERROR: Couldn't load model.");
      }
    })();

    // (debug) map axes
    if (MAP_DEBUG) new Babylon.AxesViewer(scene, 5);

    console.log('INFO: Scene created');
    setScene(scene);
  }, [engine]);

  const UpdateTileMesh = () => {
    // everything is initialized
    if (!scene) return;
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
      const roads = generateRoad(mapBundle.roads, COLOR_ROAD_FILL, scene);
      roads.position.y = ROAD_HEIGHT;

      // ROADS BORDER
      const roadsBorder = generateRoad(
        mapBundle.roadsBorder,
        COLOR_ROAD_BORDER,
        scene
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
    if (scene) {
      const handler = () => {
        frameUpdate();
      };
      scene.registerBeforeRender(handler);

      return () => {
        scene.unregisterBeforeRender(handler);
      };
    }
  }, [playerNodeTargetPos.current, deviceYaw, scene]);

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
            <EngineView camera={camera} displayFrameRate={MAP_DEBUG} />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};
