import { ColorSchemeName, FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Colors from '../../constants/Colors';
import BankListItem from './BankListItem';
import { Target } from '../../db/db';

interface Props {
  targets: Target[];
  colorScheme: ColorSchemeName;
  deleteTarget: (target: Target) => void;
  onLongPress: (target: Target) => void;
}

const TargetBankList = ({ targets, colorScheme, deleteTarget, onLongPress }: Props) => {
  return (
    <View style={[styles.card, { backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary }]}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={targets}
        keyExtractor={(item) => item.name}
        renderItem={({ item: target }) => (
          <BankListItem colorScheme={colorScheme} onRemovePress={deleteTarget} onLongPress={onLongPress} target={target} />
        )}
      />
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
