import { StyleSheet, TextInput, TextInputProps, useColorScheme } from 'react-native';
import React from 'react';
import Colors from '../../constants/Colors';
import { BORDER_RADIUS } from '../../constants/SIZES';

interface Props extends TextInputProps {
  placeholder: string;
  onChangeText: (text: string) => void;
}

const CustomTextInput = ({ placeholder, onChangeText, ...props }: Props) => {
  const colorScheme = useColorScheme();

  return (
    <TextInput
      style={[styles.textInput, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
      placeholder={placeholder}
      selectionColor={'red'}
      onChangeText={onChangeText}
      {...props}
    />
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  textInput: {
    borderRadius: BORDER_RADIUS,
    fontSize: 18,
    width: '95%',
    padding: 10,
    // marginBottom: 20,
    color: 'red',
  },
});
