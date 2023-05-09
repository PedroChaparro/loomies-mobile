import * as Babylon from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import { Platform } from 'react-native';

const isAndroid = Platform.OS === 'android';
const assetPrefix = isAndroid ? 'custom/' : '';

/**
 * Workaround for different path between OS
 *
 * https://forum.babylonjs.com/t/load-local-app-gltf-glb-mesh-in-babylon-react-native/30888/23
 * https://github.com/unimonkiez/react-native-asset/issues/25
 *
 * @param path relative path from asset directory
 * @returns Sanitized Uri with app:// scheme
 */
export function resolveAssetUri(path: string) {
  return `app:///${assetPrefix}${path}`;
}

export const MODEL_RESOURCE: { [key: string]: string } = {
  // map models

  'MAP_CIRCLE_INDICATOR': 'circleIndicator.glb',
  'MAP_PLAYER': 'player.glb',
  'MAP_GYM': 'gym.glb',

  // loomie models

  '1': '001.glb',
  '2': '002.glb',
  '3': '003.glb',
  '4': '004.glb',
  '5': '005.glb',
  '6': '006.glb',
  '7': '007.glb',
  '8': '008.glb',
  '9': '009.glb',
  '10': '010.glb',
  '11': '011.glb',
  '12': '012.glb',
  '13': '013.glb',
  '14': '014.glb',
  '15': '015.glb',
  '16': '016.glb',
  '17': '017.glb',
  '18': '018.glb',
  '19': '019.glb',

  // environment models

  'ENV_GRASS': 'grass.glb',

  // loomballs

  'loomball-008': 'loomball1.glb',
  'loomball-009': 'loomball2.glb',
  'loomball-010': 'loomball3.glb'
};

export const LoadModel = async (
  model: string,
  scene: Babylon.Scene
): Promise<Babylon.AssetContainer | null> => {
  try {
    const container = await Babylon.SceneLoader.LoadAssetContainerAsync(
      '',
      resolveAssetUri(model),
      scene
    );

    return container;
  } catch (e) {
    console.error(e);
  }
  return null;
};
