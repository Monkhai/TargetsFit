import React, { useEffect, useState } from 'react';
import { ColorSchemeName, Keyboard, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import Colors from '../../constants/Colors';
import { BORDER_RADIUS } from '../../constants/SIZES';
import { Target, TargetType } from '../../db/db';
import { SingleSortedTarget, SortedTargets } from '../../hooks/useGetDismissTargetData';
import CustomTextInput from './CustomTextInput';
import DismissTargetModal from './DismissTargetModal';
import ModalHeader from './ModalHeader';
import ModalPicker from './ModalPicker';

interface Props {
  colorScheme: ColorSchemeName;
  isEditTargetModalVisible: boolean;
  setIsEditTargetModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleModalEdit: (target: Target) => void;
  editedTarget: Target;
  setNewEditedTarget: React.Dispatch<React.SetStateAction<Target>>;
  isDismissTargetModalVisible: boolean;
  setIsDismissTargetModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onSaveRemoveTargets: (targets: SingleSortedTarget[]) => void;
  missingTargets: number;
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
  onSaveRemoveTargets,
  missingTargets,
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
    Keyboard.dismiss();

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

      <DismissTargetModal
        colorScheme={colorScheme}
        isVisible={isDismissTargetModalVisible}
        setIsVisible={setIsDismissTargetModalVisible}
        onSave={onSaveRemoveTargets}
        missingTargets={missingTargets}
        sortedWeeklyTargets={sortedWeeklyTargets}
      />
    </Modal>
  );
};

export default React.memo(EditTargetModal);

const styles = StyleSheet.create({
  modal: { width: '100%', margin: 0, top: -50 },
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
