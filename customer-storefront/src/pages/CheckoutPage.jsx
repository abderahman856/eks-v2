import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createOrder } from '../api/client';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../components/ProductCard';

const initialForm = {
  name: '',
  email: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  postcode: '',
  country: 'GB',
  notes: '',
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-stone-200 bg-white px-8 py-16 text-center shadow-sm">
        <h1 className="font-serif text-3xl italic text-stone-900">Nothing to checkout</h1>
        <p className="mt-3 text-stone-600">Add products to your cart first.</p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-full bg-stone-900 px-6 py-3 text-sm font-medium text-white hover:bg-stone-700"
        >
          Back to shop
        </Link>
      </div>
    );
  }

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    const notes = [
      `Customer: ${form.name}`,
      `Email: ${form.email}`,
      `Address: ${form.addressLine1}${form.addressLine2 ? ', ' + form.addressLine2 : ''}, ${form.city}, ${form.postcode}, ${form.country}`,
      form.notes ? `Notes: ${form.notes}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    try {
      const order = await createOrder({
        items: items.map(({ product, quantity }) => ({
          product_id: product.id,
          quantity,
          price: product.price,
        })),
        currency: 'GBP',
        notes,
      });

      clearCart();
      navigate(`/track?order=${order.id}`, {
        replace: true,
        state: { orderId: order.id, orderTotal: order.total },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <section>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand-600">Checkout</p>
        <h1 className="mt-2 font-serif text-4xl italic text-stone-900">Delivery details</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-stone-700">Full name</span>
              <input
                required
                value={form.name}
                onChange={updateField('name')}
                className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none ring-brand-500 focus:ring-2"
                placeholder="Alex Morgan"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-stone-700">Email</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={updateField('email')}
                className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none ring-brand-500 focus:ring-2"
                placeholder="alex@example.com"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-stone-700">Address line 1</span>
              <input
                required
                value={form.addressLine1}
                onChange={updateField('addressLine1')}
                className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none ring-brand-500 focus:ring-2"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-stone-700">
                Address line 2 (optional)
              </span>
              <input
                value={form.addressLine2}
                onChange={updateField('addressLine2')}
                className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none ring-brand-500 focus:ring-2"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-stone-700">City</span>
              <input
                required
                value={form.city}
                onChange={updateField('city')}
                className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none ring-brand-500 focus:ring-2"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-stone-700">Postcode</span>
              <input
                required
                value={form.postcode}
                onChange={updateField('postcode')}
                className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none ring-brand-500 focus:ring-2"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-stone-700">Country</span>
              <select
                value={form.country}
                onChange={updateField('country')}
                className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none ring-brand-500 focus:ring-2"
              >
                <option value="GB">United Kingdom</option>
                <option value="US">United States</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
              </select>
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-stone-700">
                Order notes (optional)
              </span>
              <textarea
                rows={3}
                value={form.notes}
                onChange={updateField('notes')}
                className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none ring-brand-500 focus:ring-2"
                placeholder="Delivery instructions, gift message, etc."
              />
            </label>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-brand-600 px-8 py-3 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Placing order…' : 'Place order'}
          </button>
        </form>
      </section>

      <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Your order</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {items.map(({ product, quantity }) => (
            <li key={product.id} className="flex justify-between gap-4">
              <span className="text-stone-600">
                {product.name} × {quantity}
              </span>
              <span className="font-medium">{formatPrice(product.price * quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-stone-200 pt-4 font-semibold">
          <span>Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
      </aside>
    </div>
  );
}
