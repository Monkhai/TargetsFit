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
import { Day, NewTarget, Target, TargetDAO, WeeklyTargets } from '../db/db';
import { heavyHaptics } from '../utilityFunctions/haptics';
import TargetsContext from '../context/TargetsContext';
import WeeklyTargetsContext from '../context/WeeklyTargetsContext';
import DismissTargetModal from '../components/TargetBank/DismissTargetModal';
import useTargetOperations from '../hooks/useTargetOperations';

const Targets = new TargetDAO();

type SortedTargets = {
  day: Day;
  target: { targetId: number; targetTbId: number; targetPosition: number };
  quantity: number;
};

const TargetBank = () => {
  //------------------------------------------------------------------------
  //------------------------------------------------------------------------
  const colorScheme = useColorScheme();
  const navigator = useNavigation();

  //------------------------------------------------------------------------
  //------------------------------------------------------------------------
  const { isLoading: isDBLoading } = useContext(DBContext);

  const {
    targets,
    isLoading,
    error,
    weeklyTargets,
    deleteTarget,
    createNewTarget,
    editTarget,
    editedTarget,
    setEditedTarget,
    handleLongPress,
    isNewModalVisible,
    setIsNewModalVisible,
    isEditModalVisible,
    setIsEditModalVisible,
    isDismissTargetModalVisible,
    setIsDismissTargetModalVisible,
    sortedWeeklyTargetsForEdit,
  } = useTargetOperations();

  //------------------------------------------------------------------------
  //------------------------------------------------------------------------
  useEffect(() => {
    navigator.setOptions({
      headerRight: () => <Button title="new" onPress={() => setIsNewModalVisible(true)} />,
      headerRightContainerStyle: { paddingRight: 10 },
      headerLeftContainerStyle: { paddingRight: 10 },
    });
  }, []);

  //------------------------------------------------------------------------
  //------------------------------------------------------------------------
  if (isLoading || isDBLoading) {
    return <LoadingErrorHome message="Loading..." />;
  } else if (error) {
    return <LoadingErrorHome message={error.message} />;
  } else {
    return (
      <View style={styles.container}>
        <View style={[styles.card, { backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary }]}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={targets}
            keyExtractor={(item, index) => item.name + index}
            renderItem={({ item: target }) => (
              <BankListItem colorScheme={colorScheme} onRemovePress={deleteTarget} onLongPress={handleLongPress} target={target} />
            )}
          />
        </View>

        <NewTargetModal
          colorScheme={colorScheme}
          handleModalSave={createNewTarget}
          isNewTargetModalVisible={isNewModalVisible}
          setIsNewTargetModalVisible={setIsNewModalVisible}
        />
        <EditTargetModal
          colorScheme={colorScheme}
          handleModalEdit={editTarget}
          editedTarget={editedTarget}
          isEditTargetModalVisible={isEditModalVisible}
          setIsEditTargetModalVisible={setIsEditModalVisible}
          isDismissTargetModalVisible={isDismissTargetModalVisible}
          setIsDismissTargetModalVisible={setIsDismissTargetModalVisible}
          sortedWeeklyTargetsForEdit={sortedWeeklyTargetsForEdit}
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
    paddingHorizontal: 10,
  },
});
