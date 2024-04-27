import {colors} from '@/constants/colors';
import {PADDING, SQUARE_CONTAINER_SIZE, SQUARE_SIZE} from '@/constants/values';
import {
  Rect,
  SkiaMutableValue,
  useComputedValue,
} from '@shopify/react-native-skia';

interface Props {
  i: number;
  j: number;
  backgroundColor?: string;
  touchedRects: SkiaMutableValue<number[][]>;
}

export const RectangleItem: React.FC<Props> = (props) => {
  const color = useComputedValue(() => {
    const value = props.touchedRects.current[props.i][props.j];

    // 0, 1: not touched
    if (value === 0 || value === 1) {
      return props.backgroundColor;
    }

    // 3: touched with correct rectangle
    if (value === 3) {
      return colors.emerald;
    }

    // 2: touched with wrong rectangle
    return colors.red;
  }, [props.touchedRects]);

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
