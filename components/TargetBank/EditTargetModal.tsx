import { Alert, ColorSchemeName, StyleSheet, TextInput, View } from 'react-native';
import React, { useRef, useState } from 'react';
import Modal from 'react-native-modal';
import { BORDER_RADIUS } from '../../constants/SIZES';
import Colors from '../../constants/Colors';
import Button from '../Button';
import { NewTarget, Target, TargetType } from '../../db/db';
import { Picker } from '@react-native-picker/picker';
import { Text } from '../Themed';

interface Props {
  colorScheme: ColorSchemeName;
  isEditTargetModalVisible: boolean;
  setIsEditTargetModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleModalEdit: (target: Target) => void;
  editedTarget: Target;
}

const EditTargetModal = ({
  colorScheme,
  isEditTargetModalVisible,
  setIsEditTargetModalVisible,
  handleModalEdit,
  editedTarget,
}: Props) => {
  const [selectedType, setSelectedType] = useState<TargetType>(editedTarget.type);
  const [name, setName] = useState<string>(editedTarget.name);
  const [quantity, setQuantity] = useState<number>(editedTarget.quantity);

  const quantityInputRef = useRef<TextInput>(null);

  const handlePress = () => {
    if (!name) return Alert.alert('Must choose a name');
    if (!quantity) return Alert.alert('Must choose a quantity');

    handleModalEdit({
      name: name,
      quantity: quantity,
      type: selectedType,
      id: editedTarget.id,
    });

    setIsEditTargetModalVisible(false);
  };

  return (
    <Modal
      style={styles.modal}
      onBackdropPress={() => setIsEditTargetModalVisible(false)}
      useNativeDriverForBackdrop
      isVisible={isEditTargetModalVisible}
    >
      <View
        style={[
          { backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary },
          styles.container,
        ]}
      >
        <View style={styles.headerContainer}>
          <Button title="Cancel" onPress={() => setIsEditTargetModalVisible(false)} />
          <Text ellipsizeMode="tail" numberOfLines={1} style={styles.headerText}>
            Edit {editedTarget.name}
          </Text>
          <Button title="Save" disabled={!name || !quantity} onPress={handlePress} />
        </View>
        <TextInput
          style={[styles.textInput, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
          placeholder={editedTarget.name}
          selectionColor={'red'}
          onChangeText={(text) => setName(text)}
          returnKeyType="next"
          onSubmitEditing={() => quantityInputRef.current?.focus()}
        />
        <TextInput
          style={[styles.textInput, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
          keyboardType="number-pad"
          placeholder={editedTarget.quantity.toString()}
          cursorColor={'red'}
          onChangeText={(text) => setQuantity(parseInt(text))}
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

export default EditTargetModal;

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
  headerText: { fontSize: 20, fontWeight: '600', flex: 1 },
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
