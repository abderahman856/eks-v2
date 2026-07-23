import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const navClass = ({ isActive }) =>
  [
    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
    isActive ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900',
  ].join(' ');

export default function Layout({ children }) {
  const { itemCount } = useCart();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6">
          <Link to="/" className="group flex items-baseline gap-2">
            <span className="font-serif text-2xl italic tracking-tight text-stone-900">
              Meridian
            </span>
            <span className="hidden text-xs uppercase tracking-[0.2em] text-stone-400 sm:inline">
              Store
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            <NavLink to="/" end className={navClass}>
              Shop
            </NavLink>
            <NavLink to="/cart" className={navClass}>
              Cart
              {itemCount > 0 && (
                <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1.5 text-xs text-white">
                  {itemCount}
                </span>
              )}
            </NavLink>
            <NavLink to="/track" className={navClass}>
              Track
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">{children}</main>

      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>Meridian Store — powered by your order platform.</p>
          <p>API Gateway: {import.meta.env.REACT_APP_API_GATEWAY_URL || 'http://localhost:8080'}</p>
        </div>
      </footer>
    </div>
  );
}
