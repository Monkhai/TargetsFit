import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { ColorSchemeName, StyleSheet, View } from 'react-native';
import Colors from '../../constants/Colors';
import { Target } from '../../db/db';
import BankListItem from './BankListItem';

interface Props {
  targets: Target[];
  colorScheme: ColorSchemeName;
  deleteTarget: (target: Target) => void;
  onLongPress: (target: Target) => void;
}

const TargetBankList = ({ targets, colorScheme, deleteTarget, onLongPress }: Props) => {
  return (
    <View style={[styles.card, { backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary }]}>
      {targets.length > 0 && (
        <FlashList
          estimatedItemSize={72}
          showsVerticalScrollIndicator={false}
          data={targets}
          renderItem={({ item: target }) => <BankListItem onRemovePress={deleteTarget} onLongPress={onLongPress} target={target} />}
        />
      )}
    </View>
  );
};

export default React.memo(TargetBankList);

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: '100%',

    borderRadius: 10,
    paddingHorizontal: 10,
  },
});
