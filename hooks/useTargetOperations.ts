import { useContext, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import TargetsContext from '../context/TargetsContext';
import WeeklyTargetsContext from '../context/WeeklyTargetsContext';
import ActiveQuantityContext from '../context/ActiveQuantityContext';
import { Target, NewTarget, TargetDAO, Day } from '../db/db';
import { heavyHaptics } from '../utilityFunctions/haptics';

type SortedTargets = {
  day: Day;
  target: { targetId: number; targetTbId: number; targetPosition: number };
  quantity: number;
};

const useTargetOperations = () => {
  //------------------------------------------------------------------------
  const { targets, isLoading, error, refetch: refetchAllTargets } = useContext(TargetsContext);
  const { weeklyTargets, refetch: refetchWeeklyTargets } = useContext(WeeklyTargetsContext);
  const { activeTargetQuantity, refetch: refetchActiveCount } = useContext(ActiveQuantityContext);

  //------------------------------------------------------------------------
  const [editedTarget, setEditedTarget] = useState<Target>({} as Target);
  const [isNewModalVisible, setIsNewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDismissTargetModalVisible, setIsDismissTargetModalVisible] = useState(false);

  const [sortedWeeklyTargetsForEdit, setSortedWeeklyTargetsForEdit] = useState<SortedTargets[]>();

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
    const quantityDifference = updatedTarget.quantity - oldTarget.quantity;

    if (quantityDifference < 0) {
      handleTargetDecrease(updatedTarget, oldTarget, quantityDifference);
    } else {
      handleTargetIncrease(updatedTarget);
    }
  }, []);

  //------------------------------------------------------------------------
  const handleTargetDecrease = (updatedTarget: Target, oldTarget: Target, quantityDifference: number) => {
    const activeQuantity = activeTargetQuantity.find((target) => target.target.id === updatedTarget.id);

    if (activeQuantity) {
      const unusedQuantity = oldTarget.quantity - activeQuantity.activeCount;

      if (unusedQuantity < -quantityDifference) {
        showUnusedTargetsAlert(updatedTarget, quantityDifference, unusedQuantity);
      } else {
        updateTarget(updatedTarget);
      }
    }
  };

  //------------------------------------------------------------------------
  const handleTargetIncrease = (updatedTarget: Target) => {
    updateTarget(updatedTarget);
  };

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
  const showUnusedTargetsAlert = (updatedTarget: Target, quantityDifference: number, unusedQuantity: number) => {
    const missingUnusedTargets = unusedQuantity + quantityDifference;

    Alert.alert(`${-missingUnusedTargets} Unused Targets Missing`, `Would you like to dismiss ${-missingUnusedTargets} targets?`, [
      {
        text: 'No',
      },
      {
        text: 'Yes',
        isPreferred: true,
        onPress: () => {
          setIsDismissTargetModalVisible(true);
          handleTargetDismiss(updatedTarget);
        },
      },
    ]);
  };

  //------------------------------------------------------------------------
  const handleTargetDismiss = (updatedTarget: Target) => {
    // Handle the target dismiss logic here
  };

  //------------------------------------------------------------------------
  const handleLongPress = useCallback((target: Target) => {
    heavyHaptics();
    setEditedTarget(() => {
      setIsEditModalVisible(true);
      return target;
    });
  }, []);

  return {
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
  };
};

export default useTargetOperations;
