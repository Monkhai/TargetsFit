import { StyleSheet, View, useColorScheme } from 'react-native';
import Colors from '../constants/Colors';

const ListItemSeparator = () => {
  const theme = useColorScheme();
  return (
    <View style={[{ backgroundColor: Colors[theme ?? 'light'].seperator }, styles.separator]} />
  );
};

export default ListItemSeparator;

const styles = StyleSheet.create({
  separator: {
    width: '100%',
    height: 0.33,
  },
});
