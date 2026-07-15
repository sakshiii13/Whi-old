import React from "react";
import { Typography } from "@mui/material";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard"; 

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// ── Editorial products — caption image ke ANDAR overlay hoga, price bhi wahi ──
const editProducts = {
  throwMain: {
    id: "edit-woven-throw",
    name: "Woven Throw",
    caption: "1. Woven Throw & Model",
    category: "Home",
    brand: "Whiold Home",
    price: 78,
    rating: 4.6,
    reviewCount: 42,
    description: "A soft, textured throw woven from natural fibers — cozy layering for any room.",
    images: ["/theEdit/home.jpg"],
  },
  pitcherCrop: {
    id: "edit-pitcher-crop",
    name: "Ceramic Pitcher",
    caption: "Ceramic Pitcher",
    category: "Home",
    brand: "Whiold Home",
    price: 42,
    rating: 4.4,
    reviewCount: 18,
    description: "Hand-finished ceramic pitcher with a matte glaze.",
    images: ["/theEdit/home1.jpg"],
  },
  mugCopper: {
    id: "edit-mug-copper",
    name: "Ceramic Mug Duo",
    category: "Home",
    brand: "Whiold Home",
    price: 34,
    rating: 4.7,
    reviewCount: 25,
    description: "A set of two ceramic mugs with a warm copper-toned glaze.",
    images: ["/theEdit/home2.jpg"],
  },
  basket: {
    id: "edit-basket",
    name: "Handwoven Basket",
    caption: "Handwoven Basket",
    category: "Home",
    brand: "Whiold Home",
    price: 65,
    rating: 4.8,
    reviewCount: 33,
    description: "Handwoven storage basket made from natural seagrass fiber.",
    images: ["/theEdit/home3.jpg"],
  },
  towel: {
    id: "edit-towel",
    name: "Bath Towel Set",
    caption: "Bath Towel Set",
    category: "Home",
    brand: "Whiold Home",
    price: 90,
    rating: 4.5,
    reviewCount: 51,
    description: "A plush 3-piece bath towel set made from long-staple cotton.",
    images: ["/theEdit/home4.jpg"],
  },
  mugCandle: {
    id: "edit-mug-candle",
    name: "Ceramic Mug & Candle",
    caption: "2. Ceramic Mug & Candle",
    category: "Home",
    brand: "Whiold Home",
    price: 48,
    rating: 4.6,
    reviewCount: 29,
    description: "A ceramic mug paired with a hand-poured soy candle.",
    images: ["/theEdit/home5.jpg"],
  },
};

const TheEditSection = () => {
  return (
    <section className="bg-[var(--whiold-bg)] px-4 py-16 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-[1180px]">
        <Typography
          component="h2"
          className="!mb-8"
          sx={{
            fontSize: { xs: "24px", md: "35px" },
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--whiold-text-heading)",
             textAlign: "center",
          }}
        >
          The Edit
        </Typography>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:items-start lg:gap-6 lg:grid-cols-[1.5fr_1fr_1fr_1.5fr]"
        >
          {/* ── Decorative solid circle — cards ke peeche, sirf gaps se peek karta hai ── */}
          <div
            className="pointer-events-none absolute z-0 hidden rounded-full lg:block"
            style={{
              width: "460px",
              height: "460px",
              left: "52%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "var(--whiold-300)",
            }}
          />

          {/* ══ COLUMN 1 — Big left (STAGGERED — thoda niche se start hota hai) ══ */}
          <motion.div
            variants={itemVariants}
            className="relative z-10 h-[380px] sm:col-span-2 lg:col-span-1 lg:mt-16 lg:h-[480px]"
          >
            <ProductCard product={editProducts.throwMain} fill captionOverlay />
          </motion.div>

          {/* ══ COLUMN 2 — image / image (dono me overlay caption, dusre me nahi) ══ */}
          <motion.div variants={itemVariants} className="relative z-10 flex h-[440px] flex-col gap-3 lg:h-[560px]">
            <div className="flex-[1.15]">
              <ProductCard product={editProducts.pitcherCrop} fill captionOverlay />
            </div>
            <div className="flex-1">
              <ProductCard product={editProducts.mugCopper} fill captionOverlay />
            </div>
          </motion.div>

          {/* ══ COLUMN 3 — Handwoven Basket + Bath Towel Set (caption+price overlay) ══ */}
          <motion.div variants={itemVariants} className="relative z-10 flex h-[440px] flex-col gap-3 lg:h-[560px]">
            <div className="flex-1">
              <ProductCard product={editProducts.basket} fill captionOverlay />
            </div>
            <div className="flex-1">
              <ProductCard product={editProducts.towel} fill captionOverlay />
            </div>
          </motion.div>

          {/* ══ COLUMN 4 — Big right (top-aligned, columns 2/3 jaisi hi height) ══ */}
          <motion.div
            variants={itemVariants}
            className="relative z-10 h-[380px] sm:col-span-2 lg:col-span-1 lg:h-[560px]"
          >
            <ProductCard product={editProducts.mugCandle} fill captionOverlay />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default TheEditSection;