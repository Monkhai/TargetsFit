import { DailyTargets, RawDailyTargets } from '../db';

export const transformDailyTargets = (rawTargets: RawDailyTargets[]): DailyTargets => {
  let dailyTargets: DailyTargets = {
    day: {
      id: rawTargets[0].day_id,
      name: rawTargets[0].day_name,
    },
    targets: [],
  };

  rawTargets.forEach((target) => {
    if (target.id === null) return;

    const newTarget = {
      id: target.id,
      name: target.name,
      quantity: target.quantity,
      type: target.type,
      tb_id: target.tb_id,
      position: target.position,
      dayId: target.day_id,
    };
    dailyTargets.targets.push(newTarget);
  });

  dailyTargets.targets.sort((a, b) => a.position - b.position);

  return dailyTargets;
};
