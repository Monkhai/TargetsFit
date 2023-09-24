import { SafeAreaView, StyleSheet, TextStyle, View } from 'react-native';
import Constants from 'expo-constants';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  style?: TextStyle;
}

const Screen = ({ children, style }: Props) => {
  return (
    <SafeAreaView style={[styles.screen, style]}>
      <View style={style}>{children}</View>
    </SafeAreaView>
  );
};

export default Screen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});
