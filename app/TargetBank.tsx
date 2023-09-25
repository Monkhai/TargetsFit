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
import {
  Menu,
  MenuOption,
  MenuOptionProps,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import BankListItem from '../components/BankListItem';
import EditTargetModal from '../components/EditTargetModal';
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

const Targets = new TargetDAO();

const TargetBank = () => {
  const colorScheme = useColorScheme();

  const [filter, setFilter] = useState<string>();

  const { isLoading: isDBLoading } = useContext(DBContext);
  const { targets, isLoading, error, refetch } = useGetAllTargets(isDBLoading, filter);

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
                <Menu ref={menuRef}>
                  <MenuTrigger />
                  <MenuOptions
                    optionsContainerStyle={{ backgroundColor: '#f5f5f5', borderRadius: 15 }}
                    customStyles={{
                      optionWrapper: { padding: 15 },
                    }}
                  >
                    <MenuOption value={undefined} onSelect={(value) => setFilter(value)}>
                      <Text>Any</Text>
                    </MenuOption>
                    <MenuOption value={'strength'} onSelect={(value) => setFilter(value)}>
                      <Text>Strength</Text>
                    </MenuOption>
                    <MenuOption value={'mobility'} onSelect={(value) => setFilter(value)}>
                      <Text>Mobility</Text>
                    </MenuOption>
                    <MenuOption value={'flexibility'} onSelect={(value) => setFilter(value)}>
                      <Text>Flexibility</Text>
                    </MenuOption>
                    <MenuOption value={'VO2'} onSelect={(value) => setFilter(value)}>
                      <Text>VO2</Text>
                    </MenuOption>
                    <MenuOption value={'specific'} onSelect={(value) => setFilter(value)}>
                      <Text>Specific</Text>
                    </MenuOption>
                  </MenuOptions>
                </Menu>
              </>
            ),
          }}
        />
        <View style={styles.container}>
          <FlexCard>
            <FlatList
              ItemSeparatorComponent={() => <ListItemSeparator />}
              data={targets}
              keyExtractor={(target: Target) => target.id.toString()}
              renderItem={({ item: target }) => (
                <BankListItem
                  target={target}
                  onLongPress={() => handleTargetLongPress(target)}
                  renderRightActions={() => (
                    <ListItemDeleteAction onPress={() => handleTargetDelete(target)} />
                  )}
                />
              )}
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
