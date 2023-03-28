import * as Babylon from '@babylonjs/core';

// map

export interface iPosition {
  lat: number;
  lon: number;
}

export interface iNode {
  position: iPosition;
}

export interface iWay {
  nodes: string[]; // iNode identifiers
}

export interface iMap {
  origin: iPosition;
  dicNodes: Record<string, iNode>;
  roads: iWay[];
  paths: iWay[];
  buildings: iWay[];
}

// map elements

export interface iGym {
  id: string;
  origin: iPosition;
  name: string;
}

export interface iMapObject {
  id: string;
  origin: iPosition;
  mesh: Babylon.InstantiatedEntries;
}
