import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
    height: listItemHeight - 10,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
