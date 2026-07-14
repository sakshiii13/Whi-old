import { useState, useMemo, useEffect } from "react";
import { Drawer, Slider, Checkbox, Menu, MenuItem, Skeleton } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  Star,
  SearchX,
  Check,
  ShoppingBag,
} from "lucide-react";

import ButtonComponent from "../../../ui/ButtonComponent";
import ProductCard from "../ProductCard";
import { useCart } from "../../../../context/CartContext";

/* ------------------------------------------------------------------ */
/* Sample data — replace with your real catalog / API response.        */
/* ------------------------------------------------------------------ */
const CATEGORIES = ["Fashion", "Footwear", "Accessories", "Home", "Beauty"];

const COLOR_SWATCHES = [
  { name: "Terracotta", hex: "#BA704F" },
  { name: "Ivory", hex: "#F2E1D9" },
  { name: "Espresso", hex: "#3D2115" },
  { name: "Sage", hex: "#8A9A7B" },
  { name: "Charcoal", hex: "#2B2119" },
];

const SIZES = ["XS", "S", "M", "L", "XL"];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

const PRODUCTS = [
 {
  id: 1,

  name: "Premium Cotton T-Shirt",

  brand: "Whiold Basics",

  category: "Fashion",

  price: 1399,

  originalPrice: 49,

  discount: "20% OFF",

  badge: "New Arrival",

  stock: 35,

  sku: "WB-TS-001",

  images: [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900",
  ],

  colors: [
    COLOR_SWATCHES[0],
    COLOR_SWATCHES[1],
    COLOR_SWATCHES[4],
  ],

  sizes: ["S", "M", "L", "XL"],

  description:
    "Crafted from premium cotton for superior comfort and everyday wear. Soft, breathable, and perfect for casual styling.",

  details: [
    "Regular Fit",
    "Round Neck",
    "Half Sleeves",
    "Soft Cotton Fabric",
    "Breathable Material",
  ],

  material: "100% Premium Cotton",

  fit: "Regular Fit",

  care: [
    "Machine Wash Cold",
    "Do Not Bleach",
    "Iron at Low Temperature",
  ],

  delivery: "Free delivery in 3–5 days",

  returnPolicy: "7 Days Easy Return",

  countryOfOrigin: "India",
 },
  {
    id: 2,
    name: "Running Sneakers",
    brand: "Whiold Sport",
    category: "Footwear",
    price: 89,
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"],
    colors: [COLOR_SWATCHES[4], COLOR_SWATCHES[0]],
    sizes: ["S", "M", "L"],
   
    reviewCount: 87,
    badge: "Trending",
    discount: "15% OFF",

stock: 20,

sku: "WS-RS-002",

description:
  "Lightweight running sneakers designed for maximum comfort, flexibility, and all-day performance.",

details: [
  "Breathable Mesh Upper",
  "Cushioned Sole",
  "Lightweight Design",
  "Anti-slip Grip",
  "Ideal for Running & Walking",
],

material: "Mesh & Rubber",

fit: "Regular Fit",

care: [
  "Wipe with a dry cloth",
  "Do not machine wash",
  "Air dry only",
],

delivery: "Free delivery in 3–5 days",

returnPolicy: "7 Days Easy Return",

countryOfOrigin: "India",
  },
  {
    id: 3,
    name: "Classic Hoodie",
    brand: "Whiold Basics",
    category: "Fashion",
    price: 59,
    originalPrice: 74,
    images: ["https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600"],
    colors: [COLOR_SWATCHES[2], COLOR_SWATCHES[3]],
    sizes: ["M", "L", "XL"],
   
    reviewCount: 210,
    badge: "Best Seller",
    discount: "20% OFF",

stock: 18,

sku: "WB-HD-003",

description:
  "Soft fleece hoodie crafted for warmth and everyday comfort with a timeless casual look.",

details: [
  "Regular Fit",
  "Full Sleeves",
  "Drawstring Hood",
  "Front Kangaroo Pocket",
  "Soft Fleece Fabric",
],

material: "Cotton Blend",

fit: "Regular Fit",

care: [
  "Machine Wash Cold",
  "Wash Inside Out",
  "Do Not Bleach",
],

delivery: "Free delivery in 3–5 days",

returnPolicy: "7 Days Easy Return",

countryOfOrigin: "India",
  },
  {
    id: 4,
    name: "Woven Leather Belt",
    brand: "Whiold Accents",
    category: "Accessories",
    price: 24,
    images: ["https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600"],
    colors: [COLOR_SWATCHES[2]],
    sizes: [],
    
    reviewCount: 42,
    discount: "10% OFF",

stock: 40,

sku: "WA-BL-004",

description:
  "Premium woven leather belt designed to complement both casual and formal outfits.",

details: [
  "Adjustable Fit",
  "Metal Buckle",
  "Classic Design",
  "Durable Construction",
],

material: "Genuine Leather",

fit: "Adjustable",

care: [
  "Clean with dry cloth",
  "Avoid moisture",
],

delivery: "Free delivery in 3–5 days",

returnPolicy: "7 Days Easy Return",

countryOfOrigin: "India",
  },
  {
    id: 5,
    name: "Ceramic Table Lamp",
    brand: "Whiold Home",
    category: "Home",
    price: 54,
    images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600"],
    colors: [COLOR_SWATCHES[1], COLOR_SWATCHES[3]],
    sizes: [],
    
    reviewCount: 65,
    badge: "New Arrival",
    discount: "18% OFF",

stock: 14,

sku: "WH-LP-005",

description:
  "Modern ceramic table lamp that adds warmth and elegance to any living space.",

details: [
  "Premium Ceramic Body",
  "Elegant Finish",
  "Soft Ambient Lighting",
  "Suitable for Bedroom & Living Room",
],

material: "Ceramic",

fit: "Standard",

care: [
  "Clean with soft dry cloth",
  "Avoid water exposure",
],

delivery: "Free delivery in 4–6 days",

returnPolicy: "7 Days Easy Return",

countryOfOrigin: "India",
  },
  {
    id: 6,
    name: "Matte Lip Tint",
    brand: "Whiold Beauty",
    category: "Beauty",
    price: 15,
    originalPrice: 19,
    images: ["https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600"],
    colors: [COLOR_SWATCHES[0], COLOR_SWATCHES[2]],
    sizes: [],
    
    reviewCount: 156,
    discount: "21% OFF",

stock: 60,

sku: "WB-LT-006",

description:
  "Long-lasting matte lip tint with a lightweight formula and vibrant color payoff.",

details: [
  "Matte Finish",
  "Long Lasting",
  "Smudge Resistant",
  "Lightweight Formula",
],

material: "Cosmetic Formula",

fit: "Universal",

care: [
  "Store in a cool place",
  "Close cap tightly after use",
],

delivery: "Free delivery in 2–4 days",

returnPolicy: "7 Days Easy Return",

countryOfOrigin: "India",
  },
  {
    id: 7,
    name: "Linen Blend Shirt",
    brand: "Whiold Basics",
    category: "Fashion",
    price: 45,
    images: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600"],
    colors: [COLOR_SWATCHES[1], COLOR_SWATCHES[4]],
    sizes: ["S", "M", "L", "XL"],
    
    reviewCount: 34,
    discount: "12% OFF",

stock: 28,

sku: "WB-LS-007",

description:
  "Premium linen blend shirt designed for breathable comfort and effortless everyday style.",

details: [
  "Full Sleeves",
  "Button Closure",
  "Spread Collar",
  "Breathable Fabric",
  "Lightweight Feel",
],

material: "Linen Blend",

fit: "Regular Fit",

care: [
  "Machine Wash Cold",
  "Iron on Low Heat",
  "Do Not Bleach",
],

delivery: "Free delivery in 3–5 days",

returnPolicy: "7 Days Easy Return",

countryOfOrigin: "India",
  },
  {
    id: 8,
    name: "Suede Chelsea Boots",
    brand: "Whiold Sport",
    category: "Footwear",
    price: 119,
    originalPrice: 139,
    images: ["https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600"],
    colors: [COLOR_SWATCHES[2]],
    sizes: ["M", "L"],
  
    reviewCount: 98,
    badge: "Trending",
    discount: "14% OFF",

stock: 16,

sku: "WS-CB-008",

description:
  "Classic suede Chelsea boots featuring premium craftsmanship and superior comfort for everyday wear.",

details: [
  "Elastic Side Panels",
  "Cushioned Footbed",
  "Slip-on Design",
  "Durable Outsole",
],

material: "Suede Leather",

fit: "Regular Fit",

care: [
  "Brush gently after use",
  "Keep away from water",
  "Use suede cleaner only",
],

delivery: "Free delivery in 3–5 days",

returnPolicy: "7 Days Easy Return",

countryOfOrigin: "India",
  },
];

/* ------------------------------------------------------------------ */
/* Small presentational helpers                                        */
/* ------------------------------------------------------------------ */
const FilterChip = ({ label, onRemove }) => (
  <button
    onClick={onRemove}
    className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
    style={{
      background: "var(--whiold-primary-soft)",
      color: "var(--whiold-700)",
      border: "1px solid var(--whiold-border)",
    }}
  >
    {label}
    <X size={12} />
  </button>
);

const SectionTitle = ({ children }) => (
  <p className="mb-3 text-[13px] font-semibold" style={{ color: "var(--whiold-text-heading)" }}>
    {children}
  </p>
);

const CardSkeleton = () => (
  <div className="overflow-hidden rounded-[var(--whiold-radius-lg)]" style={{ border: "1px solid var(--whiold-border)" }}>
    <Skeleton variant="rectangular" className="aspect-[4/5] w-full" sx={{ bgcolor: "var(--whiold-bg-soft)" }} />
    <div className="space-y-2 p-3.5">
      <Skeleton width="40%" sx={{ bgcolor: "var(--whiold-bg-soft)" }} />
      <Skeleton width="70%" sx={{ bgcolor: "var(--whiold-bg-soft)" }} />
      <Skeleton width="30%" sx={{ bgcolor: "var(--whiold-bg-soft)" }} />
    </div>
  </div>
);

const EmptyState = ({ onClear }) => (
  <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
    <div
      className="flex h-16 w-16 items-center justify-center rounded-full"
      style={{ background: "var(--whiold-bg-soft)" }}
    >
      <SearchX size={26} style={{ color: "var(--whiold-500)" }} />
    </div>
    <div>
      <h3 className="text-base font-semibold" style={{ color: "var(--whiold-text-heading)" }}>
        No products match your filters
      </h3>
      <p className="mt-1 text-sm" style={{ color: "var(--whiold-text-muted)" }}>
        Try removing a few filters to see more results.
      </p>
    </div>
    <ButtonComponent variant="outlined" size="small" onClick={onClear}>
      Clear all filters
    </ButtonComponent>
  </div>
);

/* ------------------------------------------------------------------ */
/* Main page                                                            */
/* ------------------------------------------------------------------ */
const Shopping = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sortAnchor, setSortAnchor] = useState(null);
  const [sortBy, setSortBy] = useState("featured");

  const [activePill, setActivePill] = useState("All");
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  // const [minRating, setMinRating] = useState(0);
  const [toast, setToast] = useState(null);
const { addToCart } = useCart();
  const handleAddToCart = (product) => {
    addToCart(product);
    setToast(product);
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 550);
    return () => clearTimeout(t);
  }, []);

  const toggle = (list, setList, value) =>
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      if (activePill !== "All" && p.category !== activePill) return false;
      if (categories.length && !categories.includes(p.category)) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (colors.length && !p.colors?.some((c) => colors.includes(c.name))) return false;
      if (sizes.length && !p.sizes?.some((s) => sizes.includes(s))) return false;
      // if (minRating && (p.rating || 0) < minRating) return false;
      return true;
    });

    if (sortBy === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    // if (sortBy === "rating") list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sortBy === "newest") list = [...list].sort((a, b) => b.id - a.id);

    return list;
  }, [activePill, categories, priceRange, colors, sizes, sortBy]);

  const activeFilterCount =
    categories.length +
    colors.length +
    sizes.length +
    // (minRating ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 5000 ? 1 : 0);

  const clearAll = () => {
    setCategories([]);
    setColors([]);
    setSizes([]);
    // setMinRating(0);
    setPriceRange([0, 5000]);
    setActivePill("All");
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--whiold-bg-soft)" }}>
      {/* ── page header ── */}
      <div style={{ background: "var(--whiold-bg)", borderBottom: "1px solid var(--whiold-border)" }}>
        <div className="mx-auto max-w-7xl px-6 pb-2 pt-8 md:px-10">
          <p className="text-xs uppercase tracking-[0.2em]" style={{ color: "var(--whiold-text-muted)" }}>
            Home / Shop
          </p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <h1 className="text-3xl font-semibold md:text-4xl" style={{ color: "var(--whiold-text-heading)" }}>
              Shop All
            </h1>
            <p className="text-sm" style={{ color: "var(--whiold-text-body)" }}>
              {isLoading ? "Loading products…" : `${filtered.length} products`}
            </p>
          </div>
        </div>

        {/* quick category pills — horizontal scroll, Pinterest-style */}
        <div className="mx-auto max-w-7xl overflow-x-auto px-6 py-4 md:px-10">
          <div className="flex w-max gap-2">
            {["All", ...CATEGORIES].map((cat) => {
              const active = activePill === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActivePill(cat)}
                  className="shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-colors"
                  style={
                    active
                      ? { background: "var(--whiold-gradient-brand)", color: "var(--whiold-text-on-primary)" }
                      : {
                          background: "var(--whiold-bg-soft)",
                          color: "var(--whiold-text-body)",
                          border: "1px solid var(--whiold-border)",
                        }
                  }
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── sticky toolbar: filter trigger + sort ── */}
      <div
        className="sticky top-0 z-30 backdrop-blur"
        style={{ background: "rgba(255,255,255,0.9)", borderBottom: "1px solid var(--whiold-border)" }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 md:px-10">
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2 rounded-[var(--whiold-radius-sm)] px-4 py-2 text-sm font-medium"
            style={{ border: "1px solid var(--whiold-border)", color: "var(--whiold-text-heading)" }}
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold"
                style={{ background: "var(--whiold-500)", color: "#fff" }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>

          <button
            onClick={(e) => setSortAnchor(e.currentTarget)}
            className="flex items-center gap-1.5 text-sm font-medium"
            style={{ color: "var(--whiold-text-heading)" }}
          >
            Sort: {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
            <ChevronDown size={15} />
          </button>

          <Menu anchorEl={sortAnchor} open={!!sortAnchor} onClose={() => setSortAnchor(null)}>
            {SORT_OPTIONS.map((o) => (
              <MenuItem
                key={o.value}
                selected={o.value === sortBy}
                onClick={() => {
                  setSortBy(o.value);
                  setSortAnchor(null);
                }}
                sx={{
                  fontSize: 14,
                  "&.Mui-selected": { color: "var(--whiold-500)", fontWeight: 600 },
                }}
              >
                {o.label}
              </MenuItem>
            ))}
          </Menu>
        </div>

        {/* active filter chips */}
        {activeFilterCount > 0 && (
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-6 pb-3 md:px-10">
            {categories.map((c) => (
              <FilterChip key={c} label={c} onRemove={() => toggle(categories, setCategories, c)} />
            ))}
            {colors.map((c) => (
              <FilterChip key={c} label={c} onRemove={() => toggle(colors, setColors, c)} />
            ))}
            {sizes.map((s) => (
              <FilterChip key={s} label={`Size ${s}`} onRemove={() => toggle(sizes, setSizes, s)} />
            ))}
            {/* {minRating > 0 && <FilterChip label={`${minRating}★ & up`} onRemove={() => setMinRating(0)} />} */}
            <button
              onClick={clearAll}
              className="text-xs font-semibold underline"
              style={{ color: "var(--whiold-500)" }}
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* ── product grid ── */}
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-10">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState onClear={clearAll} />
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </div>

      {/* ── filter drawer, slides in from the left ── */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: { xs: "100%", sm: 360 }, background: "var(--whiold-bg)" } }}
      >
        <div className="flex h-full flex-col">
          {/* header */}
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: "1px solid var(--whiold-border)" }}
          >
            <h2 className="text-base font-semibold" style={{ color: "var(--whiold-text-heading)" }}>
              Filters
            </h2>
            <button
              onClick={() => setDrawerOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{ background: "var(--whiold-bg-soft)" }}
            >
              <X size={16} style={{ color: "var(--whiold-text-heading)" }} />
            </button>
          </div>

          {/* scrollable body */}
          <div className="flex-1 space-y-7 overflow-y-auto px-5 py-6">
            {/* category */}
            <div>
              <SectionTitle>Category</SectionTitle>
              <div className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <label key={cat} className="flex cursor-pointer items-center gap-2.5">
                    <Checkbox
                      checked={categories.includes(cat)}
                      onChange={() => toggle(categories, setCategories, cat)}
                      size="small"
                      sx={{
                        color: "var(--whiold-border-hover)",
                        "&.Mui-checked": { color: "var(--whiold-500)" },
                        padding: "4px",
                      }}
                    />
                    <span className="text-sm" style={{ color: "var(--whiold-text-body)" }}>
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--whiold-border)" }} />

            {/* price range */}
            <div>
              <SectionTitle>Price Range</SectionTitle>
              <div className="px-1">
                <Slider
                  value={priceRange}
                  onChange={(_, v) => setPriceRange(v)}
                  min={0}
                  max={150}
                  step={5}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(v) => `₹${v}`}
                  sx={{
                    color: "var(--whiold-500)",
                    "& .MuiSlider-thumb": {
                      backgroundColor: "var(--whiold-bg)",
                      border: "2px solid var(--whiold-500)",
                      "&:hover, &.Mui-focusVisible": {
                        boxShadow: "0 0 0 8px var(--whiold-primary-ring)",
                      },
                    },
                    "& .MuiSlider-track": { backgroundColor: "var(--whiold-500)" },
                    "& .MuiSlider-rail": { backgroundColor: "var(--whiold-border)" },
                  }}
                />
                <div className="mt-1 flex justify-between text-xs" style={{ color: "var(--whiold-text-muted)" }}>
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--whiold-border)" }} />

            {/* colors */}
            <div>
              <SectionTitle>Color</SectionTitle>
              <div className="flex flex-wrap gap-3">
                {COLOR_SWATCHES.map((c) => {
                  const active = colors.includes(c.name);
                  return (
                    <button
                      key={c.name}
                      onClick={() => toggle(colors, setColors, c.name)}
                      className="relative flex h-9 w-9 items-center justify-center rounded-full"
                      style={{ background: c.hex, border: "2px solid var(--whiold-bg)", boxShadow: "0 0 0 1px var(--whiold-border)" }}
                      title={c.name}
                    >
                      {active && (
                        <Check
                          size={14}
                          strokeWidth={3}
                          style={{ color: c.name === "Ivory" ? "var(--whiold-700)" : "#fff" }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--whiold-border)" }} />

            {/* sizes */}
            <div>
              <SectionTitle>Size</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s) => {
                  const active = sizes.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => toggle(sizes, setSizes, s)}
                      className="h-9 w-9 rounded-[var(--whiold-radius-sm)] text-xs font-medium"
                      style={
                        active
                          ? { background: "var(--whiold-gradient-brand)", color: "var(--whiold-text-on-primary)" }
                          : {
                              border: "1px solid var(--whiold-border)",
                              color: "var(--whiold-text-heading)",
                              background: "var(--whiold-bg)",
                            }
                      }
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--whiold-border)" }} />

            {/* rating */}
            {/* <div>
              <SectionTitle>Rating</SectionTitle>
              <div className="space-y-1.5">
                {[4, 3, 2].map((r) => (
                  <button
                    key={r}
                    onClick={() => setMinRating(minRating === r ? 0 : r)}
                    className="flex w-full items-center gap-2 rounded-[var(--whiold-radius-sm)] px-2 py-2 text-sm"
                    style={{
                      background: minRating === r ? "var(--whiold-primary-soft)" : "transparent",
                      color: "var(--whiold-text-body)",
                    }}
                  >
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < r ? "var(--whiold-500)" : "none"}
                          style={{ color: "var(--whiold-500)" }}
                        />
                      ))}
                    </div>
                    <span>& up</span>
                  </button>
                ))}
              </div>
            </div> */}
          </div>

          {/* sticky footer */}
          <div
            className="flex items-center gap-3 px-5 py-4"
            style={{ borderTop: "1px solid var(--whiold-border)", background: "var(--whiold-bg)" }}
          >
            <button
              onClick={clearAll}
              className="text-sm font-medium"
              style={{ color: "var(--whiold-text-muted)" }}
            >
              Clear all
            </button>
            <ButtonComponent fullWidth onClick={() => setDrawerOpen(false)}>
              Show {filtered.length} results
            </ButtonComponent>
          </div>
        </div>
      </Drawer>

      {/* ── add-to-cart toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-[var(--whiold-radius-md)] px-4 py-3"
            style={{ background: "var(--whiold-bg)", boxShadow: "var(--whiold-shadow-card)", border: "1px solid var(--whiold-border)" }}
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

export default Shopping;