import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import { listItemHeight } from './ListItem';

interface Props {
  onPress: () => void;
}

const ListItemDeleteAction = ({ onPress }: Props) => {
  const theme = useColorScheme();

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[{ backgroundColor: Colors[theme ?? 'light'].accent }, styles.container]}>
        <MaterialCommunityIcons name="trash-can" size={24} color={Colors.light.background} />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ListItemDeleteAction;

const styles = StyleSheet.create({
  container: {
    height: listItemHeight,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
