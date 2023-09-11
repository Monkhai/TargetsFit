import * as SQLite from 'expo-sqlite';

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
        console.error(`Error occurred while creating targets table: ${error}`);
        reject();
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
      },
      (error: Error) => {
        console.error(`Error occurred while creating days table: ${error}`);
        reject();
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
