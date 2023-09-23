import { createDB } from '../db/db';
import { useEffect, useState } from 'react';

const useInitializeTables = () => {
  const [isLoading, setIsloading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    createDB()
      .then(() => {
        setIsloading(false);
      })
      .catch((error) => {
        setIsloading(false);
        setError(error);
      });
  }, []);

  return { isLoading, error };
};

export default useInitializeTables;
