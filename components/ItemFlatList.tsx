import { FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import ListItemSeparator from './ListItemSeparator';
import ListItemDeleteAction from './ListItemDeleteAction';
import { Target } from '../db/db';
import BankListItem from './BankListItem';

interface Props {
  targets: Target[];
  onLongPress: (target: Target) => void;
  onDeletePress: (target: Target) => void;
}

const ItemFlatList = ({ targets, onLongPress, onDeletePress }: Props) => {
  return (
    <FlatList
      ItemSeparatorComponent={() => <ListItemSeparator />}
      data={targets}
      keyExtractor={(target: Target) => target.id.toString()}
      renderItem={({ item: target }) => (
        <BankListItem
          target={target}
          onLongPress={() => onLongPress(target)}
          renderRightActions={() => <ListItemDeleteAction onPress={() => onDeletePress(target)} />}
        />
      )}
    />
  );
};

export default ItemFlatList;

const styles = StyleSheet.create({});
