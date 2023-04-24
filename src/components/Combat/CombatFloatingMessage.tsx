import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import { View, Text, Animated } from 'react-native';

export interface iPropsCombatFloatingMessage {
  message?: string;
}

export interface iRefCombatFloatingMessage {
  updateMessage: (_message: string, _direction: boolean) => void;
}

const MAX_VOFFSET = 80;
const ANIMATION_DURATION = 1000;

export const CombatFloatingMessage = forwardRef<
  iRefCombatFloatingMessage,
  iPropsCombatFloatingMessage
>((_props, ref) => {
  const [message, setMessage] = useState<string>('');
  const [direction, setDirection] = useState<boolean>(false);

  // animation
  const offsetBottom = useRef(new Animated.Value(0));
  const offsetTop = useRef(new Animated.Value(0));
  const opacity = useRef(new Animated.Value(0));

  useImperativeHandle(ref, () => ({
    updateMessage: (message: string, direction: boolean) => {
      console.log(message);
      setMessage(message);
      setDirection(direction);

      // set
      opacity.current.setValue(2);

      // up to down
      if (direction) {
        offsetTop.current.setValue(0);
        offsetBottom.current.setValue(0);

        Animated.parallel([
          Animated.timing(offsetTop.current, {
            toValue: MAX_VOFFSET,
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

      // down to up
      else {
        offsetTop.current.setValue(0);
        offsetBottom.current.setValue(0);

        Animated.parallel([
          Animated.timing(offsetBottom.current, {
            toValue: MAX_VOFFSET,
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
    }
  }));

  return (
    <View
      style={{
        position: 'absolute',
        top: direction ? 0 : undefined,
        bottom: direction ? undefined : 0,
        width: '100%',
        alignItems: 'center'
      }}
    >
      <Animated.View style={{ top: offsetTop.current }} pointerEvents='none'>
        <Animated.View
          style={{ bottom: offsetBottom.current }}
          pointerEvents='none'
        >
          <Animated.View
            style={{ opacity: opacity.current }}
            pointerEvents='none'
          >
            <Text>{message}</Text>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </View>
  );
});
CombatFloatingMessage.displayName = 'CombatFloatingMessage';
