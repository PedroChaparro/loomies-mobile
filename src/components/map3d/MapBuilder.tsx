import React, { useEffect, useState, useRef, useContext } from 'react';
import { Image, ScrollView, Text } from 'react-native';

import { fetchMap } from './mapFetch';
import { mapToSVG } from './mapSvgRenderer';
import { SvgWrapper } from './SvgWrapper';
import { iMap, iQueuedTile } from './mapInterfaces';
import { UserPositionContext } from '@src/context/UserPositionProvider';
import { iPosition } from '@src/services/geolocation';
import { GRIDMAP_SIZE } from '@src/context/MapProvider';
import { MapContext, iGridPosition } from '@src/context/MapProvider';

export interface iQueuedTile {
  pos: iGridPosition,
  map: iMap,
  xml?: string | null,
}

export const Map3D = () => {
  // track position
  const userCachedPosition = useRef<iPosition | null>(null);
  const userPosition = useContext(UserPositionContext);

  const mapInfo = useContext(MapContext);
  //const gridImageB64 = useRef<Array<Array<string>>>([]);

  const [finalGridImageB64, setFinalGridImageB64] = useState<Array<string>>([]);
  const [currentProcessingTile, setProcessingTile] = useState<iQueuedTile[]>(
    []
  );

  // queued tiles to be drawn in base64
  const listQueuedTiles = useRef<iQueuedTile[]>([]);
  const isBuilderBusy = useRef<boolean>(false);

  const collectFetchedMapInfo = async () => {

    // check grid is initialized
    //if (map)
    const offset = (GRIDMAP_SIZE - 1) / 2;

    // iterate trought tiles
    for (let i = 0; i < GRIDMAP_SIZE; i++) {
      for (let j = 0; j < GRIDMAP_SIZE; j++) {
        // it's already on the list
        if (
          listQueuedTiles.current.find((tile: iQueuedTile) => {
            return tile.pos.x == i && tile.pos.y == j;
          })
        )
          continue;

        // check which is missing

        console.log('Check tile ', i, ' ', j, ' ', userPosition);
        //if (gridImageB64.current[i][j] !== '') continue;
        if (mapInfo?.getGridImageB64Pos({x: i, y: j})) continue;

        (async () => {
          try {
            console.log('Empty tile ', i, ' ', j);
            if (!userPosition) return;

            // fetch OSM map
            const map: iMap = await fetchMap(userPosition, {
              x: i - offset,
              y: j - offset
            });
            console.log('FETCHED ===========================');

            // push
            listQueuedTiles.current.push({
              pos: { x: i, y: j },
              map: map
            });

            // signal builder
            signalBuilderCheckTiles();
          } catch (error) {
            console.log("Couldn't fetch map");
          }
        })();
      }
    }
  };

  const signalBuilderCheckTiles = () => {
    // is there a tile being processed?
    if (isBuilderBusy.current) return;

    // the list is not empty?
    if (!listQueuedTiles.current.length) return;

    // prepare tile
    isBuilderBusy.current = true;
    const tile = listQueuedTiles.current[0];

    // convert to svg
    tile.xml = mapToSVG(tile.map);

    // send to process
    console.log('PROCESSING ', tile.pos);
    setProcessingTile([]);
    setProcessingTile([tile]);
  };

  //useEffect(() => {
  //}, []);

  useEffect(() => {
    console.log('User position changed');
    if (!userPosition) return;

    // check it's outside boundaries
    let userOffset: iGridPosition = {
      'x': 0,
      'y': 0
    }
    //if (userPosition.)

    // build grid
    console.log('R callling');
    collectFetchedMapInfo();
  }, [userPosition]);

  const storeImageBase64 = (base64: string, tile: iQueuedTile) => {
    // dispatch
    setProcessingTile([]);
    console.log('Finished tile ', tile.pos);
    //gridImageB64.current[tile.pos.x][tile.pos.y] = base64;
    mapInfo?.externalSetGridImageB64(tile.pos, base64);

    // print what we have
    let complete = true;
    for (let i = 0; i < GRIDMAP_SIZE; i++) {
      let str = '';
      for (let j = 0; j < GRIDMAP_SIZE; j++) {
        //complete = complete && gridImageB64.current[i][j] !== '';
        //str += (gridImageB64.current[i][j] !== '') + ' ';
        str += (mapInfo?.getGridImageB64Pos({x:i, y:j}) !== '') + ' ';
      }
      console.log(str);
    }
    console.log('\n');

    // dispatch and continue
    const tileIndex = listQueuedTiles.current.indexOf(tile);
    console.log(tileIndex);

    if (tileIndex > -1) listQueuedTiles.current.splice(tileIndex, 1);
    else console.log('WARNING: Processing tile missing in the Queue');

    isBuilderBusy.current = false;
    signalBuilderCheckTiles();

    setFinalGridImageB64((old) => {
      return [...old, 'data:image/png;base64,' + base64];
    });

    console.log('QUEUE:\n');
    listQueuedTiles.current.forEach((tile, i) => {
      console.log(i, ' ', tile.pos);
    });
  };

  return (
    <ScrollView>
      <>
        {currentProcessingTile.map((tile: iQueuedTile, i: number) => (
          <SvgWrapper key={i} tile={tile} storeImageBase64={storeImageBase64} />
        ))}
      </>

      {finalGridImageB64.map((base64: string, i: number) => (
        <>
          <Text>Hello</Text>
          <Image
            key={i}
            style={{
              width: 200,
              height: 200,
              resizeMode: 'contain'
            }}
            source={{
              uri: base64
            }}
          />
        </>
      ))}
    </ScrollView>
  );
};
