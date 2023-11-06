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
      <Picker.Item label="strength" value={'strength'} />
      <Picker.Item label="mobility" value={'mobility'} />
      <Picker.Item label="VO2" value={'VO2'} />
      <Picker.Item label="Flexibility" value={'flexibilty'} />
      <Picker.Item label="specific" value={'specific'} />
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
