import React from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * FeatureCard
 * Generic clickable module tile — used for Products, Team, and Earnings grids.
 *
 * @param {{
 *   title: string,
 *   desc: string,
 *   icon: React.ElementType,
 *   color: string,      // tailwind bg + text classes, e.g. "bg-cyan-100 text-cyan-600"
 *   path?: string,       // route to navigate to (optional)
 *   onClick?: () => void // custom click handler, takes priority over `path`
 * }} item
 */
const FeatureCard = ({ item }) => {
  const navigate = useNavigate();

  if (!item) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "FeatureCard: missing `item` prop. Usage is <FeatureCard item={{ title, desc, icon, color }} /> — check the array you're mapping over."
      );
    }
    return null;
  }

  const Icon = item.icon;

  const handleClick = () => {
    if (item.onClick) return item.onClick();
    if (item.path) navigate(item.path);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative cursor-pointer overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 transition-all duration-500 hover:-translate-y-2 hover:border-[var(--whiold-primary)] hover:shadow-2xl"
    >
      <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-[var(--whiold-primary-soft)] transition-all duration-500 group-hover:scale-150" />

      <div
        className={`relative flex h-14 w-14 items-center justify-center rounded-2xl ${item.color}`}
      >
        <Icon size={24} />
      </div>

      <h3 className="relative mt-6 text-lg font-bold text-gray-800">{item.title}</h3>

      <p className="relative mt-2 text-sm leading-6 text-gray-500">{item.desc}</p>

      <button className="relative mt-6 flex items-center gap-2 text-sm font-semibold text-[var(--whiold-primary)] transition-all group-hover:gap-3">
        Open
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default FeatureCard;