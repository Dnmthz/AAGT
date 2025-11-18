import { useCallback, useEffect, useState } from 'react';
import { loadHistory, saveHistory } from '../lib/storage';

export function useHistory() {
  const [history, setHistory] = useState<Record<string, string>>({});

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const setLastRead = useCallback((seriesId: string, chapterId: string) => {
    setHistory(prev => {
      const next = { ...prev, [seriesId]: chapterId };
      saveHistory(next);
      return next;
    });
  }, []);

  return { history, setLastRead };
}
