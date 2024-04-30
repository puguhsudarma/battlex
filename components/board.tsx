import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  PADDING,
  SQUARES_AMOUNT_HORIZONTAL,
  SQUARES_AMOUNT_VERTICAL,
  SQUARE_CONTAINER_SIZE,
} from '@/constants/values';
import {useGameEngine} from '@/hooks/use-game-engine';
import {
  Canvas,
  SkiaMutableValue,
  useTouchHandler,
} from '@shopify/react-native-skia';
import {StyleSheet} from 'react-native';
import {RectangleItem} from './rectangle-item';

interface Props {
  backgroundColor?: string;
  players: SkiaMutableValue<number[][]>;
  playerTap: (i: number, j: number) => void;
  isPlayer1?: boolean;
}

export const GridBoard: React.FC<Props> = ({
  backgroundColor,
  players: touchedRects,
  playerTap,
  isPlayer1,
}) => {
  const {player1Turn} = useGameEngine();
  const touchHandler = useTouchHandler({
    onStart(e) {
      if (!isPlayer1 && player1Turn.current) {
        return;
      }

      console.log('Touched', e.x, e.y);

      const i = Math.floor((e.x - PADDING - 16) / SQUARE_CONTAINER_SIZE);
      const j = Math.floor((e.y - PADDING - 16) / SQUARE_CONTAINER_SIZE);

      console.log('Touched square', i, j);

      if (
        i < 0 ||
        i >= SQUARES_AMOUNT_HORIZONTAL ||
        j < 0 ||
        j >= SQUARES_AMOUNT_VERTICAL
      ) {
        return;
      }

      console.log('Current value', touchedRects.current[i][j]);

      playerTap(i, j);
    },
  });

  return (
    <Canvas onTouch={touchHandler} style={styles.canvas}>
      {Array.from({length: SQUARES_AMOUNT_HORIZONTAL}, (_, i) => {
        return Array.from({length: SQUARES_AMOUNT_VERTICAL}, (_, j) => {
          return (
            <RectangleItem
              key={`square-${i}-${j}`}
              backgroundColor={backgroundColor}
              i={i}
              j={j}
              touchedRects={touchedRects}
            />
          );
        });
      })}
    </Canvas>
  );
};

const styles = StyleSheet.create({
  canvas: {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
