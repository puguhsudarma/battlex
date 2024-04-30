import {SkiaMutableValue} from '@shopify/react-native-skia';
import {produce} from 'immer';
import React from 'react';

export const playerTap = (
  i: number,
  j: number,
  players: SkiaMutableValue<number[][]>,
  setPlayer1Turn: () => void,
) => {
  'worklet';

  const current = players.current[i][j];

  if (current === 3 || current === 2) {
    return;
  }

  if (current === 0) {
    setPlayer1Turn();
  }

  players.current = produce(players.current, (draft) => {
    draft[i][j] = draft[i][j] === 1 ? 3 : 2;
  });
};
