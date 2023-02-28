import { iPosition, iMap } from '@src/typescript/mapInterfaces';
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

export const BBOX_SIZE = 0.0015;

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

  console.log(url);

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

function getWays(map: iMap, osm: any): iMap {
  // loop trough all nodes
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

  //debugPrintMap(map);
  return map;
}

export function debugPrintMap(map: iMap) {
  for (const prop in map.dicNodes) {
    console.log((map.dicNodes as any)[prop]);
  }

  console.log('roads');
  map.roads.forEach((el: any) => {
    console.log(el);
  });

  console.log('paths');
  map.paths.forEach((el: any) => {
    console.log(el);
  });

  console.log('buildings');
  map.buildings.forEach((el: any) => {
    console.log(el);
  });

  console.log('Finised printing');
}
