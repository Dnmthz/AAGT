import { useMemo } from 'react';
import { getAdapter } from '../api/sources';
import type { SourceAdapter } from '../lib/types';

export function useAdapter(): SourceAdapter {
  return useMemo(() => getAdapter(), []);
}
