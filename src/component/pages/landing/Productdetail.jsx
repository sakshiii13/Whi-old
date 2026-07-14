import React, { useState, useRef, useLayoutEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import {
  Breadcrumbs,
  Chip,
  Rating,
  IconButton,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Share2,
} from "lucide-react";
import gsap from "gsap";
import products from "./editproduct";

// const MOCK_PRODUCTS = {
//   1: {
//     id: "1",
//     category: "Outerwear",
//     name: "Structured Cotton Overshirt",
//     brand: "Whiold Atelier",
//     price: 128,
//     originalPrice: 160,
//     rating: 4.5,
//     reviewCount: 86,
//     description:
//       "A relaxed, structured overshirt cut from heavyweight cotton twill. Designed to layer effortlessly, with a soft brushed interior and horn-style buttons.",
//     details: [
//       "100% brushed cotton twill",
//       "Relaxed fit — true to size",
//       "Horn-style button closure",
//       "Made in Portugal",
//     ],
//     colors: [
//       { name: "Terracotta", hex: "#BA704F" },
//       { name: "Ivory", hex: "#F2E1D9" },
//       { name: "Charcoal", hex: "#3D2115" },
//     ],
//     sizes: ["XS", "S", "M", "L", "XL"],
//     images: [
//       "https://picsum.photos/seed/whiold-a/900/1100",
//       "https://picsum.photos/seed/whiold-b/900/1100",
//       "https://picsum.photos/seed/whiold-c/900/1100",
//       "https://picsum.photos/seed/whiold-d/900/1100",
//     ],
//   },
// };

/**
 * ProductDetail
 * -------------
 * Product data teen jagah se aa sakta hai (priority order):
 * 1. `product` prop (direct pass)
 * 2. `location.state.product` (ProductCard se navigate karte waqt bheja gaya)
 * 3. `MOCK_PRODUCTS[id]` fallback (demo / direct URL visit)
 */
const ProductDetail = ({ product: productProp, onAddToCart }) => {
  const { id } = useParams();
  const { state } = useLocation();

 const product =
  productProp ||
  state?.product ||
  products.find((item) => item.id === Number(id));

  const [imgIndex, setImgIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState(false);
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);

  const imgRefs = useRef([]);
  const galleryRef = useRef(null);
  // NEW: zoom box ka ref — mousemove ka position isi box ke relative calculate hoga
  const zoomBoxRef = useRef(null);
  const infoRef = useRef(null);
  const addBarRef = useRef(null);

  // ── Entrance animation — gallery aur info panel thoda alag timing se fade+rise hote hain ──
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([galleryRef.current, infoRef.current], { opacity: 0, y: 22 });
      gsap.to(galleryRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: "power3.out",
      });
      gsap.to(infoRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: "power3.out",
        delay: 0.12,
      });
    });
    return () => ctx.revert();
  }, [product.id]);

  const goTo = (index) => {
    const clamped = (index + product.images.length) % product.images.length;
    if (clamped === imgIndex) return;
    gsap.to(imgRefs.current[imgIndex], {
      opacity: 0,
      duration: 0.25,
      ease: "power2.out",
    });
    gsap.fromTo(
      imgRefs.current[clamped],
      { opacity: 0 },
      { opacity: 1, duration: 0.35, ease: "power2.out" },
    );
    // Naya image active hone par purane wale ka zoom-scale reset kar do
    gsap.set(imgRefs.current[imgIndex], {
      scale: 1,
      transformOrigin: "50% 50%",
    });
    setImgIndex(clamped);
  };

  // ── NEW: hover-zoom handlers (Amazon/Flipkart jaisa smooth cursor-follow zoom) ──
  const handleImageMouseEnter = () => {
    const activeImg = imgRefs.current[imgIndex];
    if (!activeImg) return;
    gsap.to(activeImg, { scale: 1.7, duration: 0.45, ease: "power3.out" });
  };

  const handleImageMouseMove = (e) => {
    const activeImg = imgRefs.current[imgIndex];
    const box = zoomBoxRef.current;
    if (!activeImg || !box) return;
    const rect = box.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
    gsap.to(activeImg, {
      transformOrigin: `${xPercent}% ${yPercent}%`,
      duration: 0.35,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const handleImageMouseLeave = () => {
    const activeImg = imgRefs.current[imgIndex];
    if (!activeImg) return;
    gsap.to(activeImg, {
      scale: 1,
      transformOrigin: "50% 50%",
      duration: 0.5,
      ease: "power3.out",
    });
  };

  const handleAddToCart = () => {
    if (product.sizes?.length && !selectedSize) {
      setSizeError(true);
      gsap.fromTo(
        addBarRef.current,
        { x: -6 },
        { x: 0, duration: 0.4, ease: "elastic.out(1, 0.4)" },
      );
      return;
    }
    setSizeError(false);
    gsap.fromTo(
      addBarRef.current,
      { scale: 0.97 },
      { scale: 1, duration: 0.3, ease: "back.out(3)" },
    );

    const payload = { product, color: selectedColor, size: selectedSize, qty };
    if (onAddToCart) onAddToCart(payload);
    else console.log("Added to cart:", payload);
  };

  return (
    <div className="min-h-screen bg-[var(--whiold-bg-soft)] pb-28 md:pb-10">
      <div className="mx-auto max-w-[1180px] px-4 py-5 sm:px-6">
        {/* ── Breadcrumb ── */}
        <Breadcrumbs
          separator={
            <ChevronRight
              size={12}
              className="text-[var(--whiold-text-muted)]"
            />
          }
          className="mb-5"
        >
          {/* <Link to="/" className="text-[12px] text-[var(--whiold-text-muted)] no-underline hover:text-[var(--whiold-primary)]">
            Home
          </Link> */}
          <span className="text-[12px] text-[var(--whiold-text-muted)]">
            {product.category}
          </span>
          <span className="text-[12px] font-medium text-[var(--whiold-text-heading)]">
            {product.name}
          </span>
        </Breadcrumbs>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
          {/* ══ GALLERY ══ */}

          <div
            ref={galleryRef}
            className="md:sticky md:top-24 md:self-start mx-auto w-full max-w-[380px] md:max-w-[420px]"
          >
            <div
              ref={zoomBoxRef}
              onMouseEnter={handleImageMouseEnter}
              onMouseMove={handleImageMouseMove}
              onMouseLeave={handleImageMouseLeave}
              className="relative h-[300px] sm:h-[340px] md:h-[380px] lg:h-[420px] overflow-hidden rounded-[var(--whiold-radius-lg)] border border-[var(--whiold-border)] bg-white cursor-zoom-in"
            >
              {product.images.map((src, i) => (
                <img
                  key={src}
                  ref={(el) => (imgRefs.current[i] = el)}
                  src={src}
                  alt={`${product.name} ${i + 1}`}
                  className={`absolute inset-0 h-full w-full object-cover will-change-transform ${
                    i === 0 ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}

              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => goTo(imgIndex - 1)}
                    className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-transform duration-200 hover:scale-110"
                  >
                    <ChevronLeft
                      size={17}
                      className="text-[var(--whiold-text-heading)]"
                    />
                  </button>
                  <button
                    onClick={() => goTo(imgIndex + 1)}
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-transform duration-200 hover:scale-110"
                  >
                    <ChevronRight
                      size={17}
                      className="text-[var(--whiold-text-heading)]"
                    />
                  </button>
                </>
              )}

              <IconButton
                onClick={() => setWishlisted((w) => !w)}
                className="!absolute !right-3 !top-3 !h-9 !w-9 !bg-white/90 backdrop-blur-sm"
              >
                <Heart
                  size={16}
                  fill={wishlisted ? "var(--whiold-primary)" : "none"}
                  className="text-[var(--whiold-primary)]"
                />
              </IconButton>
            </div>

            {product.images.length > 1 && (
              <div className="mt-3 flex gap-2.5">
                {product.images.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => goTo(i)}
                    className={`h-16 w-14 flex-shrink-0 overflow-hidden rounded-[10px] border-2 transition-colors duration-200 ${
                      i === imgIndex
                        ? "border-[var(--whiold-primary)]"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={src}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ══ INFO ══ */}
          <div ref={infoRef}>
            <p className="m-0 text-[11px] font-medium uppercase tracking-wider text-[var(--whiold-text-muted)]">
              {product.brand}
            </p>
            <h1 className="m-0 mt-1 text-2xl font-bold text-[var(--whiold-text-heading)] sm:text-[28px]">
              {product.name}
            </h1>

            {product.rating != null && (
              <div className="mt-2 flex items-center gap-2">
                <Rating
                  value={product.rating}
                  readOnly
                  precision={0.5}
                  size="small"
                  sx={{ color: "var(--whiold-primary)" }}
                />
                <span className="text-[12px] text-[var(--whiold-text-muted)]">
                  {product.rating} ({product.reviewCount || 0} reviews)
                </span>
              </div>
            )}

            <div className="mt-4 flex items-baseline gap-2.5">
              {product.price != null ? (
                <>
                  <span className="text-[26px] font-bold text-[var(--whiold-text-heading)]">
                    ₹{product.price}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-[15px] text-[var(--whiold-text-muted)] line-through">
                        ₹{product.originalPrice}
                      </span>
                      <Chip
                        label={`${Math.round((1 - product.price / product.originalPrice) * 100)}% OFF`}
                        size="small"
                        className="!bg-[var(--whiold-primary-soft)] !text-[10px] !font-semibold !text-[var(--whiold-primary-hover)]"
                      />
                    </>
                  )}
                </>
              ) : (
                <span className="text-[15px] font-medium text-[var(--whiold-text-muted)]">
                  Price on request
                </span>
              )}
            </div>

            <p className="mt-4 text-[13.5px] leading-relaxed text-[var(--whiold-text-body)]">
              {product.description}
            </p>

            <Divider className="!my-5 !border-[var(--whiold-border)]" />

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="mb-5">
                <p className="mb-2 text-[12px] font-semibold text-[var(--whiold-text-heading)]">
                  Color —{" "}
                  <span className="font-normal text-[var(--whiold-text-muted)]">
                    {selectedColor}
                  </span>
                </p>
                <div className="flex gap-2.5">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      title={c.name}
                      className={`h-8 w-8 rounded-full border-2 transition-all duration-200 ${
                        selectedColor === c.name
                          ? "scale-110 border-[var(--whiold-primary)]"
                          : "border-transparent hover:scale-105"
                      }`}
                      style={{
                        backgroundColor: c.hex,
                        boxShadow: "0 0 0 1px var(--whiold-border)",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div className="mb-5">
                <div className="mb-2 flex items-center justify-between">
                  <p className="m-0 text-[12px] font-semibold text-[var(--whiold-text-heading)]">
                    Size
                  </p>
                  <button className="text-[11px] font-medium text-[var(--whiold-primary)] underline-offset-2 hover:underline">
                    Size guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSelectedSize(s);
                        setSizeError(false);
                      }}
                      className={`flex h-9 min-w-[38px] items-center justify-center rounded-[10px] border px-3 text-[12.5px] font-medium transition-colors duration-200 ${
                        selectedSize === s
                          ? "border-[var(--whiold-primary)] bg-[var(--whiold-primary)] text-white"
                          : "border-[var(--whiold-border)] text-[var(--whiold-text-body)] hover:border-[var(--whiold-primary)]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {sizeError && (
                  <p className="mt-1.5 text-[11px] text-rose-500">
                    Please select a size
                  </p>
                )}
              </div>
            )}

            {/* Quantity + Add to cart (desktop) */}
            <div ref={addBarRef} className="mt-6 flex items-center gap-3">
              <div className="flex h-12 items-center rounded-[var(--whiold-radius-md)] border border-[var(--whiold-border)]">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex h-full w-10 items-center justify-center text-[var(--whiold-text-body)] hover:text-[var(--whiold-primary)]"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-[13px] font-semibold text-[var(--whiold-text-heading)]">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="flex h-full w-10 items-center justify-center text-[var(--whiold-text-body)] hover:text-[var(--whiold-primary)]"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="hidden h-12 flex-1 items-center justify-center gap-2 rounded-[var(--whiold-radius-md)] text-[13px] font-semibold uppercase tracking-wide text-white shadow-[var(--whiold-shadow-btn)] transition-transform duration-200 hover:scale-[1.01] active:scale-[0.98] md:flex"
                style={{ backgroundImage: "var(--whiold-gradient-brand)" }}
              >
                <ShoppingBag size={15} /> Add to Cart
              </button>

              <IconButton className="!hidden !h-12 !w-12 !flex-shrink-0 !rounded-[var(--whiold-radius-md)] !border !border-[var(--whiold-border)] md:!flex">
                <Share2 size={16} className="text-[var(--whiold-text-body)]" />
              </IconButton>
            </div>

            {/* Trust badges */}
            <div className="mt-6 grid grid-cols-3 gap-2 rounded-[var(--whiold-radius-md)] border border-[var(--whiold-border)] bg-white p-3">
              <div className="flex flex-col items-center gap-1 text-center">
                <Truck size={16} className="text-[var(--whiold-primary)]" />
                <span className="text-[9.5px] font-medium text-[var(--whiold-text-muted)]">
                  Free shipping
                </span>
              </div>
              <div className="flex flex-col items-center gap-1 border-x border-[var(--whiold-border)] text-center">
                <RotateCcw size={16} className="text-[var(--whiold-primary)]" />
                <span className="text-[9.5px] font-medium text-[var(--whiold-text-muted)]">
                  30-day returns
                </span>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <ShieldCheck
                  size={16}
                  className="text-[var(--whiold-primary)]"
                />
                <span className="text-[9.5px] font-medium text-[var(--whiold-text-muted)]">
                  Secure checkout
                </span>
              </div>
            </div>

            {/* Details accordion */}
            {product.details?.length > 0 && (
              <Accordion
                elevation={0}
                defaultExpanded
                className="!mt-5 !rounded-[var(--whiold-radius-md)] !border !border-[var(--whiold-border)] !bg-white before:!hidden"
              >
                <AccordionSummary
                  expandIcon={
                    <ChevronDown
                      size={16}
                      className="text-[var(--whiold-text-muted)]"
                    />
                  }
                >
                  <span className="text-[12.5px] font-semibold text-[var(--whiold-text-heading)]">
                    Product details
                  </span>
                </AccordionSummary>
                <AccordionDetails>
                  <ul className="m-0 flex list-none flex-col gap-1.5 pl-0">
                    {product.details.map((d) => (
                      <li
                        key={d}
                        className="text-[12.5px] text-[var(--whiold-text-body)] before:mr-2 before:text-[var(--whiold-primary)] before:content-['—']"
                      >
                        {d}
                      </li>
                    ))}
                  </ul>
                </AccordionDetails>
              </Accordion>
            )}
          </div>
        </div>
      </div>

      {/* ── Sticky mobile add-to-cart bar ── */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-[var(--whiold-border)] bg-white/95 px-4 py-3 backdrop-blur-md md:hidden">
        <div>
          <p className="m-0 text-[10px] text-[var(--whiold-text-muted)]">
            Total
          </p>
          <p className="m-0 text-[15px] font-bold text-[var(--whiold-text-heading)]">
            ₹{((product.price ?? 0) * qty).toFixed(2)}
          </p>
        </div>
        <button
          onClick={handleAddToCart}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-[var(--whiold-radius-md)] text-[13px] font-semibold uppercase tracking-wide text-white shadow-[var(--whiold-shadow-btn)]"
          style={{ backgroundImage: "var(--whiold-gradient-brand)" }}
        >
          <ShoppingBag size={15} /> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
