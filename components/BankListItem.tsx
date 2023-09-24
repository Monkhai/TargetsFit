import React, { ReactNode } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import { listItemHeight, listItemWidth } from './ListItem';
import { Text, View } from './Themed';

interface Props {
  name: string;
  type: string;
  quantity?: number;
  renderRightActions?: () => ReactNode;
}

const BankListItem = ({ name: title, type, quantity, renderRightActions }: Props) => {
  const theme = useColorScheme();

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View style={[{ backgroundColor: Colors[theme ?? 'light'].background }, styles.container]}>
        <Text style={[styles.title, styles.text]}>{title}</Text>
        <Text style={styles.text}>{type}</Text>
        {quantity && <Text style={styles.text}>{quantity}</Text>}
      </View>
    </Swipeable>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: listItemHeight,
    paddingHorizontal: 30,
    width: listItemWidth,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  detailsContainer: {
    paddingLeft: 10,
    justifyContent: 'center',
  },
  text: {
    fontSize: 17,
  },
  title: {
    fontWeight: 'bold',
    color: 'red',
    minWidth: 190,
  },
  subTitle: {
    color: Colors.light.accent,
  },
  chevron: {
    alignSelf: 'center',
    position: 'absolute',
    right: 20,
  },
});

export default BankListItem;
