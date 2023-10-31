import React from 'react';
import { ColorSchemeName, FlatList, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import Colors from '../../constants/Colors';
import { BORDER_RADIUS } from '../../constants/SIZES';
import { Day, DayId, DayName, Target, TargetInWeeklyTargets, WeeklyTargets } from '../../db/db';
import DismissTargetListItem from './DismissTargetListItem';

type SortedTargets = {
  day: Day; // Assume Day is a known type
  target: { targetId: number; targetTbId: number; targetPosition: number };
  quantity: number;
};

interface Props {
  colorScheme: ColorSchemeName;
  sortedWeeklyTargets: SortedTargets[] | undefined;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const DismissTargetModal = ({ colorScheme, sortedWeeklyTargets, isVisible, setIsVisible }: Props) => {
  return (
    <Modal
      animationIn={'zoomIn'}
      animationOut={'zoomOut'}
      style={styles.modal}
      useNativeDriver
      useNativeDriverForBackdrop
      onBackButtonPress={() => setIsVisible(false)}
      isVisible={isVisible}
    >
      <View style={[{ backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary }, styles.container]}>
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
