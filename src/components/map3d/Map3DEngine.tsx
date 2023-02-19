// clean me
import React, {
  FunctionComponent,
  useEffect,
  useState,
  useRef,
  useContext
} from 'react';

import { SafeAreaView, View, Button, ViewProps } from 'react-native';

//import * as polyfill from 'react-native-url-polyfill';

import { EngineView, useEngine } from '@babylonjs/react-native';
import { Camera } from '@babylonjs/core/Cameras/camera';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import '@babylonjs/loaders/glTF';
import { Scene } from '@babylonjs/core/scene';

import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';

import * as Babylon from '@babylonjs/core';

// map
import { GRIDMAP_SIZE, iGridPosition } from '@src/context/MapProvider';

// grid map context
import { MapContext } from '@src/context/MapProvider';
import { iMapBundleVertexData } from './mapMeshBuilder';
import {  VertexData } from '@babylonjs/core';

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
  ]

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

const generateRoad = (vertexList: VertexData[], colorHex: string, scene: Babylon.Scene): Babylon.Mesh => {

  let currMesh: Babylon.Mesh | null = Babylon.MeshBuilder.CreateBox('box', { size: 1 }, scene);
  let newMesh: Babylon.Mesh;

  // material
  currMesh.material = new Babylon.StandardMaterial('road', scene);
  (currMesh.material as StandardMaterial).diffuseColor = hexToRgb(colorHex);
  (currMesh.material as StandardMaterial).specularColor = new Babylon.Color3(0.1, 0.1, 0.1);

  vertexList.forEach((vertexData: VertexData) => {
    newMesh = new Babylon.Mesh('road', scene);
    vertexData.applyToMesh(newMesh); // apply vertexData

    // merge
    if (!currMesh) return;

    currMesh = Babylon.Mesh.MergeMeshes(
      [currMesh, newMesh],
      true
    );
  });

  return currMesh;
}

export const Map3DEngine: FunctionComponent<ViewProps> = () => {
  // map info
  const mapInfo = useContext(MapContext);

  // engine related
  const engine = useEngine();
  const [camera, setCamera] = useState<Camera>();
  const [scene, setScene] = useState<Scene>();

  // map drawing
  const planeList = useRef<Array<Array<Babylon.GroundMesh>>>([]);

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

    const axes = new Babylon.AxesViewer(scene, 5)

    console.log('Creating scene');

    // create camera
    //scene.createDefaultCameraOrLight(true, undefined, true);
    //scene.createDefaultCamera(true);
    scene.createDefaultCamera(true, true, true);

    if (scene.activeCamera){
      const camera = (scene.activeCamera as ArcRotateCamera)
      camera.checkCollisions=false;
      camera.panningSensibility=0;

      // limit camera zoom
      camera.lowerRadiusLimit = 20;
      //camera.upperRadiusLimit = 30;
      
      // limit camera angle
      camera.lowerBetaLimit = Math.PI * 1/16;
      camera.upperBetaLimit = Math.PI / 4;

      camera.setTarget(Babylon.Vector3.Zero());
      //camera.alpha = Math.PI / 8;
      camera.beta  = Math.PI / 8;
      camera.radius = 10;

      setCamera(scene.activeCamera);
    }

    // initialize planes

    const offset = (GRIDMAP_SIZE - 1) / 2;

    // iterate trought tiles
    for (let i = 0; i < GRIDMAP_SIZE; i++) {
      planeList.current.push([]);
      for (let j = 0; j < GRIDMAP_SIZE; j++) {
        const plane = MeshBuilder.CreateGround(
          'plane',
          { width: PLANE_SIZE, height: PLANE_SIZE },
          scene
        );
        plane.position = new Vector3(
          (i - offset) * PLANE_SIZE,
          0,
          (j - offset) * PLANE_SIZE
        );

        plane.material = new Babylon.StandardMaterial('road', scene);
        (plane.material as StandardMaterial).diffuseColor = hexToRgb(COLOR_BACKGROUND);
        (plane.material as StandardMaterial).specularColor = new Babylon.Color3(0.1, 0.1, 0.1);

        planeList.current[i].push(plane);
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
    console.log('IMAGE UPDATE LOOK AT ME PLEASE');
    //console.log(mapInfo?.updatedTiles);
    UpdateTextures();
  }, [mapInfo?.updateCount]);

  const UpdateTextures = () => {
    if (!engine) return;
    if (!scene) return;
    if (!planeList.current.length) return;
    console.log(
      'Entered UpdateTextures ',
      mapInfo?.getUpdatedTiles().length,
      mapInfo?.getUpdatedTiles()
    );


    // iterate through updated tiles
    let mapBundle: iMapBundleVertexData | null;
    const gridOffset = (GRIDMAP_SIZE - 1) / 2 +0.5;

    console.log(mapInfo?.getUpdatedTiles());
    mapInfo?.getUpdatedTiles().forEach((tilePos: iGridPosition) => {
      console.log('Checking inside tiles', tilePos);

      let gridOffset2 = 0.0
      let path2 = [
          new Vector3((tilePos.x - gridOffset2 -1) * PLANE_SIZE, 0, (tilePos.y + gridOffset2 -1) * PLANE_SIZE),
          new Vector3((tilePos.x - gridOffset2 -1) * PLANE_SIZE, 10, (tilePos.y + gridOffset2 -1) * PLANE_SIZE),
      ];
      // create marquers
      Babylon.MeshBuilder.CreateTube("tube", {path: path2, radius: 1}, scene);

      // check if texture exists
      mapBundle = mapInfo.getGridImageB64Pos(tilePos);

      // TODO: Delete mesh if exists
      if (!mapBundle) return;

      // Create different elements

      // ROADS
      //const roads = generateRoad(mapBundle.roads, COLOR_ROAD_FILL, scene);
      const roads = generateRoad(mapBundle.roads, DEBUG_COLORS[tilePos.x][0], scene);
      roads.position.y = ROAD_HEIGHT;

      // ROADS BORDER
      const roadsBorder = generateRoad(mapBundle.roadsBorder, COLOR_ROAD_BORDER, scene);
      roadsBorder.position.y = ROAD_BORDER_HEIGHT;

      // merge them
      const mergedMesh = Babylon.Mesh.MergeMeshes([roads, roadsBorder], true, true, undefined, false, true);
      if (mergedMesh){
        //mergedMesh.position.x = tilePos.x;
        //mergedMesh.position.z = tilePos.y;
        mergedMesh.position = new Vector3(
          (tilePos.x - gridOffset) * PLANE_SIZE,
          0,
          (tilePos.y - gridOffset) * PLANE_SIZE
        );
      }

      // define boundaries
      let path = [
          new Vector3((tilePos.x - gridOffset) * PLANE_SIZE, 3, (tilePos.y - gridOffset) * PLANE_SIZE),
          new Vector3((tilePos.x - gridOffset +1) * PLANE_SIZE, 3, (tilePos.y - gridOffset) * PLANE_SIZE),
          new Vector3((tilePos.x - gridOffset +1) * PLANE_SIZE, 3, (tilePos.y - gridOffset +1) * PLANE_SIZE),
          new Vector3((tilePos.x - gridOffset) * PLANE_SIZE, 3, (tilePos.y - gridOffset +1) * PLANE_SIZE),
          new Vector3((tilePos.x - gridOffset) * PLANE_SIZE, 3, (tilePos.y - gridOffset) * PLANE_SIZE),
      ]
      const tube = Babylon.MeshBuilder.CreateTube("tube", {path: path, radius: 1}, scene);


      //path = [
          //new Vector3(0,0,0),
          //new Vector3(0,10,0)
      //];
      //// create marquers
      //Babylon.MeshBuilder.CreateTube("tube", {path: path, radius: 1}, scene);

      // finish ticket
      mapInfo.removeFromUpdatedTiles(tilePos);
    });
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'red' }}>
        <View style={{ flex: 1 }}>
          <Button title={'Worry noy'} onPress={() => {}} />
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
