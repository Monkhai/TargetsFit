import * as SQLite from 'expo-sqlite';

export const handleError = (
  errorMessage: string,
  error: Error | SQLite.SQLError,
  reject: (reason?: any) => void
) => {
  console.error(`An error has occurred whilst ${errorMessage}: ${error}.`);
  reject(error);
};
