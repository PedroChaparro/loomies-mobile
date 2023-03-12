import * as Babylon from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';

export enum MODEL {
  // eslint-disable-next-line no-unused-vars
  MAP_PLAYER = require('@assets/models/map/indicator/player.glb'),
  // eslint-disable-next-line no-unused-vars
  MAP_CIRCLE_INDICATOR = require('@assets/models/map/indicator/circleIndicator.glb')
}

export const MODEL_LOOMIE = {
  '1': require('@assets/models/loomies/001/001.glb'),
  '2': require('@assets/models/loomies/002/002.glb'),
  '3': require('@assets/models/loomies/003/003.glb'),
  '4': require('@assets/models/loomies/004/004.glb'),
  '5': require('@assets/models/loomies/005/005.glb'),
  '6': require('@assets/models/loomies/006/006.glb'),
  '7': require('@assets/models/loomies/007/007.glb'),
  '8': require('@assets/models/loomies/008/008.glb'),
  '9': require('@assets/models/loomies/009/009.glb'),
  '10': require('@assets/models/loomies/010/010.glb'),
  '11': require('@assets/models/loomies/011/011.glb'),
  '12': require('@assets/models/loomies/012/012.glb'),
  '13': require('@assets/models/loomies/013/013.glb'),
  '14': require('@assets/models/loomies/014/014.glb'),
  '15': require('@assets/models/loomies/015/015.glb'),
  '16': require('@assets/models/loomies/016/016.glb'),
  '17': require('@assets/models/loomies/017/017.glb'),
  '18': require('@assets/models/loomies/018/018.glb')
};

export const LoadModel = async (
  model: MODEL,
  scene: Babylon.Scene
): Promise<boolean> => {
  const sceneGLBUri = resolveAssetSource(model).uri;
  await Babylon.SceneLoader.AppendAsync('', sceneGLBUri, scene);
  return true;
};