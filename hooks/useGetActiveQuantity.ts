import { useCallback, useEffect, useState } from 'react';
import { ActiveTargetQuantity, TargetByDaysDAO } from '../db/db';

const WeeklyTargets = new TargetByDaysDAO();

const useGetActiveQuantity = (isDBLoading: boolean) => {
  const [isLoading, setIsloading] = useState(true);
  const [error, setError] = useState<Error | null>();
  const [activeTarrgetQuantity, setActiveTargetQuantity] = useState<ActiveTargetQuantity[]>([]);

  const fetchActiveCount = useCallback(() => {
    WeeklyTargets.getActiveTargetCount()
      .then((count) => {
        setActiveTargetQuantity(count);
        setIsloading(false);
      })
      .catch((error: Error) => {
        setError(error);
        setIsloading(false);
      });
  }, [WeeklyTargets]);

  useEffect(() => {
    if (!isDBLoading) {
      fetchActiveCount();
    }
  }, [isDBLoading]);

  return { isLoading, error, activeTarrgetQuantity, refetch: fetchActiveCount };
};
export default useGetActiveQuantity;
