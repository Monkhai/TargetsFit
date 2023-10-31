import { useContext, useEffect, useState } from 'react';
import { Day, Target, WeeklyTargets } from '../db/db';
import WeeklyTargetsContext from '../context/WeeklyTargetsContext';

export type SortedTargets = {
  day: Day;
  target: { targetId: number; targetTbId: number; targetPosition: number };
  quantity: number;
};

const useGetDismissTargetData = (target: Target) => {
  const { weeklyTargets } = useContext(WeeklyTargetsContext);
  const [sortedWeeklyTargets, setSortedWeeklyTargets] = useState<SortedTargets[]>([]);
  const [targetsLeftToDismiss, setTargetsLeftToDismiss] = useState(0);

  useEffect(() => {
    //-----------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------
    const filteredWeeklyTargets = weeklyTargets.map((day) => {
      return {
        ...day,
        targets: day.targets.filter((target) => target.id === target.id),
      };
    });

    const newSortedWeeklyTargets: SortedTargets[] = filteredWeeklyTargets.reduce((acc: SortedTargets[], day) => {
      if (day.targets.length > 0) {
        const usedDay = day.day;

        const target = day.targets.find((target) => target.id === target.id);

        if (target) {
          const sortedTargets = {
            day: usedDay,
            target: { targetId: target.id, targetTbId: target.tb_id, targetPosition: target.position },
            quantity: day.targets.length,
          };

          acc.push(sortedTargets);
        }
      }
      return acc;
    }, []);
    setSortedWeeklyTargets(newSortedWeeklyTargets);
    //-----------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------

    const newTargetsLeftToDismiss = target.quantity - newSortedWeeklyTargets.length;
    setTargetsLeftToDismiss(newTargetsLeftToDismiss);
    //-----------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------
  }, [weeklyTargets, target]);

  return { sortedWeeklyTargets, targetsLeftToDismiss };
};

export default useGetDismissTargetData;
