import { iNode, iWay, iMap } from './mapInterfaces';
import { BBOX_SIZE } from './mapFetch';

const MAP_SIZE = 500;
const COLOR_BACKGROUND = '#C8FACC';
const COLOR_ROAD_STROKE = '#C6C6C5';
const COLOR_ROAD_FILL = 'white';
const COLOR_BUILDING_STROKE = '#BFB1A5';
const COLOR_BUILDING_FILL = '#D9D0C9';

export const mapToSVG = (map: iMap): string => {
  let svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">';

  // background
  svg += `<rect fill="${COLOR_BACKGROUND}" width="500" height="500" />`;

  // buildings
  svg += drawWays(
    map,
    map.buildings,
    '<path d="M',
    `Z" stroke="${COLOR_BUILDING_STROKE}" stroke-width="1" fill="${COLOR_BUILDING_FILL}" /> \n`
  );

  // roads
  svg += drawWays(
    map,
    map.roads,
    '<path d="M',
    `" stroke="${COLOR_ROAD_STROKE}" stroke-linejoin="round" stroke-width="9" fill="none" /> \n`
  );
  svg += drawWays(
    map,
    map.roads,
    '<path d="M',
    `" stroke="${COLOR_ROAD_FILL}" stroke-linejoin="round" stroke-width="7" fill="none" /> \n`
  );

  // paths
  svg += drawWays(
    map,
    map.paths,
    '<path d="M',
    `" stroke="${COLOR_ROAD_STROKE}" stroke-linejoin="round" stroke-width="8" fill="none" /> \n`
  );
  svg += drawWays(
    map,
    map.paths,
    '<path d="M',
    `" stroke="${COLOR_ROAD_FILL}" stroke-linejoin="round" stroke-width="6" fill="none" /> \n`
  );

  svg += '</svg>';

  return svg;
};

const drawWays = (
  map: iMap,
  ways: iWay[],
  prefix: string,
  sufix: string
): string => {
  let svg = '';
  let nodeMapXCoord = 0;
  let nodeMapYCoord = 0;
  let node: iNode | null = null;

  ways.forEach((way: iWay) => {
    //
    // start svg path
    svg += prefix;

    way.nodes.forEach((nodeIdentifier: string) => {
      //
      // get node
      node = map.dicNodes[nodeIdentifier];
      if (!node) return;

      // convert coordinates

      nodeMapXCoord = Math.round(
        ((node.position.lon - map.origin.lon) / (BBOX_SIZE * 2)) * MAP_SIZE
      );
      nodeMapYCoord = Math.round(
        ((map.origin.lat - node.position.lat) / (BBOX_SIZE * 2)) * MAP_SIZE
      );

      svg += ` ${nodeMapXCoord},${nodeMapYCoord}`;
    });

    // end path
    svg += sufix;
  });

  return svg;
};
