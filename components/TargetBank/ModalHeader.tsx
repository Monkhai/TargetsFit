import { Keyboard, StyleSheet, View } from 'react-native';
import React from 'react';
import Button from '../Button';
import { Text } from '../Themed';

interface Props {
  title: string;
  disabledCondition: boolean;
  handleSave: () => void;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalHeader = ({ title, handleSave, setIsVisible, disabledCondition }: Props) => {
  return (
    <View style={styles.headerContainer}>
      <Button
        title="Cancel"
        onPress={() => {
          Keyboard.dismiss();
          setIsVisible(false);
        }}
      />
      <Text ellipsizeMode="tail" numberOfLines={1} style={styles.headerText}>
        {title}
      </Text>
      <Button title="Save" disabled={disabledCondition} onPress={handleSave} />
    </View>
  );
};

export default React.memo(ModalHeader);

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transerant',
    paddingBottom: 10,
    width: '100%',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
});
