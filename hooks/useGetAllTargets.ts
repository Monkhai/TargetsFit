import { useEffect, useState, useCallback } from 'react';
import { Target, TargetDAO } from '../db/db';

const useGetAllTargets = (isDBLoading: boolean) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();
  const [targets, setTargets] = useState<Target[] | []>([]);

  const TargetDB = new TargetDAO();

  const fetchTargets = useCallback(() => {
    TargetDB.getAllTargets()
      .then((targets) => {
        setTargets(targets);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  }, [TargetDB]);

  useEffect(() => {
    if (!isDBLoading) {
      fetchTargets();
    }
  }, [isDBLoading]);

  return { isLoading, error, targets, refetch: fetchTargets };
};

export default useGetAllTargets;
