
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import whioldLogo from "../../assets/whiold-logo.png"; // 👉 adjust this path to your actual logo location

const PageLoader = ({ label = "Loading", duration, onComplete }) => {
  React.useEffect(() => {
    if (!duration) return;
    const t = setTimeout(() => onComplete && onComplete(), duration);
    return () => clearTimeout(t);
  }, [duration, onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
        style={{
          background: "var(--whiold-loader-overlay-bg)",
          backdropFilter:
            "blur(var(--whiold-loader-overlay-blur)) saturate(var(--whiold-loader-overlay-saturate))",
          WebkitBackdropFilter:
            "blur(var(--whiold-loader-overlay-blur)) saturate(var(--whiold-loader-overlay-saturate))",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
      >
        {/* ambient glow orbs */}
        <motion.div
          className="absolute -top-24 -left-20 w-[24rem] h-[24rem] rounded-full pointer-events-none"
          style={{ background: "var(--whiold-loader-glow)", filter: "blur(var(--whiold-loader-glow-blur))" }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-28 -right-24 w-[26rem] h-[26rem] rounded-full pointer-events-none"
          style={{ background: "var(--whiold-loader-glow)", filter: "blur(var(--whiold-loader-glow-blur))" }}
          animate={{ scale: [1, 1.18, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />

        <div className="relative z-10 flex flex-col items-center gap-5">
          {/* spinner stack, logo at the core */}
          <div
            className="relative flex items-center justify-center"
            style={{ width: "var(--whiold-loader-ring-size)", height: "var(--whiold-loader-ring-size)" }}
          >
            {/* outer sweeping ring — clockwise */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: "var(--whiold-loader-ring-size)",
                height: "var(--whiold-loader-ring-size)",
                background: "var(--whiold-loader-ring-sweep)",
                WebkitMask:
                  "radial-gradient(farthest-side, transparent calc(100% - var(--whiold-loader-ring-thickness)), #000 calc(100% - var(--whiold-loader-ring-thickness) + 1px))",
                mask:
                  "radial-gradient(farthest-side, transparent calc(100% - var(--whiold-loader-ring-thickness)), #000 calc(100% - var(--whiold-loader-ring-thickness) + 1px))",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
            />

            {/* inner sweeping ring — counter-clockwise */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: "var(--whiold-loader-ring-size-inner)",
                height: "var(--whiold-loader-ring-size-inner)",
                background: "var(--whiold-loader-ring-sweep-inner)",
                WebkitMask:
                  "radial-gradient(farthest-side, transparent calc(100% - var(--whiold-loader-ring-thickness-inner)), #000 calc(100% - var(--whiold-loader-ring-thickness-inner) + 1px))",
                mask:
                  "radial-gradient(farthest-side, transparent calc(100% - var(--whiold-loader-ring-thickness-inner)), #000 calc(100% - var(--whiold-loader-ring-thickness-inner) + 1px))",
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 1.15, repeat: Infinity, ease: "linear" }}
            />

            {/* logo core — breathes gently, shimmer sweeps along its real shape */}
            <motion.div
              className="relative"
              style={{ width: "var(--whiold-loader-logo-size)", height: "var(--whiold-loader-logo-size)" }}
              animate={{ scale: [0.94, 1.04, 0.94] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <img
                src={whioldLogo}
                alt="Whiold"
                className="w-full h-full object-contain block"
                style={{ filter: "drop-shadow(var(--whiold-loader-logo-glow))" }}
              />
              <motion.div
                className="absolute inset-0"
                style={{
                  WebkitMaskImage: `url(${whioldLogo})`,
                  maskImage: `url(${whioldLogo})`,
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                  background:
                    "linear-gradient(115deg, transparent 30%, rgba(255,236,220,0.95) 48%, rgba(255,255,255,1) 52%, transparent 70%)",
                  backgroundSize: "250% 250%",
                  mixBlendMode: "screen",
                }}
                animate={{ backgroundPosition: ["-60% -60%", "60% 60%"] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </div>

          {/* status row */}
          <div
            className="flex items-center gap-[5px] text-[11px] uppercase tracking-[0.1em] font-medium"
            style={{ color: "var(--whiold-loader-subtext-color)" }}
          >
            <span>{label}</span>
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1 h-1 rounded-full"
                style={{ background: "var(--whiold-loader-dot-color)" }}
                animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PageLoader;