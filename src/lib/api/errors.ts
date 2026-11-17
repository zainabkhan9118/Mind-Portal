type ErrorBody = {
    detail?: string;
    message?: string;
    details?: { field?: string; message: string }[];
    error?: { message?: string; details?: { field?: string; message: string }[] };
};

/** Best human-readable message from an axios error, across the backend's error shapes. */
export function getApiErrorMessage(err: unknown, fallback = "Something went wrong. Please try again."): string {
    const data = (err as { response?: { data?: ErrorBody } })?.response?.data;
    if (!data || typeof data !== "object") return fallback;
    const details = data.error?.details ?? data.details;
    if (details?.length) return details.map(d => (d.field ? `${d.field}: ${d.message}` : d.message)).join(" ");
    return data.error?.message ?? data.detail ?? data.message ?? fallback;
}

/** Field-level errors ({ field: message }) from the backend's validation error shape. */
export function getApiFieldErrors(err: unknown): Record<string, string> {
    const data = (err as { response?: { data?: ErrorBody } })?.response?.data;
    const details = data?.error?.details ?? data?.details ?? [];
    return Object.fromEntries(details.filter(d => d.field).map(d => [d.field as string, d.message]));
}
