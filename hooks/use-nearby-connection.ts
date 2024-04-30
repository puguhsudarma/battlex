import {NearbyConnectionContext} from '@/providers/nearby-connection-provider';
import {useContext} from 'react';

export const useNearbyConnection = () => {
  const context = useContext(NearbyConnectionContext);
  if (!context) {
    throw new Error(
      'useNearbyConnection must be used within a NearbyConnectionProvider',
    );
  }
  return context;
};
