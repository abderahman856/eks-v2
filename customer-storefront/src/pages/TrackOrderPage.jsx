import { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { getOrder, trackShipment } from '../api/client';

function StatusBadge({ status }) {
  const styles = {
    pending: 'bg-amber-100 text-amber-800',
    confirmed: 'bg-sky-100 text-sky-800',
    processing: 'bg-violet-100 text-violet-800',
    shipped: 'bg-emerald-100 text-emerald-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    label_created: 'bg-stone-100 text-stone-800',
    in_transit: 'bg-sky-100 text-sky-800',
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${styles[status] || 'bg-stone-100 text-stone-800'}`}
    >
      {status?.replace(/_/g, ' ') || 'unknown'}
    </span>
  );
}

export default function TrackOrderPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const orderFromQuery = searchParams.get('order') || '';
  const [trackingNumber, setTrackingNumber] = useState('');
  const [orderId, setOrderId] = useState(orderFromQuery);
  const [trackingResult, setTrackingResult] = useState(null);
  const [orderResult, setOrderResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (location.state?.orderId) {
      setSuccessMessage(`Order #${location.state.orderId} placed successfully.`);
      setOrderId(String(location.state.orderId));
    }
  }, [location.state]);

  useEffect(() => {
    if (!orderFromQuery) return;

    getOrder(orderFromQuery)
      .then(setOrderResult)
      .catch(() => {
        /* order lookup is optional on this page */
      });
  }, [orderFromQuery]);

  const handleTrack = async (event) => {
    event.preventDefault();
    if (!trackingNumber.trim()) return;

    setLoading(true);
    setError('');
    setTrackingResult(null);

    try {
      const data = await trackShipment(trackingNumber.trim());
      setTrackingResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderLookup = async (event) => {
    event.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError('');
    setOrderResult(null);

    try {
      const data = await getOrder(orderId.trim());
      setOrderResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand-600">
        Order tracking
      </p>
      <h1 className="mt-2 font-serif text-4xl italic text-stone-900">Track your delivery</h1>
      <p className="mt-4 text-stone-600">
        Look up shipment progress with a tracking number, or check order status by order ID.
      </p>

      {successMessage && (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-900">
          {successMessage}
        </div>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <form
          onSubmit={handleTrack}
          className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold">Shipment tracking</h2>
          <p className="mt-1 text-sm text-stone-500">Uses GET /api/shipping/track/:id</p>
          <label className="mt-4 block">
            <span className="mb-1.5 block text-sm font-medium text-stone-700">
              Tracking number
            </span>
            <input
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="RM123456789GB"
              className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none ring-brand-500 focus:ring-2"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-60"
          >
            Track shipment
          </button>
        </form>

        <form
          onSubmit={handleOrderLookup}
          className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold">Order status</h2>
          <p className="mt-1 text-sm text-stone-500">Uses GET /api/orders/:id</p>
          <label className="mt-4 block">
            <span className="mb-1.5 block text-sm font-medium text-stone-700">Order ID</span>
            <input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="42"
              className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none ring-brand-500 focus:ring-2"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-60"
          >
            Look up order
          </button>
        </form>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-800">
          {error}
        </div>
      )}

      {orderResult && (
        <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Order #{orderResult.id}</h2>
            <StatusBadge status={orderResult.status} />
          </div>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-stone-500">Total</dt>
              <dd className="font-medium">
                {new Intl.NumberFormat('en-GB', {
                  style: 'currency',
                  currency: orderResult.currency || 'GBP',
                }).format(orderResult.total)}
              </dd>
            </div>
            <div>
              <dt className="text-stone-500">Created</dt>
              <dd className="font-medium">
                {orderResult.created_at
                  ? new Date(orderResult.created_at).toLocaleString()
                  : '—'}
              </dd>
            </div>
          </dl>
          {orderResult.items?.length > 0 && (
            <ul className="mt-4 divide-y divide-stone-100 rounded-xl border border-stone-100">
              {orderResult.items.map((item, index) => (
                <li key={index} className="flex justify-between px-4 py-3 text-sm">
                  <span>
                    {item.product_id} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    {new Intl.NumberFormat('en-GB', {
                      style: 'currency',
                      currency: orderResult.currency || 'GBP',
                    }).format(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {trackingResult && (
        <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">{trackingResult.tracking_number}</h2>
            <StatusBadge status={trackingResult.current_status} />
          </div>

          {trackingResult.events?.length > 0 ? (
            <ol className="mt-6 space-y-4 border-l-2 border-stone-200 pl-6">
              {trackingResult.events.map((event, index) => (
                <li key={index} className="relative">
                  <span className="absolute -left-[1.95rem] top-1.5 h-3 w-3 rounded-full bg-brand-600 ring-4 ring-white" />
                  <p className="font-medium capitalize">{event.status?.replace(/_/g, ' ')}</p>
                  <p className="text-sm text-stone-600">{event.description}</p>
                  <p className="mt-1 text-xs text-stone-400">
                    {[event.location, event.occurred_at && new Date(event.occurred_at).toLocaleString()]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-4 text-sm text-stone-500">No tracking events recorded yet.</p>
          )}
        </section>
      )}

      <div className="mt-10 text-center">
        <Link to="/" className="text-sm font-medium text-brand-700 hover:text-brand-800">
          ← Continue shopping
        </Link>
      </div>
    </div>
  );
}
