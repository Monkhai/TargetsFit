import React from 'react';
import { ButtonProps, Button as NativeButton, Platform, Pressable, StyleProp, Text, TextStyle } from 'react-native';

interface Props extends ButtonProps {
  title: string;
  onPress?: () => void;
}
//------------------------------------------------------------------------
const Button = ({ title, onPress, ...props }: Props) => {
  if (Platform.OS === 'ios') {
    return <NativeButton title={title} color={'red'} onPress={onPress} {...props} />;
  }

  const propsy = { ...props };
  const androidButtonStyle: StyleProp<TextStyle> = {
    color: propsy.disabled ? 'gray' : 'red',
    fontSize: 17,
  };

  return (
    <Pressable style={(a) => (a.pressed ? { opacity: 0.5 } : { opacity: 1 })} onPress={onPress} {...props}>
      <Text style={androidButtonStyle}>{title}</Text>
    </Pressable>
  );
};

export default Button;
