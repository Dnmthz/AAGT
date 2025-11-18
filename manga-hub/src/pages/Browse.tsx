import { useEffect, useMemo, useState } from 'react';
import SeriesCard from '../components/series/SeriesCard';
import { useAdapter } from '../hooks/useAdapter';
import type { SearchFilters, Series } from '../lib/types';

export default function Browse() {
  const adapter = useAdapter();
  const [series, setSeries] = useState<Series[]>([]);
  const [total, setTotal] = useState<number | undefined>(undefined);
  const [filters, setFilters] = useState<SearchFilters>({ page: 1, limit: 20, sort: 'popular' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalPages = useMemo(() => {
    if (!total || !filters.limit) return undefined;
    return Math.max(1, Math.ceil(total / filters.limit));
  }, [total, filters.limit]);

  const toggleGenre = (genre: string) => {
    setFilters((f) => {
      const genres = f.genres || [];
      return genres.includes(genre)
        ? { ...f, page: 1, genres: genres.filter((g) => g !== genre) }
        : { ...f, page: 1, genres: [...genres, genre] };
    });
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await adapter.searchSeries(filters);
        setSeries(res.results);
        setTotal(res.total);
      } catch {
        setError('Failed to load browse list');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [adapter, filters]);

  const GENRES = ['Action', 'Comedy', 'Drama', 'Fantasy', 'Romance', 'Sci-Fi', 'School', 'Food', 'Adventure'];
  const STATUSES = [
    { label: 'Any status', value: '' },
    { label: 'Ongoing', value: 'ongoing' },
    { label: 'Completed', value: 'completed' },
    { label: 'Hiatus', value: 'hiatus' },
  ];
  const CONTENT_TYPES = [
    { label: 'Any type', value: '' },
    { label: 'Manga', value: 'manga' },
    { label: 'Manhwa', value: 'manhwa' },
    { label: 'Manhua', value: 'manhua' },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-3 rounded bg-slate-800 p-3 text-sm">
        <select
          className="rounded bg-slate-900 px-3 py-2"
          value={filters.sort}
          onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value as SearchFilters['sort'] }))}
        >
          <option value="popular">Popularity</option>
          <option value="recent">Recently updated</option>
          <option value="alpha">Alphabetical</option>
        </select>
        <select
          className="rounded bg-slate-900 px-3 py-2"
          value={filters.status || ''}
          onChange={(e) =>
            setFilters((f) => ({ ...f, status: e.target.value ? (e.target.value as any) : undefined }))
          }
        >
          {STATUSES.map((s) => (
            <option key={s.label} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <select
          className="rounded bg-slate-900 px-3 py-2"
          value={filters.contentType || ''}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              page: 1,
              contentType: (e.target.value || undefined) as SearchFilters['contentType'],
            }))
          }
        >
          {CONTENT_TYPES.map((t) => (
            <option key={t.label} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <div className="flex flex-wrap gap-2">
          {GENRES.map((g) => {
            const active = filters.genres?.includes(g);
            return (
              <button
                key={g}
                onClick={() => toggleGenre(g)}
                className={`rounded px-3 py-1 ${active ? 'bg-indigo-500 text-white' : 'bg-slate-900 text-slate-200'}`}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      {loading && <div className="text-slate-400">Loading…</div>}
      {error && <div className="text-red-400">{error}</div>}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {series.map((s) => (
          <SeriesCard key={s.id} series={s} />
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-slate-300">
        <button
          className="rounded bg-slate-800 px-3 py-2 disabled:opacity-40"
          onClick={() => setFilters((f) => ({ ...f, page: Math.max(1, (f.page || 1) - 1) }))}
          disabled={(filters.page || 1) <= 1}
        >
          ← Prev
        </button>
        <div>
          Page {filters.page || 1}
          {totalPages ? ` / ${totalPages}` : ''}
        </div>
        <button
          className="rounded bg-slate-800 px-3 py-2 disabled:opacity-40"
          onClick={() =>
            setFilters((f) => ({
              ...f,
              page: totalPages ? Math.min(totalPages, (f.page || 1) + 1) : (f.page || 1) + 1,
            }))
          }
          disabled={totalPages ? (filters.page || 1) >= totalPages : false}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
