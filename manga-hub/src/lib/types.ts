export type ContentType = 'manga' | 'manhwa' | 'manhua' | 'other';
export type SeriesStatus = 'ongoing' | 'completed' | 'hiatus' | 'cancelled' | 'unknown';

export interface Series {
  id: string;
  source: string;
  title: string;
  altTitles?: string[];
  description?: string;
  coverImage: string;
  authors?: string[];
  artists?: string[];
  status?: SeriesStatus;
  genres?: string[];
  tags?: string[];
  contentType?: ContentType;
  latestChapter?: string;
}

export interface Chapter {
  id: string;
  seriesId: string;
  source: string;
  number?: string;
  title?: string;
  language?: string;
  publishedAt?: string;
  externalUrl?: string | null;
}

export interface Page {
  index: number;
  imageUrl: string;
}

export interface SearchFilters {
  query?: string;
  genres?: string[];
  status?: SeriesStatus;
  contentType?: ContentType;
  sort?: 'popular' | 'recent' | 'alpha';
  page?: number;
  limit?: number;
}

export interface SourceAdapter {
  id: string;
  searchSeries(filters: SearchFilters): Promise<{ results: Series[]; total?: number }>;
  getSeriesDetails(seriesId: string): Promise<Series>;
  getChapters(seriesId: string): Promise<Chapter[]>;
  getChapterPages(chapterId: string): Promise<Page[]>;
}
