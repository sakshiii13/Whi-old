import React from "react";
import { useState,useEffect } from "react";
import ProductCard from "../landing/ProductCard";
import { Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X } from "lucide-react";
import { useCart } from "../../../context/CartContext";

const products = [
  {
    id: 1,
    name: "Structured Cotton Overshirt",
    brand: "Whiold Atelier",
    price: 1128,
    originalPrice: 2160,
    rating: 4.5,
    reviewCount: 86,
    description:
      "A relaxed, structured overshirt cut from heavyweight cotton twill. Designed to layer effortlessly, with a soft brushed interior and horn-style buttons.",
    details: [
      "100% brushed cotton twill",
      "Relaxed fit — true to size",
      "Horn-style button closure",
      "Made in Portugal",
    ],
    colors: [
      { name: "Terracotta", hex: "#BA704F" },
      { name: "Ivory", hex: "#F2E1D9" },
      { name: "Charcoal", hex: "#3D2115" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    badge: "New",
    images: [
      "/public/items/13ecbbfc5b86a92d4d345f7154be14c0.jpg",
      "/public/items/7521159d87bf3c00fd4b01773c896e5e.jpg",
      "/public/items/a98cbfc4e39341a186a467806f15b6a5.jpg",
    ],
  },
  {
    id: 2,
    name: "Premium Linen Shirt",
    brand: "Whiold Atelier",
    price: 1195,
    originalPrice: 2120,
    rating: 4.8,
    reviewCount: 54,
    description:
      "A relaxed, structured overshirt cut from heavyweight cotton twill. Designed to layer effortlessly, with a soft brushed interior and horn-style buttons.",
    details: [
      "100% brushed cotton twill",
      "Relaxed fit — true to size",
      "Horn-style button closure",
      "Made in Portugal",
    ],
    colors: [
      { name: "Terracotta", hex: "#BA704F" },
      { name: "Ivory", hex: "#F2E1D9" },
      { name: "Charcoal", hex: "#3D2115" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    badge: "Sale",
    images: [
      "/public/items/linen (1).jpg",
      "/public/items/linen (2).jpg",
    ],
  },
  {
    id: 3,
    name: "Classic Cotton T-Shirt",
    brand: "Whiold Atelier",
    price: 1149,
    originalPrice: 1269,
    rating: 4.4,
    reviewCount: 98,
    description:
      "A relaxed, structured overshirt cut from heavyweight cotton twill. Designed to layer effortlessly, with a soft brushed interior and horn-style buttons.",
    details: [
      "100% brushed cotton twill",
      "Relaxed fit — true to size",
      "Horn-style button closure",
      "Made in Portugal",
    ],
    colors: [
      { name: "Terracotta", hex: "#BA704F" },
      { name: "Ivory", hex: "#F2E1D9" },
      { name: "Charcoal", hex: "#3D2115" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    badge: "Hot",
    images: [
      "/public/items/cotton (1).jpg",
      "/public/items/cotton (2).jpg",
    ],
  },
  {
    id: 4,
    name: "Denim Jacket",
    brand: "Whiold Atelier",
    price: 1499,
    originalPrice: 2189,
    rating: 4.9,
    reviewCount: 72,
    description:
      "A relaxed, structured overshirt cut from heavyweight cotton twill. Designed to layer effortlessly, with a soft brushed interior and horn-style buttons.",
    details: [
      "100% brushed cotton twill",
      "Relaxed fit — true to size",
      "Horn-style button closure",
      "Made in Portugal",
    ],
    colors: [
      { name: "Terracotta", hex: "#BA704F" },
      { name: "Ivory", hex: "#F2E1D9" },
      { name: "Charcoal", hex: "#3D2115" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    badge: "Best Seller",
    images: [
      "/public/items/denim (1).jpg",
      "/public/items/denim (2).jpg",
      "/public/items/denim (3).jpg",
      "/public/items/denim (4).jpg",
      "/public/items/denim (5).jpg",
    ],
  },
];

const Shop = () => {
  const { addToCart } = useCart();
  const [toast, setToast] = useState(null);

  const handleAddToCart = (product) => {
    addToCart(product);
    setToast(product);
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Typography
        component="h2"
        className="!mb-8"
        sx={{
          fontSize: { xs: "24px", md: "33px" },
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--whiold-text-heading)",
          textAlign: "center",
        }}
      >
        our Collection
      </Typography>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-[var(--whiold-radius-md)] px-4 py-3"
            style={{
              background: "var(--whiold-bg)",
              boxShadow: "var(--whiold-shadow-card)",
              border: "1px solid var(--whiold-border)",
            }}
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
              style={{ background: "var(--whiold-primary-soft)" }}
            >
              <ShoppingBag size={16} style={{ color: "var(--whiold-500)" }} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--whiold-text-heading)" }}>
                Added to bag
              </p>
              <p className="text-xs" style={{ color: "var(--whiold-text-muted)" }}>
                {toast.name}
              </p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="ml-2 flex h-6 w-6 items-center justify-center rounded-full"
              style={{ background: "var(--whiold-bg-soft)" }}
            >
              <X size={12} style={{ color: "var(--whiold-text-muted)" }} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;