import {GameEngineContext} from '@/providers/game-engine-provider';
import {useContext} from 'react';

export const useGameEngine = () => {
  const context = useContext(GameEngineContext);

  if (!context) {
    throw new Error('useGameEngine must be used within a GameEngineProvider');
  }

  return context;
};
