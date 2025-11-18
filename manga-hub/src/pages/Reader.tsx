import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAdapter } from '../hooks/useAdapter';
import { useHistory } from '../hooks/useHistory';
import type { Chapter, Page } from '../lib/types';

export default function Reader() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const [searchParams] = useSearchParams();
  const adapter = useAdapter();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setLastRead } = useHistory();
  const seriesId = searchParams.get('seriesId') || 'unknown-series';
  const [currentChapter, setCurrentChapter] = useState<Chapter | undefined>(undefined);

  useEffect(() => {
    if (!chapterId) return;
    setError('');
    setLoading(true);
    adapter
      .getChapterPages(chapterId)
      .then((res) => {
        setPages(res);
        if (!res.length) setError('No pages returned for this chapter.');
        if (seriesId !== 'unknown-series') setLastRead(seriesId, chapterId);
      })
      .catch(() => setError('Failed to load pages'))
      .finally(() => setLoading(false));
  }, [adapter, chapterId, seriesId, setLastRead]);

  useEffect(() => {
    if (!seriesId || seriesId === 'unknown-series') return;
    adapter
      .getChapters(seriesId)
      .then((chs) => {
        const sorted = [...chs].sort((a, b) => {
          const aNum = parseFloat(a.number || '0');
          const bNum = parseFloat(b.number || '0');
          if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) return aNum - bNum;
          return (a.publishedAt || '').localeCompare(b.publishedAt || '');
        });
        setChapters(sorted);
        setCurrentChapter(sorted.find((c) => c.id === chapterId));
      })
      .catch(() => {
        /* ignore; fallback without nav */
      });
  }, [adapter, seriesId, chapterId]);

  const { prevChapter, nextChapter } = useMemo(() => {
    const idx = chapters.findIndex((c) => c.id === chapterId);
    if (idx === -1) return { prevChapter: undefined, nextChapter: undefined };
    return {
      prevChapter: idx > 0 ? chapters[idx - 1] : undefined,
      nextChapter: idx < chapters.length - 1 ? chapters[idx + 1] : undefined,
    };
  }, [chapters, chapterId]);

  if (!chapterId) return null;

  const showExternalNotice = Boolean(
    currentChapter?.externalUrl && !loading && !pages.length && !error
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm text-slate-300">
        <button onClick={() => navigate(-1)} className="hover:text-white">
          ← Back
        </button>
        <div className="flex gap-2">
          <button
            disabled={!prevChapter}
            onClick={() =>
              prevChapter && navigate(`/reader/${prevChapter.id}?seriesId=${seriesId}`)
            }
            className="rounded bg-slate-800 px-3 py-1 disabled:opacity-40"
          >
            ← Prev
          </button>
          <button
            disabled={!nextChapter}
            onClick={() =>
              nextChapter && navigate(`/reader/${nextChapter.id}?seriesId=${seriesId}`)
            }
            className="rounded bg-slate-800 px-3 py-1 disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </div>
      {showExternalNotice && (
        <div className="rounded border border-yellow-400/40 bg-yellow-400/10 px-3 py-2 text-sm text-yellow-100">
          This chapter is marked as externally hosted by the source, but no pages were returned yet.
          Try another chapter or refresh later to keep reading without leaving the site.
        </div>
      )}
      {loading && <div className="text-slate-400">Loading pages…</div>}
      {error && <div className="text-red-400">{error}</div>}
      <div className="space-y-4">
        {pages.map((p) => (
          <img
            key={p.index}
            src={p.imageUrl}
            alt={`Page ${p.index + 1}`}
            className="w-full rounded"
            loading="lazy"
            onError={(e) => (e.currentTarget.style.opacity = '0.2')}
          />
        ))}
      </div>
    </div>
  );
}
