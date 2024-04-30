import {
  checkMultiple,
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';

const permissions = [
  PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
  PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE,
  PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
  PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
  PERMISSIONS.ANDROID.NEARBY_WIFI_DEVICES,
];

const checkPermission = async (): Promise<boolean> => {
  const checkPermissionStatus = await checkMultiple(permissions);

  console.log('checkPermissionStatus', checkPermissionStatus);

  const isAllGranted = Object.values(checkPermissionStatus).every((value) => {
    return (
      value === RESULTS.GRANTED ||
      value === RESULTS.UNAVAILABLE ||
      value === RESULTS.LIMITED
    );
  });

  return isAllGranted;
};

const requestPermission = async (): Promise<boolean> => {
  // Request permission
  const result = await requestMultiple(permissions);

  console.log('requestPermission', result);

  const requestIsGranted = Object.values(result).every((value) => {
    return (
      value === RESULTS.GRANTED ||
      value === RESULTS.UNAVAILABLE ||
      value === RESULTS.LIMITED
    );
  });

  return requestIsGranted;
};

export { checkPermission, requestPermission };
