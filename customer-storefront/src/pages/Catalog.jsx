import { useEffect, useState } from 'react';
import { getProducts } from '../api/client';
import ProductCard from '../components/ProductCard';

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    getProducts()
      .then((data) => {
        if (active) setProducts(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <section className="mb-10 max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand-600">
          Product catalog
        </p>
        <h1 className="mt-2 font-serif text-4xl italic text-stone-900 sm:text-5xl">
          Curated essentials
        </h1>
        <p className="mt-4 text-lg text-stone-600">
          Browse live inventory from the platform API. Add items to your cart and check out in
          minutes.
        </p>
      </section>

      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-72 animate-pulse rounded-2xl border border-stone-200 bg-white"
            />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-800">
          <p className="font-medium">Could not load products</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
          <p className="text-lg font-medium text-stone-800">No products yet</p>
          <p className="mt-2 text-stone-500">
            Seed inventory via the admin dashboard or inventory API, then refresh.
          </p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
