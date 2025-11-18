import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SeriesCard from './SeriesCard';
import type { Series } from '../../lib/types';

const mockSeries: Series = {
  id: '1',
  source: 'mock',
  title: 'Test Series',
  coverImage: 'http://example.com/cover.jpg',
};

it('renders title and source', () => {
  render(
    <MemoryRouter>
      <SeriesCard series={mockSeries} />
    </MemoryRouter>
  );
  expect(screen.getByText('Test Series')).toBeInTheDocument();
  expect(screen.getByText(/mock/i)).toBeInTheDocument();
});
