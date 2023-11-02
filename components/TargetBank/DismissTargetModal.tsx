import React, { useEffect, useState } from 'react';
import { Alert, ColorSchemeName, FlatList, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import Colors from '../../constants/Colors';
import { BORDER_RADIUS } from '../../constants/SIZES';
import DismissTargetListItem from './DismissTargetListItem';
import ModalHeader from './ModalHeader';
import { SingleSortedTarget, SortedTargets } from '../../hooks/useGetDismissTargetData';

interface Props {
  colorScheme: ColorSchemeName;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: (targets: SingleSortedTarget[]) => void;
  missingTargets: number;
  sortedWeeklyTargets: SortedTargets[];
}

const DismissTargetModal = ({ colorScheme, isVisible, setIsVisible, onSave, sortedWeeklyTargets, missingTargets }: Props) => {
  const [initialQuantity, setInitialQuantity] = useState(sortedWeeklyTargets.map((day) => day.quantity));
  const [mutableSortedWeeklyTargets, setMutableWeeklyTargets] = useState(sortedWeeklyTargets);
  const [removedWeeklyTargets, setRemovedWeeklyTargets] = useState<SingleSortedTarget[]>([]);
  const [mutableMissingTargets, setMutableMissingTargets] = useState(missingTargets);
  //------------------------------------------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    setInitialQuantity(mutableSortedWeeklyTargets.map((day) => day.quantity));
    setMutableWeeklyTargets(sortedWeeklyTargets);
    setRemovedWeeklyTargets([]);
  }, [sortedWeeklyTargets, isVisible]);

  //------------------------------------------------------------------------------------------------------------------------------------------------
  const handleRemove = (tb_id: number) => {
    const dayOfTarget = mutableSortedWeeklyTargets.filter((day) => day.targets.find((t) => t.targetTbId === tb_id)?.targetTbId === tb_id);

    const removedTarget = dayOfTarget
      .map((item) => item.targets.find((target) => target.targetTbId === tb_id))
      .find((target) => target?.targetTbId === tb_id);

    setRemovedWeeklyTargets([...removedWeeklyTargets, removedTarget!]);

    const newMutableDay: SortedTargets = dayOfTarget.map((day) => {
      const newTargets = day.targets.filter((target) => target.targetTbId !== tb_id);

      return { ...day, targets: newTargets, quantity: newTargets.length };
    })[0];

    const mutableSortedWeeklyTargetsWoNewDay = mutableSortedWeeklyTargets.filter((day) => day.day.id !== newMutableDay.day.id);

    const newMutableSortedWeeklyTargets = [...mutableSortedWeeklyTargetsWoNewDay, newMutableDay].sort((a, b) => a.day.id - b.day.id);

    setMutableWeeklyTargets(newMutableSortedWeeklyTargets);
    setMutableMissingTargets((p) => p - 1);
  };

  //------------------------------------------------------------------------------------------------------------------------------------------------
  const handleAdd = (id: number, dayId: number) => {
    const removedTarget = removedWeeklyTargets.find((target) => target.targetId === id && target.dayId === dayId);

    const dayOfTarget = mutableSortedWeeklyTargets.filter((day) => day.day.id === dayId)[0];

    const newTargetArray = [...dayOfTarget.targets!, removedTarget!].sort((a, b) => a.targetPosition - b.targetPosition);

    dayOfTarget.targets = newTargetArray;
    dayOfTarget.quantity = newTargetArray.length;

    const weekWoDay = mutableSortedWeeklyTargets.filter((day) => day.day.id !== dayOfTarget.day.id);

    const newMutableSortedWeeklyTargets = [...weekWoDay, dayOfTarget].sort((a, b) => a.day.id - b.day.id);
    setMutableWeeklyTargets(newMutableSortedWeeklyTargets);
    setMutableMissingTargets((p) => p + 1);
  };

  //------------------------------------------------------------------------------------------------------------------------------------------------

  //------------------------------------------------------------------------------------------------------------------------------------------------
  return (
    <Modal isVisible={isVisible} animationIn={'zoomIn'} animationOut={'zoomOut'} style={styles.modal}>
      <View style={[{ backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary }, styles.container]}>
        <ModalHeader
          disabledCondition={mutableMissingTargets !== 0}
          handleSave={() => onSave(removedWeeklyTargets)}
          setIsVisible={setIsVisible}
          title={`${mutableMissingTargets} Left`}
        />
        <FlatList
          style={{ width: '100%' }}
          data={mutableSortedWeeklyTargets}
          renderItem={({ item, index }) => {
            return (
              <DismissTargetListItem
                mutableMissingTargets={mutableMissingTargets}
                onRemove={handleRemove}
                onAdd={handleAdd}
                initialQuantity={initialQuantity[index]}
                colorScheme={colorScheme}
                item={item}
              />
            );
          }}
        />
      </View>
    </Modal>
  );
};

export default React.memo(DismissTargetModal);

const styles = StyleSheet.create({
  modal: {
    width: '100%',
    margin: 0,
    top: -50,
    zIndex: 100,
  },
  container: {
    alignSelf: 'center',
    width: '80%',
    height: 'auto',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS,
    gap: 20,
    padding: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transerant',
    paddingBottom: 10,
    width: '100%',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
});
