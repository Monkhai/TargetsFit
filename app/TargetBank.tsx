import { useNavigation } from 'expo-router';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, useColorScheme } from 'react-native';
import Button from '../components/Button';
import LoadingErrorHome from '../components/LoadingErrorHome';
import BankListItem from '../components/TargetBank/BankListItem';
import EditTargetModal from '../components/TargetBank/EditTargetModal';
import NewTargetModal from '../components/TargetBank/NewTargetModal';
import { View } from '../components/Themed';
import Colors from '../constants/Colors';
import ActiveQuantityContext from '../context/ActiveQuantityContext';
import DBContext from '../context/DBLoadingContext';
import { NewTarget, Target, TargetDAO } from '../db/db';
import { heavyHaptics } from '../utilityFunctions/haptics';
import TargetsContext from '../context/TargetsContext';
import WeeklyTargetsContext from '../context/WeeklyTargetsContext';

const Targets = new TargetDAO();

const TargetBank = () => {
  const colorScheme = useColorScheme();
  const navigator = useNavigation();

  const { isLoading: isDBLoading } = useContext(DBContext);
  const { targets, isLoading, error, refetch: refetchAllTargets } = useContext(TargetsContext);

  const { refetch: refetchWeeklyTergets } = useContext(WeeklyTargetsContext);

  const { refetch: refetchActiveCount } = useContext(ActiveQuantityContext);

  const [editedTarget, setEditedTarget] = useState<Target>({} as Target);

  const [isNewModalVisible, setIsNewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const handleTargetDelete = (target: Target) => {
    Targets.deleteTarget(target.id)
      .then(() => {
        refetchWeeklyTergets();
        refetchAllTargets();
        refetchActiveCount();
      })
      .catch((error: Error) => Alert.alert(error.message));
  };

  const handleTargetLongPress = (target: Target) => {
    heavyHaptics();
    setEditedTarget(() => {
      setIsEditModalVisible(true);
      return target;
    });
  };

  const handleModalSave = (newTarget: NewTarget) => {
    Targets.createNewTarget(newTarget)
      .then(() => {
        refetchAllTargets();
        refetchActiveCount();
      })
      .then(() => setIsNewModalVisible(false))
      .catch((error: Error) => Alert.alert(error.message));
  };

  const handleModalEdit = (updatedTarget: Target) => {
    Targets.updateTarget(updatedTarget)
      .then(() => refetchAllTargets())
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
          style={[
            styles.card,
            { backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary },
          ]}
        >
          <FlatList
            data={targets}
            keyExtractor={(item, index) => item.name + index}
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

export default React.memo(TargetBank);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 13,
  },

  card: {
    width: '100%',
    height: '100%',

    borderRadius: 10,
    padding: 10,
  },
});
