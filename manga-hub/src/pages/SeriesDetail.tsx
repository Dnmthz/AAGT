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
  const [seriesError, setSeriesError] = useState('');
  const [chaptersError, setChaptersError] = useState('');
  const { favorites, toggle } = useFavorites();
  const { history } = useHistory();

  useEffect(() => {
    if (!id) return;
    setSeries(null);
    setSeriesError('');
    adapter
      .getSeriesDetails(id)
      .then(setSeries)
      .catch(() => setSeriesError('Failed to load series'));
  }, [adapter, id]);

  useEffect(() => {
    if (!id) return;
    setChapters([]);
    setChaptersError('');
    adapter
      .getChapters(id)
      .then(setChapters)
      .catch(() => setChaptersError('Failed to load chapters'));
  }, [adapter, id]);

  if (!id) return null;
  if (seriesError) return <div className="text-red-400">{seriesError}</div>;
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
          const externalCount = chapters.filter((ch) => ch.externalUrl).length;
          return (
            <>
              {chaptersError && (
                <div className="rounded border border-red-400/40 bg-red-400/5 px-3 py-2 text-sm text-red-100">
                  {chaptersError}
                </div>
              )}
              {!chaptersError && externalCount > 0 && (
                <div className="rounded border border-yellow-400/40 bg-yellow-400/5 px-3 py-2 text-sm text-yellow-100">
                  {externalCount} chapter{externalCount === 1 ? '' : 's'} were flagged as externally hosted
                  by MangaDex. We&apos;ll keep you here and try to load any available pages automatically,
                  but some of them might not have images yet.
                </div>
              )}
              {!chaptersError &&
                chapters.map((ch) => (
                  <Link
                    key={ch.id}
                    to={`/reader/${ch.id}?seriesId=${series.id}`}
                    className="block rounded bg-slate-800 px-3 py-2 hover:bg-slate-700"
                  >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-white">
                      {ch.number ? `Ch. ${ch.number}` : 'Chapter'} {ch.title && `- ${ch.title}`}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      {ch.publishedAt ? new Date(ch.publishedAt).toLocaleDateString() : ''}
                      {ch.externalUrl && (
                        <span className="rounded bg-yellow-500/20 px-2 py-0.5 text-xs text-yellow-100">
                          External source
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
                ))}
              {!chaptersError && !chapters.length && (
                <div className="text-slate-400">No chapters were returned for this series yet.</div>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
}
