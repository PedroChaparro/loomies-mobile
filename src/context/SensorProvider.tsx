/*
 * Sensor provider:
 * Provides device sensor information
 */

import React, { createContext, useEffect, useState } from 'react';
import {
  setUpdateIntervalForType,
  SensorTypes,
  orientation
} from 'react-native-sensors';
import { Subscription } from 'rxjs';

export interface iSensorContext {
  deviceYaw: number;
}

export const SensorContext = createContext<iSensorContext>({
  deviceYaw: 0
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SensorProvider = (props: { children: any }) => {
  const [deviceYaw, setDeviceYaw] = useState<number>(0);
  const [sensorSubscription, setSensorSubscription] =
    useState<Subscription | null>(null);

  useEffect(() => {
    // sets the update interval config. Does not start the loop
    setUpdateIntervalForType(SensorTypes.orientation, 1000);

    // subscribe to service
    const sub = orientation.subscribe(({ yaw }) => {
      setDeviceYaw(yaw);
    });

    if (sub) setSensorSubscription(sub);

    // unmount
    return () => {
      if (sensorSubscription) {
        sensorSubscription.unsubscribe();
        setSensorSubscription(null);
      }
    };
  }, []);

  return (
    <SensorContext.Provider value={{ deviceYaw }}>
      {props.children}
    </SensorContext.Provider>
  );
};
