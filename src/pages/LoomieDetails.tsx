import { RouteProp, useIsFocused } from '@react-navigation/core';
import { TCaughtLoomies } from '@src/types/types';
import { StyleSheet, Text, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { colors } from '@src/utils/utils';
import { LoomieStat } from '@src/components/LoomieDetails/LoomieStat';
import { EngineView } from '@babylonjs/react-native';
import {
  ArcRotateCamera,
  Camera,
  Color4,
  HemisphericLight,
  Scene,
  Vector3
} from '@babylonjs/core';
import { ModelContext } from '@src/context/ModelProvider';
import { LoomieDetailsSceneContext } from '@src/context/LoomieDetailsSceneProvider';
import { hexToRgb } from '@src/components/Map3D/utilsMapBuilder';

interface IProps {
  route?: RouteProp<{ params: { loomie: TCaughtLoomies } }, 'params'>;
}

export const LoomieDetails = ({ route }: IProps) => {
  const [loomie, setLoomie] = useState<TCaughtLoomies | null>(null);
  const isFocused = useIsFocused();

  // BabylonJS states
  // Note: We can't use the useEngine hook because it will not re-create
  // the engine when the component is focused again or the loomie changes
  const { engine } = useContext(LoomieDetailsSceneContext);
  const { instantiateModel } = useContext(ModelContext);
  const [camera, setCamera] = useState<Camera | undefined>(undefined);
  const [scene, setScene] = useState<Scene>();

  useEffect(() => {
    // Try to get the loomie from the route params
    const loomieFromRoute = route?.params?.loomie;
    if (loomieFromRoute) setLoomie(loomieFromRoute);
  }, []);

  useEffect(() => {
    if (!isFocused) {
      // Dispose the scene when the component is not focused to create another one
      // when the component is focused again
      if (scene && camera) {
        scene.dispose();
        camera.dispose();
        setScene(undefined);
        setCamera(undefined);
      }
    } else {
      if (!engine || !loomie) return;

      // Create the scene and attack a camera to it
      const newScene = new Scene(engine);
      newScene.createDefaultCamera(true, true, true);

      const light = new HemisphericLight(
        'light',
        new Vector3(5, 10, 0),
        newScene
      );
      light.intensity = 0.9;

      const { r, g, b } = hexToRgb(colors[loomie.types[0].toUpperCase()]);
      newScene.clearColor = new Color4(r, g, b, 0);
      // Change the z position of the camera to see the model

      if (newScene.activeCamera) {
        // Instantiate the loomie model
        const currentCamera = newScene.activeCamera as ArcRotateCamera;
        currentCamera.checkCollisions = false;
        currentCamera.setPosition(new Vector3(0, 1, 5));
        currentCamera.setTarget(new Vector3(0, 1.5, 0));

        instantiateModel(loomie.serial.toString(), newScene, false);
        setScene(newScene);
        setCamera(newScene.activeCamera);
      }
    }
  }, [isFocused, engine, loomie]);

  if (!loomie) return null;

  const mainColor = loomie.types[0].toUpperCase();
  const typeColor = colors[mainColor];

  return (
    <View style={{ ...Styles.background, backgroundColor: typeColor }}>
      <View style={Styles.scenario}>
        {camera && <EngineView camera={camera} />}
      </View>
      <View style={Styles.information}>
        <View style={Styles.row}>
          <Text style={Styles.loomieName}>{loomie.name}</Text>
          {loomie.types.map((type) => (
            <Text
              key={type}
              style={{
                ...Styles.loomieType,
                backgroundColor: colors[type.toUpperCase()]
              }}
            >
              {type}
            </Text>
          ))}
        </View>
        <View style={Styles.row}>
          <Text style={Styles.loomieLevel}>Lvl {loomie.level}</Text>
        </View>
        <View style={{ ...Styles.row, ...Styles.stats }}>
          <LoomieStat
            name='HP'
            value={loomie.hp}
            color={colors[loomie.types[0].toUpperCase()]}
          />
          <LoomieStat
            name='ATK'
            value={loomie.attack}
            color={colors[loomie.types[0].toUpperCase()]}
          />
          <LoomieStat
            name='DEF'
            value={loomie.defense}
            color={colors[loomie.types[0].toUpperCase()]}
          />
        </View>
      </View>
    </View>
  );
};

const Styles = StyleSheet.create({
  background: {
    flex: 1
  },
  scenario: {
    height: '40%',
    zIndex: 1
  },

  information: {
    flex: 1,
    borderTopLeftRadius: 42,
    borderTopRightRadius: 42,
    backgroundColor: 'white',
    padding: 32
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8
  },
  loomieName: {
    color: '#5C5C5C',
    fontWeight: 'bold',
    fontSize: 24,
    marginRight: 8
  },
  loomieType: {
    color: '#5C5C5C',
    fontWeight: 'bold',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginHorizontal: 4
  },
  loomieLevel: {
    fontSize: 18
  },
  stats: {
    flexDirection: 'column'
  }
});
