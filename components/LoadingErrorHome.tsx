import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

interface Props {
  message: string;
}

const LoadingErrorHome = ({ message }: Props) => {
  return (
    <View style={styles.container}>
      <Text>{message}</Text>
    </View>
  );
};

export default LoadingErrorHome;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
