import React, { useEffect, useState } from 'react';
import { Alert, ColorSchemeName, Keyboard, Platform, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import Colors from '../../constants/Colors';
import { BORDER_RADIUS } from '../../constants/SIZES';
import { NewTarget, TargetType } from '../../db/db';
import CustomTextInput from './CustomTextInput';
import ModalHeader from './ModalHeader';
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

  useEffect(() => {
    setNewName(undefined);
    setNewQuantity(undefined);
    setSelectedType('strength');
  }, [isNewTargetModalVisible]);

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
      useNativeDriverForBackdrop
      style={styles.modal}
      onBackdropPress={() => {
        Keyboard.dismiss();
        setIsNewTargetModalVisible(false);
      }}
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
        <ModalPicker
          onValueChange={(value) => {
            setSelectedType(value);
          }}
          selectedType={selectedType}
        />
      </View>
    </Modal>
  );
};

export default React.memo(NewTargetModal);

const styles = StyleSheet.create({
  modal: { width: '100%', margin: 0, top: Platform.OS === 'ios' ? -80 : 0 },
  container: {
    alignSelf: 'center',
    width: '80%',
    maxWidth: 450,
    height: 'auto',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS,
    gap: 20,
    padding: 10,
  },
});
