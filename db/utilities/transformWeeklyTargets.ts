import { RawWeeklyTargets, WeeklyTargets } from '../db';

export const transformWeeklyTargets = (rawTargets: RawWeeklyTargets) => {
  const week: WeeklyTargets = [];

  rawTargets.forEach((row) => {
    let day = week.find((d) => d.day.id === row.day_id);

    if (!day) {
      day = {
        day: {
          id: row.day_id,
          name: row.day_name,
        },
        targets: [],
      };
      week.push(day);
    }

    if (row.id !== null) {
      const target = {
        tb_id: row.tb_id,
        id: row.id,
        name: row.name,
        quantity: row.quantity,
        type: row.type,
      };
      day.targets.push(target);
    }
  });

  return week;
};
