import {Canvas, Circle, Fill} from '@shopify/react-native-skia';
import React from 'react';
import {useWindowDimensions} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {useSharedValue, withDecay} from 'react-native-reanimated';

const App: React.FC = () => {
  const {width, height} = useWindowDimensions();
  const leftBoundary = 0;
  const rightBoundary = width;
  const topBoundary = 0;
  const bottomBoundary = height;
  const translateX = useSharedValue(width / 2);
  const translateY = useSharedValue(height / 2);

  const gesture = Gesture.Pan()
    .onChange((e) => {
      translateX.value += e.changeX;
      translateY.value += e.changeY;
    })
    .onEnd((e) => {
      translateX.value = withDecay({
        velocity: e.velocityX,
        clamp: [leftBoundary, rightBoundary],
      });

      translateY.value = withDecay({
        velocity: e.velocityY,
        clamp: [topBoundary, bottomBoundary],
      });
    });

  return (
    <GestureDetector gesture={gesture}>
      <Canvas style={{flex: 1}}>
        <Fill color="white" />
        <Circle cx={translateX} cy={translateY} r={20} color="#3E3E" />
      </Canvas>
    </GestureDetector>
  );
};

export default App;
