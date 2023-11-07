import { useCallback, useEffect, useState } from 'react';
import { DailyTargets, DayId, TargetByDaysDAO, TargetInWeeklyTargets, WeeklyTargets } from '../db/db';
import { lightHaptics } from '../utilityFunctions/haptics';
import { Alert } from 'react-native';

const initialSundayTargets: DailyTargets = {
  day: { id: 1, name: 'sunday' },
  targets: [] as TargetInWeeklyTargets[],
};

const initialMondayTargets: DailyTargets = {
  day: { id: 2, name: 'monday' },
  targets: [] as TargetInWeeklyTargets[],
};

const initialTuesdayTargets: DailyTargets = {
  day: { id: 3, name: 'tuesday' },
  targets: [] as TargetInWeeklyTargets[],
};

const initialWednesdayTargets: DailyTargets = {
  day: { id: 4, name: 'wednesday' },
  targets: [] as TargetInWeeklyTargets[],
};

const initialThursdayTargets: DailyTargets = {
  day: { id: 5, name: 'thursday' },
  targets: [] as TargetInWeeklyTargets[],
};

const initialFridayTargets: DailyTargets = {
  day: { id: 6, name: 'friday' },
  targets: [] as TargetInWeeklyTargets[],
};

const initialSaturdayTargets: DailyTargets = {
  day: { id: 7, name: 'saturday' },
  targets: [] as TargetInWeeklyTargets[],
};

const useGetWeeklyTargets = (isDBLoading: boolean) => {
  const [isLoading, setIsloading] = useState(true);
  const [error, setError] = useState<Error | undefined>();
  const [weeklyTargets, setWeeklyTargets] = useState<WeeklyTargets>([]);
  const [sundayTargets, setSundayTargets] = useState<DailyTargets>(initialSundayTargets);
  const [mondayTargets, setMondayTargets] = useState<DailyTargets>(initialMondayTargets);
  const [tuesdayTargets, setTuesdayTargets] = useState<DailyTargets>(initialTuesdayTargets);
  const [wednesdayTargets, setWednesdayTargets] = useState<DailyTargets>(initialWednesdayTargets);
  const [thursdayTargets, setThursdayTargets] = useState<DailyTargets>(initialThursdayTargets);
  const [fridayTargets, setFridayTargets] = useState<DailyTargets>(initialFridayTargets);
  const [saturdayTargets, setSaturdayTargets] = useState<DailyTargets>(initialSaturdayTargets);

  const setTargetsByDayId = {
    1: setSundayTargets,
    2: setMondayTargets,
    3: setTuesdayTargets,
    4: setWednesdayTargets,
    5: setThursdayTargets,
    6: setFridayTargets,
    7: setSaturdayTargets,
  };

  const TargetsByDays = new TargetByDaysDAO();

  const fetchAllTargets = useCallback(() => {
    TargetsByDays.getWeeklyTargets()
      .then((targets) => {
        setWeeklyTargets(targets);

        setSundayTargets(targets[0]);
        setMondayTargets(targets[1]);
        setTuesdayTargets(targets[2]);
        setWednesdayTargets(targets[3]);
        setThursdayTargets(targets[4]);
        setFridayTargets(targets[5]);
        setSaturdayTargets(targets[6]);

        setIsloading(false);
      })
      .catch((error) => {
        setError(error);
        setIsloading(false);
      });
  }, []);

  const fetchDailyTargets = useCallback((dayId: DayId) => {
    setIsloading(true);
    TargetsByDays.getDailyTargets(dayId)
      .then((targets) => {
        const setTargets = setTargetsByDayId[dayId];
        setTargets(targets);
        setIsloading(false);
      })
      .catch((error) => {
        setError(error);
        Alert.alert(error.message);
        setIsloading(false);
      });
  }, []);

  useEffect(() => {
    if (!isDBLoading) fetchAllTargets();
  }, [isDBLoading]);

  return {
    isLoading,
    error,
    refetchDailyTargets: fetchDailyTargets,
    refetchAllTargets: fetchAllTargets,
    weeklyTargets,
    sundayTargets,
    mondayTargets,
    tuesdayTargets,
    wednesdayTargets,
    thursdayTargets,
    fridayTargets,
    saturdayTargets,
  };
};

export default useGetWeeklyTargets;
