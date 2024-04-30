import {checkPermission, requestPermission} from '@/helpers/handle-permission';
import Constants from 'expo-constants';
import {
  ConnectionResult,
  EndpointFound,
  Strategy,
  acceptConnection,
  disconnectFromEndpoint,
  rejectConnection,
  requestConnection,
  sendPayload,
  startAdvertising,
  startDiscovery,
  stopAdvertising,
  stopAllEndpoints,
  stopDiscovery,
} from 'expo-nearby-connections';
import React, {useCallback, useRef, useState} from 'react';
import {Alert} from 'react-native';

export interface ContextValue {
  endpoints: EndpointFound[];
  connectedDevice: ConnectionResult | undefined;
  isAdvertising: boolean;
  isDiscovering: boolean;
  handleAdvertiser: (onAccepted: () => void) => void;
  handleStopAdvertiser: () => void;
  handleDiscoverer: () => void;
  handleStopDiscoverer: () => void;
  handleRequest: (endpoint: EndpointFound, onAccepted: () => void) => void;
  handleStopRequest: () => void;
  handleSend: (payload: string) => void;
  handleDisconnect: () => void;
}

export const NearbyConnectionContext = React.createContext<ContextValue>(
  {} as ContextValue,
);

interface Props {
  children: React.ReactNode;
}

const packageName = Constants.expoConfig?.android?.package || 'com.battlex';
const deviceName = Constants.deviceName || 'Battlex';

export const NearbyConnectionProvider: React.FC<Props> = ({children}) => {
  const [endpoints, setEndpoints] = useState<EndpointFound[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<ConnectionResult>();
  const [isAdvertising, setIsAdvertising] = useState(false);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const advertiseRef = useRef<Function>();
  const discoverRef = useRef<Function>();
  const requestRef = useRef<Function>();

  const handleAdvertiser = useCallback(async (onAccepted: () => void) => {
    const isGranted = await checkPermission();

    if (!isGranted) {
      const isRequested = await requestPermission();

      if (!isRequested) {
        console.log('Permission is not granted');
        return;
      }
    }

    advertiseRef.current = startAdvertising(
      deviceName,
      packageName,
      Strategy.P2P_POINT_TO_POINT,
      {
        onConnectionInitiated: (result) => {
          Alert.alert(
            'Connection',
            `Accept connection from ${result.endpointName} with PIN: ${result.authenticationDigits}?`,
            [
              {
                text: 'Accept',
                onPress: async () => {
                  await acceptConnection(result.endpointId);
                  onAccepted();
                },
              },
              {
                text: 'Reject',
                onPress: () => rejectConnection(result.endpointId),
              },
            ],
          );
        },
        onConnectionResult: (result) => {
          if (result.isSuccess) {
            setConnectedDevice(result);
          }
        },
        onDisconnected: () => {
          setConnectedDevice(undefined);
        },
      },
    );

    setIsAdvertising(true);
  }, []);

  const handleStopAdvertiser = useCallback(() => {
    advertiseRef.current?.();
    stopAdvertising();
    setIsAdvertising(false);
  }, []);

  const handleDiscoverer = useCallback(async () => {
    const isGranted = await checkPermission();

    if (!isGranted) {
      const isRequested = await requestPermission();

      if (!isRequested) {
        console.log('Permission is not granted');
        return;
      }
    }

    discoverRef.current = startDiscovery(
      packageName,
      Strategy.P2P_POINT_TO_POINT,
      {
        onEndpointFound: (endpoint) => {
          setEndpoints((prev) => [...prev, endpoint]);
        },
        onEndpointLost: (endpoint) => {
          setEndpoints((prev) =>
            prev.filter((e) => e.endpointId !== endpoint.endpointId),
          );
        },
      },
    );

    setIsDiscovering(true);
  }, []);

  const handleStopDiscoverer = useCallback(() => {
    discoverRef.current?.();
    stopDiscovery();
    setIsDiscovering(false);
  }, []);

  const handleRequest = useCallback(
    async (endpoint: EndpointFound, onAccepted: () => void) => {
      requestRef.current = await requestConnection(
        deviceName,
        endpoint.endpointId,
        {
          onConnectionInitiated: (result) => {
            Alert.alert(
              'Connection',
              `Accept connection from ${result.endpointName} with PIN: ${result.authenticationDigits}?`,
              [
                {
                  text: 'Accept',
                  onPress: async () => {
                    await acceptConnection(result.endpointId);
                    onAccepted();
                  },
                },
                {
                  text: 'Reject',
                  onPress: () => rejectConnection(result.endpointId),
                },
              ],
            );
          },
          onConnectionResult: (result) => {
            if (result.isSuccess) {
              setConnectedDevice(result);
            }
          },
          onDisconnected: () => {
            setConnectedDevice(undefined);
          },
        },
      );
    },
    [],
  );

  const handleStopRequest = useCallback(() => {
    requestRef.current?.();
  }, []);

  const handleSend = useCallback(
    async (payload: string) => {
      if (connectedDevice) {
        await sendPayload(connectedDevice.endpointId, payload);
      }
    },
    [connectedDevice],
  );

  const handleDisconnect = useCallback(() => {
    if (connectedDevice) {
      disconnectFromEndpoint(connectedDevice.endpointId);
      stopAllEndpoints();
      setConnectedDevice(undefined);
    }
  }, []);

  const contextValue: ContextValue = {
    endpoints,
    connectedDevice,
    isAdvertising,
    isDiscovering,
    handleAdvertiser,
    handleStopAdvertiser,
    handleDiscoverer,
    handleStopDiscoverer,
    handleRequest,
    handleStopRequest,
    handleSend,
    handleDisconnect,
  };

  return (
    <NearbyConnectionContext.Provider value={contextValue}>
      {children}
    </NearbyConnectionContext.Provider>
  );
};
