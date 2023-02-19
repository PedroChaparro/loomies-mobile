// clean me
import React, {
  FunctionComponent,
  useEffect,
  useState,
  useRef,
  useContext
} from 'react';

import { SafeAreaView, View, Button, ViewProps } from 'react-native';

import { EngineView, useEngine } from '@babylonjs/react-native';
import { Camera } from '@babylonjs/core/Cameras/camera';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import '@babylonjs/loaders/glTF';
import { Scene } from '@babylonjs/core/scene';

import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';

import * as Babylon from '@babylonjs/core';

// map
import { GRIDMAP_SIZE, iGridPosition } from '@src/context/MapProvider';

// grid map context
import { MapContext } from '@src/context/MapProvider';
import { iMapBundleVertexData } from './mapMeshBuilder';
import { VertexData } from '@babylonjs/core';
import { UserPositionContext } from '@src/context/UserPositionProvider';
import { BBOX_SIZE } from '@src/services/mapAPI.services';

const DEBUG_MOVE_DISTANCE = 0.0001;

// drawing constants
//export const PLANE_SIZE = 20;
export const PLANE_SIZE = 20;
const ROAD_HEIGHT = 0.1;
const ROAD_BORDER_HEIGHT = 0.05;

const COLOR_BACKGROUND = '#C8FACC';
const COLOR_ROAD_BORDER = '#C6C6C5';
const COLOR_ROAD_FILL = '#FFFFFF';
const COLOR_BUILDING_STROKE = '#BFB1A5';
const COLOR_BUILDING_FILL = '#D9D0C9';

const DEBUG_COLORS = [
  ['#FF0000', '#00FF00', '#0000FF'],
  ['#FFFF00', '#000000', '#FF00FF'],
  ['#FF00FF', '#00FFFF', '#FFFFFF']
];

const hexToRgb = (hex: string): Babylon.Color3 => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (_m, r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? new Babylon.Color3(
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255
      )
    : new Babylon.Color3(0, 0, 0);
};

const generateRoad = (
  vertexData: VertexData,
  colorHex: string,
  scene: Babylon.Scene
): Babylon.Mesh => {
  const newMesh = new Babylon.Mesh('road', scene);
  vertexData.applyToMesh(newMesh); // apply vertexData

  // material
  newMesh.material = new Babylon.StandardMaterial('road', scene);
  (newMesh.material as StandardMaterial).diffuseColor = hexToRgb(colorHex);
  (newMesh.material as StandardMaterial).specularColor = new Babylon.Color3(
    0.1,
    0.1,
    0.1
  );
  return newMesh;
};

export const Map3DEngine: FunctionComponent<ViewProps> = () => {
  // user position debug method
  const { userPosition, debugMovePosition } = useContext(UserPositionContext);

  // map info
  const {
    getMapOrigin,
    updateCount,
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
  const planeList = useRef<Array<Array<Babylon.GroundMesh>>>([]);
  const playerNode = useRef<Babylon.Mesh>();

  const meshGrid = useRef<Array<Array<Babylon.Mesh | null>>>([]);

  // expose methods such as
  // - draw object in pos
  // - click on object
  // - modify object list

  // startup
  useEffect(() => {
    if (planeList.current.length) return;

    if (!engine) return;

    const scene = new Scene(engine);

    if (!scene) return;

    new Babylon.AxesViewer(scene, 5);

    console.log('Creating scene');

    // create player
    const playerMesh: Babylon.Mesh = Babylon.MeshBuilder.CreateBox(
      'box',
      { size: 1 },
      scene
    );
    playerNode.current = playerMesh;

    // create camera
    scene.createDefaultCamera(true, true, true);

    if (scene.activeCamera) {
      const camera = scene.activeCamera as ArcRotateCamera;
      camera.checkCollisions = false;
      camera.panningSensibility = 0;

      // limit camera zoom
      camera.lowerRadiusLimit = 20;
      //camera.upperRadiusLimit = 30;

      // limit camera angle
      camera.lowerBetaLimit = (Math.PI * 1) / 16;
      camera.upperBetaLimit = Math.PI / 4;

      camera.setTarget(Babylon.Vector3.Zero());
      //camera.alpha = Math.PI / 8;
      camera.beta = Math.PI / 8;
      camera.radius = 10;

      setCamera(scene.activeCamera);
    }

    // initialize planes

    const gridOffset = (GRIDMAP_SIZE - 1) / 2 + 0.5;

    // initialize gridmap
    for (let i = 0; i < GRIDMAP_SIZE; i++) {
      meshGrid.current.push([]);
      for (let j = 0; j < GRIDMAP_SIZE; j++) {
        meshGrid.current[i].push(null);

        // define boundaries
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
    // lights
    const light = new HemisphericLight('light', new Vector3(5, 10, 0), scene);
    light.intensity = 0.7;

    console.log('Scene created');
    setScene(scene);
  }, [engine]);

  // update textures

  useEffect(() => {
    console.log('TILES HAS BEEN UPDATED, AWAIT CHANGES');
    UpdateTextures();
  }, [updateCount]);

  const UpdateTextures = () => {
    // check everything is initialized
    if (!engine) return;
    if (!scene) return;
    if (!meshGrid.current.length) return;

    // if there is an offset -> apply it
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
    }

    console.log(
      'Entered UpdateTextures ',
      getUpdatedTiles().length,
      getUpdatedTiles()
    );

    // iterate through updated tiles
    let mapBundle: iMapBundleVertexData | null;
    const gridOffset = (GRIDMAP_SIZE - 1) / 2 + 0.5;

    getUpdatedTiles().forEach((tilePos: iGridPosition) => {
      console.log('Checking inside tiles', tilePos);

      // Delete current tile mesh if exists
      const oldMesh = meshGrid.current[tilePos.x][tilePos.y];
      if (oldMesh) {
        console.log('Diponsing old mesh');
        oldMesh.dispose();
      }

      // Source vertexData exists
      mapBundle = getGridMeshAtPos(tilePos);
      if (!mapBundle) return;

      // Create different elements

      // ROADS
      const roads = generateRoad(
        mapBundle.roads,
        DEBUG_COLORS[tilePos.x][tilePos.y],
        scene
      );
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

  useEffect(() => {
    console.log('Enter moving player');

    if (!userPosition) return;
    const mapOrigin = getMapOrigin();
    if (!mapOrigin) return;
    if (!playerNode.current) return;

    console.log('Moving player');

    playerNode.current.position = new Vector3(
      ((userPosition.lon - mapOrigin.lon) / (BBOX_SIZE * 2)) * PLANE_SIZE,
      0,
      ((userPosition.lat - mapOrigin.lat) / (BBOX_SIZE * 2)) * PLANE_SIZE
    );

    // move pivot
  }, [userPosition]);

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'red' }}>
        <View style={{ flex: 1 }}>
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
          <View style={{ flex: 1 }}>
            <EngineView camera={camera} displayFrameRate={true} />
          </View>
        </View>
      </SafeAreaView>
      {(() => {
        //mapInfo?.gridImageB64.find((_el) => {
        //console.log("GRID CHANGED");
        //return true;
        //})
      })()}
    </>
  );
};