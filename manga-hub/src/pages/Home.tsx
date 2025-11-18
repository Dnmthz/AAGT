import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useAdapter } from '../hooks/useAdapter';
import SeriesCard from '../components/series/SeriesCard';
import type { Series } from '../lib/types';

export default function Home() {
  const adapter = useAdapter();
  const [query, setQuery] = useState('');
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    adapter
      .searchSeries({ limit: 12 })
      .then((res) => setSeries(res.results))
      .catch(() => setError('Failed to load series'))
      .finally(() => setLoading(false));
  }, [adapter]);

  const onSearch = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await adapter.searchSeries({ query, limit: 20 });
      setSeries(res.results);
    } catch {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={onSearch} className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title..."
          className="flex-1 rounded bg-slate-800 px-3 py-2 text-white focus:outline-none focus:ring focus:ring-indigo-500/40"
        />
        <button
          type="submit"
          className="rounded bg-indigo-500 px-4 py-2 font-semibold text-white hover:bg-indigo-600"
        >
          Search
        </button>
      </form>

      {loading && <div className="text-slate-400">Loading…</div>}
      {error && <div className="text-red-400">{error}</div>}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {series.map((s) => (
          <SeriesCard key={s.id} series={s} />
        ))}
      </div>
    </div>
  );
}
