import React, { useEffect, useState } from "react";
import { Card, Box, Chip } from "@mui/material";
import {
  Wallet,ShoppingBag,Users,Package,
  DollarSign,
  ShoppingCart,
  Heart,
  Boxes,
  Gift,
  Link2,
  UserPlus,
  Layers,
  Trophy,
  ArrowRight,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import { Router } from "../../../constants/router";
import { useNavigate } from "react-router-dom";

const statsData = [
  {
    title: "Wallet",
    value: "₹2,450.00",
    icon: Wallet,
    gradient:
      "from-cyan-500 via-sky-500 to-blue-600",
  },
  {
    title: "Income",
    value: "₹980.00",
    icon: DollarSign,
    gradient:
      "from-emerald-500 via-green-500 to-teal-600",
  },
  {
    title: "Orders",
    value: "18",
    icon: ShoppingBag,
    gradient:
      "from-orange-500 via-amber-500 to-yellow-500",
  },
  {
    title: "Team",
    value: "56",
    icon: Users,
    gradient:
      "from-violet-500 via-fuchsia-500 to-pink-500",
  },
];

const productCards = [
  {
    title: "Products",
    desc: "Explore all available products",
    icon: Package,
    color: "bg-cyan-100 text-cyan-600",
  },
  {
    title: "View Products",
    desc: "Browse complete catalog",
    icon: Boxes,
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    title: "Buy Product",
    desc: "Purchase premium products",
    icon: ShoppingCart,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Bulk Order",
    desc: "Place wholesale orders",
    icon: Package,
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "Cart",
    desc: "Review selected products",
    icon: ShoppingCart,
    color: "bg-pink-100 text-pink-600",
    path: Router?.CART,
  },
  {
    title: "Wishlist",
    desc: "Save favorite products",
    icon: Heart,
    color: "bg-rose-100 text-rose-600",
    path: Router?.WISHLIST,
  },
];

const teamCards = [
  {
    title: "Referral Link",
    desc: "Invite new members",
    icon: Link2,
    color: "bg-sky-100 text-sky-600",
  },
  {
    title: "Team List",
    desc: "View your network",
    icon: UserPlus,
    color: "bg-violet-100 text-violet-600",
  },
  {
    title: "Level 1",
    desc: "Direct referrals",
    icon: Layers,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Level 2",
    desc: "Second level members",
    icon: Layers,
    color: "bg-amber-100 text-amber-600",
  },
  {
    title: "Level 3",
    desc: "Third level members",
    icon: Layers,
    color: "bg-rose-100 text-rose-600",
  },
];

const earningCards = [
  {
    title: "Direct Income",
    desc: "Income from referrals",
    icon: DollarSign,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Team Income",
    desc: "Network earnings",
    icon: Users,
    color: "bg-cyan-100 text-cyan-600",
  },
  {
    title: "Reward Income",
    desc: "Bonus rewards",
    icon: Gift,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Total Income",
    desc: "Overall earnings",
    icon: Trophy,
    color: "bg-yellow-100 text-yellow-600",
  },
];

const StatCard = ({ item }) => {
  const Icon = item.icon;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${item.gradient} p-[1px] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl`}
    >
      <div className="rounded-3xl bg-white p-6 h-full">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              {item.title}
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-800">
              {item.value}
            </h2>
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

const FeatureCard = ({ item }) => {
  const navigate = useNavigate();
  const Icon = item.icon;

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 transition-all duration-500 hover:-translate-y-2 hover:border-[var(--whiold-primary)] hover:shadow-2xl cursor-pointer" onClick={() => {
        if (item.path) {
          navigate(item.path);
        }
        
      }}>
      <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-[var(--whiold-primary-soft)] transition-all duration-500 group-hover:scale-150" />

      <div
        className={`relative flex h-14 w-14 items-center justify-center rounded-2xl ${item.color}`}
      >
        <Icon size={24} />
      </div>

      <h3 className="relative mt-6 text-lg font-bold text-gray-800">
        {item.title}
      </h3>

      <p className="relative mt-2 text-sm leading-6 text-gray-500">
        {item.desc}
      </p>

      <button className="relative mt-6 flex items-center gap-2 text-sm font-semibold text-[var(--whiold-primary)] transition-all group-hover:gap-3">
        Open
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

const UserDashboard = () => {
  const [loading, setLoading] = useState(false);

  const refresh = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {}, []);

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
            <RefreshCw
              size={18}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Top Stats */}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {statsData.map((item) => (
            <StatCard
              key={item.title}
              item={item}
            />
          ))}
        </div>

        {/* Products */}

        <div className="mt-12">

          <div className="mb-6 flex items-center justify-between">

            <div>

              <h2 className="text-2xl font-bold text-[var(--whiold-text-heading)]">
                Products
              </h2>

              <p className="mt-1 text-sm text-[var(--whiold-text-body)]">
                Manage all your product activities.
              </p>

            </div>

            <Chip
              label="6 Modules"
              className="!bg-[var(--whiold-primary-soft)] !text-[var(--whiold-primary)]"
            />

          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">

            {productCards.map((item) => (
              <FeatureCard
                key={item.title}
                item={item}
                path={item.path}
              />
            ))}

          </div>

        </div>

                {/* ================= TEAM ================= */}

        <div className="mt-14">

          <div className="mb-6 flex items-center justify-between">

            <div>
              <h2 className="text-2xl font-bold text-[var(--whiold-text-heading)]">
                Team
              </h2>

              <p className="mt-1 text-sm text-[var(--whiold-text-body)]">
                Grow and manage your referral network.
              </p>
            </div>

            <Chip
              label="5 Modules"
              className="!bg-[var(--whiold-primary-soft)] !text-[var(--whiold-primary)]"
            />

          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">

            {teamCards.map((item) => (
              <FeatureCard
                key={item.title}
                item={item}
              />
            ))}

          </div>

        </div>

        {/* ================= EARNINGS ================= */}

        <div className="mt-14">

          <div className="mb-6 flex items-center justify-between">

            <div>
              <h2 className="text-2xl font-bold text-[var(--whiold-text-heading)]">
                Earnings
              </h2>

              <p className="mt-1 text-sm text-[var(--whiold-text-body)]">
                Track every income generated from your business.
              </p>
            </div>

            <Chip
              label="4 Modules"
              className="!bg-[var(--whiold-primary-soft)] !text-[var(--whiold-primary)]"
            />

          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

            {earningCards.map((item) => (
              <FeatureCard
                key={item.title}
                item={item}
              />
            ))}

          </div>

        </div>

        {/* ================= ORDERS ================= */}

        <div className="mt-14">

          <div className="mb-6">

            <h2 className="text-2xl font-bold text-[var(--whiold-text-heading)]">
              Orders
            </h2>

            <p className="mt-1 text-sm text-[var(--whiold-text-body)]">
              Manage and track all your product orders.
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-7 transition-all duration-500 hover:-translate-y-2 hover:border-[var(--whiold-primary)] hover:shadow-2xl">

              <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[var(--whiold-primary-soft)] group-hover:scale-150 transition-all duration-500" />

              <div className="relative flex items-center justify-between">

                <div>

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-yellow-500 text-white shadow-lg">
                    <ShoppingBag size={28} />
                  </div>

                  <h3 className="mt-6 text-2xl font-bold text-gray-800">
                    Orders
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    View active orders, completed purchases and delivery
                    status.
                  </p>

                </div>

                <ArrowRight
                  className="text-gray-300 group-hover:text-[var(--whiold-primary)] transition-all"
                  size={26}
                />

              </div>

            </div>

          </div>

        </div>
                {/* ================= ACCOUNT STATUS ================= */}

        <div className="mt-14">

          <Card
            elevation={0}
            className="!overflow-hidden !rounded-[32px] !border !border-[var(--whiold-border)] !bg-white !shadow-xl transition-all duration-500 hover:-translate-y-2 hover:border-[var(--whiold-primary)] hover:shadow-xl"
          >

            <div className="relative overflow-hidden">

              <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-[var(--whiold-primary-soft)] blur-3xl opacity-70" />

              <div className="relative p-8">

                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                  <div>

                    <Chip
                      label="ACTIVE ACCOUNT"
                      className="!mb-4 !bg-green-100 !text-green-700 !font-semibold"
                    />

                    <h2 className="text-3xl font-black text-[var(--whiold-text-heading)]">
                      Everything looks great 🎉
                    </h2>

                    <p className="mt-3 max-w-2xl leading-7 text-[var(--whiold-text-body)]">
                      Your account is active and running smoothly.
                      Continue growing your business by purchasing products,
                      building your team and earning exciting rewards.
                    </p>

                  </div>

                  <div className="grid grid-cols-2 gap-4">

                    <div className="rounded-2xl border border-[var(--whiold-border)] bg-[var(--whiold-primary-soft)] p-5">

                      <p className="text-xs uppercase tracking-wider text-[var(--whiold-text-muted)]">
                        Wallet
                      </p>

                      <h3 className="mt-2 text-2xl font-bold">
                        ₹2,450
                      </h3>

                    </div>

                    <div className="rounded-2xl border border-[var(--whiold-border)] bg-[var(--whiold-primary-soft)] p-5">

                      <p className="text-xs uppercase tracking-wider text-[var(--whiold-text-muted)]">
                        Income
                      </p>

                      <h3 className="mt-2 text-2xl font-bold">
                        ₹980
                      </h3>

                    </div>

                    <div className="rounded-2xl border border-[var(--whiold-border)] bg-[var(--whiold-primary-soft)] p-5">

                      <p className="text-xs uppercase tracking-wider text-[var(--whiold-text-muted)]">
                        Orders
                      </p>

                      <h3 className="mt-2 text-2xl font-bold">
                        18
                      </h3>

                    </div>

                    <div className="rounded-2xl border border-[var(--whiold-border)] bg-[var(--whiold-primary-soft)] p-5">

                      <p className="text-xs uppercase tracking-wider text-[var(--whiold-text-muted)]">
                        Team
                      </p>

                      <h3 className="mt-2 text-2xl font-bold">
                        56
                      </h3>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </Card>

        </div>

      </div>
    </Box>
  );
};

export default UserDashboard;