import * as Babylon from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';

export enum MODEL {
  MAP_PLAYER = require('@assets/models/map/player.glb'),
  MAP_CIRCLE_INDICATOR = require('@assets/models/map/circleIndicator.glb')
}

export const LoadModel = async (
  model: MODEL,
  scene: Babylon.Scene
): Promise<boolean> => {
  const sceneGLBUri = resolveAssetSource(model).uri;
  await Babylon.SceneLoader.AppendAsync('', sceneGLBUri, scene);
  return true;
};
