import { Alert, ColorSchemeName, StyleSheet, TextInput, View } from 'react-native';
import React, { useRef, useState } from 'react';
import Modal from 'react-native-modal';
import { BORDER_RADIUS } from '../../constants/SIZES';
import Colors from '../../constants/Colors';
import Button from '../Button';
import { NewTarget, TargetType } from '../../db/db';
import { Picker } from '@react-native-picker/picker';
import { Text } from '../Themed';

interface Props {
  colorScheme: ColorSchemeName;
  isNewTargetModalVisible: boolean;
  setIsNewTargetModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleModalSave: (newTarget: NewTarget) => void;
}

const NewTargetModal = ({
  colorScheme,
  isNewTargetModalVisible,
  setIsNewTargetModalVisible,
  handleModalSave,
}: Props) => {
  const [selectedType, setSelectedType] = useState<TargetType>('strength');
  const [newName, setNewName] = useState<string>();
  const [newQuantity, setNewQuantity] = useState<number>();

  const quantityInputRef = useRef<TextInput>(null);

  const handlePress = () => {
    if (!newName) return Alert.alert('Must choose a name');
    if (!newQuantity) return Alert.alert('Must choose a quantity');

    handleModalSave({
      name: newName,
      quantity: newQuantity,
      type: selectedType,
    });

    setIsNewTargetModalVisible(false);
  };

  return (
    <Modal
      style={styles.modal}
      onBackdropPress={() => setIsNewTargetModalVisible(false)}
      useNativeDriverForBackdrop
      isVisible={isNewTargetModalVisible}
    >
      <View
        style={[
          { backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary },
          styles.container,
        ]}
      >
        <View style={styles.headerContainer}>
          <Button title="Cancel" onPress={() => setIsNewTargetModalVisible(false)} />
          <Text style={styles.headerText}>New target</Text>
          <Button title="Create" onPress={handlePress} />
        </View>
        <TextInput
          style={[styles.textInput, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
          placeholder="Target name"
          selectionColor={'red'}
          onChangeText={(text) => setNewName(text)}
          returnKeyType="next"
          onSubmitEditing={() => quantityInputRef.current?.focus()}
        />
        <TextInput
          style={[styles.textInput, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
          keyboardType="number-pad"
          placeholder="Target quantity"
          cursorColor={'red'}
          onChangeText={(text) => setNewQuantity(parseInt(text))}
          ref={quantityInputRef}
          returnKeyType="done"
        />
        <Picker
          selectedValue={selectedType}
          onValueChange={(itemValue) => setSelectedType(itemValue)}
          style={styles.pickerContainer}
          itemStyle={[styles.pickerItem, { color: Colors[colorScheme ?? 'light'].text }]}
        >
          <Picker.Item label="strength" value={'strength'} />
          <Picker.Item label="mobility" value={'mobility'} />
          <Picker.Item label="VO2" value={'VO2'} />
          <Picker.Item label="Flexibility" value={'flexibilty'} />
          <Picker.Item label="specific" value={'specific'} />
        </Picker>
      </View>
    </Modal>
  );
};

export default NewTargetModal;

const styles = StyleSheet.create({
  modal: { width: '100%', margin: 0, top: -50 },
  container: {
    alignSelf: 'center',
    width: '80%',
    height: 'auto',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS,
    gap: 20,
    padding: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transerant',
    paddingBottom: 10,
    width: '100%',
  },
  headerText: { fontSize: 20, fontWeight: '600' },
  textInput: {
    borderRadius: BORDER_RADIUS,
    fontSize: 18,
    width: '95%',
    padding: 10,
    color: 'red',
  },
  pickerContainer: {
    justifyContent: 'center',
    width: '100%',
    height: 50,
    overflow: 'hidden',
  },
  pickerItem: { fontSize: 20 },
});
