export const handleError = (errorMessage: string, error: Error, reject: (reason?: any) => void) => {
  console.error(`An error has occurred whilst ${errorMessage}: ${error}`);
  reject(error);
};
