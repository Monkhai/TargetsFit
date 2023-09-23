import * as SQLite from 'expo-sqlite';
import { DATABASE_NAME } from '../../constants/DATABASE_NAME';
import { handleError } from './dbErrorHandler';

const db: any = SQLite.openDatabase(DATABASE_NAME);
export const handleQuery = async <T>(
  sqlStatement: string,
  errorStatement: string,
  args: (string | number | null)[] = []
) => {
  return new Promise<T>((resolve, reject) => {
    db.transaction(
      (tx: SQLite.SQLTransaction) => {
        tx.executeSql(
          sqlStatement,
          args,
          (_, { rows: { _array } }) => resolve(_array as T),
          (_, error) => {
            handleError(errorStatement, error, reject);
            return false;
          }
        );
      },
      (error: Error) => handleError(errorStatement, error, reject)
    );
  });
};
