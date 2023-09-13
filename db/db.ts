import * as SQLite from 'expo-sqlite';
import { handleError } from './dbErrorHandler';

//define db name
const DATABASE_NAME = 'app.db';

//TYPES
export type Target = {
  id: number;
  name: string;
  totalQuantity: number;
  activeQuantity: number;
  type: 'mobility' | 'strength' | 'specific' | 'cardio' | 'VO2' | 'flexibility';
};

export type NewTarget = Omit<Target, 'id' | 'activeQuantity'>;

export type Day = {
  id: 1 | 2 | 3 | 4 | 5 | 6 | 7;
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
                    total_quantity INTEGER,
                    active_quantity INTEGER,
                    type TEXT NOT NULL
                );`);
      },
      (error: Error) => handleError('creating targets table', error, reject),
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
      (error: Error) => handleError('creating days table', error, reject),
      () => resolve()
    );
  });
};

const createTargetsByDays = () => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(
      (tx: SQLite.SQLTransaction) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS targets_by_days (
            id INTEGER PRIMARY KEY NOT NULL,
            day_id INTEGER,
            target_id INTEGER,
            FOREIGN KEY(day_id) REFERENCES days(id),
            FOREIGN KEY(target_id) REFERENCES targets(id)
        )`
        );
      },
      (error: Error) => handleError('creating targets_by_day table', error, reject),
      () => resolve()
    );
  });
};

export const createDB = async (): Promise<void> => {
  try {
    await createDaysTable();
    await createTargetsTable();
    await createTargetsByDays();
  } catch (error) {
    console.error(`creating DB: ${error}`);
    throw error;
  }
};

class TargetDAO {
  public async getAllTargets(): Promise<Target[]> {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx: SQLite.SQLTransaction) => {
          tx.executeSql(
            `SELECT * FROM targets
                ORDER BY
                    CASE WHEN active_quantity = quantity THEN 0 ELSE 1 END,
                    type ASC, 
                    name ASC`,
            [],
            (_, { rows: { _array } }) => {
              resolve(_array as Target[]);
            }
          );
        },
        (error: Error) => handleError('getting targets', error, reject)
      );
    });
  }

  public async createNewTarget(target: NewTarget): Promise<Target[]> {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx: SQLite.SQLTransaction) => {
          tx.executeSql(
            `INSERT INTO targets (name, total_quantity, active_quantity, type) VALUES (?, ?, ?, ?)`,
            [target.name, target.totalQuantity, target.totalQuantity, target.type],
            async () => {
              const newTargets = await this.getAllTargets();
              resolve(newTargets);
            }
          );
        },
        (error: Error) => handleError('creating a new target', error, reject)
      );
    });
  }

  public async deleteTarget(targetId: number): Promise<string> {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx: SQLite.SQLTransaction) => {
          tx.executeSql(`DELETE FROM targets WHERE id = ?`, [targetId], () => {
            tx.executeSql(`DELETE FROM targets_by_days WHERE target_id = ?`, [targetId]);
          });
        },
        (error: Error) => handleError('deleteing target', error, reject),
        () => resolve('Target successfully deleted')
      );
    });
  }

  public async updateSingleTargetActiveQuantity(
    newActiveQuantity: number,
    id: number
  ): Promise<Target> {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx: SQLite.SQLTransaction) => {
          tx.executeSql(
            `UPDATE targets SET active_quantity = ? WHERE id = ?`,
            [newActiveQuantity, id],
            () => {
              tx.executeSql(`SELECT * FROM targets WHERE id = ?`, [id], (_, { rows: { _array } }) =>
                resolve(_array[0])
              );
            }
          );
        },
        (error: Error) => handleError('updating target quantity', error, reject)
      );
    });
  }

  public async updateAllTargetsActiveQuantity(targets: Target[]): Promise<Target[]> {
    targets.forEach(async (target) => {
      await this.updateSingleTargetActiveQuantity(target.activeQuantity, target.id);
    });

    const allTargets = await this.getAllTargets();
    return allTargets;
  }
}

class TargetByDaysDAO {
  public async getTargetsForDay(dayId: number): Promise<Target[]> {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx: SQLite.SQLTransaction) => {
          tx.executeSql(
            `SELECT targets.* 
                FROM days
                JOIN targets_by_days ON days.id = targets_by_days.day_id
                JOIN targets ON targets.id = targets_by_days.target_id
                WHERE days.id = ?;`,
            [dayId],
            (_, { rows: { _array } }) => resolve(_array as Target[])
          );
        },
        (error: Error) => handleError('getting targets for this day', error, reject)
      );
    });
  }
}
