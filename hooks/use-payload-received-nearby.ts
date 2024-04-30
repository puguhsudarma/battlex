import {PayloadTypes} from '@/types/send-types';
import {onPayloadReceived} from 'expo-nearby-connections';
import {useEffect} from 'react';

export const usePayloadReceivedNearby = (
  callback: (data: PayloadTypes) => void,
) => {
  useEffect(() => {
    const unsubscribe = onPayloadReceived((data) => {
      if (!data.payload) {
        return;
      }

      callback(JSON.parse(data.payload));
    });

    return () => {
      unsubscribe();
    };
  }, [callback]);
};
