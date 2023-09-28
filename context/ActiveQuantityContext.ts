import React from 'react';
import { ActiveTargetQuantity } from '../db/db';

type TargetsContextType = {
  activeTargetQuantity: ActiveTargetQuantity[];
  isLoading: boolean;
  error: Error | undefined;
  refetch: () => void;
};

const ActiveQuantityContext = React.createContext<TargetsContextType>({
  activeTargetQuantity: [],
  isLoading: false,
  error: undefined,
  refetch: () => {},
});

export default ActiveQuantityContext;
