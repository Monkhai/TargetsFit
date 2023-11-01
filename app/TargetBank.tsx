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
import TargetsContext from '../context/TargetsContext';
import WeeklyTargetsContext from '../context/WeeklyTargetsContext';
import { NewTarget, Target, TargetByDaysDAO, TargetDAO } from '../db/db';
import useGetDismissTargetData from '../hooks/useGetDismissTargetData';
import { heavyHaptics } from '../utilityFunctions/haptics';

const TargetBank = () => {
  //------------------------------------------------------------------------
  //------------------------------------------------------------------------
  const colorScheme = useColorScheme();
  const navigator = useNavigation();

  //------------------------------------------------------------------------
  const WeeklyTargets = new TargetByDaysDAO();

  //------------------------------------------------------------------------
  //------------------------------------------------------------------------
  const { isLoading: isDBLoading } = useContext(DBContext);

  //------------------------------------------------------------------------
  const { targets, isLoading, error, refetch: refetchAllTargets } = useContext(TargetsContext);
  const { refetch: refetchWeeklyTargets } = useContext(WeeklyTargetsContext);
  const { refetch: refetchActiveCount } = useContext(ActiveQuantityContext);

  //------------------------------------------------------------------------
  const [editedTarget, setEditedTarget] = useState<Target>({} as Target);
  const [newEditedTarget, setNewEditedTarget] = useState<Target>({} as Target);
  const [isNewModalVisible, setIsNewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDismissTargetModalVisible, setIsDismissTargetModalVisible] = useState(false);

  const { availableTargets, sortedWeeklyTargets, missingTargets } = useGetDismissTargetData(editedTarget, newEditedTarget);
  //------------------------------------------------------------------------
  const Targets = new TargetDAO();

  //------------------------------------------------------------------------
  const deleteTarget = useCallback((target: Target) => {
    Targets.deleteTarget(target.id)
      .then(() => {
        refetchWeeklyTargets();
        refetchAllTargets();
        refetchActiveCount();
      })
      .catch((error: Error) => Alert.alert(error.message));
  }, []);

  //------------------------------------------------------------------------
  const createNewTarget = useCallback((newTarget: NewTarget) => {
    Targets.createNewTarget(newTarget)
      .then(() => {
        refetchAllTargets();
        refetchActiveCount();
        setIsNewModalVisible(false);
      })
      .catch((error: Error) => {
        Alert.alert(error.message);
      });
  }, []);

  //------------------------------------------------------------------------
  const editTarget = useCallback(
    (updatedTarget: Target) => {
      console.log(newEditedTarget);
      if (missingTargets <= 0) {
        updateTarget(updatedTarget);
      } else {
        Alert.alert(`Missing ${missingTargets} Targets`, `Would you like to dismiss ${missingTargets} targets?`, [
          {
            text: 'No',
          },
          {
            text: 'Yes',
            isPreferred: true,
            onPress: () => {
              setIsDismissTargetModalVisible(true);
            },
          },
        ]);
      }
    },
    [newEditedTarget, missingTargets]
  );

  //------------------------------------------------------------------------
  const deleteTargetFromWeeklyTargets = useCallback((tb_id: number) => {
    WeeklyTargets.deleteTargetFromWeeklyTargets(tb_id)
      .then(() => {
        refetchActiveCount();
        refetchAllTargets();
        refetchWeeklyTargets();
      })
      .catch((error: Error) => {
        Alert.alert(error.message);
      });
  }, []);

  //------------------------------------------------------------------------
  const updateTarget = (updatedTarget: Target) => {
    Targets.updateTarget(updatedTarget)
      .then(() => {
        refetchAllTargets();
        refetchActiveCount();
        setIsEditModalVisible(false);
      })
      .catch((err: Error) => {
        Alert.alert(err.message);
        setIsEditModalVisible(false);
      });
  };

  //------------------------------------------------------------------------
  const handleLongPress = useCallback(
    (target: Target) => {
      heavyHaptics();
      setIsEditModalVisible(true);
      setEditedTarget(target);
    },
    [isEditModalVisible]
  );

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
          handleDecrease={deleteTargetFromWeeklyTargets}
          colorScheme={colorScheme}
          handleModalEdit={editTarget}
          editedTarget={editedTarget}
          setNewEditedTarget={setNewEditedTarget}
          isEditTargetModalVisible={isEditModalVisible}
          setIsEditTargetModalVisible={setIsEditModalVisible}
          isDismissTargetModalVisible={isDismissTargetModalVisible}
          setIsDismissTargetModalVisible={setIsDismissTargetModalVisible}
          availableTargets={availableTargets}
          sortedWeeklyTargets={sortedWeeklyTargets}
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
