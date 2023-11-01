import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, ColorSchemeName, Keyboard, StyleSheet, TextInput, View } from 'react-native';
import Modal from 'react-native-modal';
import Colors from '../../constants/Colors';
import { BORDER_RADIUS } from '../../constants/SIZES';
import { Day, Target, TargetType } from '../../db/db';
import Button from '../Button';
import { Text } from '../Themed';
import DismissTargetModal from './DismissTargetModal';
import ModalHeader from './ModalHeader';
import CustomTextInput from './CustomTextInput';
import ModalPicker from './ModalPicker';

type SortedTargets = {
  day: Day; // Assume Day is a known type
  target: { targetId: number; targetTbId: number; targetPosition: number };
  quantity: number;
};
interface Props {
  colorScheme: ColorSchemeName;
  isEditTargetModalVisible: boolean;
  setIsEditTargetModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleModalEdit: (target: Target) => void;
  editedTarget: Target;
  setNewEditedTarget: React.Dispatch<React.SetStateAction<Target>>;
  isDismissTargetModalVisible: boolean;
  setIsDismissTargetModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleDecrease: (tb_id: number) => void;

  availableTargets: number;
  sortedWeeklyTargets: SortedTargets[];
}

const EditTargetModal = ({
  colorScheme,
  isEditTargetModalVisible,
  setIsEditTargetModalVisible,
  handleModalEdit,
  editedTarget,
  setNewEditedTarget,
  isDismissTargetModalVisible,
  setIsDismissTargetModalVisible,
  handleDecrease,

  availableTargets,
  sortedWeeklyTargets,
}: Props) => {
  const [selectedType, setSelectedType] = useState<TargetType>(editedTarget.type);
  const [name, setName] = useState<string>(editedTarget.name);
  const [quantity, setQuantity] = useState<number>(editedTarget.quantity);

  useEffect(() => {
    setName(editedTarget.name);
    setQuantity(editedTarget.quantity);
    setSelectedType(editedTarget.type);
  }, [editedTarget]);

  const handleSave = () => {
    setNewEditedTarget({
      name: name,
      quantity: quantity,
      type: selectedType,
      id: editedTarget.id,
    });
    handleModalEdit({
      name: name,
      quantity: quantity,
      type: selectedType,
      id: editedTarget.id,
    });
  };

  if (!editedTarget.id) return null;

  return (
    <Modal
      isVisible={isEditTargetModalVisible}
      style={styles.modal}
      onBackdropPress={() => {
        Keyboard.dismiss();
        setIsEditTargetModalVisible(false);
      }}
      useNativeDriverForBackdrop
      animationIn={'zoomIn'}
      animationOut={'zoomOut'}
    >
      <View style={[{ backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary }, styles.container]}>
        <ModalHeader
          disabledCondition={!name || !quantity}
          handleSave={handleSave}
          setIsVisible={setIsEditTargetModalVisible}
          title={`Edit ${editedTarget.name}`}
        />

        <CustomTextInput onChangeText={(text) => setName(text)} placeholder={editedTarget.name} returnKeyType="next" />
        <CustomTextInput
          onChangeText={(text) => setQuantity(parseInt(text))}
          placeholder={editedTarget.quantity.toString()}
          keyboardType="numeric"
          returnKeyType="done"
        />
        <ModalPicker onValueChange={(value) => setSelectedType(value)} selectedType={selectedType} />
      </View>
      {/* //------------------------------------------------------------------------ */}
      {isDismissTargetModalVisible && (
        <DismissTargetModal
          colorScheme={colorScheme}
          isVisible={isDismissTargetModalVisible}
          setIsVisible={setIsDismissTargetModalVisible}
          handleDecrease={handleDecrease}
          availableTargets={availableTargets}
          sortedWeeklyTargets={sortedWeeklyTargets}
        />
      )}
    </Modal>
  );
};

export default React.memo(EditTargetModal);

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
