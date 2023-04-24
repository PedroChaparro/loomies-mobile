import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import { View, Text, Animated } from 'react-native';

export interface iPropsCombatFloatingMessage {
  message: string;
}

export interface iRefCombatFloatingMessage {
  updateMessage: (_message: string) => void;
}

const MAX_OFFSET_BOTTOM = 100;
const ANIMATION_DURATION = 1000;

export const CombatFloatingMessage = forwardRef<
  iRefCombatFloatingMessage,
  iPropsCombatFloatingMessage
>((props, ref) => {
  const [message, setMessage] = useState<string>('');

  // animation
  const offsetBottom = useRef(new Animated.Value(0));
  const opacity = useRef(new Animated.Value(0));

  useImperativeHandle(ref, () => ({
    updateMessage: (message: string) => {
      console.log(message);
      setMessage(message);

      // set
      offsetBottom.current.setValue(0);
      opacity.current.setValue(1);

      // start
      Animated.parallel([
        Animated.timing(offsetBottom.current, {
          toValue: MAX_OFFSET_BOTTOM,
          duration: ANIMATION_DURATION,
          useNativeDriver: false
        }),
        Animated.timing(opacity.current, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true
        })
      ]).start();
    }
  }));

  //useEffect(() => {
  //console.log(message);
  //}, [message]);

  return (
    <View style={{ position: 'absolute', bottom: 0 }}>
      <Animated.View style={{ opacity: opacity.current }}>
        <Text style={{ color: 'black' }}>{props.message}</Text>
        <Text>{message}</Text>
      </Animated.View>
      <Animated.View style={{ height: offsetBottom.current }}></Animated.View>
    </View>
  );
});
CombatFloatingMessage.displayName = 'CombatFloatingMessage';
