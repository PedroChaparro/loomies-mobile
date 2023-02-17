// grid

export interface iGridPosition {
  x: number;
  y: number;
}

export interface iQueuedTile {
  pos: iGridPosition,
  map: iMap,
  xml?: string | null,
}

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
