/**
 * Sorgente TypeScript `useApiPost` — progetto Varco.
 */
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type ApiPostState = {
  message: string | null;
  isError: boolean;
  busy: string | null;
};

type ApiPostOptions = {
  onSuccess?: (jobId?: string) => void;
  successMessage?: (jobId?: string) => string;
};

/** Esportazione `useApiPost` — vedi implementazione sotto. */
export function useApiPost() {
  const router = useRouter();
  const [state, setState] = useState<ApiPostState>({
    message: null,
    isError: false,
    busy: null,
  });

  async function post(path: string, body: unknown, label: string, options?: ApiPostOptions) {
    setState({ message: null, isError: false, busy: label });
    try {
      const res = await fetch(`/api/v1/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as { jobId?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Richiesta fallita');

      const jobId = data.jobId;
      const message =
        options?.successMessage?.(jobId) ??
        `Job accodato (${jobId ?? 'ok'}) · ricarica tra qualche secondo`;

      setState({ message, isError: false, busy: null });
      options?.onSuccess?.(jobId);
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setState({ message: `Errore ${label}: ${msg}`, isError: true, busy: null });
    }
  }

  return { ...state, post };
}
