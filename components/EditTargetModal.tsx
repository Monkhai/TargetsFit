import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, TextInput, useColorScheme } from 'react-native';
import Modal from 'react-native-modal/dist/modal';
import Colors from '../constants/Colors';
import { NewTarget, Target, TargetType } from '../db/db';
import ExerciseTypePicker from './ExerciseTypePicker';
import { Text, View } from './Themed';

interface Props {
  isVisible: boolean;
  onModalCancel: () => void;
  onEditModalSave: (updatedTarget: Target) => void;
  target: Target;
  editNameRef: React.RefObject<TextInput>;
  editTypeRef: React.RefObject<TextInput>;
  editQuantityRef: React.RefObject<TextInput>;
  onBackdropPress: () => void;
}

const EditTargetModal = ({
  isVisible = false,
  editNameRef,
  editTypeRef,
  editQuantityRef,
  target,
  onModalCancel,
  onEditModalSave,
  onBackdropPress,
}: Props) => {
  const theme = useColorScheme();
  const [nameValue, setNameValue] = useState<string>();
  const [typeValue, setTypeValue] = useState<TargetType>();
  const [quantityValue, setQuantityValue] = useState<number>();

  const handleSave = () => {
    const updatedTarget: Target = {
      id: target.id,
      name: nameValue ? nameValue : target.name,
      quantity: quantityValue ? quantityValue : target.quantity,
      type: typeValue!,
    };

    onEditModalSave(updatedTarget);
  };

  return (
    <Modal
      isVisible={isVisible}
      style={styles.modal}
      onBackdropPress={onBackdropPress}
      useNativeDriverForBackdrop={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.topControllers}>
          <Button disabled={quantityValue === 0} title="save" color={'red'} onPress={handleSave} />
          <Text style={styles.title}>Edit {target.name}</Text>
          <Button color={'red'} title="cancel" onPress={onModalCancel} />
        </View>
        <View style={styles.textWrapper}>
          <Text>Target name</Text>
        </View>
        <TextInput
          placeholder={target.name}
          selectionColor={'red'}
          onChangeText={(text) => setNameValue(text)}
          ref={editNameRef}
          style={[{ backgroundColor: Colors[theme ?? 'light'].background }, styles.input]}
          returnKeyType="next"
          onSubmitEditing={() => editTypeRef.current?.focus()}
        />

        <View style={styles.textWrapper}>
          <Text>Target quantity</Text>
        </View>
        <TextInput
          placeholder={target.quantity ? target.quantity.toString() : ''}
          selectionColor={'red'}
          onChangeText={(text) => setQuantityValue(Number.parseInt(text))}
          ref={editQuantityRef}
          style={[{ backgroundColor: Colors[theme ?? 'light'].background }, styles.input]}
          keyboardType="numeric"
          returnKeyType="done"
        />

        <View style={styles.textWrapper}>
          <Text>Target type</Text>
        </View>
        <ExerciseTypePicker setTypeValue={setTypeValue} typeValue={typeValue} />
      </View>
    </Modal>
  );
};

export default EditTargetModal;

const styles = StyleSheet.create({
  modal: {
    position: 'relative',
    bottom: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    height: 360,
    width: 300,
    justifyContent: 'flex-start',
    paddingTop: 10,
    alignItems: 'center',
    borderRadius: 20,
  },

  topControllers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    paddingHorizontal: 5,
    paddingBottom: 10,
  },

  textWrapper: {
    width: '80%',
    marginTop: 15,
    paddingHorizontal: 10,
  },

  title: {
    fontWeight: 'bold',
    fontSize: 17,
  },

  input: {
    margin: 10,
    width: '80%',
    height: 35,
    borderRadius: 10,
    paddingHorizontal: 10,
    color: 'red',
  },
});
