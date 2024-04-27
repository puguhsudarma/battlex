import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  PADDING,
  SQUARES_AMOUNT_HORIZONTAL,
  SQUARES_AMOUNT_VERTICAL,
  SQUARE_CONTAINER_SIZE,
  SQUARE_SIZE,
} from '@/constants/values';
import {
  Canvas,
  Rect,
  SkiaMutableValue,
  useComputedValue,
  useTouchHandler,
  useValue,
} from '@shopify/react-native-skia';
import {produce} from 'immer';
import {useMemo} from 'react';

interface Props {
  backgroundColor?: string;
}

export const GridBoard: React.FC<Props> = ({backgroundColor}) => {
  const touchedRects = useValue<number[][]>(
    useMemo(
      () =>
        Array.from({length: SQUARES_AMOUNT_HORIZONTAL}, (_, i) => {
          return Array.from({length: SQUARES_AMOUNT_VERTICAL}, (_, j) => {
            return Math.random() > 0.5 ? 1 : 0;
          });
        }),
      [],
    ),
  );

  const touchHandler = useTouchHandler({
    onStart(e) {
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

      if (
        touchedRects.current[i][j] === 3 ||
        touchedRects.current[i][j] === 2
      ) {
        return;
      }

      touchedRects.current = produce(touchedRects.current, (draft) => {
        draft[i][j] = draft[i][j] === 1 ? 3 : 2;
      });
    },
  });

  return (
    <Canvas
      onTouch={touchHandler}
      style={{
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {Array.from({length: SQUARES_AMOUNT_HORIZONTAL}, (_, i) => {
        return Array.from({length: SQUARES_AMOUNT_VERTICAL}, (_, j) => {
          return (
            <Rectangle
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

interface RectangleProps {
  i: number;
  j: number;
  backgroundColor?: string;
  touchedRects: SkiaMutableValue<number[][]>;
}

const Rectangle: React.FC<RectangleProps> = (props) => {
  const color = useComputedValue(() => {
    const value = props.touchedRects.current[props.i][props.j];

    // 0, 1: not touched
    if (value === 0 || value === 1) {
      return props.backgroundColor;
    }

    // 3: touched with correct rectangle
    if (value === 3) {
      return 'green';
    }

    // 2: touched with wrong rectangle
    return 'red';
  }, [props.touchedRects]);

  console.log('Rendering', props.i, props.j, color.current);

  return (
    <>
      <Rect
        key={`square-${props.i}-${props.j}`}
        color={color}
        x={props.i * SQUARE_CONTAINER_SIZE + PADDING + 16}
        y={props.j * SQUARE_CONTAINER_SIZE + PADDING + 16}
        width={SQUARE_SIZE}
        height={SQUARE_SIZE}
      />
    </>
  );
};
