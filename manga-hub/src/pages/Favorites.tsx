import { useEffect, useState } from 'react';
import SeriesCard from '../components/series/SeriesCard';
import { useAdapter } from '../hooks/useAdapter';
import { useFavorites } from '../hooks/useFavorites';
import type { Series } from '../lib/types';

export default function Favorites() {
  const { favorites } = useFavorites();
  const adapter = useAdapter();
  const [items, setItems] = useState<Series[]>([]);

  useEffect(() => {
    if (!favorites.length) {
      setItems([]);
      return;
    }
    Promise.all(favorites.map((id) => adapter.getSeriesDetails(id)))
      .then(setItems)
      .catch(() => setItems([]));
  }, [adapter, favorites]);

  if (!favorites.length) return <div className="text-slate-400">No favorites yet.</div>;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {items.map((s) => (
        <SeriesCard key={s.id} series={s} />
      ))}
    </div>
  );
}
