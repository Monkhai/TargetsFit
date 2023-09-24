import { Stack } from 'expo-router';
import React, { useContext, useRef, useState } from 'react';
import {
  Alert,
  Button,
  Dimensions,
  FlatList,
  StyleSheet,
  TextInput,
  useColorScheme,
} from 'react-native';
import BankListItem from '../components/BankListItem';
import ListItemDeleteAction from '../components/ListItemDeleteAction';
import { Text, View } from '../components/Themed';
import Colors from '../constants/Colors';
import DBContext from '../context/DBLoadingContext';
import { NewTarget, Target, TargetDAO } from '../db/db';
import useGetAllTargets from '../hooks/useGetAllTargets';
import FlexCard from '../components/FlexCard';
import NewTargetModal from '../components/NewTargetModal';
import { listItemHeight } from '../components/ListItem';
import ListItemSeparator from '../components/ListItemSeparator';

const Targets = new TargetDAO();

const TargetBank = () => {
  const colorScheme = useColorScheme();
  const { isLoading: isDBLoading } = useContext(DBContext);
  const { targets, isLoading, error, refetch } = useGetAllTargets(isDBLoading);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const nameRef = useRef<TextInput>(null);
  const typeRef = useRef<TextInput>(null);
  const quantityRef = useRef<TextInput>(null);

  const handleTargetDelete = (target: Target) => {};

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleModalSave = (newTarget: NewTarget) => {
    Targets.createNewTarget(newTarget)
      .then(() => refetch())
      .then(() => setIsModalVisible(false))
      .catch((error: Error) => Alert.alert(error.message));
  };

  if (isLoading || isDBLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  } else if (error) {
    return (
      <View>
        <Text>{error.message}</Text>
      </View>
    );
  } else {
    return (
      <>
        <Stack.Screen
          options={{
            headerLeft: () => (
              <Button
                title="new"
                color={Colors[colorScheme ?? 'light'].accent}
                onPress={() => setIsModalVisible(true)}
              />
            ),
          }}
        />
        <View style={styles.container}>
          <FlexCard>
            <FlatList
              ItemSeparatorComponent={() => <ListItemSeparator />}
              data={targets}
              keyExtractor={(target: Target) => target.id.toString()}
              renderItem={({ item: target }) => (
                <BankListItem
                  name={target.name}
                  type={target.type}
                  quantity={target.quantity}
                  renderRightActions={() => (
                    <ListItemDeleteAction onPress={() => console.log(target)} />
                  )}
                />
              )}
            />
          </FlexCard>
          <NewTargetModal
            onBackdropPress={handleModalCancel}
            isVisible={isModalVisible}
            nameRef={nameRef}
            typeRef={typeRef}
            quantityRef={quantityRef}
            onModalCancel={handleModalCancel}
            onModalSave={handleModalSave}
          />
        </View>
      </>
    );
  }
};

export default TargetBank;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContainer: {
    width: Dimensions.get('screen').width,
    height: listItemHeight * 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
