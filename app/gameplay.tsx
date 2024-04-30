import {GridBoard} from '@/components/board';
import {colors} from '@/constants/colors';
import {useGameEngine} from '@/hooks/use-game-engine';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import {Button, StyleSheet, View} from 'react-native';

const App: React.FC = () => {
  const {
    player1,
    player1Tap,
    player2,
    player2Tap,
    player1Turn,
    player1TurnState,
    reset,
  } = useGameEngine();

  return (
    <View style={{flex: 1}}>
      <View style={styles.container}>
        <GridBoard
          backgroundColor={colors.plum1}
          players={player1}
          playerTap={player1Tap}
          isPlayer1={true}
        />

        <Ionicons
          name={player1TurnState ? 'arrow-back' : 'arrow-forward'}
          size={100}
          color={colors.yellow}
          style={{marginHorizontal: 32}}
        />

        <GridBoard
          backgroundColor={colors.plum2}
          players={player2}
          playerTap={player2Tap}
          isPlayer1={false}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 16,
        }}>
        <Button title="    Reset    " onPress={reset} />
      </View>
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
