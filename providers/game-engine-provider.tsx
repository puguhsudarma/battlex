import {generatePlayerDimensions} from '@/helpers/generate-player-dimensions';
import {playerTap} from '@/helpers/player-tap';
import {SkiaMutableValue, useValue} from '@shopify/react-native-skia';
import React, {useMemo, useState} from 'react';

export interface ContextValue {
  player1: SkiaMutableValue<number[][]>;
  player2: SkiaMutableValue<number[][]>;
  player1Tap: (i: number, j: number) => void;
  player2Tap: (i: number, j: number) => void;
  player1Turn: SkiaMutableValue<boolean>;
  player1TurnState: boolean;
  reset: () => void;
}

export const GameEngineContext = React.createContext<ContextValue>(
  {} as ContextValue,
);

interface Props {
  children: React.ReactNode;
}

export const GameEngineProvider: React.FC<Props> = ({children}) => {
  const player1 = useValue<number[][]>([]);
  const player2 = useValue<number[][]>([]);
  const player1Turn = useValue(true);
  const [player1TurnState, setPlayer1TurnState] = useState(true);

  const player1Tap = (i: number, j: number) =>
    playerTap(i, j, player1, () => {
      setPlayer1TurnState((prev) => !prev);
      player1Turn.current = !player1Turn.current;
    });

  const player2Tap = (i: number, j: number) =>
    playerTap(i, j, player2, () => {
      setPlayer1TurnState((prev) => !prev);
      player1Turn.current = !player1Turn.current;
    });

  const handleReset = () => {
    player1.current = generatePlayerDimensions();
    player2.current = generatePlayerDimensions();
    player1Turn.current = true;
    setPlayer1TurnState(true);
  };

  const contextValue: ContextValue = {
    player1,
    player2,
    player1Tap,
    player2Tap,
    player1Turn,
    player1TurnState,
    reset: handleReset,
  };

  return (
    <GameEngineContext.Provider value={contextValue}>
      {children}
    </GameEngineContext.Provider>
  );
};
