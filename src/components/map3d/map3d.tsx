import React from 'react';
import { useEffect } from 'react';

import { getPosition } from './geolocation';
import { fetchMap } from './osm';
import { iMap } from './mapInterfaces';
import { mapToSVG } from './mapSvgRenderer';

export const Map3D = () => {

    useEffect(() => {

        (async () => {
            // get position
            const position = await getPosition();
            console.log("Position: ", position);

            if (!position)
                return;

            // get osm map
            const map: iMap = await fetchMap(position);
            console.log("B")

            // render to svg image
            console.log(mapToSVG(map));

            // convert to base64 image
        })();


    }, []);

    return <>
    </>;
}

