import React from "react";

/**
 * StatCard
 * Small gradient-bordered summary tile.
 *
 * @param {{ title: string, value: string|number, icon: React.ElementType, gradient: string }} item
 *   gradient — tailwind gradient stop classes, e.g. "from-cyan-500 via-sky-500 to-blue-600"
 */
const StatCard = ({ item }) => {
  if (!item) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "StatCard: missing `item` prop. Usage is <StatCard item={{ title, value, icon, gradient }} />."
      );
    }
    return null;
  }

  const Icon = item.icon;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${item.gradient} p-[1px] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl`}
    >
      <div className="h-full rounded-3xl bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              {item.title}
            </p>
            <h2 className="mt-3 text-3xl font-bold text-gray-800">{item.value}</h2>
          </div>

          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-lg`}
          >
            <Icon size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;