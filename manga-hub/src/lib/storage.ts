const FAVORITES_KEY = 'favorites';
const HISTORY_KEY = 'history';

export function loadFavorites(): string[] {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveFavorites(ids: string[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}

export function loadHistory(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}');
  } catch {
    return {};
  }
}

export function saveHistory(history: Record<string, string>) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}
