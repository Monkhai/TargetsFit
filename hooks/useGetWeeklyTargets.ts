import { useCallback, useEffect, useState } from 'react';
import { TargetByDaysDAO, WeeklyTargets } from '../db/db';

const TargetsByDays = new TargetByDaysDAO();

const useGetWeeklyTargets = (isDBLoading: boolean, filter?: string) => {
  const [isLoading, setIsloading] = useState(true);
  const [error, setError] = useState<Error | null>();
  const [weeklyTargets, setWeeklyTargets] = useState<WeeklyTargets>([]);

  const fetchTargets = useCallback(() => {
    TargetsByDays.getWeeklyTargets()
      .then((targets) => {
        setWeeklyTargets(targets);
        setIsloading(false);
      })
      .catch((error) => {
        setError(error);
        setIsloading(false);
      });
  }, [TargetsByDays, filter]);

  useEffect(() => {
    if (!isDBLoading) fetchTargets();
  }, [isDBLoading, filter]);
  return { isLoading, error, weeklyTargets, refetch: fetchTargets };
};

export default useGetWeeklyTargets;
