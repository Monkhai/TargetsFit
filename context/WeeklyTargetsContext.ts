import React from 'react';
import { DailyTargets, DayId, Target, TargetInWeeklyTargets } from '../db/db';

type WeeklyTargetsContextType = {
  sundayTargets: DailyTargets;
  mondayTargets: DailyTargets;
  tuesdayTargets: DailyTargets;
  wednesdayTargets: DailyTargets;
  thursdayTargets: DailyTargets;
  fridayTargets: DailyTargets;
  saturdayTargets: DailyTargets;
  isLoading: boolean;
  error: Error | undefined;
  refetch: () => void;
  refetchDailyTargets: (dayId: DayId) => void;
};

const initialDailyTargets = {
  day: { id: 0, name: '' },
  targets: [] as TargetInWeeklyTargets[],
};

const WeeklyTargetsContext = React.createContext<WeeklyTargetsContextType>({
  sundayTargets: { ...initialDailyTargets, day: { id: 1, name: 'sunday' } },
  mondayTargets: { ...initialDailyTargets, day: { id: 2, name: 'monday' } },
  tuesdayTargets: { ...initialDailyTargets, day: { id: 3, name: 'tuesday' } },
  wednesdayTargets: { ...initialDailyTargets, day: { id: 4, name: 'wednesday' } },
  thursdayTargets: { ...initialDailyTargets, day: { id: 5, name: 'thursday' } },
  fridayTargets: { ...initialDailyTargets, day: { id: 6, name: 'friday' } },
  saturdayTargets: { ...initialDailyTargets, day: { id: 7, name: 'saturday' } },

  isLoading: false,
  error: undefined,
  refetch: () => {},
  refetchDailyTargets: (id) => {},
});

export default WeeklyTargetsContext;
