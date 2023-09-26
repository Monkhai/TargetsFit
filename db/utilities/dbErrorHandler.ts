import * as SQLite from 'expo-sqlite';
import { Alert } from 'react-native';

export const handleError = (
  errorMessage: string,
  error: Error | SQLite.SQLError,
  reject: (reason?: any) => void
) => {
  Alert.alert(`An error has occurred whilst ${errorMessage}: ${error}.`);
  reject(error);
};
