import React, { useContext } from 'react';
import { Target } from '../db/db';

type TargetsContextType = {
  targets: Target[];
  isLoading: boolean;
  error: Error | undefined;
  refetch: () => void;
};

const TargetsContext = React.createContext<TargetsContextType>({
  targets: [],
  isLoading: false,
  error: undefined,
  refetch: () => {},
});

export default TargetsContext;
