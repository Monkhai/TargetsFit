import { ButtonProps, Button as NativeButton } from 'react-native';
import React from 'react';

interface Props extends ButtonProps {
  title: string;
  onPress?: () => void;
}
//------------------------------------------------------------------------
const Button = ({ title, onPress, ...props }: Props) => {
  return <NativeButton title={title} color="red" onPress={onPress} {...props} />;
};

export default Button;
