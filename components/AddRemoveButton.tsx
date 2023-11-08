import { Pressable, StyleSheet, Text, View, ViewProps, ViewStyle, useColorScheme } from 'react-native';
import React from 'react';
import Colors from '../constants/Colors';

interface Props {
  disabled?: boolean;
  onPress: () => void;
  label: string;
}

const AddRemoveButton = ({ disabled = false, onPress, label }: Props) => {
  const colorScheme = useColorScheme();
  return (
    <Pressable style={(a) => (a.pressed ? { opacity: 0.5 } : { opacity: 1 })} disabled={disabled} onPress={onPress}>
      <View style={[styles.addButtonContainer, { backgroundColor: Colors[colorScheme ?? 'light'].tertiary }]}>
        <Text style={styles.addButton}>{label}</Text>
      </View>
    </Pressable>
  );
};

export default React.memo(AddRemoveButton);

const styles = StyleSheet.create({
  addButtonContainer: {
    height: 32,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginLeft: 10,
  },
  addButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.accent,
  },
});
