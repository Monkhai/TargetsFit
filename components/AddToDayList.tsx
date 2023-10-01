import { ColorSchemeName, FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ActiveTargetQuantity } from '../db/db';
import Colors from '../constants/Colors';

interface Props {
  colorScheme: ColorSchemeName;
  activeTargetQuantity: ActiveTargetQuantity[];
}

const AddToDayList = ({ colorScheme, activeTargetQuantity }: Props) => {
  return (
    <View
      style={[
        { backgroundColor: Colors[colorScheme ?? 'light'].background },
        styles.flatListContainer,
      ]}
    >
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Add to Day</Text>
      <FlatList
        style={styles.flatListStyle}
        ListEmptyComponent={() => <Text>you have nothing baba</Text>}
        data={activeTargetQuantity}
        renderItem={({ item }) => {
          return (
            <>
              <Text>{item.target.name}</Text>
              <Text>{item.target.type}</Text>
              <Text>{item.activeCount}</Text>
            </>
          );
        }}
      />
    </View>
  );
};

export default AddToDayList;

const styles = StyleSheet.create({
  flatListContainer: {
    height: 'auto',
    width: '90%',
    paddingVertical: 10,
    borderRadius: 10,
  },

  flatListStyle: {
    width: '100%',
    minHeight: 100,
  },
});
