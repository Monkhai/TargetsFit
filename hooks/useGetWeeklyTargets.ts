import { useCallback, useEffect, useState } from 'react';
import { TargetByDaysDAO, WeeklyTargets } from '../db/db';

const useGetWeeklyTargets = (isDBLoading: boolean) => {
  const [isLoading, setIsloading] = useState(true);
  const [error, setError] = useState<Error | undefined>();
  const [weeklyTargets, setWeeklyTargets] = useState<WeeklyTargets>([]);

  const TargetsByDays = new TargetByDaysDAO();

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
  }, []);

  useEffect(() => {
    if (!isDBLoading) fetchTargets();
  }, [isDBLoading]);
  return { isLoading, error, weeklyTargets, refetch: fetchTargets };
};

export default useGetWeeklyTargets;
