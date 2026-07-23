import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'storefront_cart';

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo(() => {
    const addItem = (product, quantity = 1) => {
      setItems((current) => {
        const existing = current.find((item) => item.product.id === product.id);
        if (existing) {
          return current.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        }
        return [...current, { product, quantity }];
      });
    };

    const updateQuantity = (productId, quantity) => {
      if (quantity <= 0) {
        removeItem(productId);
        return;
      }
      setItems((current) =>
        current.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item,
        ),
      );
    };

    const removeItem = (productId) => {
      setItems((current) => current.filter((item) => item.product.id !== productId));
    };

    const clearCart = () => setItems([]);

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    return {
      items,
      itemCount,
      subtotal,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
