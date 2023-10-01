import React, { useContext, useRef, useState } from 'react';
import { Alert, StyleSheet, TextInput, useColorScheme } from 'react-native';
import Modal from 'react-native-modal';
import { Menu } from 'react-native-popup-menu';
import Button from '../components/Button';
import LoadingErrorHome from '../components/LoadingErrorHome';
import { Text, View } from '../components/Themed';
import Colors from '../constants/Colors';
import { BORDER_RADIUS } from '../constants/SIZES';
import ActiveQuantityContext from '../context/ActiveQuantityContext';
import DBContext from '../context/DBLoadingContext';
import TargetsContext from '../context/TargetsContext';
import { NewTarget, Target, TargetDAO, TargetType } from '../db/db';
import { Picker } from '@react-native-picker/picker';

const Targets = new TargetDAO();

const TargetBank = () => {
  const colorScheme = useColorScheme();

  const { isLoading: isDBLoading } = useContext(DBContext);
  const { targets, isLoading, error, refetch, filter, setFilter } = useContext(TargetsContext);

  const { refetch: refetchActiveCount } = useContext(ActiveQuantityContext);

  const [editedTarget, setEditedTarget] = useState<Target>({} as Target);

  const [isNewModalVisible, setIsNewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const menuRef = useRef<Menu>(null);

  const newNameRef = useRef<TextInput>(null);
  const newTypeRef = useRef<TextInput>(null);
  const newQuantityRef = useRef<TextInput>(null);

  const editNameRef = useRef<TextInput>(null);
  const editTypeRef = useRef<TextInput>(null);
  const editQuantityRef = useRef<TextInput>(null);

  //add new target modal
  //add new target modal
  //add new target modal
  const [selectedType, setSelectedType] = useState<TargetType>('strength');
  //add new target modal
  //add new target modal
  //add new target modal

  const handleTargetDelete = (target: Target) => {
    Targets.deleteTarget(target.id)
      .then(() => {
        refetch();
        refetchActiveCount();
      })
      .catch((error: Error) => Alert.alert(error.message));
  };

  const handleModalCancel = () => {
    if (isNewModalVisible) setIsNewModalVisible(false);
    if (isEditModalVisible) setIsEditModalVisible(false);
  };

  const handleTargetLongPress = (target: Target) => {
    setEditedTarget(() => {
      setIsEditModalVisible(true);
      return target;
    });
  };

  const handleModalSave = (newTarget: NewTarget) => {
    Targets.createNewTarget(newTarget)
      .then(() => {
        refetch();
        refetchActiveCount();
      })
      .then(() => setIsNewModalVisible(false))
      .catch((error: Error) => Alert.alert(error.message));
  };

  const handleModalEdit = (updatedTarget: Target) => {
    Targets.updateTarget(updatedTarget)
      .then(() => refetch())
      .then(() => setIsEditModalVisible(false))
      .catch((error: Error) => Alert.alert(error.message));
  };

  if (isLoading || isDBLoading) {
    return <LoadingErrorHome message="Loading..." />;
  } else if (error) {
    return <LoadingErrorHome message={error.message} />;
  } else {
    return (
      <View style={styles.container}>
        <Button title="new" onPress={() => setIsNewModalVisible(true)} />
        <Modal
          onBackdropPress={() => setIsNewModalVisible(false)}
          useNativeDriverForBackdrop
          isVisible={isNewModalVisible}
        >
          <View
            style={{
              alignSelf: 'center',
              width: 300,
              height: 'auto',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary,
              borderRadius: BORDER_RADIUS,
              gap: 10,

              borderWidth: 1,
              borderColor: 'white',
            }}
          >
            <Text>Create new target</Text>
            <TextInput ref={newNameRef} placeholder="Target name" />
            <TextInput ref={newQuantityRef} placeholder="Target quantity" />
            <Picker
              selectedValue={selectedType}
              onValueChange={(itemValue) => setSelectedType(itemValue)}
              style={{
                width: '100%',
                height: 59,
                overflow: 'hidden',
              }}
            >
              <Picker.Item style={{ color: 'white' }} label="strength" value={'strength'} />
              <Picker.Item label="mobility" value={'mobility'} />
              <Picker.Item label="VO2" value={'VO2'} />
              <Picker.Item label="Flexibility" value={'flexibilty'} />
              <Picker.Item label="specific" value={'specific'} />
            </Picker>
          </View>
        </Modal>
      </View>
    );
  }
};

export default TargetBank;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
