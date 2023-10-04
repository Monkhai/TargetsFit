import React, { useContext } from 'react';
import { Target, WeeklyTargets } from '../db/db';

type WeeklyTargetsContextType = {
  weeklyTargets: WeeklyTargets;
  isLoading: boolean;
  error: Error | undefined;
  refetch: () => void;
};

const WeeklyTargetsContext = React.createContext<WeeklyTargetsContextType>({
  weeklyTargets: [],
  isLoading: false,
  error: undefined,
  refetch: () => {},
});

export default WeeklyTargetsContext;
