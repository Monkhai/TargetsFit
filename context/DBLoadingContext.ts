import React from 'react';

type DBLoader = {
  isLoading: boolean;
  error: Error | undefined;
};

const DBContext = React.createContext<DBLoader>({
  isLoading: true,
  error: undefined,
});

export default DBContext;
