import { Alert, ColorSchemeName, Keyboard, StyleSheet, TextInput, View } from 'react-native';
import React, { useRef, useState } from 'react';
import Modal from 'react-native-modal';
import { BORDER_RADIUS } from '../../constants/SIZES';
import Colors from '../../constants/Colors';
import Button from '../Button';
import { NewTarget, TargetType } from '../../db/db';
import { Picker } from '@react-native-picker/picker';
import { Text } from '../Themed';
import ModalHeader from './ModalHeader';
import CustomTextInput from './CustomTextInput';
import ModalPicker from './ModalPicker';

interface Props {
  colorScheme: ColorSchemeName;
  isNewTargetModalVisible: boolean;
  setIsNewTargetModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleModalSave: (newTarget: NewTarget) => void;
}

const NewTargetModal = ({ colorScheme, isNewTargetModalVisible, setIsNewTargetModalVisible, handleModalSave }: Props) => {
  const [selectedType, setSelectedType] = useState<TargetType>('strength');
  const [newName, setNewName] = useState<string>();
  const [newQuantity, setNewQuantity] = useState<number>();

  const handlePress = () => {
    if (!newName) return Alert.alert('Must choose a name');
    if (!newQuantity) return Alert.alert('Must choose a quantity');

    handleModalSave({
      name: newName,
      quantity: newQuantity,
      type: selectedType,
    });

    Keyboard.dismiss();
    setIsNewTargetModalVisible(false);
  };

  return (
    <Modal
      style={styles.modal}
      onBackdropPress={() => {
        Keyboard.dismiss();
        setIsNewTargetModalVisible(false);
      }}
      animationIn={'zoomIn'}
      animationOut={'zoomOut'}
      useNativeDriverForBackdrop
      isVisible={isNewTargetModalVisible}
    >
      <View style={[{ backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary }, styles.container]}>
        <ModalHeader
          disabledCondition={!newName || !newQuantity}
          handleSave={handlePress}
          setIsVisible={setIsNewTargetModalVisible}
          title="Create Target"
        />
        <CustomTextInput placeholder="Target" onChangeText={(text) => setNewName(text)} returnKeyType="next" />
        <CustomTextInput
          placeholder="Quantity"
          onChangeText={(text) => setNewQuantity(parseInt(text))}
          returnKeyType="done"
          keyboardType="number-pad"
        />
        <ModalPicker onValueChange={(value) => setSelectedType(value)} selectedType={selectedType} />
      </View>
    </Modal>
  );
};

export default React.memo(NewTargetModal);

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
});
