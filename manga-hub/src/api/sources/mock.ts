import type { Chapter, Page, SearchFilters, Series, SourceAdapter } from '../../lib/types';

const series: Series[] = [
  {
    id: 'mock-1',
    source: 'mock',
    title: 'Mock Hero Academia',
    altTitles: ['MHA Mock'],
    description: 'A demo series for the mock adapter.',
    coverImage: 'https://placehold.co/300x450?text=Mock+Cover',
    authors: ['Jane Doe'],
    artists: ['John Smith'],
    status: 'ongoing',
    genres: ['Action', 'School'],
    tags: ['Shounen'],
    contentType: 'manga',
    latestChapter: '5',
  },
  {
    id: 'mock-2',
    source: 'mock',
    title: 'Galactic Chef',
    description: 'Cooking battles across the stars.',
    coverImage: 'https://placehold.co/300x450?text=Galactic+Chef',
    authors: ['Nova Cook'],
    artists: ['Pan Illustrator'],
    status: 'completed',
    genres: ['Comedy', 'Sci-Fi'],
    tags: ['Food', 'Adventure'],
    contentType: 'manhwa',
    latestChapter: '10',
  },
];

const chapters: Record<string, Chapter[]> = {
  'mock-1': Array.from({ length: 5 }).map((_, i) => ({
    id: `mock-1-ch-${i + 1}`,
    seriesId: 'mock-1',
    source: 'mock',
    number: String(i + 1),
    title: `Chapter ${i + 1}`,
    language: 'en',
    publishedAt: new Date(Date.now() - i * 86400000).toISOString(),
  })),
  'mock-2': Array.from({ length: 10 }).map((_, i) => ({
    id: `mock-2-ch-${i + 1}`,
    seriesId: 'mock-2',
    source: 'mock',
    number: String(i + 1),
    title: `Episode ${i + 1}`,
    language: 'en',
    publishedAt: new Date(Date.now() - i * 172800000).toISOString(),
  })),
};

const pages: Record<string, Page[]> = Object.fromEntries(
  Object.values(chapters)
    .flat()
    .map((ch) => [
      ch.id,
      Array.from({ length: 5 }).map((_, i) => ({
        index: i,
        imageUrl: `https://placehold.co/800x1200?text=${encodeURIComponent(ch.title || '')}+p${i + 1}`,
      })),
    ])
);

function filterSeries(filters: SearchFilters): Series[] {
  const q = (filters.query || '').toLowerCase();
  let results = series.filter((s) => s.title.toLowerCase().includes(q));
  if (filters.status) {
    results = results.filter((s) => s.status === filters.status);
  }
  if (filters.genres?.length) {
    results = results.filter((s) =>
      filters.genres!.every((g) => s.genres?.map((x) => x.toLowerCase()).includes(g.toLowerCase()))
    );
  }
  if (filters.sort === 'alpha') {
    results = [...results].sort((a, b) => a.title.localeCompare(b.title));
  } else if (filters.sort === 'recent') {
    results = [...results].sort((a, b) => Number(b.latestChapter || 0) - Number(a.latestChapter || 0));
  }
  return results;
}

export const mockAdapter: SourceAdapter = {
  id: 'mock',
  async searchSeries(filters) {
    const results = filterSeries(filters);
    return { results, total: results.length };
  },
  async getSeriesDetails(seriesId) {
    const found = series.find((s) => s.id === seriesId);
    if (!found) throw new Error('Series not found');
    return found;
  },
  async getChapters(seriesId) {
    return chapters[seriesId] || [];
  },
  async getChapterPages(chapterId) {
    return pages[chapterId] || [];
  },
};
