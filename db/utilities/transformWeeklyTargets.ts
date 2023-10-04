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

  // Sort the targets within each day first by type, and then by name
  week.forEach((day) => {
    day.targets.sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name); // Sort by name if types are the same
      }
      // Define the order for types here (specific, strength, mobility, flexibility, VO2)
      const typeOrder = {
        specific: 0,
        strength: 1,
        mobility: 2,
        flexibility: 3,
        cardio: 4,
        VO2: 5,
      };
      return typeOrder[a.type] - typeOrder[b.type];
    });
  });

  return week;
};
