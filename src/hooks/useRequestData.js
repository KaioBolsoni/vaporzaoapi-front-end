import { useState, useEffect, useCallback } from "react";

export function useRequestData(requestFn, deps = []) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = useCallback(() => {
    setIsLoading(true);
    setError(null);
    requestFn()
      .then((result) => setData(result))
      .catch((err) => setError(err.message || "Erro ao carregar dados."))
      .finally(() => setIsLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, isLoading, error, refetch: execute };
}
