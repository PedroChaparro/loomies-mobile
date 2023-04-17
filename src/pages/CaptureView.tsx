import React, { useContext, useEffect, useState } from 'react';
import { NavigationProp, RouteProp, useFocusEffect } from '@react-navigation/core';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { TWildLoomies } from '@src/types/types';
import { MapContext } from '@src/context/MapProvider';
import { getItemsService, getLoomballsService } from '@src/services/user.services';
import { TLoomball } from '@src/types/types';
import { requestCaptureLoomieAttempt } from '@src/services/capture.services';
import { UserPositionContext } from '@src/context/UserPositionProvider';
import { CaptureLoomie3D } from '@src/components/CaptureLoomie3D/CaptureLoomie3D';
import { images } from '@src/utils/utils';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { APP_SCENE, BabylonContext } from '@src/context/BabylonProvider';
import { navigate } from '@src/navigation/RootNavigation';
import { useToastAlert } from '@src/hooks/useToastAlert';

interface CaptureViewProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation?: NavigationProp<any, any>;
  route: RouteProp<{ params: { loomieId: string } }, 'params'>;
}

export const CaptureView = ({ navigation, route }: CaptureViewProps) => {
  const { showInfoToast } = useToastAlert();

  const [loomie, setLoomie] = useState<TWildLoomies | null>(null);
  const { getWildLoomies } = useContext(MapContext);
  const { userPosition } = useContext(UserPositionContext);
  const { showScene } = useContext(BabylonContext);

  // state
  const [balls, setBalls] = useState<TLoomball[]>([]);
  const [ballSelected, setBallSelected] = useState<TLoomball | null>(null);
  //const [ballAmount, setBallAmount] = useState<number>(0);

  // fetch user loomballs

  const fetchLoomballs = () => {

    (async () => {
      const loomballs = await getLoomballsService();

      // if no loomballs return to map
      if (!loomballs.length){
        navigation?.navigate("Map");
        showInfoToast("You don't have any Loomballs to catch this Loomie");
      }

      // set loomballs available to player
      setBalls(loomballs);

      // still has balls of this kind available?
      let available = false;

      if (ballSelected){
        available = loomballs.some((ball) => {
          return (ball._id == ballSelected._id);
        })
      }

      // select the first one in the array
      if (!available && loomballs.length){
        setBallSelected(loomballs[0]);
      }

      console.log(loomballs);

    })();
  };

  const throwLoomball = async () => {
    if (!userPosition) return;
    if (!ballSelected) return;
    if (!loomie) return;

    const success = await requestCaptureLoomieAttempt (userPosition, ballSelected._id, loomie._id);
  }

  const escape = () => {
    navigation?.navigate("Map");
  }

  useEffect(() => {

    // get loomie

    const wildLoomies = getWildLoomies();
    const foundLoomie = wildLoomies.find((wild) => {
      return wild._id == route.params.loomieId;
    })

    // loomie not found, probably it just stopped existing

    if (!foundLoomie) {
      escape();
      return;
    }

    setLoomie(foundLoomie);
    console.log("INFO: Loomie exists", foundLoomie);

    // get user loomballs

    fetchLoomballs();
    
  }, []);

  // toggle render loop on focus events
  useFocusEffect(
    React.useCallback(() => {
      //showScene( APP_SCENE.DETAILS );
      return () => showScene( APP_SCENE.NONE );
    }, [])
  );

  return (
    <View style={styles.container}>

      <View style={styles.scene}>
        { loomie && ballSelected && <CaptureLoomie3D loomie={loomie} loomball={ballSelected} /> }
      </View>

      { /* header */ }
      <View style={styles.circle}></View>
      { loomie && <Text style={styles.title} >{loomie.name}</Text> }
      { loomie && <Text style={styles.subtitle} >Level {loomie.level}</Text>}

      { /* loomball bubble */ }
      <Pressable
        style={styles.bubbleLoomball}
        onPress={() => {
          console.log("1");
        }}
      >
        <Image
          style={{width:65, height:65}}
          source={images['LOOMBALL']}
        />
      </Pressable>

      <Pressable
        style={styles.bubbleLoomballAmount}
        onPress={() => {
          console.log("1");
        }}
      >
      <Text style={{ color: "black" }} >12</Text>
      </Pressable>

      { /* scape bubble */ }
      <Pressable
        style={styles.bubbleEscape}
        onPress={escape}
      >
        <MaterialCommunityIcons size={30} name={"run"} color={"white"} style={{transform: [{ scaleX: -1 }]}} />
      </Pressable>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#289d75',
  },
  scene: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: 'red',
  },
  circle: {
    height:220, 
    width: 230,
    borderRadius:200, 
    backgroundColor:'#ED4A5F', 
    position:'absolute', 
    top:-160, 
    transform: [{scaleX: 2}]
  },
  title: {
    position:'absolute', 
    top:10, 
    fontSize:18, 
    fontWeight: 'bold', 
    color:'white',
    userSelect: "none"
  },
  subtitle: {
    position:'absolute', 
    top:32, 
    fontSize:14, 
    fontWeight: 'middle', 
    color:'white',
    userSelect: "none"
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
    backgroundColor: '#ED4A5F',
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
    userSelect: "none"
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
  },
});
