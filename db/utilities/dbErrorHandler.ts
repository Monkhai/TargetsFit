import * as SQLite from 'expo-sqlite';
import { Alert } from 'react-native';

export const handleError = (
  errorMessage: string,
  error: Error | SQLite.SQLError,
  reject: (reason?: any) => void
) => {
  console.log(`An error has occurred whilst ${errorMessage}: ${error}.`);
  Alert.alert(`An error has occurred whilst ${errorMessage}: ${error}.`);
  reject(error);
};
