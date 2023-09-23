import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import Colors from '../constants/Colors';

interface Props {
  icon: 'circle' | 'check-circle' | 'home' | 'target' | 'file-plus';
  color: 'accent' | 'secondary';
}

const Icon = ({ icon, color }: Props) => {
  const theme = useColorScheme();

  const colorMap = {
    accent: Colors[theme!].accent,
    secondary: Colors[theme!].secondary,
  };

  return <Feather name={icon} size={28} color={colorMap[color]} />;
};

export default Icon;

const styles = StyleSheet.create({});
