import React from 'react';
import Svg, { SvgXml } from 'react-native-svg';

const BASE64_IMAGE_SIZE = 500;

interface iSvgWrapper {
  xml: string;
  storeImageBase64: (_str: string) => void;
}

/*
 * This component receives an XML SVG string, once it's fully loaded returns the
 * resulting base64 equivalent. Then it will be deleted by it's parent.
 */

export const SvgWrapper = (props: iSvgWrapper) => {
  const getBase64 = (svgComponent: Svg) => {
    console.log('entered getBase64');

    // TODO: add a % of failure to test

    if (!svgComponent) {
      console.log('rejected getBase64');
      return;
    }

    svgComponent.toDataURL(
      (base64: string) => {
        console.log('Base64 Data Start');
        console.log('Base64 Data End');
        props.storeImageBase64(base64);
      },
      { width: BASE64_IMAGE_SIZE, height: BASE64_IMAGE_SIZE }
    );
  };

  return <SvgXml ref={getBase64} xml={props.xml} width='100' height='100' />;
};
