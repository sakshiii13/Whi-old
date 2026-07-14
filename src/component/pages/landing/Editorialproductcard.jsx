import { useState } from "react";
import { motion } from "framer-motion";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import { useNavigate } from "react-router-dom";
import products from "./editproduct";

const ProductShowcaseHero = ({
  onAdd,
  bannerImage = "/public/banner.jpg",
  eyebrow = "Curated Picks",
  heading = "Latest Arrivals",
  description = "Discover pieces made to bring warmth, texture and character to your everyday spaces.",
  ctaLabel = "Get Inspired",
  onCtaClick,
  topOffset = 96, // match your fixed navbar height
}) => {
  const [hovered, setHovered] = useState({});
  const navigate = useNavigate();

  return (
    <section className="w-full pb-10 md:pb-16" style={{ background: "var(--whiold-bg)", paddingTop: topOffset }}>
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div
          className="relative overflow-hidden rounded-[var(--whiold-radius-lg)]"
          style={{
            backgroundImage: `url(${bannerImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            boxShadow: "var(--whiold-shadow-card)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(100deg, rgba(30,20,14,0.82) 0%, rgba(30,20,14,0.55) 42%, rgba(30,20,14,0.15) 70%)",
            }}
          />

          <div className="relative z-10 flex flex-col gap-10 p-8 md:flex-row md:items-center md:gap-6 md:p-14">
            {/* text column */}
            <motion.div
              className="max-w-sm shrink-0 text-white"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-4 flex items-center gap-2">
                <span className="h-px w-8" style={{ background: "var(--whiold-300)" }} />
                <p className="text-xs uppercase tracking-[0.22em]" style={{ color: "var(--whiold-200)" }}>
                  {eyebrow}
                </p>
              </div>

              <h2 className="mb-4 text-4xl font-semibold leading-[1.1] md:text-5xl">{heading}</h2>

              <p className="mb-8 text-sm leading-relaxed opacity-90" style={{ color: "var(--whiold-100)" }}>
                {description}
              </p>

              <motion.button
                onClick={onCtaClick}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold"
                style={{
                  background: "var(--whiold-gradient-brand)",
                  color: "var(--whiold-text-on-primary)",
                  boxShadow: "var(--whiold-shadow-btn)",
                }}
              >
                {ctaLabel}
                <ArrowOutwardRoundedIcon sx={{ fontSize: 16 }} />
              </motion.button>
            </motion.div>

            {/* cards row — fully inside the banner, original dark-scrim card style */}
            <div className="flex flex-1 flex-wrap justify-center gap-5 md:justify-end md:gap-6">
              {products.map((product, i) => {
                const { id, images, name, category, price, tag } = product;

                return (
                  <motion.div
                    key={id}
                    className="relative h-[320px] w-[230px] shrink-0 cursor-pointer overflow-hidden rounded-[var(--whiold-radius-lg)] md:h-[340px] md:w-[240px]"
                    style={{ boxShadow: "var(--whiold-shadow-card)" }}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    onHoverStart={() => setHovered((prev) => ({ ...prev, [id]: true }))}
                    onHoverEnd={() => setHovered((prev) => ({ ...prev, [id]: false }))}
                    onClick={() => navigate(`/product/${id}`, { state: { product } })}
                  >
                    <motion.img
                      src={images[0]}
                      alt={name}
                      className="absolute inset-0 h-full w-full object-cover"
                      animate={{ scale: hovered[id] ? 1.1 : 1 }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    />

                    <div
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(180deg, rgba(43,33,25,0) 35%, rgba(43,33,25,0.86) 100%)",
                      }}
                    />

                    {tag ? (
                      <span
                        className="absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]"
                        style={{ background: "var(--whiold-bg)", color: "var(--whiold-700)" }}
                      >
                        {tag}
                      </span>
                    ) : (
                      <motion.div
                        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full"
                        style={{ background: "var(--whiold-bg)" }}
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: hovered[id] ? 1 : 0, scale: hovered[id] ? 1 : 0.6 }}
                      >
                        <ArrowOutwardRoundedIcon sx={{ fontSize: 16, color: "var(--whiold-700)" }} />
                      </motion.div>
                    )}

                    <div className="absolute inset-x-4 bottom-4 text-white">
                      <p className="text-[11px] uppercase tracking-[0.18em] opacity-80">{category}</p>

                      <div className="mt-1 flex items-end justify-between gap-3">
                        <h3 className="text-base font-semibold leading-tight">{name}</h3>
                        <span className="shrink-0 text-sm font-semibold">₹{price}</span>
                      </div>

                      <motion.div
                        className="mt-3 h-px w-full origin-left"
                        style={{ background: "var(--whiold-300)" }}
                        initial={{ scaleX: 0.25 }}
                        animate={{ scaleX: hovered[id] ? 1 : 0.25 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />

                      <motion.button
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-[var(--whiold-radius-md)] py-2 text-xs font-medium"
                        style={{ background: "var(--whiold-gradient-brand)", color: "var(--whiold-text-on-primary)" }}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: hovered[id] ? 1 : 0, y: hovered[id] ? 0 : 16 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onAdd?.(product);
                        }}
                      >
                        <ShoppingBagRoundedIcon sx={{ fontSize: 14 }} />
                        Add to Bag
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcaseHero;