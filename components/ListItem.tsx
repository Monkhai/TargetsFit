import { Dimensions, StyleSheet, TouchableOpacity, View, useColorScheme } from 'react-native';
import React, { ReactNode, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { Target } from '../db/db';
import { Text } from './Themed';
import Colors from '../constants/Colors';
import Swipeable from 'react-native-gesture-handler/Swipeable';
// import { Swipeable } from 'react-native-gesture-handler';

interface Props {
  target: Target;
  bank?: boolean;
  renderLeftActions?: () => ReactNode;
}

const ListItem = ({ target, renderLeftActions, bank = false }: Props) => {
  const theme = useColorScheme();
  const [isDone, setIsDone] = useState(false);

  return (
    <Swipeable renderRightActions={renderLeftActions}>
      <View style={[styles.listItem]}>
        <View style={styles.exerciseName}>
          {!bank && (
            <TouchableOpacity onPress={() => setIsDone(!isDone)}>
              {!isDone ? (
                <FontAwesome name="circle-o" size={24} color={Colors[theme!].accent} />
              ) : (
                <FontAwesome name="circle" size={24} color={Colors[theme!].accent} />
              )}
            </TouchableOpacity>
          )}
          <Text style={[{ fontWeight: 'bold' }, styles.text]}>{target.name}</Text>
        </View>
        {bank && <Text style={styles.text}>{target.quantity}</Text>}
        <Text style={[{ color: 'red' }, styles.text]}>{target.type}</Text>
      </View>
    </Swipeable>
  );
};

export default ListItem;

export const listItemHeight = (Dimensions.get('screen').height / 100) * 6;

const styles = StyleSheet.create({
  listItem: {
    height: listItemHeight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  exerciseName: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    gap: 10,
  },
  text: {
    fontSize: 16,
    flexWrap: 'wrap',
  },
});
