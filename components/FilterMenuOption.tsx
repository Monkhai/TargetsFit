import { ColorSchemeName, StyleSheet, View } from 'react-native';
import React from 'react';
import { Text } from './Themed';
import { MenuOption } from 'react-native-popup-menu';
import Colors from '../constants/Colors';

interface Props {
  value: string | undefined;
  colorScheme: ColorSchemeName;
  setFilter: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const FilterMenuOption = ({ value, colorScheme, setFilter }: Props) => {
  return (
    <MenuOption
      style={{
        borderBottomWidth: 0.33,
        borderBottomColor: Colors[colorScheme ?? 'light'].seperator,
      }}
      value={value}
      onSelect={(value) => setFilter(value)}
    >
      <Text style={styles.text}>{value ? value : 'all'}</Text>
    </MenuOption>
  );
};

export default FilterMenuOption;

const styles = StyleSheet.create({
  text: {
    textTransform: 'capitalize',
    fontSize: 15,
  },
});
