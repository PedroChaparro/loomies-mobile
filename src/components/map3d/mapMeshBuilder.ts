import { iNode, iWay, iMap } from './mapInterfaces';
import { BBOX_SIZE } from './mapFetch';
import { Vector3, VertexData } from '@babylonjs/core';
import { createLineVertex, iLineOptions } from './createLineVertex';
import { PLANE_SIZE } from './Map3DEngine';

//const PLANE_SIZE = 10;
const COLOR_BACKGROUND = '#C8FACC';
const COLOR_ROAD_STROKE = '#C6C6C5';
const COLOR_ROAD_FILL = 'white';
const COLOR_BUILDING_STROKE = '#BFB1A5';
const COLOR_BUILDING_FILL = '#D9D0C9';

const ROAD_WIDTH = 0.2;
const ROAD_BORDER = 0.05;

//export interface iMapBundleVector3{
//roads: Vector3[];
//paths: Vector3[];
//buildings: Vector3[];
//}

export interface iMapBundleVertexData {
  roads: VertexData[];
  roadsBorder: VertexData[];
  buildings: VertexData[];
}

export const mapToVertexData = (map: iMap): iMapBundleVertexData => {
  let bundleVector3: Array<Vector3[]>;
  const mapBundle: iMapBundleVertexData = {
    roads: [],
    roadsBorder: [],
    buildings: []
  };

  // buildings
  // disabled

  // roads
  bundleVector3 = waysToBundleVector3(map, map.roads);

  mapBundle.roads = createVertexDataPath(
    bundleVector3,
    ROAD_WIDTH,
    COLOR_ROAD_FILL
  );
  mapBundle.roadsBorder = createVertexDataPath(
    bundleVector3,
    ROAD_WIDTH + ROAD_BORDER,
    COLOR_ROAD_FILL
  );

  // paths
  bundleVector3 = waysToBundleVector3(map, map.paths);

  mapBundle.roads.push.apply(
    createVertexDataPath(bundleVector3, ROAD_WIDTH, COLOR_ROAD_FILL)
  );
  mapBundle.roadsBorder.push.apply(
    createVertexDataPath(
      bundleVector3,
      ROAD_WIDTH + ROAD_BORDER,
      COLOR_ROAD_FILL
    )
  );

  console.log('FOUND ROADS ', mapBundle.roads.length);

  return mapBundle;
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

      nodeMapXCoord = Math.round(
        ((node.position.lon - map.origin.lon) / (BBOX_SIZE * 2)) * PLANE_SIZE
      );
      nodeMapYCoord = Math.round(
        ((map.origin.lat - node.position.lat) / (BBOX_SIZE * 2)) * PLANE_SIZE
      );

      vertexList.push(new Vector3(nodeMapXCoord, 0, nodeMapYCoord));
    });

    // end path
    wayVertexCollection.push(vertexList);
  });

  console.log('WAYS retreived ', wayVertexCollection.length);
  return wayVertexCollection;
};

const createVertexDataPath = (
  vector3Bundle: Array<Vector3[]>,
  width: number,
  color: string
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
