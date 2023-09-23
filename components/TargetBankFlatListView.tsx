import { Dimensions, FlatList, StyleSheet, TextInput, useColorScheme } from 'react-native';
import React, { useRef } from 'react';
import { Text, View } from './Themed';
import Colors from '../constants/Colors';
import ListItem, { listItemHeight } from './ListItem';
import { DailyTargets, Target } from '../db/db';
import FlexCard from './FlexCard';
import Modal from 'react-native-modal/dist/modal';
import ListItemDeleteAction from './ListItemDeleteAction';

interface Props {
  targets: Target[];
  onDelete: (item: Target) => void;
}

const TargetBankFlatListView = ({ targets, onDelete }: Props) => {
  {
    return (
      <View style={[styles.flatListContainer]}>
        <FlatList
          contentContainerStyle={styles.flatList}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          data={targets}
          snapToInterval={listItemHeight}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item: target }) => (
            <ListItem
              renderLeftActions={() => <ListItemDeleteAction onPress={() => onDelete(target)} />}
              target={target}
              bank
            />
          )}
        />
      </View>
    );
  }
};

export default TargetBankFlatListView;

const styles = StyleSheet.create({
  flatListContainer: {
    width: Dimensions.get('screen').width,
    height: listItemHeight * 12,
    alignItems: 'center',
    flex: 1,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
  },

  flatList: {
    width: Dimensions.get('screen').width,
  },
});
