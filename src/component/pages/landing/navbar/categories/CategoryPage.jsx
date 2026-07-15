import React, { useState, useRef, useMemo, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { Sparkles, ArrowRight, ChevronRight } from "lucide-react";
import { Router } from "../../../../../constants/router";
import ProductCard from "../../ProductCard";
import { useParams } from "react-router-dom";


const HERO_IMAGE =
  "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1800&auto=format&fit=crop";

const SUBCATEGORIES = [
  {
    name: "Kurtas",
    image:
      "/public/kurta.jpg",
  },
  {
    name: "Sherwanis",
    image:
      "/public/shervani/shervani1.jpg",
  },
  {
    name: "Nehru Jackets",
    image:
      "/public/nehru.jpg",
  },
  {
    name: "Bandhgalas",
    image:
      "/public/bandhgalas.jpg",
  },
  {
    name: "Casual Fits",
    image:
      "/public/casual.jpg",
  },
];

const PROMO_BANNERS = [
  {
    title: "The Wedding Edit",
    subtitle: "Sherwanis & bandhgalas cut for the big day",
    sub: "Sherwanis",
    image:
      "/public/shervani/shervani1.jpg",
  },
  {
    title: "Everyday Comfort",
    subtitle: "Kurtas & casual fits, made to move with you",
    sub: "Kurtas",
    image:
      "/public/kurta.jpg",
  },
];

// ── Mock catalogue — wire this up to your real product API/store ──
const MEN_PRODUCTS = [
  {
    id: 101,
    category: "Men",
    subcategory: "Kurtas",
    brand: "Whiold Atelier",
    name: "Chikankari Cotton Kurta",
    price: 1499,
    originalPrice: 1999,
    rating: 4.4,
    reviewCount: 89,
    badge: "Bestseller",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Ivory", hex: "#F2E1D9" },
      { name: "Sage", hex: "#8A9A7E" },
    ],
    description:
      "Hand-embroidered chikankari work on breathable cotton — a warm-weather staple built for festive and everyday wear alike.",
    details: ["100% pure cotton", "Hand chikankari embroidery", "Regular fit", "Made in Lucknow"],
    images: [
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=900&auto=format&fit=crop",
    ],
  },
  {
    id: 102,
    category: "Men",
    subcategory: "Kurtas",
    brand: "Whiold Atelier",
    name: "Linen Straight Kurta",
    price: 1299,
    rating: 4.2,
    reviewCount: 54,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [{ name: "Charcoal", hex: "#3D2115" }],
    description:
      "A relaxed straight-cut kurta in pure linen, breathable and effortless — built for humid afternoons and easy layering.",
    details: ["100% linen", "Straight fit", "Side slits", "Made in Jaipur"],
    images: [
      "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=900&auto=format&fit=crop",
    ],
  },
  {
    id: 103,
    category: "Men",
    subcategory: "Sherwanis",
    brand: "Whiold Atelier",
    name: "Zari Embroidered Sherwani",
    price: 6999,
    originalPrice: 8999,
    rating: 4.7,
    reviewCount: 132,
    badge: "Trending",
    sizes: ["M", "L", "XL"],
    colors: [
      { name: "Maroon", hex: "#6E1F2B" },
      { name: "Gold", hex: "#C9A24B" },
    ],
    description:
      "Statement zari embroidery on a structured silhouette — the centrepiece for a wedding wardrobe.",
    details: ["Silk blend fabric", "Hand zari embroidery", "Comes with matching stole", "Dry clean only"],
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=900&auto=format&fit=crop",
    ],
  },
  {
    id: 104,
    category: "Men",
    subcategory: "Sherwanis",
    brand: "Whiold Atelier",
    name: "Silk Blend Wedding Sherwani",
    price: 8499,
    rating: 4.6,
    reviewCount: 77,
    sizes: ["M", "L", "XL"],
    colors: [{ name: "Ivory", hex: "#F2E1D9" }],
    description:
      "Understated silk-blend sherwani with a tailored fit — for the groom who prefers quiet luxury over shine.",
    details: ["Silk blend", "Tailored fit", "Concealed button placket", "Made in Varanasi"],
    images: [
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?q=80&w=900&auto=format&fit=crop",
    ],
  },
  {
    id: 105,
    category: "Men",
    subcategory: "Nehru Jackets",
    brand: "Whiold Atelier",
    name: "Textured Nehru Jacket",
    price: 2199,
    originalPrice: 2799,
    rating: 4.3,
    reviewCount: 41,
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Charcoal", hex: "#3D2115" }],
    description: "A textured weave Nehru jacket that layers over kurtas or shirts alike — festive, not fussy.",
    details: ["Textured cotton blend", "Mandarin collar", "Two front pockets", "Made in India"],
    images: [
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?q=80&w=900&auto=format&fit=crop",
    ],
  },
  {
    id: 106,
    category: "Men",
    subcategory: "Bandhgalas",
    brand: "Whiold Atelier",
    name: "Velvet Bandhgala Set",
    price: 5499,
    rating: 4.5,
    reviewCount: 63,
    badge: "New",
    sizes: ["M", "L", "XL"],
    colors: [{ name: "Maroon", hex: "#6E1F2B" }],
    description:
      "A velvet bandhgala with a structured collar and matching trousers — evening-ready from the first fitting.",
    details: ["Velvet outer, satin lining", "Matching trousers included", "Structured collar", "Dry clean only"],
    images: [
      "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?q=80&w=900&auto=format&fit=crop",
    ],
  },
  {
    id: 107,
    category: "Men",
    subcategory: "Casual Fits",
    brand: "Whiold Atelier",
    name: "Relaxed Fit Shirt-Kurta",
    price: 999,
    rating: 4.1,
    reviewCount: 36,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Sage", hex: "#8A9A7E" },
      { name: "Ivory", hex: "#F2E1D9" },
    ],
    description: "Somewhere between a shirt and a kurta — a weekend piece that goes from errands to dinner.",
    details: ["Cotton poplin", "Curved hem", "Relaxed fit", "Machine washable"],
    images: [
      "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=900&auto=format&fit=crop",
    ],
  },
  {
    id: 108,
    category: "Men",
    subcategory: "Casual Fits",
    brand: "Whiold Atelier",
    name: "Everyday Cotton Co-ord",
    price: 1799,
    originalPrice: 2199,
    rating: 4.3,
    reviewCount: 58,
    sizes: ["S", "M", "L"],
    colors: [{ name: "Charcoal", hex: "#3D2115" }],
    description: "A matching cotton co-ord set built for warm days — light, breathable, zero fuss.",
    details: ["100% cotton", "Matching set", "Elasticated waist", "Made in India"],
    images: [
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=900&auto=format&fit=crop",
    ],
  },
];

const FRAUNCES = { fontFamily: "'Fraunces', serif", fontWeight: 500 };

const CATEGORY_INFO = {
  men: {
    title: "Tailored",
    highlight: "for him.",
    description:
      "From festive bandhgalas to everyday kurtas — pieces built for how he actually lives.",
    button: "Shop Men's Collection",

  },

  women: {
    title: "Designed",
    highlight: "for her.",
    description:
      "Elegant sarees, lehengas and everyday styles crafted with timeless grace.",
    button: "Shop Women's Collection",
  },

  kids: {
    title: "Made",
    highlight: "for little ones.",
    description:
      "Comfortable, playful and festive outfits for every celebration.",
    button: "Shop Kids Collection",
  },

  sports: {
    title: "Built",
    highlight: "to perform.",
    description:
      "Activewear and sports essentials designed for movement and comfort.",
    button: "Shop Sports Collection",
  },

  accessories: {
    title: "Complete",
    highlight: "your look.",
    description:
      "Premium accessories that elevate every outfit.",
    button: "Shop Accessories",
  },
};

const CategoryPage = () => {
  const { category } = useParams();
  const pageData = CATEGORY_INFO[category] || CATEGORY_INFO.men;
  const [activeSub, setActiveSub] = useState("All");

  const heroRef = useRef(null);
  const pillsRef = useRef(null);
  const promoRef = useRef(null);
  const gridRef = useRef(null);
  const gridSectionRef = useRef(null);

  // ── Fraunces font — skip if already injected elsewhere (e.g. HeroSection) ──
  useLayoutEffect(() => {
    if (document.getElementById("whiold-fraunces-font")) return;
    const link = document.createElement("link");
    link.id = "whiold-fraunces-font";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;1,9..144,500&display=swap";
    document.head.appendChild(link);
  }, []);

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ── Entrance animations ──
  useLayoutEffect(() => {
    if (reduceMotion) return;
    const ctx = gsap.context(() => {
      gsap.set(heroRef.current, { opacity: 0, y: 24 });
      gsap.to(heroRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.1 });

      if (pillsRef.current) {
        gsap.set(pillsRef.current.children, { opacity: 0, y: 14 });
        gsap.to(pillsRef.current.children, {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.06,
          ease: "power2.out",
          delay: 0.15,
        });
      }

      if (promoRef.current) {
        gsap.set(promoRef.current.children, { opacity: 0, y: 20 });
        gsap.to(promoRef.current.children, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        });
      }
    });
    return () => ctx.revert();
  }, []);

  // ── Re-run a light fade-in whenever the filtered set changes ──
  useLayoutEffect(() => {
    if (reduceMotion || !gridRef.current) return;
    gsap.fromTo(
      gridRef.current.children,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.04, ease: "power2.out" },
    );
  }, [activeSub]);

  const filteredProducts = useMemo(
    () => (activeSub === "All" ? MEN_PRODUCTS : MEN_PRODUCTS.filter((p) => p.subcategory === activeSub)),
    [activeSub],
  );

  const handleSelectSub = (name) => setActiveSub(name);

  const scrollToGrid = () =>
    gridSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <section className="w-full" style={{ background: "var(--whiold-bg)" }}>
      {/* ══ HERO ══ */}
      <div className="relative w-full overflow-hidden" style={{ height: "clamp(420px, 62dvh, 640px)" }}>
        <img
          src={HERO_IMAGE}
          alt="Men's collection"
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(20,14,10,0.1) 20%, rgba(20,14,10,0.78) 100%), linear-gradient(90deg, rgba(20,14,10,0.5) 0%, rgba(20,14,10,0) 60%)",
          }}
          aria-hidden="true"
        />

        <div className="absolute inset-0 flex flex-col justify-end px-4 pb-10 sm:px-8 sm:pb-14 lg:px-16 lg:pb-16">
          <nav className="mb-3 flex items-center gap-1.5 text-[11px] font-medium text-white/70">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight size={11} />
        <span className="text-white">
  {category.charAt(0).toUpperCase() + category.slice(1)}
</span>
          </nav>

          <div ref={heroRef} className="max-w-[540px]">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
              <Sparkles size={13} className="text-[#E8B98F]" />
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white/85">
                New Season Edit
              </span>
            </div>

   <h1
  className="m-0 text-[38px] leading-[1.05] text-white sm:text-[52px] lg:text-[62px]"
  style={FRAUNCES}
>
  {pageData.title}{" "}
  <em
    className="italic text-[#E8B98F]"
    style={{ fontWeight: 500 }}
  >
    {pageData.highlight}
  </em>
</h1>

           <p className="mt-4 max-w-[420px] text-[14.5px] leading-relaxed text-white/75">
  {pageData.description}
</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={scrollToGrid}
                className="group inline-flex items-center gap-2 rounded-[var(--whiold-radius-md)] bg-white px-6 py-3.5 text-[13px] font-semibold uppercase tracking-wide shadow-lg transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{ color: "var(--whiold-primary)" }}
              >
                 {pageData.button}
                <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══ SUBCATEGORY QUICK-NAV ══ */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-8 lg:px-16">
        <h2 className="m-0 mb-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--whiold-text-muted)]">
          Shop by Category
        </h2>
        <div
          ref={pillsRef}
          className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <button
            type="button"
            onClick={() => handleSelectSub("All")}
            className="flex flex-shrink-0 flex-col items-center gap-2"
          >
            <span
              className={`flex h-16 w-16 items-center justify-center rounded-full border-1 text-[11px] font-semibold uppercase tracking-wide transition-all duration-200 sm:h-20 sm:w-20 ${
                activeSub === "All"
                  ? "border-[var(--whiold-primary)] bg-[var(--whiold-primary-soft)] text-[var(--whiold-primary)] scale-105"
                  : "border-[var(--whiold-border)] text-[var(--whiold-text-muted)] hover:border-[var(--whiold-primary)]"
              }`}
            >
              All
            </span>
            <span
              className={`text-[11.5px] font-medium ${
                activeSub === "All" ? "text-[var(--whiold-primary)]" : "text-[var(--whiold-text-body)]"
              }`}
            >
              Everything
            </span>
          </button>

          {SUBCATEGORIES.map((sub) => (
            <button
              key={sub.name}
              type="button"
              onClick={() => handleSelectSub(sub.name)}
              className="flex flex-shrink-0 flex-col items-center gap-2"
            >
              <span
                className={`block h-16 w-16 overflow-hidden rounded-full border-2 transition-all duration-200 sm:h-20 sm:w-20 ${
                  activeSub === sub.name
                    ? "border-[var(--whiold-primary)] scale-105"
                    : "border-transparent opacity-80 hover:opacity-100"
                }`}
              >
                <img src={sub.image} alt={sub.name} className="h-full w-full object-cover" draggable={false} />
              </span>
              <span
                className={`whitespace-nowrap text-[11.5px] font-medium ${
                  activeSub === sub.name ? "text-[var(--whiold-primary)]" : "text-[var(--whiold-text-body)]"
                }`}
              >
                {sub.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ══ PROMO SPLIT BANNER ══ */}
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-8 lg:px-16">
        <div ref={promoRef} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PROMO_BANNERS.map((b) => (
            <button
              key={b.title}
              type="button"
              onClick={() => {
                handleSelectSub(b.sub);
                scrollToGrid();
              }}
              className="group relative block h-[240px] w-full overflow-hidden rounded-[var(--whiold-radius-lg)] text-left sm:h-[300px]"
            >
              <img
                src={b.image}
                alt={b.title}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                draggable={false}
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(0deg, rgba(20,14,10,0.75) 0%, rgba(20,14,10,0.1) 55%, rgba(20,14,10,0) 100%)",
                }}
              />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <h3 className="m-0 text-[21px] text-white sm:text-[25px]" style={FRAUNCES}>
                  {b.title}
                </h3>
                <p className="mt-1 max-w-[280px] text-[12.5px] text-white/80">{b.subtitle}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-wide text-white">
                  Shop now
                  <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ══ PRODUCT GRID ══ */}
      <div ref={gridSectionRef} className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-16 sm:px-8 lg:px-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="m-0 text-[23px] text-[var(--whiold-text-heading)] sm:text-[27px]" style={FRAUNCES}>
              {activeSub === "All" ? "Trending in Men" : activeSub}
            </h2>
            <p className="mt-1 text-[13px] text-[var(--whiold-text-muted)]">
              {filteredProducts.length} {filteredProducts.length === 1 ? "piece" : "pieces"}
            </p>
          </div>
          <Link
            to={`${Router.CATEGORY}?category=men`}
            className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold uppercase tracking-wide text-[var(--whiold-primary)] transition-colors hover:text-[var(--whiold-primary-hover)]"
          >
            View all
            <ArrowRight size={13} />
          </Link>
        </div>

        {filteredProducts.length > 0 ? (
          <div ref={gridRef} className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-1.5 rounded-[var(--whiold-radius-lg)] border border-dashed border-[var(--whiold-border)] py-16 text-center">
            <p className="m-0 text-[14px] font-medium text-[var(--whiold-text-heading)]">No pieces here yet</p>
            <p className="m-0 text-[12.5px] text-[var(--whiold-text-muted)]">
              Check back soon, or explore another category above.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryPage;