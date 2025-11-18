import type { SearchFilters, Series, SourceAdapter } from '../../lib/types';

const API = 'https://api.mangadex.org';

async function mdFetch<T>(
  path: string,
  params: Record<string, string | number | (string | number)[] | undefined> = {}
) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) return;
    if (Array.isArray(value)) {
      value.forEach((v) => query.append(key, String(v)));
      return;
    }
    query.set(key, String(value));
  });
  const token = import.meta.env.VITE_MANGADEX_TOKEN;
  const res = await fetch(`${API}${path}?${query.toString()}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error(`MangaDex error ${res.status}`);
  return res.json() as Promise<T>;
}

function mapSeries(item: any): Series {
  const title =
    item.attributes?.title?.en || Object.values(item.attributes?.title || {})[0] || 'Untitled';
  const altTitles = item.attributes?.altTitles
    ?.map((t: Record<string, string>) => Object.values(t)[0])
    .filter(Boolean);
  const tags = item.attributes?.tags?.map((t: any) => t.attributes?.name?.en).filter(Boolean);
  const relationships = item.relationships || [];
  const coverRel = relationships.find((r: any) => r.type === 'cover_art');
  const coverFile = coverRel?.attributes?.fileName;
  return {
    id: item.id,
    source: 'mangadex',
    title,
    altTitles,
    description: item.attributes?.description?.en,
    coverImage: coverFile
      ? `https://uploads.mangadex.org/covers/${item.id}/${coverFile}.256.jpg`
      : '',
    authors: [],
    artists: [],
    status: (item.attributes?.status as any) || 'unknown',
    genres: tags,
    contentType: item.attributes?.publicationDemographic || 'manga',
    latestChapter: item.attributes?.lastChapter || undefined,
  };
}

export const mangadexAdapter: SourceAdapter = {
  id: 'mangadex',

  async searchSeries(filters: SearchFilters) {
    const params: Record<string, string | number | (string | number)[] | undefined> = {
      title: filters.query,
      limit: filters.limit ?? 20,
      offset: ((filters.page ?? 1) - 1) * (filters.limit ?? 20),
      'status[]': filters.status,
      'includes[]': ['cover_art', 'author', 'artist'],
      'availableTranslatedLanguage[]': ['en'],
      'contentRating[]': ['safe', 'suggestive'], // keep it PG by default
    };
    // MangaDex expects order[field]=dir
    if (filters.sort === 'alpha') params['order[title]'] = 'asc';
    else if (filters.sort === 'recent') params['order[latestUploadedChapter]'] = 'desc';
    else params['order[followedCount]'] = 'desc';

    const data = await mdFetch<any>('/manga', params);
    const results = (data.data || []).map(mapSeries);
    return { results, total: data.total };
  },

  async getSeriesDetails(seriesId: string) {
    const data = await mdFetch<any>(`/manga/${seriesId}`, {
      'includes[]': ['cover_art', 'author', 'artist'],
    });
    const item = data.data;
    const base = mapSeries(item);
    const relationships = item.relationships || [];
    const coverRel = relationships.find((r: any) => r.type === 'cover_art');
    const authorNames = relationships
      .filter((r: any) => r.type === 'author')
      .map((r: any) => r.attributes?.name);
    const artistNames = relationships
      .filter((r: any) => r.type === 'artist')
      .map((r: any) => r.attributes?.name);
    const coverFile = coverRel?.attributes?.fileName;
    const coverImage = coverFile
      ? `https://uploads.mangadex.org/covers/${seriesId}/${coverFile}.256.jpg`
      : base.coverImage;
    return { ...base, coverImage, authors: authorNames, artists: artistNames };
  },

  async getChapters(seriesId: string) {
    const data = await mdFetch<any>('/chapter', {
      manga: seriesId,
      'translatedLanguage[]': ['en'],
      'order[chapter]': 'desc',
      limit: 100,
      'includes[]': ['scanlation_group'],
    });
    return (data.data || []).map((ch: any) => ({
      id: ch.id,
      seriesId,
      source: 'mangadex',
      number: ch.attributes?.chapter,
      title: ch.attributes?.title,
      language: ch.attributes?.translatedLanguage?.[0],
      publishedAt: ch.attributes?.publishAt,
      externalUrl: ch.attributes?.externalUrl,
    }));
  },

  async getChapterPages(chapterId: string) {
    const atHome = await mdFetch<any>(`/at-home/server/${chapterId}`);
    if (atHome.result && atHome.result !== 'ok') {
      throw new Error('At-home returned error');
    }
    const baseUrl = atHome.baseUrl;
    const hash = atHome.chapter?.hash;
    const dataArr: string[] = atHome.chapter?.dataSaver?.length
      ? atHome.chapter.dataSaver
      : atHome.chapter?.data || [];
    const qualityPath = atHome.chapter?.dataSaver?.length ? 'data-saver' : 'data';
    return dataArr.map((file, i) => ({
      index: i,
      imageUrl: `${baseUrl}/${qualityPath}/${hash}/${file}`,
    }));
  },
};
