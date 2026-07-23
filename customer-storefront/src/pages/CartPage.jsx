import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../components/ProductCard';

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-stone-200 bg-white px-8 py-16 text-center shadow-sm">
        <h1 className="font-serif text-3xl italic text-stone-900">Your cart is empty</h1>
        <p className="mt-3 text-stone-600">Discover products and add them before checkout.</p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-full bg-stone-900 px-6 py-3 text-sm font-medium text-white hover:bg-stone-700"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <section>
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand-600">
              Shopping cart
            </p>
            <h1 className="mt-2 font-serif text-4xl italic text-stone-900">Review your items</h1>
          </div>
          <button
            type="button"
            onClick={clearCart}
            className="text-sm text-stone-500 underline-offset-4 hover:text-stone-800 hover:underline"
          >
            Clear cart
          </button>
        </div>

        <ul className="divide-y divide-stone-200 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          {items.map(({ product, quantity }) => (
            <li key={product.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-stone-100 font-serif text-2xl italic text-stone-400">
                {product.name.charAt(0)}
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-medium text-stone-900">{product.name}</p>
                <p className="text-sm text-stone-500">{product.sku}</p>
                <p className="mt-1 text-sm font-medium">{formatPrice(product.price)} each</p>
              </div>

              <div className="flex items-center gap-3">
                <label className="sr-only" htmlFor={`qty-${product.id}`}>
                  Quantity for {product.name}
                </label>
                <input
                  id={`qty-${product.id}`}
                  type="number"
                  min="1"
                  max={product.available}
                  value={quantity}
                  onChange={(e) => updateQuantity(product.id, Number(e.target.value))}
                  className="w-20 rounded-lg border border-stone-300 px-3 py-2 text-center text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeItem(product.id)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>

              <p className="text-right font-semibold sm:w-24">
                {formatPrice(product.price * quantity)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-900">Order summary</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-stone-500">Subtotal</dt>
            <dd className="font-medium">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone-500">Shipping</dt>
            <dd className="font-medium">Calculated at fulfillment</dd>
          </div>
        </dl>
        <div className="mt-4 flex justify-between border-t border-stone-200 pt-4 text-base font-semibold">
          <span>Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <Link
          to="/checkout"
          className="mt-6 flex w-full items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-medium text-white hover:bg-brand-700"
        >
          Proceed to checkout
        </Link>
      </aside>
    </div>
  );
}
