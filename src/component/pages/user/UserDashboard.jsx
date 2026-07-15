import React, { useState } from "react";
import { Box } from "@mui/material";
import { RefreshCw, ShoppingBag } from "lucide-react";

import {
  StatCard,
  FeatureSection,
  OrderHighlightCard,
  AccountStatusCard,
} from "./Index";

import { statsData, productCards, teamCards, earningCards } from "./DashboardData";

const UserDashboard = () => {
  const [loading, setLoading] = useState(false);

  const refresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <Box className="min-h-screen bg-[var(--whiold-bg-soft)] px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-[var(--whiold-text-heading)]">
              Welcome Back !!
            </h1>
            <p className="mt-2 text-sm text-[var(--whiold-text-body)]">
              Manage your wallet, products, team and earnings from one place.
            </p>
          </div>

          <button
            onClick={refresh}
            className="flex items-center gap-2 rounded-2xl border border-[var(--whiold-border)] bg-white px-5 py-3 font-semibold shadow-sm transition-all hover:border-[var(--whiold-primary)] hover:shadow-lg"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Top stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {statsData.map((item) => (
            <StatCard key={item.title} item={item} />
          ))}
        </div>

        {/* Products, Team, Earnings — same component, different data */}
        <FeatureSection
          title="Products"
          description="Manage all your product activities."
          chipLabel="6 Modules"
          items={productCards}
          gridClassName="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
          className="mt-12"
        />

        <FeatureSection
          title="Team"
          description="Grow and manage your referral network."
          chipLabel="5 Modules"
          items={teamCards}
          gridClassName="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
        />

        <FeatureSection
          title="Earnings"
          description="Track every income generated from your business."
          chipLabel="4 Modules"
          items={earningCards}
          gridClassName="grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
        />

        {/* Orders spotlight */}
        <div className="mt-14">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[var(--whiold-text-heading)]">Orders</h2>
            <p className="mt-1 text-sm text-[var(--whiold-text-body)]">
              Manage and track all your product orders.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <OrderHighlightCard
              title="Orders"
              desc="View active orders, completed purchases and delivery status."
              icon={ShoppingBag}
              gradient="from-orange-500 to-yellow-500"
              path="/orders"
            />
          </div>
        </div>

        {/* Account status */}
        <div className="mt-14">
          <AccountStatusCard
            heading="Everything looks great 🎉"
            description="Your account is active and running smoothly. Continue growing your business by purchasing products, building your team and earning exciting rewards."
            stats={[
              { label: "Wallet", value: "₹2,450" },
              { label: "Income", value: "₹980" },
              { label: "Orders", value: "18" },
              { label: "Team", value: "56" },
            ]}
          />
        </div>
      </div>
    </Box>
  );
};

export default UserDashboard;