import { Dimensions, FlatList, StyleSheet, useColorScheme } from 'react-native';
import React from 'react';
import { Text, View } from './Themed';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../constants/Colors';

interface Props {
  title: string;
  exercises: string[];
}

const FlatListView = ({ title, exercises }: Props) => {
  const theme = useColorScheme();
  return (
    <View style={styles.flatListContainer}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        scrollEnabled={false}
        contentContainerStyle={styles.flatList}
        data={exercises}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.textWrapper}>
            <FontAwesome name="circle" size={20} color={Colors[theme ?? 'light'].tint} />
            <Text style={styles.text}>{item}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default FlatListView;

const styles = StyleSheet.create({
  flatListContainer: {
    width: Dimensions.get('screen').width,
    alignItems: 'center',
  },
  flatList: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: Dimensions.get('screen').width,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    paddingBottom: 10,
  },
  textWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    width: '90%',
  },
  text: {
    fontSize: 24,
    fontWeight: '200',
    flexWrap: 'wrap',
  },
});
