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

const Targets = new TargetDAO();

type SortedTargets = {
  day: Day; // Assume Day is a known type
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
  const { targets, isLoading, error, refetch: refetchAllTargets } = useContext(TargetsContext);

  const { weeklyTargets, refetch: refetchWeeklyTergets } = useContext(WeeklyTargetsContext);

  const { activeTargetQuantity, refetch: refetchActiveCount } = useContext(ActiveQuantityContext);

  const [editedTarget, setEditedTarget] = useState<Target>({} as Target);

  const [isNewModalVisible, setIsNewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDismissTargetModalVisible, setIsDismissTargetModalVisible] = useState(false);

  const [sortedWeeklyTargetsForEdit, setSortedWeeklyTargetsForEdit] = useState<SortedTargets[]>();

  //------------------------------------------------------------------------
  //------------------------------------------------------------------------
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
      .catch((error: Error) => {
        Alert.alert(error.message);
      });
  };

  const handleModalEdit = (updatedTarget: Target, oldTarget: Target) => {
    //negative if targets are decreasing positive if targets are increasing
    const quantityDifference = updatedTarget.quantity - oldTarget.quantity;

    if (quantityDifference < 0) {
      const activeQuantity = activeTargetQuantity.find((target) => target.target.id == updatedTarget.id);

      if (activeQuantity) {
        const unusedQuantity = oldTarget.quantity - activeQuantity.activeCount;

        if (unusedQuantity < -quantityDifference) {
          const missingUnusedTargets = unusedQuantity + quantityDifference;

          Alert.alert(`${-missingUnusedTargets} Unused Targets Missing`, `Would you like to dismiss ${-missingUnusedTargets} targets?`, [
            {
              text: 'No',
            },
            {
              text: 'Yes',
              isPreferred: true,
              onPress: () => {
                const filteredWeeklyTargets = weeklyTargets.map((day) => {
                  return {
                    ...day,
                    targets: day.targets.filter((target) => target.id === updatedTarget.id),
                  };
                });

                const sortedWeeklyTargets: SortedTargets[] = filteredWeeklyTargets.reduce((acc: SortedTargets[], day) => {
                  if (day.targets.length > 0) {
                    const usedDay = day.day;

                    const target = day.targets.find((target) => target.id === updatedTarget.id);

                    if (target) {
                      const sortedTargets = {
                        day: usedDay,
                        target: { targetId: target.id, targetTbId: target.tb_id, targetPosition: target.position },
                        quantity: day.targets.length,
                      };

                      acc.push(sortedTargets);
                    }
                  }
                  return acc;
                }, []);
                setIsDismissTargetModalVisible(true);
                setSortedWeeklyTargetsForEdit(sortedWeeklyTargets);
              },
            },
          ]);
        } else {
          Targets.updateTarget(updatedTarget)
            .then(() => {
              refetchAllTargets();
              refetchActiveCount();
            })
            .then(() => setIsEditModalVisible(false))
            .catch((error: Error) => Alert.alert(error.message));
        }
      }
    } else {
      Targets.updateTarget(updatedTarget)
        .then(() => {
          refetchAllTargets();
          refetchActiveCount();
        })
        .then(() => setIsEditModalVisible(false))
        .catch((error: Error) => Alert.alert(error.message));
    }
  };

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
