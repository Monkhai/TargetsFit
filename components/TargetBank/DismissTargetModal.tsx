import React from 'react';
import { ColorSchemeName, FlatList, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import Colors from '../../constants/Colors';
import { BORDER_RADIUS } from '../../constants/SIZES';
import { Day, Target } from '../../db/db';
import useGetDismissTargetData from '../../hooks/useGetDismissTargetData';
import DismissTargetListItem from './DismissTargetListItem';
import ModalHeader from './ModalHeader';
import Button from '../Button';
import { Text } from '../Themed';

type SortedTargets = {
  day: Day; // Assume Day is a known type
  target: { targetId: number; targetTbId: number; targetPosition: number };
  quantity: number;
};

interface Props {
  colorScheme: ColorSchemeName;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  editingTarget: Target;
}

const DismissTargetModal = ({ colorScheme, editingTarget, isVisible, setIsVisible }: Props) => {
  const { sortedWeeklyTargets, targetsLeftToDismiss } = useGetDismissTargetData(editingTarget);

  return (
    <Modal
      animationIn={'zoomIn'}
      animationOut={'zoomOut'}
      style={styles.modal}
      useNativeDriverForBackdrop
      onBackButtonPress={() => setIsVisible(false)}
      isVisible={isVisible}
    >
      <View style={[{ backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary }, styles.container]}>
        <View style={styles.headerContainer}>
          <Button
            title="Cancel"
            onPress={() => {
              setIsVisible(false);
            }}
          />
          <Text ellipsizeMode="tail" numberOfLines={1} style={styles.headerText}>
            {`${targetsLeftToDismiss} Left`}
          </Text>
          <Button title="Save" disabled={targetsLeftToDismiss !== 0} onPress={() => ''} />
        </View>
        <FlatList
          style={{ width: '100%' }}
          data={sortedWeeklyTargets}
          renderItem={({ item }) => {
            return <DismissTargetListItem colorScheme={colorScheme} item={item} />;
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
