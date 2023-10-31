import * as SQLite from 'expo-sqlite';
import { handleError } from './utilities/dbErrorHandler';
import { DATABASE_NAME } from '../constants/DATABASE_NAME';
import { handleQuery } from './utilities/queryHandler';
import { transformWeeklyTargets } from './utilities/transformWeeklyTargets';

//----------------------------------------------------------------------------------------------
//TYPES--TYPES--TYPES--TYPES--TYPES--TYPES--TYPES--TYPES--TYPES--TYPES--TYPES--TYPES--TYPES
//----------------------------------------------------------------------------------------------
export type TargetType = 'mobility' | 'strength' | 'specific' | 'cardio' | 'VO2' | 'flexibility';

export type Target = {
  id: number;
  name: string;
  quantity: number;
  type: TargetType;
};

export type ActiveTargetQuantity = { target: Target; activeCount: number };

export type NewTarget = Omit<Target, 'id'>;

export type DayId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type DayName = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

export type Day = {
  id: DayId;
  name: DayName;
};

export type DailyTargets = {
  day: Day;
  targets: Array<Target & { tb_id: number; position: number }>;
};

export type WeeklyTargets = DailyTargets[];

export type TargetInWeeklyTargets = Target & { tb_id: number };

type RawDailyTargets = {
  day_id: DayId;
  day_name: DayName;
  tb_id: number;
  id: number;
  name: string;
  quantity: number;
  type: TargetType;
  position: number;
};

export type RawWeeklyTargets = RawDailyTargets[];

const db: any = SQLite.openDatabase(DATABASE_NAME);

//----------------------------------------------------------------------------------------------
//DB_CREATION--DB_CREATION--DB_CREATION--DB_CREATION--DB_CREATION--DB_CREATION--DB_CREATION
//----------------------------------------------------------------------------------------------
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
  position INTEGER NOT NULL,
  FOREIGN KEY(day_id) REFERENCES days(id),
  FOREIGN KEY(target_id) REFERENCES targets(id)
  );
`,
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

//----------------------------------------------------------------------------------------------
//TARGETS--TARGETS--TARGETS--TARGETS--TARGETS--TARGETS--TARGETS--TARGETS--TARGETS--TARGETS
//----------------------------------------------------------------------------------------------
export class TargetDAO {
  //----------------------------------------------------------------------------------------------
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

  //----------------------------------------------------------------------------------------------
  public async getOneTarget(targetId: number): Promise<Target> {
    const targets = await handleQuery<Target[]>(`SELECT * FROM targets WHERE id = ?`, 'getting target', [targetId]);
    return targets[0];
  }

  //----------------------------------------------------------------------------------------------
  public async createNewTarget(target: NewTarget): Promise<string> {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx: SQLite.SQLTransaction) => {
          // First check if a target with the same name already exists
          tx.executeSql(`SELECT * FROM targets WHERE name = ?`, [target.name], (_, resultSet) => {
            if (resultSet.rows.length > 0) {
              // A target with the same name already exists
              reject(new Error('Target already exists'));
            } else {
              // If not, create the new target
              tx.executeSql(
                `INSERT INTO targets (name, quantity, type) VALUES (?, ?, ?)`,
                [target.name, target.quantity, target.type],
                () => resolve('created new targets')
              );
            }
          });
        },
        (error: Error) => handleError('creating new target', error, reject)
      );
    });
  }

  //----------------------------------------------------------------------------------------------
  public async updateTarget(target: Target): Promise<void> {
    const targetQunaity = target.quantity < 0 ? 0 : target.quantity;
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx: SQLite.SQLTransaction) => {
          tx.executeSql(
            `UPDATE targets SET name = ?, type = ?, quantity = ? WHERE id = ?`,
            [target.name, target.type, targetQunaity, target.id],
            () => resolve()
          );
        },
        (error: Error) => handleError('updating target', error, reject)
      );
    });
  }

  //----------------------------------------------------------------------------------------------
  public async deleteTarget(targetId: number): Promise<string> {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx: SQLite.SQLTransaction) => {
          tx.executeSql(`DELETE FROM targets WHERE id = ?`, [targetId], () => {
            tx.executeSql(`SELECT DISTINCT day_id FROM targets_by_days WHERE target_id = ?`, [targetId], (_, resultSet) => {
              const days: { day_id: number }[] = resultSet.rows._array;

              days.forEach((day) => {
                tx.executeSql(`DELETE FROM targets_by_days WHERE target_id = ? AND day_id = ?`, [targetId, day.day_id], () => {
                  tx.executeSql(
                    `SELECT id, position FROM targets_by_days WHERE day_id = ? ORDER BY position`,
                    [day.day_id],
                    (_, resultSet) => {
                      const remainingTargets = resultSet.rows._array;
                      remainingTargets.forEach((target, index) => {
                        tx.executeSql(`UPDATE targets_by_days SET position = ? WHERE id = ?`, [index + 1, target.id]);
                      });
                    }
                  );
                });
              });
            });
          });
        },
        (error: Error) => handleError('deleting target', error, reject),
        () => resolve('Target successfully deleted')
      );
    });
  }
}

//----------------------------------------------------------------------------------------------
//WEEKLY_TARGETS--WEEKLY_TARGETS--WEEKLY_TARGETS--WEEKLY_TARGETS--WEEKLY_TARGETS--WEEKLY_TARGETS
//----------------------------------------------------------------------------------------------
export class TargetByDaysDAO {
  //----------------------------------------------------------------------------------------------
  public async getDailyTargets(dayId: number): Promise<Target[]> {
    return handleQuery(
      `SELECT targets.* FROM days
        JOIN targets_by_days ON days.id = targets_by_days.day_id
        JOIN targets ON targets.id = targets_by_days.target_id WHERE days.id = ?;`,
      'getting targets for this day',
      [dayId]
    );
  }

  //----------------------------------------------------------------------------------------------
  public async getWeeklyTargets(): Promise<WeeklyTargets> {
    const sql = `
    SELECT 
      days.id as day_id,
      days.name as day_name,
      targets_by_days.id as tb_id,
      targets.*, 
      targets_by_days.position
    FROM days 
    LEFT JOIN targets_by_days ON days.id = targets_by_days.day_id
    LEFT JOIN targets ON targets.id = targets_by_days.target_id 
    ORDER BY days.id, targets_by_days.position, targets.type, targets.name;
  `;

    const rawWeeklyTargets = await handleQuery<RawWeeklyTargets>(sql, 'getting weekly targets');

    return transformWeeklyTargets(rawWeeklyTargets);
  }

  //----------------------------------------------------------------------------------------------
  public async addTargetToDay(dayId: number, targetId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx: SQLite.SQLTransaction) => {
          tx.executeSql(`SELECT MAX(position) as maxPosition FROM targets_by_days WHERE day_id = ?`, [dayId], (_, resultSet) => {
            const maxPosition = resultSet.rows.item(0).maxPosition || 0;
            const newPosition = maxPosition + 1;

            tx.executeSql(
              `INSERT INTO targets_by_days (day_id, target_id, position) VALUES (?, ?, ?)`,
              [dayId, targetId, newPosition],
              () => resolve(),
              (_, error) => {
                handleError('inserting target by day', error, reject);
                return false;
              }
            );
          });
        },
        (error: Error) => handleError('adding target to day', error, reject)
      );
    });
  }

  //----------------------------------------------------------------------------------------------
  public async getActiveTargetCount(): Promise<ActiveTargetQuantity[]> {
    const TargetsDAO = new TargetDAO();
    const allTargets = await TargetsDAO.getAllTargets();
    const allWeeklyTargets = await this.getWeeklyTargets();

    const activeCountMap: Map<number, number> = new Map();

    allTargets.forEach((target) => {
      activeCountMap.set(target.id, 0);
    });

    allWeeklyTargets.forEach((day) => {
      day.targets.forEach((target) => {
        const count = activeCountMap.get(target.id) || 0;
        activeCountMap.set(target.id, count + 1);
      });
    });

    const activeCountArray = Array.from(activeCountMap.entries())
      .map(([id, activeCount]) => {
        const target = allTargets.find((target) => target.id === id);
        if (target) {
          return { target, activeCount };
        }
      })
      .filter((item): item is ActiveTargetQuantity => item !== undefined)
      .filter((item) => item.activeCount !== item.target.quantity);
    return activeCountArray;
  }

  //----------------------------------------------------------------------------------------------
  public async deleteTargetFromWeeklyTargets(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx: SQLite.SQLTransaction) => {
          tx.executeSql(`SELECT day_id FROM targets_by_days WHERE id = (?)`, [id], (_, resultSet) => {
            const day = resultSet.rows._array[0];

            tx.executeSql(`DELETE FROM targets_by_days WHERE id = (?)`, [id], () => {
              tx.executeSql(`SELECT id, position FROM targets_by_days WHERE day_id = ? ORDER BY position`, [day.day_id], (_, resultSet) => {
                const remainingTargets = resultSet.rows._array;
                remainingTargets.forEach((target, index) => {
                  tx.executeSql(`UPDATE targets_by_days SET position = ? WHERE id = ?`, [index + 1, target.id]);
                });
              });
            });
          });
        },
        (error: Error) => handleError('removing target from day', error, reject),
        () => resolve()
      );
    });
  }

  //----------------------------------------------------------------------------------------------
  async updatePositions(dayId: number, positions: { tb_id: number; position: number }[]): Promise<void> {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx: SQLite.SQLTransaction) => {
          positions.forEach(({ tb_id, position }) => {
            tx.executeSql(`UPDATE targets_by_days SET position = ? WHERE id = ? AND day_id = ?`, [position, tb_id, dayId]);
          });
        },
        (error: Error) => handleError('updating positions', error, reject),
        () => resolve()
      );
    });
  }
}
