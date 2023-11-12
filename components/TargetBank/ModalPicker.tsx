import { Platform, StyleSheet, useColorScheme } from 'react-native';
import React from 'react';
import { Picker } from '@react-native-picker/picker';
import { TargetType } from '../../db/db';
import Colors from '../../constants/Colors';

interface Props {
  selectedType: TargetType;
  onValueChange: (item: TargetType) => void;
}

const ModalPicker = ({ selectedType, onValueChange }: Props) => {
  const colorScheme = useColorScheme();

  return (
    <Picker
      selectedValue={selectedType}
      onValueChange={onValueChange}
      style={styles.pickerContainer}
      itemStyle={[styles.pickerItem, { color: Colors[colorScheme ?? 'light'].text }]}
    >
      <Picker.Item style={{ color: Colors[colorScheme ?? 'light'].text }} label="Strength" value={'strength'} />
      <Picker.Item style={{ color: Colors[colorScheme ?? 'light'].text }} label="Mobility" value={'mobility'} />
      <Picker.Item style={{ color: Colors[colorScheme ?? 'light'].text }} label="VO2" value={'VO2'} />
      <Picker.Item style={{ color: Colors[colorScheme ?? 'light'].text }} label="Cardio" value={'cardio'} />
      <Picker.Item style={{ color: Colors[colorScheme ?? 'light'].text }} label="Flexibility" value={'flexibilty'} />
      <Picker.Item style={{ color: Colors[colorScheme ?? 'light'].text }} label="Specific" value={'specific'} />
    </Picker>
  );
};

export default ModalPicker;

const styles = StyleSheet.create({
  pickerContainer: {
    justifyContent: 'center',
    width: '100%',
    height: Platform.OS === 'ios' ? 100 : 50,
    overflow: 'hidden',
  },
  pickerItem: { fontSize: 20 },
});
