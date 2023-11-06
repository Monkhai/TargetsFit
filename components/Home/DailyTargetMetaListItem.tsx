import { ColorSchemeName, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ScaleDecorator } from 'react-native-draggable-flatlist';
import * as Haptics from 'expo-haptics';
import DailyTargetListItem from './DailyTargetListItem';
import { TargetInWeeklyTargets } from '../../db/db';

interface Props {
  drag: () => void;
  completionMap: Map<number, boolean>;
  onRemovePress: (target: TargetInWeeklyTargets) => void;
  handleStatusToggle: (id: number, status: boolean | undefined) => void;
  colorScheme: ColorSchemeName;
  target: TargetInWeeklyTargets;
}

const handleDragEnd = (drag: () => void) => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  drag();
};

const DailyTargetMetaListItem = ({ drag, completionMap, onRemovePress, colorScheme, handleStatusToggle, target }: Props) => {
  return (
    <ScaleDecorator>
      <Pressable onLongPress={() => handleDragEnd(drag)}>
        <DailyTargetListItem
          status={completionMap.get(target.tb_id)}
          onStatusToggle={handleStatusToggle}
          colorScheme={colorScheme}
          target={target}
          onRemovePress={onRemovePress}
        />
      </Pressable>
    </ScaleDecorator>
  );
};

export default React.memo(DailyTargetMetaListItem);
