import React, { useRef } from 'react';
import Svg, { SvgXml } from 'react-native-svg';
import { iQueuedTile } from './mapInterfaces';

const BASE64_IMAGE_SIZE = 500;

interface iSvgWrapper {
  tile: iQueuedTile;
  storeImageBase64: (_base64: string, _tile: iQueuedTile) => void;
}

/*
 * This component receives an XML SVG string, once it's fully loaded returns the
 * resulting base64 equivalent. Then it will be deleted by it's parent.
 */

export const SvgWrapper = (props: iSvgWrapper) => {
  const done = useRef<boolean>(false);

  const getBase64 = (svgComponent: Svg) => {
    if (done.current) return;

    console.log('entered getBase64');
    // TODO: add a % of failure to test

    if (!svgComponent) {
      console.log('rejected getBase64');
      return;
    }

    done.current = true;

    svgComponent.toDataURL(
      (base64: string) => {
        console.log('Base64 Data Start');
        console.log('Base64 Data End');
        props.storeImageBase64(base64, props.tile);
      },
      { width: BASE64_IMAGE_SIZE, height: BASE64_IMAGE_SIZE }
    );
  };

  return (
    <SvgXml ref={getBase64} xml={props.tile.xml!} width='100' height='100' />
  );
};
