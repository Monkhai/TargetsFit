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
import { NewTarget, Target, TargetDAO } from '../db/db';
import { SortedTargets } from '../hooks/useGetDismissTargetData';
import { heavyHaptics } from '../utilityFunctions/haptics';

const TargetBank = () => {
  //------------------------------------------------------------------------
  //------------------------------------------------------------------------
  const colorScheme = useColorScheme();
  const navigator = useNavigation();

  //------------------------------------------------------------------------
  //------------------------------------------------------------------------
  const { isLoading: isDBLoading } = useContext(DBContext);

  //------------------------------------------------------------------------
  const { targets, isLoading, error, refetch: refetchAllTargets } = useContext(TargetsContext);
  const { weeklyTargets, refetch: refetchWeeklyTargets } = useContext(WeeklyTargetsContext);
  const { refetch: refetchActiveCount } = useContext(ActiveQuantityContext);

  //------------------------------------------------------------------------
  const [editedTarget, setEditedTarget] = useState<Target>({} as Target);
  const [isNewModalVisible, setIsNewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDismissTargetModalVisible, setIsDismissTargetModalVisible] = useState(false);

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
  const editTarget = useCallback((updatedTarget: Target, oldTarget: Target) => {
    const changedQuantity = updatedTarget.quantity - oldTarget.quantity;

    if (changedQuantity > 0) {
      updateTarget(updatedTarget);
    } else {
      Alert.alert(`Missing ${-changedQuantity} Targets`, `Would you like to dismiss ${-changedQuantity} targets?`, [
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
      setEditedTarget(() => {
        setIsEditModalVisible(true);
        return target;
      });
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
          colorScheme={colorScheme}
          handleModalEdit={editTarget}
          editedTarget={editedTarget}
          isEditTargetModalVisible={isEditModalVisible}
          setIsEditTargetModalVisible={setIsEditModalVisible}
          isDismissTargetModalVisible={isDismissTargetModalVisible}
          setIsDismissTargetModalVisible={setIsDismissTargetModalVisible}
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
