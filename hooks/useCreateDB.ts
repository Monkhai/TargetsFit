import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDB } from '../db/db';
import { useEffect, useState } from 'react';

const useInitializeTables = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    const initializeDB = async () => {
      try {
        const didDbInitiate = await AsyncStorage.getItem('didDbInitiate');
        if (didDbInitiate !== 'true') {
          await createDB();
          await AsyncStorage.setItem('didDbInitiate', 'true');
        }
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeDB();
  }, []);

  return { isLoading, error };
};

export default useInitializeTables;
