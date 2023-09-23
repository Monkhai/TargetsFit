import { Stack } from 'expo-router';
import React, { useContext, useRef, useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, useColorScheme } from 'react-native';
import NewTargetModal from '../components/NewTargetModal';
import TargetBankFlatListView from '../components/TargetBankFlatListView';
import { Text, View } from '../components/Themed';
import Colors from '../constants/Colors';
import DBContext from '../context/DBLoadingContext';
import { NewTarget, Target, TargetDAO } from '../db/db';
import useGetAllTargets from '../hooks/useGetAllTargets';

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
            headerRight: () => (
              <Button title="edit" color={Colors[colorScheme ?? 'light'].accent} />
            ),
            headerLeft: () => (
              <Button
                onPress={() => setIsModalVisible(true)}
                title="new"
                color={Colors[colorScheme ?? 'light'].accent}
              />
            ),
          }}
        />
        <View style={styles.container}>
          <TargetBankFlatListView targets={targets} onDelete={handleTargetDelete} />
          <NewTargetModal
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
});
