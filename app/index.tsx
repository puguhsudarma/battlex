import {GridBoard} from '@/components/board';
import {colors} from '@/constants/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import {StyleSheet, View} from 'react-native';

const App: React.FC = () => {
  return (
    <View style={styles.container}>
      <GridBoard backgroundColor={colors.plum1} />

      <Ionicons
        name="arrow-back"
        size={100}
        color={colors.yellow}
        style={{marginHorizontal: 32}}
      />

      <GridBoard backgroundColor={colors.plum2} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
