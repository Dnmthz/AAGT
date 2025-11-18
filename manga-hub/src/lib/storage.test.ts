import { loadFavorites, saveFavorites } from './storage';

beforeEach(() => {
  localStorage.clear();
});

it('save/load favorites', () => {
  saveFavorites(['a', 'b']);
  expect(loadFavorites()).toEqual(['a', 'b']);
});
