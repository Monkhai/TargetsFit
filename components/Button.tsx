import React from 'react';
import {
  ButtonProps,
  Button as NativeButton,
  Platform,
  Pressable,
  PressableStateCallbackType,
  StyleProp,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';
import Colors from '../constants/Colors';

interface Props extends ButtonProps {
  title: string;
  onPress?: () => void;
}
//------------------------------------------------------------------------
const Button = ({ title, onPress, ...props }: Props) => {
  if (Platform.OS === 'ios') {
    return <NativeButton title={title} color={Colors.accent} onPress={onPress} {...props} />;
  }

  const propsy = { ...props };
  const androidButtonStyle: StyleProp<TextStyle> = {
    color: propsy.disabled ? 'gray' : Colors.accent,
    fontSize: 17,
  };

  const pressableStyle = (isPressed: PressableStateCallbackType): StyleProp<ViewStyle> => {
    if (isPressed.pressed) {
      return {
        opacity: 0.5,
      };
    } else if (!isPressed.pressed) {
      return {
        opacity: 1,
      };
    }
  };

  return (
    <Pressable hitSlop={5} style={(a) => pressableStyle(a)} onPress={onPress} {...props}>
      <Text style={androidButtonStyle}>{title}</Text>
    </Pressable>
  );
};

export default Button;
