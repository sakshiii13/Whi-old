import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, MoveHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

const COLLECTIONS = [
  {
    id: "wedding-edit",
    title: "The Wedding Edit",
    tagline: "Heirloom silhouettes, reimagined",
    count: 42,
    slug: "wedding-edit",
    image:
      "https://images.unsplash.com/photo-1610189844343-9c4f79952c53?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "festive-luxe",
    title: "Festive Luxe",
    tagline: "Zari, velvet & warm gold",
    count: 36,
    slug: "festive-luxe",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "contemporary-fusion",
    title: "Contemporary Fusion",
    tagline: "Drapes for the modern day",
    count: 51,
    slug: "contemporary-fusion",
    image:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "minimal-essentials",
    title: "Minimal Essentials",
    tagline: "Quiet luxury, everyday",
    count: 28,
    slug: "minimal-essentials",
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "winter-drapes",
    title: "Winter Drapes",
    tagline: "Layered warmth, rich texture",
    count: 19,
    slug: "winter-drapes",
    image:
      "https://images.unsplash.com/photo-1608234808654-2a8875faa7fd?q=80&w=1200&auto=format&fit=crop",
  },
];

/* ---------- Animation variants ---------- */
const headingWord = {
  hidden: { y: "110%" },
  show: (i) => ({
    y: "0%",
    transition: { duration: 0.7, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] },
  }),
};

const curtainVariants = {
  hidden: {},
  show: {},
};

/* ============================================================
   Single collection card — handles its own hover-tilt state and
   its own scroll-triggered curtain reveal (useInView per-card so
   each one un-drapes as it scrolls into the viewport).
   ============================================================ */
function CollectionCard({ item, index }) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-10% 0px" });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Lightweight magnetic tilt — subtle, premium, not gimmicky (max ~5deg)
  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -6, y: px * 6 });
  };
  const resetTilt = () => setTilt({ x: 0, y: 0 });

  return (
    <motion.div
      ref={cardRef}
      className="whiold-collections-card whiold-foil-border"
      style={{
        width: 300,
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(14px)",
        borderRadius: "var(--whiold-radius-lg)",
        overflow: "hidden",
        boxShadow: "var(--whiold-shadow-card)",
      }}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      whileHover={{ y: -6 }}
    >
      <Link to={`/shop?collection=${item.slug}`} className="block">
        {/* ---------- Image + curtain reveal ---------- */}
        <div className="relative h-[380px] overflow-hidden">
          <motion.img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover"
            initial={{ scale: 1.18 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.08 }}
          />

          {/* Two curtain panels — start fully closed, part outward on scroll-into-view */}
          <motion.div
            className="whiold-curtain-l"
            initial={{ scaleX: 1 }}
            animate={isInView ? { scaleX: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15 * index, ease: [0.65, 0, 0.35, 1] }}
          />
          <motion.div
            className="whiold-curtain-r"
            initial={{ scaleX: 1 }}
            animate={isInView ? { scaleX: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15 * index, ease: [0.65, 0, 0.35, 1] }}
          />

          {/* Bottom gradient so title stays legible over any image */}
          <div
            className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none"
            style={{ background: "linear-gradient(180deg, transparent 0%, rgba(43,33,25,0.9) 100%)" }}
          />

          {/* Item count pill */}
          <span
            className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium"
            style={{
              background: "rgba(255,255,255,0.14)",
              color: "var(--whiold-text-on-primary)",
              border: "1px solid rgba(255,255,255,0.25)",
              backdropFilter: "blur(6px)",
            }}
          >
            {item.count} pieces
          </span>

          {/* Title block */}
          <div className="absolute inset-x-0 bottom-0 p-6">
            <h3
              className="text-xl font-semibold mb-1"
              style={{ color: "var(--whiold-text-on-primary)" }}
            >
              {item.title}
            </h3>
            <div className="flex items-center justify-between">
              <p className="text-sm" style={{ color: "var(--whiold-100)" }}>
                {item.tagline}
              </p>
              <motion.span
                whileHover={{ x: 3, y: -3 }}
                className="flex-shrink-0 ml-3 rounded-full p-1.5"
                style={{ background: "var(--whiold-gradient-brand)" }}
              >
                <ArrowUpRight size={16} color="var(--whiold-text-on-primary)" />
              </motion.span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ============================================================
   MAIN EXPORT
   ============================================================ */
export default function Collections() {
  const trackRef = useRef(null);

  return (
    <section className="relative w-full py-24 md:py-32 overflow-hidden">
      {/* ---------- FIXED BACKGROUND (stays put while page scrolls) ---------- */}
      <div className="whiold-collections-bg" aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1594633313739-9dabdaa8e5aa?q=80&w=1920&auto=format&fit=crop"
          alt=""
        />
        <div className="whiold-collections-scrim" />
        <div className="whiold-collections-grain" />
      </div>

      {/* ---------- CONTENT (scrolls normally over the fixed bg) ---------- */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="uppercase tracking-[0.25em] text-lg font-medium mb-4"
          style={{ color: "var(--whiold-900)" }}
        >
          Whiold &nbsp;·&nbsp; Atelier Drops
        </motion.p>

        {/* Heading — each word masks up from below on load */}
        <h2
          className="flex flex-wrap gap-x-3 text-4xl md:text-6xl font-semibold mb-4 leading-[1.05]"
          style={{ color: "var(--whiold-text-on-primary)" }}
        >
          {["Curated,", "not", "catalogued."].map((word, i) => (
            <span key={word} className="overflow-hidden inline-block">
              <motion.span
                custom={i}
                initial="hidden"
                animate="show"
                variants={headingWord}
                className="inline-block"
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-md text-base mb-14"
          style={{ color: "var(--whiold-200)" }}
        >
          Five drops, each built around a single idea — from wedding heirlooms
          to everyday minimalism. Scroll sideways to browse the rack.
        </motion.p>

        {/* Drag hint — appears once, fades with first scroll interaction */}
        <div
          className="flex items-center gap-2 mb-6 text-xs md:hidden"
          style={{ color: "var(--whiold-300)" }}
        >
          <MoveHorizontal size={14} />
          Swipe to explore
        </div>

        {/* ---------- Horizontal snap-scroll gallery ---------- */}
        <div ref={trackRef} className="whiold-collections-track">
          {COLLECTIONS.map((item, i) => (
            <CollectionCard key={item.id} item={item} index={i} />
          ))}

          {/* Trailing "view all" card, matches card sizing so the row ends cleanly */}
          <Link
            to="/shop"
            className="whiold-collections-card flex-shrink-0 flex flex-col items-center justify-center gap-3 text-center"
            style={{
              width: 300,
              height: 380,
              borderRadius: "var(--whiold-radius-lg)",
              border: "1px dashed rgba(242,225,217,0.35)",
              color: "var(--whiold-100)",
            }}
          >
            <span className="text-lg font-medium">View all collections</span>
            <ArrowUpRight size={22} />
          </Link>
        </div>
      </div>
    </section>
  );
}