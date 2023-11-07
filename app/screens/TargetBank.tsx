import { useNavigation } from 'expo-router';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Alert, StyleSheet, useColorScheme } from 'react-native';
import Button from '../../components/Button';
import LoadingErrorHome from '../../components/LoadingErrorHome';
import EditTargetModal from '../../components/TargetBank/EditTargetModal';
import NewTargetModal from '../../components/TargetBank/NewTargetModal';
import TargetBankList from '../../components/TargetBank/TargetBankList';
import { View } from '../../components/Themed';
import ActiveQuantityContext from '../../context/ActiveQuantityContext';
import DBContext from '../../context/DBLoadingContext';
import TargetsContext from '../../context/TargetsContext';
import WeeklyTargetsContext from '../../context/WeeklyTargetsContext';
import { NewTarget, Target, TargetByDaysDAO, TargetDAO } from '../../db/db';
import useGetDismissTargetData, { SingleSortedTarget } from '../../hooks/useGetDismissTargetData';
import { heavyHaptics } from '../../utilityFunctions/haptics';

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
  const { refetch: refetchWeeklyTargets, refetchDailyTargets } = useContext(WeeklyTargetsContext);
  const { refetch: refetchActiveCount } = useContext(ActiveQuantityContext);

  //------------------------------------------------------------------------
  const [oldEditTarget, setOldEditTarget] = useState<Target>({} as Target);
  const [newEditTarget, setNewEditTarget] = useState<Target>({} as Target);
  const [isNewModalVisible, setIsNewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDismissTargetModalVisible, setIsDismissTargetModalVisible] = useState(false);

  const { sortedWeeklyTargets, missingTargets } = useGetDismissTargetData(oldEditTarget, newEditTarget);
  //------------------------------------------------------------------------
  const Targets = new TargetDAO();

  //------------------------------------------------------------------------
  const deleteTarget = useCallback(
    (target: Target) => {
      Targets.deleteTarget(target.id)
        .then(() => {
          refetchWeeklyTargets();
          refetchAllTargets();
          refetchActiveCount();
        })
        .catch((error: Error) => Alert.alert(error.message));
    },
    [refetchActiveCount, refetchAllTargets, refetchWeeklyTargets]
  );

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
  const editTarget = (updatedTarget: Target) => {
    const totalActiveQuantity = sortedWeeklyTargets.reduce((acc, curr) => acc + curr.quantity, 0);
    const availableTargets = oldEditTarget.quantity - totalActiveQuantity;
    const targetsToRemove = Math.max(oldEditTarget.quantity - updatedTarget.quantity, 0);

    const newMissingTargets = targetsToRemove - availableTargets;

    if (newMissingTargets <= 0) {
      updateTarget(updatedTarget);
    } else {
      Alert.alert(`Missing ${newMissingTargets} Targets`, `Would you like to dismiss ${newMissingTargets} targets?`, [
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
  };

  //------------------------------------------------------------------------
  const deleteTargetsFromWeeklyTargets = useCallback(
    (targets: SingleSortedTarget[]) => {
      targets.forEach((target) => {
        WeeklyTargets.deleteTargetFromWeeklyTargets(target.targetTbId, target.dayId)
          .then(() => {
            refetchActiveCount();
            refetchAllTargets();
            refetchDailyTargets(target.dayId);
            setIsDismissTargetModalVisible(false);
          })
          .catch((error: Error) => {
            setIsDismissTargetModalVisible(false);
            Alert.alert(error.message);
          });
      });
    },
    [refetchActiveCount, refetchAllTargets, refetchWeeklyTargets]
  );

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
  const handleTargetPress = useCallback((target: Target) => {
    heavyHaptics();
    setIsEditModalVisible(true);
    setOldEditTarget(target);
  }, []);

  //------------------------------------------------------------------------
  //------------------------------------------------------------------------
  useEffect(() => {
    navigator.setOptions({
      headerRight: () => (
        <Button
          title="New"
          onPress={() => {
            setIsNewModalVisible(true);
          }}
        />
      ),
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
        <TargetBankList targets={targets} deleteTarget={deleteTarget} onLongPress={handleTargetPress} colorScheme={colorScheme} />

        <NewTargetModal
          colorScheme={colorScheme}
          handleModalSave={createNewTarget}
          isNewTargetModalVisible={isNewModalVisible}
          setIsNewTargetModalVisible={setIsNewModalVisible}
        />

        <EditTargetModal
          onSaveRemoveTargets={deleteTargetsFromWeeklyTargets}
          handleModalEdit={editTarget}
          editedTarget={oldEditTarget}
          setNewEditedTarget={setNewEditTarget}
          isEditTargetModalVisible={isEditModalVisible}
          setIsEditTargetModalVisible={setIsEditModalVisible}
          isDismissTargetModalVisible={isDismissTargetModalVisible}
          setIsDismissTargetModalVisible={setIsDismissTargetModalVisible}
          missingTargets={missingTargets}
          sortedWeeklyTargets={sortedWeeklyTargets}
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
    padding: 13,
  },
});
