import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAdapter } from '../hooks/useAdapter';
import { useFavorites } from '../hooks/useFavorites';
import { useHistory } from '../hooks/useHistory';
import type { Chapter, Series } from '../lib/types';

export default function SeriesDetail() {
  const { id } = useParams<{ id: string }>();
  const adapter = useAdapter();
  const [series, setSeries] = useState<Series | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [error, setError] = useState('');
  const { favorites, toggle } = useFavorites();
  const { history } = useHistory();

  useEffect(() => {
    if (!id) return;
    setError('');
    adapter
      .getSeriesDetails(id)
      .then(setSeries)
      .catch(() => setError('Failed to load series'));
    adapter
      .getChapters(id)
      .then(setChapters)
      .catch(() => setError('Failed to load chapters'));
  }, [adapter, id]);

  if (!id) return null;
  if (error) return <div className="text-red-400">{error}</div>;
  if (!series) return <div className="text-slate-400">Loading…</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="w-48 flex-shrink-0">
          <img src={series.coverImage} alt={series.title} className="w-full rounded" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">{series.title}</h1>
          <p className="text-slate-300 whitespace-pre-line">{series.description}</p>
          <div className="flex flex-wrap gap-2 text-sm text-slate-400">
            {series.authors?.length && <span>Author: {series.authors.join(', ')}</span>}
            {series.artists?.length && <span>Artist: {series.artists.join(', ')}</span>}
            {series.status && <span>Status: {series.status}</span>}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => toggle(series.id)}
              className="rounded bg-indigo-500 px-3 py-1 font-semibold text-white"
            >
              {favorites.includes(series.id) ? 'Unfavorite' : 'Favorite'}
            </button>
            {history[series.id] && (
              <Link
                to={`/reader/${history[series.id]}?seriesId=${series.id}`}
                className="rounded bg-slate-800 px-3 py-1 text-sm text-slate-100"
              >
                Resume
              </Link>
            )}
          </div>
          {series.genres && (
            <div className="flex flex-wrap gap-2 text-xs text-slate-300">
              {series.genres.map((g) => (
                <span key={g} className="rounded bg-slate-800 px-2 py-1">
                  {g}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <h2 className="text-xl font-semibold text-white">Chapters</h2>
      <div className="space-y-2">
        {(() => {
          const internal = chapters.filter((ch) => !ch.externalUrl);
          const externalCount = chapters.length - internal.length;
          return (
            <>
              {externalCount > 0 && (
                <div className="rounded bg-slate-800 px-3 py-2 text-sm text-slate-300">
                  {externalCount} chapter(s) are hosted externally and not readable in-app. Look for
                  entries marked “(External)” in the source.
                </div>
              )}
              {internal.map((ch) => (
                <Link
                  key={ch.id}
                  to={`/reader/${ch.id}?seriesId=${series.id}`}
                  className="block rounded bg-slate-800 px-3 py-2 hover:bg-slate-700"
                >
                  <div className="flex justify-between">
                    <div className="text-white">
                      {ch.number ? `Ch. ${ch.number}` : 'Chapter'} {ch.title && `- ${ch.title}`}
                    </div>
                    <div className="text-sm text-slate-400">
                      {ch.publishedAt ? new Date(ch.publishedAt).toLocaleDateString() : ''}
                    </div>
                  </div>
                </Link>
              ))}
              {!internal.length && (
                <div className="text-slate-400">
                  No readable chapters available via MangaDex. If some exist externally, follow the
                  source links on MangaDex directly.
                </div>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
}
