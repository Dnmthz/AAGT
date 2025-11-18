import { Link } from 'react-router-dom';
import type { Series } from '../../lib/types';

export default function SeriesCard({ series }: { series: Series }) {
  return (
    <Link
      to={`/series/${series.id}`}
      className="block overflow-hidden rounded-md bg-slate-800 shadow transition hover:shadow-lg"
    >
      <div className="aspect-[3/4] bg-slate-700">
        {series.coverImage ? (
          <img
            src={series.coverImage}
            alt={series.title}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
            No cover
          </div>
        )}
      </div>
      <div className="space-y-1 p-3">
        <div className="text-xs uppercase text-slate-400">{series.source}</div>
        <div className="line-clamp-2 text-base font-semibold text-white">{series.title}</div>
        {series.latestChapter && (
          <div className="text-xs text-slate-400">Latest: {series.latestChapter}</div>
        )}
      </div>
    </Link>
  );
}
