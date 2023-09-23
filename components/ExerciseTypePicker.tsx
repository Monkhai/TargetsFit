import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import React from 'react';
import { Picker } from '@react-native-picker/picker';
import Colors from '../constants/Colors';
import { TargetType } from '../db/db';

interface Props {
  typeValue: TargetType | undefined;
  setTypeValue: React.Dispatch<React.SetStateAction<TargetType | undefined>>;
}

const ExerciseTypePicker = ({ typeValue, setTypeValue }: Props) => {
  const theme = useColorScheme();

  return (
    <Picker
      style={[{ backgroundColor: Colors[theme ?? 'light'].backgroundSecondary }, styles.picker]}
      selectionColor={Colors[theme ?? 'light'].tertiary}
      selectedValue={typeValue}
      onValueChange={(itemValue) => setTypeValue(itemValue)}
    >
      <Picker.Item color={Colors[theme ?? 'light'].text} label="mobility" value={'mobility'} />
      <Picker.Item color={Colors[theme ?? 'light'].text} label="strength" value={'strength'} />
      <Picker.Item color={Colors[theme ?? 'light'].text} label="VO2" value={'VO2'} />
      <Picker.Item
        color={Colors[theme ?? 'light'].text}
        label="flexibility"
        value={'flexibility'}
      />
      <Picker.Item color={Colors[theme ?? 'light'].text} label="specific" value={'specific'} />
    </Picker>
  );
};

export default ExerciseTypePicker;

const styles = StyleSheet.create({
  picker: {
    marginTop: 10,
    overflow: 'hidden',
    width: '100%',
    height: '15%',
    justifyContent: 'center',
  },
});
