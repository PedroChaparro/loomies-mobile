

// clean me
import React, {
  FunctionComponent,
  useEffect,
  useCallback,
  useState,
  useRef,
  useContext,
} from "react";

import {
  SafeAreaView,
  View,
  Button,
  ViewProps,
} from "react-native";

//import * as polyfill from 'react-native-url-polyfill';

import {EngineView, useEngine} from "@babylonjs/react-native";
import {Camera} from "@babylonjs/core/Cameras/camera";
import {ArcRotateCamera} from "@babylonjs/core/Cameras/arcRotateCamera";
import "@babylonjs/loaders/glTF";
import {Scene} from "@babylonjs/core/scene";

import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder";
import {DirectionalLight} from "@babylonjs/core/Lights/directionalLight";
import {HemisphericLight} from "@babylonjs/core/Lights/hemisphericLight";
import {Vector3} from "@babylonjs/core/Maths/math.vector";
import {Tools} from "@babylonjs/core/Misc/tools";
import {StandardMaterial} from "@babylonjs/core/Materials/standardMaterial";

import * as Babylon from "@babylonjs/core";

// map
import { GRIDMAP_SIZE, iGridPosition } from '@src/context/MapProvider';

// grid map context
import { MapContext } from "@src/context/MapProvider";




// drawing constants
const PLANE_SIZE = 4;

export const Map3DEngine: FunctionComponent<ViewProps> = (props: ViewProps) => {
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

    console.log("Creating scene");
    
    // create camera
    scene.createDefaultCameraOrLight(true, undefined, true);
    (scene.activeCamera as ArcRotateCamera).alpha += Math.PI;
    (scene.activeCamera as ArcRotateCamera).radius = 10;
    setCamera(scene.activeCamera!);

    // initialize planes

    const offset = (GRIDMAP_SIZE - 1) / 2;


    // iterate trought tiles
    for (let i = 0; i < GRIDMAP_SIZE; i++) {
      planeList.current.push([]);
      for (let j = 0; j < GRIDMAP_SIZE; j++) {

        const plane = MeshBuilder.CreateGround(`plane_${i},${j}`, {width: PLANE_SIZE, height: PLANE_SIZE}, scene);
        plane.material = new StandardMaterial(`plane_${i},${j}_material`, scene);
        plane.position = new Vector3(
            (i - offset) * PLANE_SIZE,
            0,
            (j - offset) * PLANE_SIZE
        );
        //const base64 = "iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAIAAADZrBkAAAAACXBIWXMAAA06AAANOgEDIh6FAAABVklEQVQokZ2RTUoDQRCFX3V3pp3EmIQBV0ZCcgZx4QEigoIQ0RN4Aw8hJHoHIS4kO1dZegOJIC5dzUJCfsboaJzpcjFOBCFNTFGLftV81KsquqnX8f8QSzDLY1StVpfA1GltCAFIkACSTN+USqRfj76+e8oCUMdbG1AgCVKABCSgAJlUOJGU1idTerigwWhCnesr0B/jNvnxRc1mSw3fPufOTcTMMyml1FoTwfM8dd66XHANGSVPjhqVSsUYoxpxH0Cf1a0pRFYsGo183y+Xy8ysztw+gBDiPsw9G8fGERljoihiZkEapJHV5mAlIBsEAL8YNJLcy43XRGxrBmLmH4wdsAPSqOWm2+77ot167PbYTaweFseaeCGsHZTaQYkdJod3ipNNPbW4ZOY4jgGIbpDvBvkXypDGqmv2vbFlMQnGzCI0IjSiMyywBjR211+9zNz7zUx+Azspotv+7FefAAAAAElFTkSuQmCC";

        // use svg image
        //const oneTexture = new Babylon.Texture("data:image/png;base64," + base64, scene);
        //oneTexture.hasAlpha = false; // enables transparency
        //(plane.material as StandardMaterial).diffuseTexture = oneTexture;

        planeList.current[i].push(plane);
      }
    }

    // lights
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    const dirLight = new DirectionalLight(
      "dirlight",
      new Vector3(0, -1, -0.5),
      scene,
    );
    dirLight.position = new Vector3(0, 5, -5);

    console.log("Scene created");
    setScene(scene);
  }, [engine]);

  // update textures

  useEffect(() => {
    console.log("IMAGE UPDATE LOOK AT ME PLEASE");
    //console.log(mapInfo?.updatedTiles);
    UpdateTextures();

  }, [mapInfo?.updateCount])

  const UpdateTextures = () => {
    if (!engine) return;
    if (!scene) return;
    if (!planeList.current.length) return;
    console.log("Entered UpdateTextures ", mapInfo?.getUpdatedTiles().length, mapInfo?.getUpdatedTiles());


    // iterate through updated tiles
    let newTexture: Babylon.Texture;
    let newMaterial: Babylon.StandardMaterial;
    let base64: string;

    mapInfo?.getUpdatedTiles().forEach((tilePos: iGridPosition) => {
        console.log("Checking inside tiles", tilePos);

        // check if texture exists
        base64 = mapInfo.getGridImageB64Pos(tilePos);
        console.log("base64 exists?", base64.length);
        if (!base64.length) return;

        // set


        newTexture = new Babylon.Texture("data:image/png;base64," + base64, scene);
        newTexture.hasAlpha = false; // enables transparency

        //newMaterial = new StandardMaterial(`plane_${tilePos.x},${tilePos.y}_material`, scene);
        //newMaterial.diffuseTexture = new Babylon.Texture("data:image/png;base64," + base64, scene);

        //console.log("material exists? ", !!planeList.current[tilePos.x][tilePos.y].material)
        (planeList.current[tilePos.x][tilePos.y].material as StandardMaterial).diffuseTexture = newTexture;
        //(planeList.current[tilePos.x][tilePos.y].material as StandardMaterial).diffuseTexture = newTexture;
        //console.log(planeList.current[tilePos.x][tilePos.y]);

        //console.log(base64);

    });
    

    // iterate trought tiles


        // check if texture exists
  };



  const setupScene = () => {
    if (!engine) return;

    const scene = new Scene(engine);

    if (!scene) return;

    console.log("Creating scene");
    
    // create camera
    scene.createDefaultCameraOrLight(true, undefined, true);
    (scene.activeCamera as ArcRotateCamera).alpha += Math.PI;
    (scene.activeCamera as ArcRotateCamera).radius = 10;
    setCamera(scene.activeCamera!);

    // spheres
    let sphere = null;
    sphere = MeshBuilder.CreateSphere(
      "sphere",
      {diameter: 2, segments: 32},
      scene,
    );
    sphere.position = new Vector3(2, 0);

    // svg test

    const plane = MeshBuilder.CreateGround("one", {width: 6, height: 6}, scene);
    plane.rotation.x = Tools.ToRadians(90);
    plane.material = new StandardMaterial("oneMaterial", scene);

    const base64 = "iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAIAAADZrBkAAAAACXBIWXMAAA06AAANOgEDIh6FAAABVklEQVQokZ2RTUoDQRCFX3V3pp3EmIQBV0ZCcgZx4QEigoIQ0RN4Aw8hJHoHIS4kO1dZegOJIC5dzUJCfsboaJzpcjFOBCFNTFGLftV81KsquqnX8f8QSzDLY1StVpfA1GltCAFIkACSTN+USqRfj76+e8oCUMdbG1AgCVKABCSgAJlUOJGU1idTerigwWhCnesr0B/jNvnxRc1mSw3fPufOTcTMMyml1FoTwfM8dd66XHANGSVPjhqVSsUYoxpxH0Cf1a0pRFYsGo183y+Xy8ysztw+gBDiPsw9G8fGERljoihiZkEapJHV5mAlIBsEAL8YNJLcy43XRGxrBmLmH4wdsAPSqOWm2+77ot167PbYTaweFseaeCGsHZTaQYkdJod3ipNNPbW4ZOY4jgGIbpDvBvkXypDGqmv2vbFlMQnGzCI0IjSiMyywBjR211+9zNz7zUx+Azspotv+7FefAAAAAElFTkSuQmCC";

    // use svg image
    const oneTexture = new Babylon.Texture("data:image/png;base64," + base64, scene);
    oneTexture.hasAlpha = false; // enables transparency
    (plane.material as StandardMaterial).diffuseTexture = oneTexture;

    // lights
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    const dirLight = new DirectionalLight(
      "dirlight",
      new Vector3(0, -1, -0.5),
      scene,
    );
    dirLight.position = new Vector3(0, 5, -5);

    // set scene
    console.log("Scene created");
    setScene(scene);
  };

  //useEffect(() => {
    //setupScene();
  //}, [engine]);

  //// here the scene is created
  //useEffect(() => {
    //if (engine) {
      //setupScene();
    //}
  //}, [engine]);

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: "red"}}>
        <View style={{flex: 1}}>
          <Button title={"Worry noy"} onPress={() => { }} />
          <View style={{flex: 1}}>
            <EngineView camera={camera} displayFrameRate={true} />
          </View>
        </View>
      </SafeAreaView>
      {
        (() => {
          //mapInfo?.gridImageB64.find((_el) => {
            //console.log("GRID CHANGED");
            //return true; 
          //})
        })()
      }
    </>
  );
};
