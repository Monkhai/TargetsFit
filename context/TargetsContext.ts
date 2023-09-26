import React, { useContext } from 'react';
import { Target } from '../db/db';

type TargetsContextType = {
  targets: Target[];
  isLoading: boolean;
  error: Error | undefined;
  refetch: () => void;
  filter: string | undefined;
  setFilter: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const TargetsContext = React.createContext<TargetsContextType>({
  targets: [],
  isLoading: false,
  error: undefined,
  refetch: () => {},
  filter: undefined,
  setFilter: () => {},
});

export default TargetsContext;
