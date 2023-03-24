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
  const models = useRef<{ [key: string]: Babylon.AssetContainer }>({});

  // return model as Babylon.AssetContainer. If not loaded before then load
  const getModelAsset = async (
    name: string
  ): Promise<Babylon.AssetContainer | null> => {
    try {
      // model is already loaded
      const model: Babylon.AssetContainer | undefined = models.current[name];

      if (!model) {
        // if not, load it
        const container = await LoadModel(MODEL_RESOURCE[name]);
        if (!container) throw "ERROR: Couldn't load model";

        models.current[name] = container;
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
    _scene: Babylon.Scene
  ): Promise<Babylon.InstantiatedEntries | null> => {
    try {
      const container = await getModelAsset(name);

      if (container) {
        const instance = container.instantiateModelsToScene();
        console.log(instance.rootNodes.length);

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
    _scene: Babylon.Scene
  ): Promise<Babylon.Mesh | null> => {
    try {
      const container = await getModelAsset(name);

      if (container) {
        // clone from container
        let model = container.createRootMesh();
        model = model.clone(name);
        model.visibility = 0;

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
