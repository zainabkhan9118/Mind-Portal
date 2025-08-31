"use client";
import { useState, useCallback } from "react";

export interface UseLoadingReturn {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  withLoading: <T>(promise: Promise<T>) => Promise<T>;
}

/**
 * Custom hook to handle loading states in components
 * @returns Loading state controls
 */
export const useLoading = (initialState = false): UseLoadingReturn => {
  const [isLoading, setIsLoading] = useState(initialState);

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Helper to wrap async functions with loading state
  const withLoading = useCallback(
    async <T,>(promise: Promise<T>): Promise<T> => {
      try {
        startLoading();
        return await promise;
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading]
  );

  return { isLoading, startLoading, stopLoading, withLoading };
};

export default useLoading;