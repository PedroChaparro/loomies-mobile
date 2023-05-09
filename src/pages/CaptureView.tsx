import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  NavigationProp,
  RouteProp,
  useFocusEffect
} from '@react-navigation/core';
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  BackHandler
} from 'react-native';
import { TWildLoomies } from '@src/types/types';
import { MapContext } from '@src/context/MapProvider';
import { TLoomball } from '@src/types/types';
import { getLoomballsService } from '@src/services/items.services';
import {
  CaptureLoomie3D,
  LOOMBALL_STATE
} from '@src/components/CaptureLoomie3D/CaptureLoomie3D';
import { images } from '@src/utils/utils';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { APP_SCENE, BabylonContext } from '@src/context/BabylonProvider';
import { useToastAlert } from '@src/hooks/useToastAlert';
import { LOOMBALL_INITIAL_STATE } from '@src/components/CaptureLoomie3D/animations';
import { SelectLoomBallModal } from '@src/components/Modals/SelectLoomBall';

interface CaptureViewProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation?: NavigationProp<any, any>;
  route: RouteProp<{ params: { loomieId: string } }, 'params'>;
}

const interactableStates = [
  LOOMBALL_STATE.GRABBABLE,
  LOOMBALL_STATE.ANI_GRABBED,
  LOOMBALL_STATE.ANI_RETURNING
];

export const CaptureView = ({ navigation, route }: CaptureViewProps) => {
  const { showInfoToast } = useToastAlert();

  const [loomie, setLoomie] = useState<TWildLoomies | null>(null);
  const { getWildLoomies } = useContext(MapContext);
  const { showScene } = useContext(BabylonContext);

  // state

  const [ballSelected, setBallSelected] = useState<TLoomball | null>(null);
  const [aniState, setAniState] = useState<LOOMBALL_STATE>(
    LOOMBALL_INITIAL_STATE
  );
  const [showLoomBallModal, setShowLoomBallModal] = useState(false);
  const [loombalImage, setLoombalImage] = useState<string>();
  const cleanUp = useRef<() => Promise<void>>(async () => {
    return;
  });

  // clean up function

  const setCleanUp = (newCleanUp: () => Promise<void>) => {
    cleanUp.current = newCleanUp;
  };

  // set state

  const setBallState = (state: LOOMBALL_STATE) => {
    setAniState(state);
    console.log(`Info: Capture animation state: ${state}`);

    switch (state) {
      // decrease loomball quantity

      case LOOMBALL_STATE.ANI_THROW: {
        // update ball quantity

        let currBall: TLoomball | null = null;

        setBallSelected((ball) => {
          currBall = ball;
          return ball;
        });

        if (currBall) {
          if ((currBall as TLoomball).quantity > 0) {
            (currBall as TLoomball).quantity -= 1;
            setBallSelected(currBall);
          }
        }

        break;
      }

      // refresh user Loomballs on escape

      case LOOMBALL_STATE.ANI_ESCAPED:
        fetchLoomballs();
        break;
    }
  };

  // fetch user loomballs

  const fetchLoomballs = () => {
    (async () => {
      const loomballs = await getLoomballsService();

      // if no loomballs return to map
      if (!loomballs.length) {
        // clean
        await cleanUp.current();

        navigation?.navigate('Map');
        showInfoToast("You don't have any Loomballs to catch this Loomie");
      }

      // still has balls of this kind available?
      let available = false;

      if (ballSelected) {
        available = loomballs.some((ball) => {
          return ball._id == ballSelected._id;
        });
      }

      // select the first one in the array
      if (!available && loomballs.length) {
        setBallSelected(loomballs[0]);
      }

      //Set image of loomBall
      setLoombalImage(ballSelected?.serial.toString().padStart(3, '0'));
    })();
  };

  //update ballSelected

  const updateSelectLoomBall = (loomBall: TLoomball) => {
    setBallSelected(loomBall);
  };

  const escape = async () => {
    // clean
    await cleanUp.current();

    navigation?.navigate('Map');
  };

  useEffect(() => {
    // get loomie

    const wildLoomies = getWildLoomies();
    const foundLoomie = wildLoomies.find((wild) => {
      return wild._id == route.params.loomieId;
    });

    // loomie not found, probably it just stopped existing

    if (!foundLoomie) {
      escape();
      return;
    }

    setLoomie(foundLoomie);
    fetchLoomballs();
  }, [ballSelected]);

  // toggle render loop on focus events
  useFocusEffect(
    React.useCallback(() => {
      // prevent user from going back

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => true
      );

      return () => {
        subscription.remove();
        showScene(APP_SCENE.NONE);
      };
    }, [])
  );

  //Visibility from LoomBall modal
  const toggleItemModalVisibility = () => {
    setShowLoomBallModal(!showLoomBallModal);
  };

  return (
    <View style={styles.container}>
      {showLoomBallModal && (
        <SelectLoomBallModal
          isVisible={showLoomBallModal}
          toggleVisibilityCallback={toggleItemModalVisibility}
          submitCallback={updateSelectLoomBall}
        />
      )}
      <View style={styles.scene}>
        {loomie && ballSelected && (
          <CaptureLoomie3D
            loomie={loomie}
            loomball={ballSelected}
            setBallState={setBallState}
            setCleanUp={setCleanUp}
          />
        )}
      </View>

      {/* header */}
      <View style={styles.circle}></View>
      {loomie && <Text style={styles.title}>{loomie.name}</Text>}
      {loomie && <Text style={styles.subtitle}>Level {loomie.level}</Text>}

      {interactableStates.some((i) => i == aniState) && (
        <>
          {/* loomball bubble */}
          <Pressable
            style={styles.bubbleLoomball}
            onPress={() => {
              toggleItemModalVisibility();
            }}
          >
            <Image
              style={{ width: 70, height: 70 }}
              source={images[`O-${loombalImage}`]}
            />
          </Pressable>

          <Pressable
            style={styles.bubbleLoomballAmount}
            onPress={() => {
              toggleItemModalVisibility();
            }}
          >
            <Text style={{ color: 'black' }}>
              {ballSelected ? ballSelected.quantity : ''}
            </Text>
          </Pressable>

          {/* scape bubble */}
          <Pressable style={styles.bubbleEscape} onPress={escape}>
            <MaterialCommunityIcons
              size={30}
              name={'run'}
              color={'white'}
              style={{ transform: [{ scaleX: -1 }] }}
            />
          </Pressable>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black'
  },
  scene: {
    width: '100%',
    height: '100%'
  },
  circle: {
    height: 220,
    width: 230,
    borderRadius: 200,
    backgroundColor: '#ED4A5F',
    position: 'absolute',
    top: -160,
    transform: [{ scaleX: 2 }]
  },
  title: {
    position: 'absolute',
    top: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    userSelect: 'none'
  },
  subtitle: {
    position: 'absolute',
    top: 32,
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
    userSelect: 'none'
  },
  bubbleLoomball: {
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    position: 'absolute',
    bottom: 15,
    right: 15,
    height: 70,
    //backgroundColor: '#ED4A5F',
    backgroundColor: 'transparent',
    borderRadius: 200
  },
  bubbleLoomballAmount: {
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    position: 'absolute',
    bottom: 15,
    right: 65,
    height: 30,
    backgroundColor: '#ffffff',
    borderRadius: 200,
    userSelect: 'none'
  },
  bubbleEscape: {
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    width: 55,
    height: 55,
    position: 'absolute',
    bottom: 15,
    left: 15,
    backgroundColor: '#00000022',
    borderRadius: 200
  }
});
