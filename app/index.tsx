import {colors} from '@/constants/colors';
import {useNearbyConnection} from '@/hooks/use-nearby-connection';
import Ionicons from '@expo/vector-icons/Ionicons';
import {EndpointFound} from 'expo-nearby-connections';
import {router} from 'expo-router';
import {useCallback} from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

export default function App() {
  const {width} = useWindowDimensions();
  const nearbyConnection = useNearbyConnection();

  const handleRequest = useCallback(
    (endpoint: EndpointFound) => {
      nearbyConnection.handleRequest(endpoint, () => {
        router.push('/gameplay');
      });
    },
    [nearbyConnection],
  );

  const handleAdvertiser = useCallback(() => {
    nearbyConnection.handleAdvertiser(() => {
      router.push('/gameplay');
    });
  }, [nearbyConnection]);

  if (nearbyConnection.isAdvertising) {
    return (
      <View style={styles.container}>
        <View style={{width: width * 0.7, gap: 16}}>
          {nearbyConnection.connectedDevice ? (
            <Text style={{fontSize: 22}}>
              {nearbyConnection.connectedDevice.endpointId} is joined
            </Text>
          ) : (
            <Text style={{fontSize: 22}}>
              <ActivityIndicator style={{marginRight: 16}} />
              {'  Waiting someone join your server...'}
            </Text>
          )}

          <Button
            title="Go back"
            onPress={nearbyConnection.handleStopAdvertiser}
          />
        </View>
      </View>
    );
  }

  if (nearbyConnection.isDiscovering) {
    return (
      <View style={styles.container}>
        <View style={{width: width * 0.7, gap: 16}}>
          {nearbyConnection.endpoints.length <= 0 ? (
            <Text style={{fontSize: 22}}>
              <ActivityIndicator style={{marginRight: 16}} />
              {'  Finding a server...'}
            </Text>
          ) : (
            nearbyConnection.endpoints.map((endpoint) => (
              <TouchableOpacity
                key={endpoint.endpointId}
                activeOpacity={0.8}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 16,
                  backgroundColor: colors.emerald,
                  borderRadius: 8,
                  marginTop: 16,
                  gap: 16,
                }}
                onPress={() => handleRequest(endpoint)}>
                <Ionicons name="person" color={colors.white} size={22} />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: colors.white,
                  }}>
                  {endpoint.endpointName}
                </Text>
              </TouchableOpacity>
            ))
          )}

          <Button
            title="Go back"
            onPress={nearbyConnection.handleStopDiscoverer}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, {gap: 128}]}>
      <TouchableOpacity
        onPress={handleAdvertiser}
        activeOpacity={0.8}
        style={{
          backgroundColor: colors.plum1,
          padding: 16,
          borderRadius: 8,
          alignItems: 'center',
          width: 200,
          height: 200,
          justifyContent: 'center',
        }}>
        <Ionicons name="home" size={70} color={colors.white} />
        <Text
          style={{
            color: colors.white,
            fontSize: 22,
            fontWeight: 'bold',
            marginTop: 8,
          }}>
          Host a game
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={nearbyConnection.handleDiscoverer}
        activeOpacity={0.8}
        style={{
          backgroundColor: colors.emerald,
          padding: 16,
          borderRadius: 8,
          alignItems: 'center',
          width: 200,
          height: 200,
          justifyContent: 'center',
        }}>
        <Ionicons name="person" size={70} color={colors.white} />
        <Text
          style={{
            color: colors.white,
            fontSize: 22,
            fontWeight: 'bold',
            marginTop: 8,
          }}>
          Join game
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    flexDirection: 'row',
  },
});
