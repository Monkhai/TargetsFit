import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Text, TextProps } from './Themed';
import React from 'react';

interface Props extends TextStyle {
  text: string;
}

const MemoText = ({ text, ...props }: Props) => {
  return <Text {...props}>{text}</Text>;
};

export default React.memo(MemoText);

const styles = StyleSheet.create({});
