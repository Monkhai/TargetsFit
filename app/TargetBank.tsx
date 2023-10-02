import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import Modal from 'react-native-modal';
import { Menu } from 'react-native-popup-menu';
import Button from '../components/Button';
import LoadingErrorHome from '../components/LoadingErrorHome';
import { Text, View } from '../components/Themed';
import Colors from '../constants/Colors';
import { BORDER_RADIUS, LIST_ITEM_HEIGHT } from '../constants/SIZES';
import ActiveQuantityContext from '../context/ActiveQuantityContext';
import DBContext from '../context/DBLoadingContext';
import TargetsContext from '../context/TargetsContext';
import { NewTarget, Target, TargetDAO, TargetType } from '../db/db';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from 'expo-router';
import NewTargetModal from '../components/TargetBank/NewTargetModal';
import { FontAwesome } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';
import BankListItem from '../components/TargetBank/BankListItem';
import EditTargetModal from '../components/TargetBank/EditTargetModal';

const Targets = new TargetDAO();
const AnimatedFontAwesome = Animated.createAnimatedComponent(FontAwesome);
const TargetBank = () => {
  const colorScheme = useColorScheme();
  const navigator = useNavigation();

  const { isLoading: isDBLoading } = useContext(DBContext);
  const { targets, isLoading, error, refetch, filter, setFilter } = useContext(TargetsContext);

  const { refetch: refetchActiveCount } = useContext(ActiveQuantityContext);

  const [editedTarget, setEditedTarget] = useState<Target>({} as Target);

  const [isNewModalVisible, setIsNewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const menuRef = useRef<Menu>(null);

  const editNameRef = useRef<TextInput>(null);
  const editTypeRef = useRef<TextInput>(null);
  const editQuantityRef = useRef<TextInput>(null);

  //add new target modal
  //add new target modal
  //add new target modal

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

  useEffect(() => {
    navigator.setOptions({
      headerRight: () => <Button title="new" onPress={() => setIsNewModalVisible(true)} />,
      headerRightContainerStyle: { paddingRight: 10 },
      headerLeftContainerStyle: { paddingRight: 10 },
    });
  }, []);

  //COMPONENT--COMPONENT--COMPONENT--COMPONENT--COMPONENT--COMPONENT
  //COMPONENT--COMPONENT--COMPONENT--COMPONENT--COMPONENT--COMPONENT
  //COMPONENT--COMPONENT--COMPONENT--COMPONENT--COMPONENT--COMPONENT
  if (isLoading || isDBLoading) {
    return <LoadingErrorHome message="Loading..." />;
  } else if (error) {
    return <LoadingErrorHome message={error.message} />;
  } else {
    return (
      <View style={styles.container}>
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary,
            borderRadius: 10,
            padding: 10,
          }}
        >
          <FlatList
            data={targets}
            renderItem={({ item: target }) => (
              <BankListItem
                colorScheme={colorScheme}
                onRemovePress={handleTargetDelete}
                onLongPress={handleTargetLongPress}
                target={target}
              />
            )}
          />
        </View>
        <NewTargetModal
          colorScheme={colorScheme}
          handleModalSave={handleModalSave}
          isNewTargetModalVisible={isNewModalVisible}
          setIsNewTargetModalVisible={setIsNewModalVisible}
        />
        <EditTargetModal
          colorScheme={colorScheme}
          handleModalEdit={handleModalEdit}
          editedTarget={editedTarget}
          isEditTargetModalVisible={isEditModalVisible}
          setIsEditTargetModalVisible={setIsEditModalVisible}
        />
      </View>
    );
  }
};

export default TargetBank;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '3%',
  },

  listItemContainer: {
    flexDirection: 'row',
    height: LIST_ITEM_HEIGHT,
    alignItems: 'center',
    backgroundColor: 'transparent',
    gap: 30,
  },
  listItemText: {
    fontSize: 15,
  },
  addButtonContainer: {
    height: 32,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  addButtonPlus: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
    paddingBottom: 10,
  },

  headerTitle: { fontSize: 24, fontWeight: 'bold' },
});
