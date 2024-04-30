import {generatePlayerDimensions} from '@/helpers/generate-player-dimensions';
import {playerTap} from '@/helpers/player-tap';
import {useNearbyConnection} from '@/hooks/use-nearby-connection';
import {usePayloadReceivedNearby} from '@/hooks/use-payload-received-nearby';
import {SkiaMutableValue, useValue} from '@shopify/react-native-skia';
import React, {useEffect, useMemo, useState} from 'react';

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
  const player1 = useValue<number[][]>(
    useMemo(() => generatePlayerDimensions(), []),
  );

  const player2 = useValue<number[][]>(
    useMemo(() => generatePlayerDimensions(), []),
  );

  const player1Turn = useValue(true);
  const [player1TurnState, setPlayer1TurnState] = useState(true);
  const [rerender, setRerender] = useState(true);

  const {connectedDevice, isAdvertising, handleSend} = useNearbyConnection();

  useEffect(() => {
    if (!!connectedDevice && isAdvertising) {
      player1.current = generatePlayerDimensions();
      player2.current = generatePlayerDimensions();

      handleSend({
        type: 'PlayerDimensions',
        player1: player1.current,
        player2: player2.current,
      });

      player1Turn.current = true;
      setPlayer1TurnState(true);
    }
  }, [connectedDevice, isAdvertising]);

  usePayloadReceivedNearby((payload) => {
    if (payload.type !== 'PlayerDimensions') return;

    player1.current = payload.player1;
    player2.current = payload.player2;
  });

  usePayloadReceivedNearby((payload) => {
    if (payload.type !== 'PlayerTap') return;

    const {i, j} = payload;
    if (player1Turn.current) {
      player2Tap(i, j, false);
    }

    if (!player1Turn.current) {
      player1Tap(i, j, false);
    }

    setRerender((prev) => !prev);
  });

  const player1Tap = (i: number, j: number, isSend = true) =>
    playerTap(i, j, player1, () => {
      setPlayer1TurnState((prev) => !prev);
      player1Turn.current = !player1Turn.current;
      if (isSend) {
        handleSend({
          type: 'PlayerTap',
          i,
          j,
        });
      }
    });

  const player2Tap = (i: number, j: number, isSend = true) =>
    playerTap(i, j, player2, () => {
      setPlayer1TurnState((prev) => !prev);
      player1Turn.current = !player1Turn.current;
      if (isSend) {
        handleSend({
          type: 'PlayerTap',
          i,
          j,
        });
      }
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
