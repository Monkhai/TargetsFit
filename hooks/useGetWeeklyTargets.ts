import { useEffect, useState } from 'react';
import { TargetByDaysDAO, WeeklyTargets } from '../db/db';

const TargetsByDays = new TargetByDaysDAO();

const useGetWeeklyTargets = (isDBLoading: boolean) => {
  const [isLoading, setIsloading] = useState(true);
  const [error, setError] = useState<Error | null>();
  const [weeklyTargets, setWeeklyTargets] = useState<WeeklyTargets>([]);

  useEffect(() => {
    if (!isDBLoading) {
      TargetsByDays.getWeeklyTargets()
        .then((targets) => {
          setWeeklyTargets(targets);
          setIsloading(false);
        })
        .catch((error) => {
          setError(error);
          setIsloading(false);
        });
    }
  }, [isDBLoading]);
  return { isLoading, error, weeklyTargets };
};

export default useGetWeeklyTargets;
