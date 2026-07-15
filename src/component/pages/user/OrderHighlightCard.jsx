import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * OrderHighlightCard
 * Large single spotlighted tile — currently used for "Orders" but works for
 * any single-CTA highlight block (e.g. "Support", "Downloads", etc.)
 *
 * @param {{
 *   title: string,
 *   desc: string,
 *   icon: React.ElementType,
 *   gradient?: string,   // tailwind gradient classes for the icon badge
 *   path?: string,
 *   onClick?: () => void
 * }} props
 */
const OrderHighlightCard = ({
  title,
  desc,
  icon: Icon,
  gradient = "from-orange-500 to-yellow-500",
  path,
  onClick,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) return onClick();
    if (path) navigate(path);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative cursor-pointer overflow-hidden rounded-3xl border border-gray-200 bg-white p-7 transition-all duration-500 hover:-translate-y-2 hover:border-[var(--whiold-primary)] hover:shadow-2xl"
    >
      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[var(--whiold-primary-soft)] transition-all duration-500 group-hover:scale-150" />

      <div className="relative flex items-center justify-between">
        <div>
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg`}
          >
            <Icon size={28} />
          </div>

          <h3 className="mt-6 text-2xl font-bold text-gray-800">{title}</h3>

          <p className="mt-2 text-sm leading-6 text-gray-500">{desc}</p>
        </div>

        <ArrowRight
          className="text-gray-300 transition-all group-hover:text-[var(--whiold-primary)]"
          size={26}
        />
      </div>
    </div>
  );
};

export default OrderHighlightCard;