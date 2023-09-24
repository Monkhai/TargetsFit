import * as SQLite from 'expo-sqlite';
import { handleError } from './utilities/dbErrorHandler';
import { DATABASE_NAME } from '../constants/DATABASE_NAME';
import { handleQuery } from './utilities/queryHandler';
import { transformWeeklyTargets } from './utilities/transformWeeklyTargets';

export type TargetType = 'mobility' | 'strength' | 'specific' | 'cardio' | 'VO2' | 'flexibility';

export type Target = {
  id: number;
  name: string;
  quantity: number;
  type: TargetType;
};

export type NewTarget = Omit<Target, 'id'>;

type DayId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

type DayName = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

export type Day = {
  id: DayId;
  name: DayName;
};

export type DailyTargets = {
  day: Day;
  targets: Target[];
};

export type WeeklyTargets = DailyTargets[];

type RawDailyTargets = {
  day_id: DayId;
  day_name: DayName;
  id: number;
  name: string;
  quantity: number;
  type: TargetType;
};

export type RawWeeklyTargets = RawDailyTargets[];

const db: any = SQLite.openDatabase(DATABASE_NAME);

const createTargetsTable = async () => {
  await handleQuery(
    `CREATE TABLE IF NOT EXISTS targets (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      quantity INTEGER,
      type TEXT NOT NULL
      );`,
    'creating targets table'
  );
};

const createDaysTable = () => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(
      (tx: SQLite.SQLTransaction) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS days (
              id INTEGER PRIMARY KEY NOT NULL,
              name TEXT NOT NULL
          );`
        );

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

const createTargetsByDays = async () => {
  await handleQuery(
    `CREATE TABLE IF NOT EXISTS targets_by_days (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      day_id INTEGER,
      target_id INTEGER,
      FOREIGN KEY(day_id) REFERENCES days(id),
      FOREIGN KEY(target_id) REFERENCES targets(id)
      )`,
    'creating targets_by_days table'
  );
};

export const createDB = async (): Promise<void> => {
  try {
    await createTargetsTable();
    await createDaysTable();
    await createTargetsByDays();
  } catch (error) {
    console.error(`creating DB: ${error}`);
    throw error;
  }
};

export const deleteAllTables = async () => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(
      (tx: SQLite.SQLTransaction) => {
        tx.executeSql(`DROP TABLE IF EXISTS targets;`, [], undefined, (_, error) => {
          handleError('deleting targets table', error, reject);
          return false;
        });
        tx.executeSql(`DROP TABLE IF EXISTS days;`, [], undefined, (_, error) => {
          handleError('deleting days table', error, reject);
          return false;
        });
        tx.executeSql(`DROP TABLE IF EXISTS targets_by_days;`, [], undefined, (_, error) => {
          handleError('deleting targets_by_days table', error, reject);
          return false;
        });
      },
      (error: Error) => {
        handleError('deleting all tables', error, reject);
      },
      () => resolve()
    );
  });
};

export class TargetDAO {
  public async getAllTargets(typeFilter?: string): Promise<Target[]> {
    let sql = `SELECT * FROM targets `;
    let params: any[] = [];

    if (typeFilter) {
      sql += `WHERE type = ? `;
      params.push(typeFilter);
    }

    sql += `ORDER BY
        CASE type
          WHEN 'strength' THEN 1  
          WHEN 'mobility' THEN 2  
          WHEN 'flexibility' THEN 3  
          WHEN 'VO2' THEN 4  
          WHEN 'specific' THEN 5
          ELSE 1000
        END,
      name ASC`;

    const targets = await handleQuery<Target[]>(sql, 'getting targets', params);
    return targets;
  }

  public async getOneTarget(targetId: number): Promise<Target> {
    const targets = await handleQuery<Target[]>(
      `SELECT * FROM targets WHERE id = ?`,
      'getting target',
      [targetId]
    );
    return targets[0];
  }

  //CHANGE TO TRANSACTIONS
  //CHANGE TO TRANSACTIONS
  //CHANGE TO TRANSACTIONS
  //CHANGE TO TRANSACTIONS
  //CHANGE TO TRANSACTIONS
  //CHANGE TO TRANSACTIONS
  public async createNewTarget(target: NewTarget): Promise<string> {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx: SQLite.SQLTransaction) => {
          tx.executeSql(
            `INSERT INTO targets (name, quantity, type) VALUES (?, ?, ?)`,
            [target.name, target.quantity, target.type],
            () => resolve('created new targets')
          );
        },
        (error: Error) => handleError('creating new target', error, reject)
      );
    });
  }

  public async updateTarget(target: Target): Promise<string> {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx: SQLite.SQLTransaction) => {
          tx.executeSql(
            `UPDATE targets SET name = ?, type = ?, quantity = ? WHERE id = ?`,
            [target.name, target.type, target.quantity, target.id],
            () => resolve('Target successfully updated')
          );
        },
        (error: Error) => handleError('updating target', error, reject)
      );
    });
  }

  public async deleteTarget(targetId: number): Promise<string> {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx: SQLite.SQLTransaction) => {
          tx.executeSql(`DELETE FROM targets WHERE id = ?`, [targetId], () => {
            tx.executeSql(`DELETE FROM targets_by_days WHERE target_id = ?`, [targetId]),
              (error: Error) => handleError('deleteing target', error, reject);
          });
        },
        (error: Error) => handleError('deleteing target', error, reject),
        () => resolve('Target successfully deleted')
      );
    });
  }
}

export class TargetByDaysDAO {
  public async getDailyTargets(dayId: number): Promise<Target[]> {
    return handleQuery(
      `SELECT targets.* FROM days
        JOIN targets_by_days ON days.id = targets_by_days.day_id
        JOIN targets ON targets.id = targets_by_days.target_id WHERE days.id = ?;`,
      'getting targets for this day',
      [dayId]
    );
  }

  public async getWeeklyTargets(): Promise<WeeklyTargets> {
    const rawWeeklyTargets = await handleQuery<RawWeeklyTargets>(
      `SELECT days.id as day_id, days.name as day_name, targets.* 
        FROM days
        LEFT JOIN targets_by_days ON days.id = targets_by_days.day_id
        LEFT JOIN targets ON targets.id = targets_by_days.target_id
        ORDER BY days.id, targets.type, targets.name;`,
      'getting targets for the week'
    );

    return transformWeeklyTargets(rawWeeklyTargets);
  }

  public async saveWeeklyTargets(weeklyTargets: WeeklyTargets): Promise<WeeklyTargets> {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx: SQLite.SQLTransaction) => {
          weeklyTargets.forEach((day) => {
            day.targets.forEach((target) => {
              tx.executeSql(
                `INSERT INTO targets_by_days (day_id, target_id) VALUES (?, ?);`,
                [day.day.id, target.id],
                undefined,
                (_, error: SQLite.SQLError) => {
                  handleError(`saving ${target.name} into ${day.day.name}`, error, reject);
                  return false; // This will roll back the transaction
                }
              );
            });
          });
        },
        (error: Error) => {
          handleError('Error saving weekly targets', error, reject);
          reject(error);
        },
        async () => {
          const updatedTargets = await this.getWeeklyTargets();
          resolve(updatedTargets);
        }
      );
    });
  }

  public async addTargetToDay(dayId: number, targetId: number): Promise<Target[]> {
    await handleQuery(
      `INSERT INTO targets_by_days (day_id, target_id) VALUES (?, ?)`,
      'adding a target',
      [dayId, targetId]
    );
    const Targets = new TargetDAO();
    return Targets.getAllTargets();
  }
}
