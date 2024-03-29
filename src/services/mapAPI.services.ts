import { iPosition, iMap } from '@src/types/mapInterfaces';
import { iGridPosition } from '@src/context/MapProvider';

/*
min Longitude , min Latitude , max Longitude , max Latitude
          ^
          |
        +lat
  <- -lon   +lon ->
        -lat
          |
          v
*/

export const BBOX_SIZE = 0.001;

export async function fetchMap(
  pos: iPosition,
  offset: iGridPosition = { x: 0, y: 0 }
): Promise<iMap> {
  let map: iMap = {
    origin: {
      lon: pos.lon - BBOX_SIZE + BBOX_SIZE * 2 * offset.x,
      //lat: pos.lat + BBOX_SIZE + BBOX_SIZE * 2 * -offset.y
      lat: pos.lat - BBOX_SIZE + BBOX_SIZE * 2 * -offset.y
    },
    dicNodes: {},
    roads: [],
    paths: [],
    buildings: []
  };

  const url = `https://www.openstreetmap.org/api/0.6/map?bbox=${
    pos.lon - BBOX_SIZE + BBOX_SIZE * 2 * offset.x
  },${pos.lat - BBOX_SIZE + BBOX_SIZE * 2 * -offset.y},${
    pos.lon + BBOX_SIZE + BBOX_SIZE * 2 * offset.x
  },${pos.lat + BBOX_SIZE + BBOX_SIZE * 2 * -offset.y}`;

  console.log('INFO: fetching from ', url);

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  const data = await res.json();
  // TODO: error checkin?

  map = getWays(map, data);
  return map;
}

// get ways

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getWays(map: iMap, osm: any): iMap {
  // loop trough all nodes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  osm.elements.forEach((ele: any) => {
    // index all nodes
    if (ele['type'] === 'node') {
      map.dicNodes[ele.id] = {
        position: {
          lat: ele.lat,
          lon: ele.lon
        }
      };
    }

    // group by category
    else if (ele['type'] === 'way') {
      for (const tag in ele['tags']) {
        // buldings
        if (tag === 'building') {
          map.buildings.push({
            nodes: ele['nodes']
          });
        } else if (tag === 'highway') {
          // paths
          if (ele['tags'][tag] === 'footway') {
            map.paths.push({
              nodes: ele['nodes']
            });
          }

          // roads
          else {
            map.roads.push({
              nodes: ele['nodes']
            });
          }
        }
      }
    }
  });

  return map;
}

// For debugging retreived map
export function debugPrintMap(map: iMap) {
  for (const prop in map.dicNodes) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    console.log((map.dicNodes as any)[prop]);
  }

  console.log('roads');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  map.roads.forEach((el: any) => {
    console.log(el);
  });

  console.log('paths');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  map.paths.forEach((el: any) => {
    console.log(el);
  });

  console.log('buildings');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  map.buildings.forEach((el: any) => {
    console.log(el);
  });

  console.log('Finised printing');
}
