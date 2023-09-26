import { Stack } from 'expo-router';
import React, { useContext, useRef, useState } from 'react';
import {
  Alert,
  Button,
  Dimensions,
  FlatList,
  StyleSheet,
  TextInput,
  useColorScheme,
} from 'react-native';
import { Menu, MenuProvider } from 'react-native-popup-menu';
import BankListItem from '../components/BankListItem';
import EditTargetModal from '../components/EditTargetModal';
import FilterMenu from '../components/FilterMenu';
import FlexCard from '../components/FlexCard';
import { listItemHeight } from '../components/ListItem';
import ListItemDeleteAction from '../components/ListItemDeleteAction';
import ListItemSeparator from '../components/ListItemSeparator';
import NewTargetModal from '../components/NewTargetModal';
import { Text, View } from '../components/Themed';
import Colors from '../constants/Colors';
import DBContext from '../context/DBLoadingContext';
import { NewTarget, Target, TargetDAO } from '../db/db';
import useGetAllTargets from '../hooks/useGetAllTargets';
import BankFlatList from '../components/BankFlatList';
import TargetsContext from '../context/TargetsContext';

const Targets = new TargetDAO();

const TargetBank = () => {
  const colorScheme = useColorScheme();

  const { isLoading: isDBLoading } = useContext(DBContext);
  const { targets, isLoading, error, refetch, filter, setFilter } = useContext(TargetsContext);

  const [editedTarget, setEditedTarget] = useState<Target>({} as Target);

  const [isNewModalVisible, setIsNewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const menuRef = useRef<Menu>(null);

  const nameRef = useRef<TextInput>(null);
  const typeRef = useRef<TextInput>(null);
  const quantityRef = useRef<TextInput>(null);

  const editNameRef = useRef<TextInput>(null);
  const editTypeRef = useRef<TextInput>(null);
  const editQuantityRef = useRef<TextInput>(null);

  const handleTargetDelete = (target: Target) => {
    Targets.deleteTarget(target.id)
      .then(() => refetch())
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
      .then(() => refetch())
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
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  } else if (error) {
    return (
      <View>
        <Text>{error.message}</Text>
      </View>
    );
  } else {
    return (
      <>
        <Stack.Screen
          options={{
            headerLeft: () => (
              <Button
                title="new"
                color={Colors[colorScheme ?? 'light'].accent}
                onPress={() => setIsNewModalVisible(true)}
              />
            ),
            headerRight: () => (
              <>
                <Button
                  title="filter"
                  color={Colors[colorScheme ?? 'light'].accent}
                  onPress={() => menuRef.current?.open()}
                />

                <FilterMenu colorScheme={colorScheme} menuRef={menuRef} setFilter={setFilter} />
              </>
            ),
          }}
        />
        <View style={styles.container}>
          <FlexCard height={15}>
            <BankFlatList
              targets={targets}
              onLongPress={handleTargetLongPress}
              onDeletePress={handleTargetDelete}
            />
          </FlexCard>
          <NewTargetModal
            onModalCancel={handleModalCancel}
            onBackdropPress={handleModalCancel}
            isVisible={isNewModalVisible}
            nameRef={nameRef}
            typeRef={typeRef}
            quantityRef={quantityRef}
            onModalSave={handleModalSave}
          />
          <EditTargetModal
            onBackdropPress={handleModalCancel}
            onModalCancel={handleModalCancel}
            isVisible={isEditModalVisible}
            editNameRef={editNameRef}
            editQuantityRef={editQuantityRef}
            editTypeRef={editTypeRef}
            target={editedTarget!}
            onEditModalSave={handleModalEdit}
          />
        </View>
        <View></View>
      </>
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
  flatListContainer: {
    width: Dimensions.get('screen').width,
    height: listItemHeight * 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
