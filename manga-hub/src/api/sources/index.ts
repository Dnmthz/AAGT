import type { SourceAdapter } from '../../lib/types';
import { mangadexAdapter } from './mangadex';
import { mockAdapter } from './mock';

export function getAdapter(): SourceAdapter {
  // Default to mock unless explicitly disabled (VITE_USE_MOCK=0 or false).
  const flag = import.meta.env.VITE_USE_MOCK ?? '0';
  const useMock = flag === '1' || flag === 'true';
  return useMock ? mockAdapter : mangadexAdapter;
}
