import { Keyboard, StyleSheet, View } from 'react-native';
import React from 'react';
import Button from '../Button';
import { Text } from '../Themed';

interface Props {
  title: string;
  name: string | undefined;
  quantity: number | undefined;
  handleSave: () => void;
  setIsEditTargetModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalHeader = ({ title, name, quantity, handleSave, setIsEditTargetModalVisible }: Props) => {
  return (
    <View style={styles.headerContainer}>
      <Button
        title="Cancel"
        onPress={() => {
          Keyboard.dismiss();
          setIsEditTargetModalVisible(false);
        }}
      />
      <Text ellipsizeMode="tail" numberOfLines={1} style={styles.headerText}>
        {title}
      </Text>
      <Button title="Save" disabled={!name || !quantity} onPress={handleSave} />
    </View>
  );
};

export default ModalHeader;

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
