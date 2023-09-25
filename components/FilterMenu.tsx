import { ColorSchemeName, StyleSheet } from 'react-native';
import React, { RefObject } from 'react';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { Text } from './Themed';
import Colors from '../constants/Colors';
import FilterMenuOption from './FilterMenuOption';

interface Props {
  setFilter: React.Dispatch<React.SetStateAction<string | undefined>>;
  menuRef: React.RefObject<Menu>;
  colorScheme: ColorSchemeName;
}

const FilterMenu = ({ setFilter, menuRef, colorScheme }: Props) => {
  return (
    <Menu ref={menuRef}>
      <MenuTrigger />
      <MenuOptions
        optionsContainerStyle={[
          { backgroundColor: Colors[colorScheme ?? 'light'].menuBackground },
          styles.optionsContainerStyle,
        ]}
        customStyles={{ optionWrapper: styles.optionWrapper }}
      >
        <FilterMenuOption colorScheme={colorScheme} setFilter={setFilter} value={undefined} />
        <FilterMenuOption colorScheme={colorScheme} setFilter={setFilter} value="strength" />
        <FilterMenuOption colorScheme={colorScheme} setFilter={setFilter} value="mobility" />
        <FilterMenuOption colorScheme={colorScheme} setFilter={setFilter} value="flexibility" />
        <FilterMenuOption colorScheme={colorScheme} setFilter={setFilter} value="VO2" />
        <FilterMenuOption colorScheme={colorScheme} setFilter={setFilter} value="specific" />
      </MenuOptions>
    </Menu>
  );
};

export default FilterMenu;

const styles = StyleSheet.create({
  optionsContainerStyle: {
    borderRadius: 15,
  },
  optionWrapper: {
    padding: 12,
  },
});
