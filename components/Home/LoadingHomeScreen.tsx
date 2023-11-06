import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import DailyTargetListSkeleton from './DailyTargetListSkeleton';

const LoadingHomeScreen = () => {
  return <DailyTargetListSkeleton />;
};

export default LoadingHomeScreen;

const styles = StyleSheet.create({});
