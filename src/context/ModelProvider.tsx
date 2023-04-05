/*
 * ModelProvider:
 * stores 3D models for later use
 */

import * as Babylon from '@babylonjs/core';
import React, { createContext, useRef, ReactNode } from 'react';
import { LoadModel, MODEL_RESOURCE } from '@src/services/modelLoader.services';

// provider interface
interface iModelProvider {
  instantiateModel: (
    _name: string,
    _scene: Babylon.Scene
  ) => Promise<Babylon.InstantiatedEntries | null>;
  cloneModel: (
    _name: string,
    _scene: Babylon.Scene
  ) => Promise<Babylon.Mesh | null>;
}

export const ModelContext = createContext<iModelProvider>({
  instantiateModel: async (_name: string, _scene: Babylon.Scene) => null,
  cloneModel: async (_name: string, _scene: Babylon.Scene) => null
});

export const ModelProvider = (props: { children: ReactNode }) => {
  const models = useRef<{ [key: string]: { [key: string]: Babylon.AssetContainer }}>({});

  // return model as Babylon.AssetContainer. If not loaded before then load
  const getModelAsset = async (
    name: string,
    scene: Babylon.Scene
  ): Promise<Babylon.AssetContainer | null> => {

    const sceneName: string = scene.metadata.name ;

    if (!sceneName) return null;
    if (!models.current[sceneName])
      models.current[sceneName] = {};

    try {

      // model is already loaded
      const model: Babylon.AssetContainer | undefined = models.current[sceneName][name];

      if (!model) {
        // if not, load it
        const container = await LoadModel(MODEL_RESOURCE[name], scene);
        if (!container) throw "ERROR: Couldn't load model";

        // make it non pickable by default
        container.meshes.forEach((mesh) => {
          mesh.isPickable = false;
        });

        models.current[sceneName][name] = container;
        return container;
      }

      return model;
    } catch (e) {
      console.error(e);
    }

    return null;
  };

  // Instantiates model to specified scene
  const instantiateModel = async (
    name: string,
    scene: Babylon.Scene
  ): Promise<Babylon.InstantiatedEntries | null> => {
    try {
      const container = await getModelAsset(name, scene);

      if (container) {
        const instance = container.instantiateModelsToScene();

        return instance;
      }
    } catch (e) {
      console.error(e);
    }

    return null;
  };

  // Clones model to specified scene
  const cloneModel = async (
    name: string,
    scene: Babylon.Scene
  ): Promise<Babylon.Mesh | null> => {
    try {
      const container = await getModelAsset(name, scene);

      if (container) {
        // clone from container
        let model = container.createRootMesh();
        model = model.clone(name);
        model.visibility = 1;

        return model;
      }
    } catch (e) {
      console.error(e);
    }

    return null;
  };

  return (
    <ModelContext.Provider value={{ instantiateModel, cloneModel }}>
      {props.children}
    </ModelContext.Provider>
  );
};
