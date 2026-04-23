import { useState, useEffect, useCallback } from "react";
import { api } from "../lib/api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeIds = (data: any): any => {
  if (Array.isArray(data)) return data.map(normalizeIds);
  if (data && typeof data === "object" && data._id && !data.id) {
    return { ...data, id: data._id };
  }
  return data;
};

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFetch<T>(path: string): UseFetchState<T> {
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: string | null;
  }>({ data: null, loading: true, error: null });

  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    let cancelled = false;

    setState({ data: null, loading: true, error: null });

    api
      .get(path)
      .then((result) => {
        if (!cancelled)
          setState({ data: normalizeIds(result), loading: false, error: null });
      })
      .catch((err: Error) => {
        if (!cancelled)
          setState({ data: null, loading: false, error: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [path, trigger]);

  const refetch = useCallback(() => setTrigger((t) => t + 1), []);

  return { ...state, refetch };
}
