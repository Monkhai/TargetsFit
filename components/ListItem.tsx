import {
  Dimensions,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import React, { ReactNode, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { Target } from '../db/db';
import { Text } from './Themed';
import Colors from '../constants/Colors';
import Swipeable from 'react-native-gesture-handler/Swipeable';
// import { Swipeable } from 'react-native-gesture-handler';

interface Props {
  target: Target;
  renderLeftActions?: () => ReactNode;
}

const ListItem = ({ target, renderLeftActions }: Props) => {
  const theme = useColorScheme();
  const [isDone, setIsDone] = useState(false);

  return (
    <Swipeable renderRightActions={renderLeftActions}>
      <View style={[{ backgroundColor: Colors[theme ?? 'light'].background }, styles.listItem]}>
        <View style={styles.exerciseName}>
          <TouchableHighlight onPress={() => setIsDone(!isDone)}>
            {!isDone ? (
              <FontAwesome name="circle-o" size={24} color={Colors[theme!].accent} />
            ) : (
              <FontAwesome name="circle" size={24} color={Colors[theme!].accent} />
            )}
          </TouchableHighlight>
          <Text style={[{ fontWeight: 'bold' }, styles.text]}>{target.name}</Text>
        </View>
        <Text style={[{ color: 'red' }, styles.text]}>{target.type}</Text>
      </View>
    </Swipeable>
  );
};

export default ListItem;

export const listItemHeight = (Dimensions.get('screen').height / 100) * 5;
export const listItemWidth = (Dimensions.get('screen').width / 100) * 90;

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: listItemHeight,
    width: listItemWidth,
    paddingHorizontal: 30,
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
