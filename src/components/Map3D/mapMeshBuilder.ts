import { iNode, iWay, iMap } from '@src/typescript/mapInterfaces';
import { BBOX_SIZE } from '@src/services/mapAPI.services';

import { Vector3, VertexData } from '@babylonjs/core';
import { createLineVertex, iLineOptions } from './createLineVertex';
import { PLANE_SIZE } from './Map3DEngine';

//const MAP_SIZE = 500;
const ROAD_WIDTH = 0.5;
const ROAD_WIDTH_BORDER = 0.6;
//const ROAD_WIDTH = 1;
//const ROAD_WIDTH_BORDER = 1.3;

export interface iMapBundleVertexData {
  roads: VertexData;
  roadsBorder: VertexData;
}

export const mapToVertexData = (map: iMap): iMapBundleVertexData => {
  let bundleVector3: Array<Vector3[]>;

  const roads = createLineVertex({
    path: [new Vector3(99999, 99999), new Vector3(99999, 100000)],
    width: 1
  });
  const roadsBorder = createLineVertex({
    path: [new Vector3(99999, 99999), new Vector3(99999, 100000)],
    width: 1
  });

  console.log('mapToVertexData: Starting');

  // buildings disabled

  // roads
  bundleVector3 = waysToBundleVector3(map, map.roads);
  roads.merge(createVertexDataPath(bundleVector3, ROAD_WIDTH), true);
  roadsBorder.merge(
    createVertexDataPath(bundleVector3, ROAD_WIDTH_BORDER),
    true
  );

  // paths
  bundleVector3 = waysToBundleVector3(map, map.paths);
  roads.merge(createVertexDataPath(bundleVector3, ROAD_WIDTH), true);
  roadsBorder.merge(
    createVertexDataPath(bundleVector3, ROAD_WIDTH_BORDER),
    true
  );

  console.log('mapToVertexData: Succesfully built');

  return {
    roads: roads,
    roadsBorder: roadsBorder
  };
};

const waysToBundleVector3 = (map: iMap, ways: iWay[]): Array<Vector3[]> => {
  const wayVertexCollection: Array<Vector3[]> = [];
  let vertexList: Vector3[] = [];
  let nodeMapXCoord = 0;
  let nodeMapYCoord = 0;
  let node: iNode | null = null;

  console.log('WAYS found ', ways.length);
  ways.forEach((way: iWay) => {
    //
    // start vertex path
    vertexList = [];

    way.nodes.forEach((nodeIdentifier: string) => {
      //
      // get node
      node = map.dicNodes[nodeIdentifier];
      if (!node) return;

      // convert coordinates

      nodeMapXCoord =
        ((node.position.lon - map.origin.lon) / (BBOX_SIZE * 2)) * PLANE_SIZE;
      nodeMapYCoord =
        ((node.position.lat - map.origin.lat) / (BBOX_SIZE * 2)) * PLANE_SIZE;

      vertexList.push(new Vector3(nodeMapXCoord, 0, nodeMapYCoord));
    });

    // end path
    wayVertexCollection.push(vertexList);
  });

  console.log('WAYS retreived ', wayVertexCollection.length);
  return wayVertexCollection;
};

// converts a collection of vector3 into vertexData
const createVertexDataPath = (
  vector3Bundle: Array<Vector3[]>,
  width: number
): VertexData[] => {
  const vertexBundle: VertexData[] = [];

  vector3Bundle.forEach((vecList) => {
    const meshOptions: iLineOptions = {
      path: vecList,
      width: width
    };

    vertexBundle.push(createLineVertex(meshOptions));
  });

  return vertexBundle;
};