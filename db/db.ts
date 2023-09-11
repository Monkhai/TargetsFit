import * as SQLite from 'expo-sqlite';
import { handleError } from './dbErrorHandler';

//define db name
const DATABASE_NAME = 'app.db';

//TYPES
export type Target = {
  id: number;
  name: string;
  quantity: number;
  type: 'mobility' | 'strength' | 'specific' | 'cardio' | 'VO2' | 'flexibility';
};

export type Day = {
  id: number;
  name: 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
};

const db: any = SQLite.openDatabase(DATABASE_NAME);

const createTargetsTable = () => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(
      (tx: SQLite.SQLTransaction) => {
        tx.executeSql(`
                CREATE TABLE IF NOT EXISTS targets (
                    id INTEGER PRIMARY KEY NOT NULL,
                    name TEXT NOT NULL,
                    quantity INTEGER,
                    type TEXT NOT NULL
                );`);
      },
      (error: Error) => {
        handleError('Error occurred while creating targets table', error, reject);
      },
      () => resolve()
    );
  });
};

const createDaysTable = () => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(
      (tx: SQLite.SQLTransaction) => {
        tx.executeSql(`
                CREATE TABLE IF NOT EXISTS days (
                    id INTEGER PRIMARY KEY NOT NULL,
                    name TEXT NOT NULL,
                );`);

        tx.executeSql(`SELECT COUNT(id) as count FROM days;`, [], (_, { rows: { _array } }) => {
          if (_array[0].count === 0) {
            tx.executeSql(
              `INSERT INTO days (id, name) VALUES 
                (1, 'sunday'),
                (2, 'monday'),
                (3, 'tuesday'),
                (4, 'wednesday'),
                (5, 'thursday'),
                (6, 'friday'),
                (7, 'saturday');`
            );
          }
        });
      },
      (error: Error) => {
        handleError('Error occurred while creating days table', error, reject);
      },
      () => resolve()
    );
  });
};

export const createDB = async (): Promise<void> => {
  try {
    await createDaysTable();
    await createTargetsTable();
  } catch (error) {
    console.error(`Error occurred while creating DB: ${error}`);
    throw error;
  }
};

class TargetDAO {
  public async getAllTargets(): Promise<Target[]> {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx: SQLite.SQLTransaction) => {
          tx.executeSql(
            `SELECT * FROM targets ORDER BY name ASC`,
            [],
            (_, { rows: { _array } }) => {
              resolve(_array as Target[]);
            }
          );
        },
        (error: Error) => {
          handleError('Error occured while getting targets', error, reject);
        }
      );
    });
  }
}
