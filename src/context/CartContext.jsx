import { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [savedForLater, setSavedForLater] = useState([]);

  const addToCart = useCallback((product, options = {}) => {
    const size = options.size || product.sizes?.[0] || "-";
    const color = options.color || product.colors?.[0]?.name || null;
    const qty = options.quantity || 1;
    const lineId = `${product.id}-${size}`;

    setCart((prev) => {
      const existing = prev.find((i) => i.lineId === lineId);
      if (existing) {
        return prev.map((i) =>
          i.lineId === lineId
            ? { ...i, quantity: Math.min(i.quantity + qty, i.maxQuantity) }
            : i
        );
      }
      return [
        ...prev,
        {
          lineId,
          id: product.id,
          name: product.name,
          category: product.category,
          size,
          color,
          price: product.price,
          originalPrice: product.originalPrice || null,
          image: product.images?.[0] || product.image,
          quantity: qty,
          maxQuantity: product.stock ?? 10,
          inStock: (product.stock ?? 1) > 0,
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((lineId, qty) => {
    setCart((prev) => prev.map((i) => (i.lineId === lineId ? { ...i, quantity: qty } : i)));
  }, []);

  const removeFromCart = useCallback((lineId) => {
    setCart((prev) => prev.filter((i) => i.lineId !== lineId));
  }, []);

  const saveForLater = useCallback((lineId) => {
    setCart((prev) => {
      const found = prev.find((i) => i.lineId === lineId);
      if (found) setSavedForLater((s) => [...s, found]);
      return prev.filter((i) => i.lineId !== lineId);
    });
  }, []);

  const moveToCart = useCallback((lineId) => {
    setSavedForLater((prev) => {
      const found = prev.find((i) => i.lineId === lineId);
      if (found) setCart((c) => [...c, found]);
      return prev.filter((i) => i.lineId !== lineId);
    });
  }, []);

  const clearCart = useCallback(() => setCart([]), []);
  const itemCount = cart.reduce((n, i) => n + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        savedForLater,
        addToCart,
        updateQuantity,
        removeFromCart,
        saveForLater,
        moveToCart,
        clearCart,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};