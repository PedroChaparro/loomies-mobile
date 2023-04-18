import * as Babylon from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';

export const MODEL_RESOURCE: { [key: string]: NodeRequire } = {
  // map models
  'MAP_CIRCLE_INDICATOR': require('@assets/models/map/indicator/circleIndicator.glb'),
  'MAP_PLAYER': require('@assets/models/map/indicator/player.glb'),
  'MAP_GYM': require('@assets/models/map/gym/gym.glb'),

  // loomie models
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
  '18': require('@assets/models/loomies/018/018.glb'),
  '19': require('@assets/models/loomies/019/019.glb'),

  // environment models
  'ENV_GRASS': require('@assets/models/environments/grass/grass.glb'),

  // loomballs
  'loomball-008': require('@assets/models/loomballs/loomball/loomball.glb'),
  'loomball-009': require('@assets/models/loomballs/loomball/loomball.glb'),
  'loomball-010': require('@assets/models/loomballs/loomball/loomball.glb')
};

export const LoadModel = async (
  model: NodeRequire,
  scene: Babylon.Scene
): Promise<Babylon.AssetContainer | null> => {
  try {
    const sceneGLBUri = resolveAssetSource(model).uri;

    const container = await Babylon.SceneLoader.LoadAssetContainerAsync(
      '',
      sceneGLBUri,
      scene
    );

    return container;
  } catch (e) {
    console.error(e);
  }
  return null;
};
