import { useContext, useEffect, useState } from 'react';
import WeeklyTargetsContext from '../context/WeeklyTargetsContext';
import { Day, Target } from '../db/db';

export type SortedTargets = {
  day: Day;
  target: { targetId: number; targetTbId: number; targetPosition: number };
  quantity: number;
};

const useGetDismissTargetData = (oldTarget: Target, newTarget: Target) => {
  const { weeklyTargets } = useContext(WeeklyTargetsContext);
  const [sortedWeeklyTargets, setSortedWeeklyTargets] = useState<SortedTargets[]>([]);
  const [availableTargets, setAvailableTargets] = useState(0);
  const [missingTargets, setMissingTargets] = useState(0);

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

    const newTotalActiveQuantity = newSortedWeeklyTargets.reduce((acc, curr) => acc + curr.quantity, 0);

    const newAvailableTargets = oldTarget.quantity - newTotalActiveQuantity;
    setAvailableTargets(newAvailableTargets);

    const targetsToRemove = Math.max(oldTarget.quantity - newTarget.quantity, 0);

    const newMissingTargets = Math.max(targetsToRemove - newAvailableTargets, 0);
    setMissingTargets(newMissingTargets);
    //-----------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------
  }, [weeklyTargets, newTarget, oldTarget]);

  return { sortedWeeklyTargets, availableTargets, missingTargets };
};

export default useGetDismissTargetData;
