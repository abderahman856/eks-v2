import { useState } from 'react';
import { useCart } from '../context/CartContext';

function formatPrice(value) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(value);
}

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const outOfStock = product.available <= 0;

  const handleAdd = () => {
    addItem(product, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-stone-100 via-stone-50 to-brand-50">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-serif text-5xl italic text-stone-300 transition group-hover:text-stone-400">
            {product.name.charAt(0)}
          </span>
        </div>
        {outOfStock && (
          <span className="absolute left-3 top-3 rounded-full bg-stone-900 px-3 py-1 text-xs font-medium text-white">
            Out of stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="text-xs uppercase tracking-wider text-stone-400">{product.sku}</p>
          <h3 className="mt-1 text-lg font-semibold text-stone-900">{product.name}</h3>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3">
          <div>
            <p className="text-xl font-semibold text-stone-900">{formatPrice(product.price)}</p>
            <p className="text-xs text-stone-500">
              {product.available} available · {product.stock} in stock
            </p>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={outOfStock}
            className="rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            {added ? 'Added' : 'Add to cart'}
          </button>
        </div>
      </div>
    </article>
  );
}

export { formatPrice };
