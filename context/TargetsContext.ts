import React, { useContext } from 'react';

type Target = {
  // Define the structure of your target here
};

type TargetsContextType = {
  targets: Target[];
  isLoading: boolean;
  error: Error | null;
  setTargets: React.Dispatch<React.SetStateAction<Target[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<Error | null>>;
};

const TargetsContext = React.createContext<TargetsContextType>({
  targets: [],
  isLoading: false,
  error: null,
  // These are placeholder functions and will be overridden by actual implementations in the provider
  setTargets: () => {},
  setIsLoading: () => {},
  setError: () => {},
});

export default TargetsContext;

export const useTargets = () => {
  const context = useContext(TargetsContext);
  if (!context) throw new Error('useTargets must be used within a TargetsProvider');
  return context;
};
