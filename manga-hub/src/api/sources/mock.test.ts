import { mockAdapter } from './mock';

it('searchSeries returns results', async () => {
  const res = await mockAdapter.searchSeries({ query: 'Hero' });
  expect(res.results.length).toBeGreaterThan(0);
});

it('getChapterPages returns pages', async () => {
  const chapters = await mockAdapter.getChapters('mock-1');
  const pages = await mockAdapter.getChapterPages(chapters[0].id);
  expect(pages[0].imageUrl).toContain('placehold');
});
