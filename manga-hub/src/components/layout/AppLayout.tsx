import { Link, NavLink } from 'react-router-dom';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-xl font-bold text-white">
            MangaHub
          </Link>
          <nav className="flex gap-4 text-sm">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'text-indigo-400' : 'text-slate-300')}
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/browse"
              className={({ isActive }) => (isActive ? 'text-indigo-400' : 'text-slate-300')}
            >
              Browse
            </NavLink>
            <NavLink
              to="/favorites"
              className={({ isActive }) => (isActive ? 'text-indigo-400' : 'text-slate-300')}
            >
              Favorites
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
