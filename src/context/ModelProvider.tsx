/*
 * ModelProvider:
 * stores 3D models for later use
 */

import * as Babylon from '@babylonjs/core';
import React, { createContext, useRef, ReactNode } from 'react';
import { LoadModel, MODEL_RESOURCE } from '@src/services/modelLoader.services';

// provider interface
export interface iModelProvider {
  instantiateModel: (
    _name: string,
    _scene: Babylon.Scene
  ) => Promise<Babylon.InstantiatedEntries | null>;
  cloneModel: (
    _name: string,
    _scene: Babylon.Scene
  ) => Promise<Babylon.Mesh | null>;
  getModelHeight: (_name: string, _scene: Babylon.Scene) => Promise<number>;
}

export const ModelContext = createContext<iModelProvider>({
  instantiateModel: async (_name: string, _scene: Babylon.Scene) => null,
  cloneModel: async (_name: string, _scene: Babylon.Scene) => null,
  getModelHeight: async (_name: string, _scene: Babylon.Scene) => 0
});

export const ModelProvider = (props: { children: ReactNode }) => {
  const models = useRef<{
    [key: string]: { [key: string]: Babylon.AssetContainer };
  }>({});

  // return model as Babylon.AssetContainer. If not loaded before then load
  const getModelAsset = async (
    name: string,
    scene: Babylon.Scene
  ): Promise<Babylon.AssetContainer | null> => {
    const sceneName: string = scene.metadata.name;

    if (!sceneName) return null;
    if (!models.current[sceneName]) models.current[sceneName] = {};

    try {
      // model is already loaded
      const model: Babylon.AssetContainer | undefined =
        models.current[sceneName][name];

      if (!model) {
        // if not, load it
        const container = await LoadModel(MODEL_RESOURCE[name], scene);
        if (!container) throw "ERROR: Couldn't load model";

        // create an abstract root mesh [WARNING]
        //container.createRootMesh();

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
        if (!container.meshes.length) return null;

        // create a root mesh
        const rootNode = new Babylon.Mesh(`rootNode_${name}`, scene);

        // clone
        const clone = container.meshes[0].clone(name, rootNode);
        if (clone == null) return null;

        clone.visibility = 1;
        return rootNode;
      }
    } catch (e) {
      console.error(e);
    }

    return null;
  };

  // returns height of model including it's children
  const getModelHeight = async (
    name: string,
    scene: Babylon.Scene
  ): Promise<number> => {
    try {
      const container = await getModelAsset(name, scene);

      if (container) {
        // get bounding box from entire hierarchy
        const boundingBox = container.meshes[0].getHierarchyBoundingVectors();
        return boundingBox.max.y;
      }
    } catch (e) {
      console.error(e);
    }

    return 10;
  };

  return (
    <ModelContext.Provider
      value={{ instantiateModel, cloneModel, getModelHeight }}
    >
      {props.children}
    </ModelContext.Provider>
  );
};
