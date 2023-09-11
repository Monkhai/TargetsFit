export const handleError = (errorMessage: string, error: Error, reject: (reason?: any) => void) => {
  console.error(`${errorMessage}: ${error}`);
  reject(error);
};
