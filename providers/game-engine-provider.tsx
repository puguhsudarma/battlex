import {generatePlayerDimensions} from '@/helpers/generate-player-dimensions';
import {playerTap} from '@/helpers/player-tap';
import {SkiaMutableValue, useValue} from '@shopify/react-native-skia';
import React, {useMemo, useState} from 'react';

export interface ContextValue {
  player1: SkiaMutableValue<number[][]>;
  player2: SkiaMutableValue<number[][]>;
  player1Tap: (i: number, j: number) => void;
  player2Tap: (i: number, j: number) => void;
  player1Turn: boolean;
  reset: () => void;
}

export const GameEngineContext = React.createContext<ContextValue>(
  {} as ContextValue,
);

interface Props {
  children: React.ReactNode;
}

export const GameEngineProvider: React.FC<Props> = ({children}) => {
  const player1 = useValue<number[][]>(
    useMemo(() => generatePlayerDimensions(), []),
  );

  const player2 = useValue<number[][]>(
    useMemo(() => generatePlayerDimensions(), []),
  );

  const [player1Turn, setPlayer1Turn] = useState<boolean>(true);

  const player1Tap = (i: number, j: number) =>
    playerTap(i, j, player1, setPlayer1Turn);

  const player2Tap = (i: number, j: number) =>
    playerTap(i, j, player2, setPlayer1Turn);

  const handleReset = () => {
    player1.current = generatePlayerDimensions();
    player2.current = generatePlayerDimensions();
    setPlayer1Turn(true);
  };

  const contextValue: ContextValue = {
    player1,
    player2,
    player1Tap,
    player2Tap,
    player1Turn,
    reset: handleReset,
  };

  return (
    <GameEngineContext.Provider value={contextValue}>
      {children}
    </GameEngineContext.Provider>
  );
};
