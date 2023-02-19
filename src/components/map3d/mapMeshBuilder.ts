import { iNode, iWay, iMap } from './mapInterfaces';
import { BBOX_SIZE } from './mapFetch';
import { Vector3, VertexData } from '@babylonjs/core';
import { createLineVertex, iLineOptions } from './createLineVertex';
import { PLANE_SIZE } from './Map3DEngine';

//const MAP_SIZE = 500;
const ROAD_WIDTH = 0.5;
const ROAD_WIDTH_BORDER = 0.6;
//const ROAD_WIDTH = 1;
//const ROAD_WIDTH_BORDER = 1.3;

export interface iMapBundleVertexData {
  roads: VertexData[];
  roadsBorder: VertexData[];
  buildings: VertexData[];
}

let ssvg = '';

export const mapToVertexData = (map: iMap): iMapBundleVertexData => {
  let bundleVector3: Array<Vector3[]>;
  const mapBundle: iMapBundleVertexData = {
    roads: [],
    roadsBorder: [],
    buildings: []
  };

  ssvg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">';
  ssvg += `<rect fill="gray" width="500" height="500" />`;

  // buildings disabled

  // roads
  bundleVector3 = waysToBundleVector3(map, map.roads);

  mapBundle.roads = createVertexDataPath(bundleVector3, ROAD_WIDTH);
  mapBundle.roadsBorder = createVertexDataPath(bundleVector3, ROAD_WIDTH_BORDER);

  // paths
  bundleVector3 = waysToBundleVector3(map, map.paths);

  mapBundle.roads.push.apply(createVertexDataPath(bundleVector3, ROAD_WIDTH));
  mapBundle.roadsBorder.push.apply( createVertexDataPath(bundleVector3, ROAD_WIDTH_BORDER));

  console.log('FOUND ROADS ', mapBundle.roads.length);

  ssvg += '</svg>';
  console.log(ssvg);
  return mapBundle;
};

const waysToBundleVector3 = (map: iMap, ways: iWay[]): Array<Vector3[]> => {
  const wayVertexCollection: Array<Vector3[]> = [];
  let vertexList: Vector3[] = [];
  let nodeMapXCoord = 0;
  let nodeMapYCoord = 0;
  let node: iNode | null = null;

  let svg = '';

  console.log('WAYS found ', ways.length);
  ways.forEach((way: iWay) => {
    //
    // start vertex path
    vertexList = [];
    svg += '<path d="M';

    way.nodes.forEach((nodeIdentifier: string) => {
      //
      // get node
      node = map.dicNodes[nodeIdentifier];
      if (!node) return;

      // convert coordinates

      //nodeMapXCoord = 
        //((map.origin.lon - node.position.lon) / (BBOX_SIZE * 2)) * PLANE_SIZE
      //nodeMapYCoord = 
        //((map.origin.lat - node.position.lat) / (BBOX_SIZE * 2)) * PLANE_SIZE

      nodeMapXCoord = 
        ((node.position.lon - map.origin.lon) / (BBOX_SIZE * 2)) * PLANE_SIZE
      nodeMapYCoord = 
        ((node.position.lat - map.origin.lat) / (BBOX_SIZE * 2)) * PLANE_SIZE
      

      //nodeMapXCoord = Math.round(
        //((node.position.lon - map.origin.lon) / (BBOX_SIZE * 2)) * PLANE_SIZE
      //);
      //nodeMapYCoord = Math.round(
        //((map.origin.lat - node.position.lat) / (BBOX_SIZE * 2)) * PLANE_SIZE
      //);

      vertexList.push(new Vector3(nodeMapXCoord, 0, nodeMapYCoord));
      svg += ` ${nodeMapXCoord},${nodeMapYCoord}`;
    });

    // end path
    wayVertexCollection.push(vertexList);
    svg += `" stroke="red" stroke-linejoin="round" stroke-width="7" fill="none" /> \n`;
  });

  console.log('WAYS retreived ', wayVertexCollection.length);
  ssvg += svg;
  return wayVertexCollection;
};

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
