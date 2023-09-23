import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, TextInput, useColorScheme } from 'react-native';
import Modal from 'react-native-modal/dist/modal';
import Colors from '../constants/Colors';
import { NewTarget, TargetType } from '../db/db';
import ExerciseTypePicker from './ExerciseTypePicker';
import { Text, View } from './Themed';

interface Props {
  isVisible: boolean;
  onModalCancel: () => void;
  onModalSave: (newTarget: NewTarget) => void;
  nameRef: React.RefObject<TextInput>;
  typeRef: React.RefObject<TextInput>;
  quantityRef: React.RefObject<TextInput>;
}

const NewTargetModal = ({
  isVisible = false,
  nameRef,
  typeRef,
  quantityRef,
  onModalCancel,
  onModalSave,
}: Props) => {
  const theme = useColorScheme();
  const [nameValue, setNameValue] = useState<string | undefined>();
  const [typeValue, setTypeValue] = useState<TargetType>();
  const [quantityValue, setQuantityValue] = useState<number>(0);

  useEffect(() => {
    if (!isVisible) {
      setNameValue(undefined);
      setTypeValue(undefined);
      setQuantityValue(0);
    }
  }, [isVisible]);

  const handleSave = () => {
    const newTarget: NewTarget = {
      name: nameValue!,
      quantity: quantityValue,
      type: typeValue!,
    };

    onModalSave(newTarget);
  };

  return (
    <Modal isVisible={isVisible} style={styles.modal} useNativeDriverForBackdrop={true}>
      <View style={styles.modalContainer}>
        <View style={styles.topControllers}>
          <Button
            disabled={!nameValue || !typeValue || quantityValue === 0}
            title="save"
            color={'red'}
            onPress={handleSave}
          />
          <Button color={'red'} title="cancel" onPress={onModalCancel} />
        </View>
        <View style={styles.textWrapper}>
          <Text>Target name</Text>
        </View>
        <TextInput
          selectionColor={'red'}
          onChangeText={(text) => setNameValue(text)}
          ref={nameRef}
          style={[{ backgroundColor: Colors[theme ?? 'light'].background }, styles.input]}
          returnKeyType="next"
          onSubmitEditing={() => typeRef.current?.focus()}
        />

        <View style={styles.textWrapper}>
          <Text>Target quantity</Text>
        </View>
        <TextInput
          selectionColor={'red'}
          onChangeText={(text) => setQuantityValue(Number.parseInt(text))}
          ref={quantityRef}
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

export default NewTargetModal;

const styles = StyleSheet.create({
  modal: {
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
    width: '90%',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },

  textWrapper: {
    width: '80%',
    marginTop: 15,
    paddingHorizontal: 10,
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
