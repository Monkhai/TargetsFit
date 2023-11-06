import React from 'react';
import { StyleSheet, View, useColorScheme, useWindowDimensions } from 'react-native';
import Colors from '../../constants/Colors';

const DailyTargetList = () => {
  const { width: screenWidth } = useWindowDimensions();
  const colorScheme = useColorScheme();
  //------------------------------------------------------------------------------------------------------------------------------------------------
  return (
    <View style={[styles.container, { width: screenWidth }]}>
      <View style={[styles.secondaryContainer, { backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary }]}></View>
    </View>
  );
};

export default React.memo(DailyTargetList);

const styles = StyleSheet.create({
  container: {
    padding: 13,
  },
  secondaryContainer: {
    justifyContent: 'flex-start',
    borderRadius: 10,
    width: '100%',
    height: '100%',
    paddingHorizontal: 10,
  },
  header: {
    alignSelf: 'center',
    fontSize: 24,
    textTransform: 'capitalize',
    fontWeight: '600',
    color: 'red',
    marginVertical: 8,
  },
});
