import { api } from '@/data/api';
import { toast } from '@/components/Toast';

interface SyncJob {
  id: string;
  status: 'queued' | 'processing' | 'done' | 'failed';
  progress: number;
  error?: string;
  result?: { syncedCount: number; chesscom: number; lichess: number; skipped: number; message: string };
}

/**
 * Pull new games from the linked Chess.com / Lichess accounts (the real backend sync) and wait for the job.
 * Shows toasts, fires `chess-data-refresh` when done, and resolves true on success.
 */
export async function runGameSync(): Promise<boolean> {
  toast.info('Starting sync...', 'Connecting to Chess.com & Lichess');
  try {
    const res = await api.post<{ jobId: string }>('/sync');
    const jobId = res?.jobId;
    if (!jobId) throw new Error('No job ID returned from sync endpoint');

    for (let attempts = 0; attempts < 60; attempts++) {
      await new Promise((r) => setTimeout(r, 1000));
      try {
        const job = await api.get<SyncJob>(`/jobs/${jobId}`);
        if (job.status === 'done') {
          toast.success('Sync complete', job.result?.message || 'Games up to date');
          window.dispatchEvent(new CustomEvent('chess-data-refresh'));
          return true;
        }
        if (job.status === 'failed') {
          toast.error('Sync failed', job.error || 'Unknown sync error');
          return false;
        }
      } catch {
        // ignore transient poll error
      }
    }
    toast.warning('Sync taking longer than expected', 'Check back in a moment');
    return false;
  } catch (err: unknown) {
    toast.error('Sync error', err instanceof Error ? err.message : 'Failed to start sync');
    return false;
  }
}
