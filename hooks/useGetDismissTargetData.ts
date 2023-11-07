import { useContext, useEffect, useState } from 'react';
import WeeklyTargetsContext from '../context/WeeklyTargetsContext';
import { Day, DayId, Target } from '../db/db';
import useGetWeeklyTargets from './useGetWeeklyTargets';
import { lightHaptics } from '../utilityFunctions/haptics';

export type SingleSortedTarget = { targetId: number; targetTbId: number; targetPosition: number; dayId: DayId };

export type SortedTargets = {
  day: Day;
  targets: SingleSortedTarget[];
  quantity: number;
};

const useGetDismissTargetData = (oldTarget: Target, newTarget: Target) => {
  const { sundayTargets, mondayTargets, tuesdayTargets, wednesdayTargets, thursdayTargets, fridayTargets, saturdayTargets } =
    useContext(WeeklyTargetsContext);
  const [sortedWeeklyTargets, setSortedWeeklyTargets] = useState<SortedTargets[]>([]);
  const [availableTargets, setAvailableTargets] = useState(0);
  const [missingTargets, setMissingTargets] = useState(0);

  useEffect(() => {
    const weeklyTargets = [sundayTargets, mondayTargets, tuesdayTargets, wednesdayTargets, thursdayTargets, fridayTargets, saturdayTargets];

    const filteredWeeklyTargets = weeklyTargets.map((day) => {
      return {
        ...day,
        targets: day.targets.filter((target) => target.id === oldTarget.id),
      };
    });

    const newSortedWeeklyTargets: SortedTargets[] = filteredWeeklyTargets.reduce((acc: SortedTargets[], day) => {
      if (day.targets.length > 0) {
        const usedDay = day.day;

        const targets = day.targets.filter((target) => target.id === target.id);

        const arrangedTargets: SingleSortedTarget[] = targets.reduce((acc: SingleSortedTarget[], curr) => {
          const target = {
            targetId: curr.id,
            targetTbId: curr.tb_id,
            targetPosition: curr.position,
            dayId: day.day.id,
          };

          acc.push(target);
          return acc;
        }, []);

        if (targets) {
          const sortedTargets = {
            day: usedDay,
            targets: arrangedTargets,
            quantity: day.targets.length,
          };

          acc.push(sortedTargets);
        }
      }
      return acc;
    }, []);
    setSortedWeeklyTargets(newSortedWeeklyTargets);

    //-----------------------------------------------------------------------------------------------------------------------------

    const newTotalActiveQuantity = newSortedWeeklyTargets.reduce((acc, curr) => acc + curr.quantity, 0);

    const newAvailableTargets = oldTarget.quantity - newTotalActiveQuantity;
    setAvailableTargets(newAvailableTargets);

    const targetsToRemove = Math.max(oldTarget.quantity - newTarget.quantity, 0);

    const newMissingTargets = Math.max(targetsToRemove - newAvailableTargets, 0);
    setMissingTargets(newMissingTargets);
    //-----------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------
  }, [
    sundayTargets,
    mondayTargets,
    tuesdayTargets,
    wednesdayTargets,
    thursdayTargets,
    fridayTargets,
    saturdayTargets,
    newTarget,
    oldTarget,
  ]);

  return { sortedWeeklyTargets, availableTargets, missingTargets };
};

export default useGetDismissTargetData;
