"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Generic hook for fetching data from the API with loading/error states.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useApiQuery(
 *     () => usersApi.getDashboard({ start_date: "2025-01-01" }),
 *     [startDate]  // re-fetch when these deps change
 *   );
 */
export function useApiQuery<T>(
    fetcher: () => Promise<T>,
    deps: unknown[] = [],
) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const mountedRef = useRef(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetcher();
            if (mountedRef.current) {
                setData(result);
            }
        } catch (err: unknown) {
            if (mountedRef.current) {
                const message =
                    err instanceof Error ? err.message : "An unexpected error occurred.";
                setError(message);
            }
        } finally {
            if (mountedRef.current) {
                setLoading(false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    useEffect(() => {
        mountedRef.current = true;
        fetchData();
        return () => {
            mountedRef.current = false;
        };
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
}

/**
 * Generic hook for mutations (POST / PUT / PATCH / DELETE) with
 * loading / error / success states.
 *
 * Usage:
 *   const { mutate, loading, error, data } = useApiMutation(
 *     (status: UserStatus) => usersApi.changeUserStatus(userId, { status })
 *   );
 *   await mutate("suspended");
 */
export function useApiMutation<TInput, TOutput = void>(
    mutator: (input: TInput) => Promise<TOutput>,
) {
    const [data, setData] = useState<TOutput | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const mutate = useCallback(
        async (input: TInput): Promise<TOutput> => {
            setLoading(true);
            setError(null);
            setIsSuccess(false);
            try {
                const result = await mutator(input);
                setData(result);
                setIsSuccess(true);
                return result;
            } catch (err: unknown) {
                const message =
                    err instanceof Error ? err.message : "An unexpected error occurred.";
                setError(message);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [mutator],
    );

    const reset = useCallback(() => {
        setData(null);
        setLoading(false);
        setError(null);
        setIsSuccess(false);
    }, []);

    return { mutate, data, loading, error, isSuccess, reset };
}

/**
 * Hook for paginated endpoints.
 *
 * Usage:
 *   const { data, page, setPage, pageSize, setPageSize, loading, error, refetch } =
 *     usePaginatedQuery(
 *       (p) => usersApi.getUsers({ page: p.page, size: p.size, search: query }),
 *       { initialPage: 1, initialSize: 20 },
 *       [query]
 *     );
 */
export function usePaginatedQuery<T>(
    fetcher: (pagination: { page: number; size: number }) => Promise<{
        count: number;
        pages_count: number;
        next: string | null;
        previous: string | null;
        results: T[];
    }>,
    options?: { initialPage?: number; initialSize?: number },
    deps: unknown[] = [],
) {
    const [page, setPage] = useState(options?.initialPage ?? 1);
    const [pageSize, setPageSize] = useState(options?.initialSize ?? 20);

    const {
        data: response,
        loading,
        error,
        refetch,
    } = useApiQuery(
        () => fetcher({ page, size: pageSize }),
        [page, pageSize, ...deps],
    );

    return {
        data: response?.results ?? [],
        totalCount: response?.count ?? 0,
        totalPages: response?.pages_count ?? 0,
        hasNext: !!response?.next,
        hasPrevious: !!response?.previous,
        page,
        setPage,
        pageSize,
        setPageSize,
        loading,
        error,
        refetch,
    };
}
