import { useEffect, useState, useCallback } from 'react';
import { Target, TargetDAO } from '../db/db';

const useGetAllTargets = (isDBLoading: boolean, filter?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();
  const [targets, setTargets] = useState<Target[] | []>([]);

  const TargetDB = new TargetDAO();

  const fetchTargets = useCallback(() => {
    TargetDB.getAllTargets(filter)
      .then((result) => {
        setTargets(result);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  }, [TargetDB, filter]);

  useEffect(() => {
    if (!isDBLoading) {
      fetchTargets();
    }
  }, [isDBLoading, filter]);

  return { isLoading, error, targets, refetch: fetchTargets };
};

export default useGetAllTargets;
