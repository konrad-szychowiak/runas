import { useEffect, useState } from 'react';

export interface GetAsyncOptions<T> {
  dependencies?: any[];
  initialCall?: boolean;
}

export function useGetAsync<T>(
  initialPromise: (...args: any[]) => Promise<T>,
  { dependencies = [], initialCall = true }: GetAsyncOptions<T> = {}
) {
  const [isInitialCall, setIsInitialCall] = useState<boolean>(true);
  const [value, setValue] = useState<T>(undefined);

  function call(...args: any[]) {
    initialPromise(...args).then(setValue);
  }
  useEffect(() => {
    if (isInitialCall) {
      setIsInitialCall(false);
      if (!initialCall) return;
    }
    call();
  }, dependencies);

  return { value, call };
}
