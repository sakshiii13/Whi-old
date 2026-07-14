import { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Drawer,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  MoreVertical,
  Eye,
  X,
  MapPin,
  Phone,
  CreditCard,
  RefreshCcw,
  ChevronDown,
  IndianRupee,
} from "lucide-react";
import Swal from "sweetalert2";

import TableComponent from "../../../ui/TableComponent";
import ButtonComponent from "../../../ui/ButtonComponent";

/* ------------------------------------------------------------------ */
/*  Status config — single source of truth for color + icon + copy     */
/* ------------------------------------------------------------------ */
const STATUS_FLOW = ["pending", "processing", "shipped", "delivered"];

const STATUS_META = {
  pending: { label: "Pending", icon: Clock, color: "#B8862B", bg: "rgba(184,134,43,0.12)" },
  processing: { label: "Processing", icon: RefreshCcw, color: "#3B6FB6", bg: "rgba(59,111,182,0.12)" },
  shipped: { label: "Shipped", icon: Truck, color: "#7A5CC7", bg: "rgba(122,92,199,0.12)" },
  delivered: { label: "Delivered", icon: CheckCircle2, color: "#2E9E5B", bg: "rgba(46,158,91,0.12)" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "#D64545", bg: "rgba(214,69,69,0.12)" },
};

/* ------------------------------------------------------------------ */
/*  Mock data — swap this block for your Axios call, shape stays same  */
/* ------------------------------------------------------------------ */
const seedOrders = [
  { id: "WHD-10231", customer: "Ananya Rathore", phone: "+91 98765 43210", items: [{ name: "Copper Table Lamp", qty: 1, price: 2499 }, { name: "Linen Cushion Cover", qty: 2, price: 899 }], address: "204, Palm Residency, Vijay Nagar, Indore, MP 452010", payment: "UPI", status: "pending", date: "2026-07-09" },
  { id: "WHD-10232", customer: "Karan Mehta", phone: "+91 91234 56789", items: [{ name: "Terracotta Vase Set", qty: 1, price: 3199 }], address: "B-12, Sector 7, Bhopal, MP 462011", payment: "Card", status: "processing", date: "2026-07-09" },
  { id: "WHD-10233", customer: "Priya Deshmukh", phone: "+91 90000 11223", items: [{ name: "Handwoven Throw", qty: 1, price: 1799 }, { name: "Ceramic Mug Set", qty: 1, price: 999 }], address: "45 Green Park, Nagpur, MH 440001", payment: "COD", status: "shipped", date: "2026-07-08" },
  { id: "WHD-10234", customer: "Rohit Sharma", phone: "+91 99887 76655", items: [{ name: "Oak Wall Shelf", qty: 2, price: 1599 }], address: "12 MG Road, Indore, MP 452001", payment: "UPI", status: "delivered", date: "2026-07-06" },
  { id: "WHD-10235", customer: "Ishita Verma", phone: "+91 98123 45566", items: [{ name: "Brass Candle Holder", qty: 3, price: 649 }], address: "7 Lake View, Bhopal, MP 462001", payment: "Card", status: "cancelled", date: "2026-07-05" },
  { id: "WHD-10236", customer: "Aditya Joshi", phone: "+91 97654 32109", items: [{ name: "Copper Table Lamp", qty: 1, price: 2499 }], address: "88 Civil Lines, Indore, MP 452002", payment: "UPI", status: "delivered", date: "2026-07-03" },
  { id: "WHD-10237", customer: "Simran Kaur", phone: "+91 96543 21098", items: [{ name: "Terracotta Vase Set", qty: 2, price: 3199 }], address: "23 DLF Colony, Indore, MP 452010", payment: "COD", status: "pending", date: "2026-07-10" },
  { id: "WHD-10238", customer: "Manav Kapoor", phone: "+91 95432 10987", items: [{ name: "Handwoven Throw", qty: 1, price: 1799 }], address: "56 Race Course Road, Indore, MP 452003", payment: "Card", status: "processing", date: "2026-07-10" },
];

const orderTotal = (order) => order.items.reduce((sum, it) => sum + it.qty * it.price, 0);
const inr = (n) => `\u20B9${n.toLocaleString("en-IN")}`;

/* ------------------------------------------------------------------ */
/*  Status pill — used both in table and drawer header                 */
/* ------------------------------------------------------------------ */
const StatusPill = ({ status, onClick }) => {
  const meta = STATUS_META[status] || STATUS_META.pending;
  const Icon = meta.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-full px-3 text-[11px] font-semibold transition-transform active:scale-95"
      style={{ background: meta.bg, color: meta.color, cursor: onClick ? "pointer" : "default" }}
    >
      <Icon size={12} />
      {meta.label}
      {onClick && <ChevronDown size={12} className="opacity-60" />}
    </button>
  );
};

/* ------------------------------------------------------------------ */
/*  Stat card                                                           */
/* ------------------------------------------------------------------ */
const StatCard = ({ label, value, accent, icon: Icon }) => (
  <Box
    className="relative flex-1 min-w-[170px] overflow-hidden rounded-2xl border p-5"
    sx={{ borderColor: "var(--whiold-border)", background: "var(--whiold-bg)" }}
  >
    <Box className="absolute left-0 top-0 h-full w-[3px]" sx={{ background: accent }} />
    <Box className="flex items-center justify-between">
      <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: "var(--whiold-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}
      </Typography>
      <Box className="flex h-7 w-7 items-center justify-center rounded-lg" sx={{ background: `${accent}1f`, color: accent }}>
        <Icon size={14} />
      </Box>
    </Box>
    <Typography sx={{ fontSize: 23, fontWeight: 800, color: "var(--whiold-text-heading)", mt: 1 }}>
      {value}
    </Typography>
  </Box>
);

/* ------------------------------------------------------------------ */
/*  Order journey — signature element inside the drawer                */
/* ------------------------------------------------------------------ */
const OrderJourney = ({ status }) => {
  if (status === "cancelled") {
    return (
      <Box
        className="flex items-center gap-2 rounded-xl px-3.5 py-3"
        sx={{ background: STATUS_META.cancelled.bg, color: STATUS_META.cancelled.color }}
      >
        <XCircle size={16} />
        <Typography sx={{ fontSize: 13, fontWeight: 600 }}>This order was cancelled</Typography>
      </Box>
    );
  }

  const currentIndex = STATUS_FLOW.indexOf(status);

  return (
    <Box className="flex items-start">
      {STATUS_FLOW.map((step, i) => {
        const meta = STATUS_META[step];
        const Icon = meta.icon;
        const reached = i <= currentIndex;
        const isLast = i === STATUS_FLOW.length - 1;
        return (
          <Box key={step} className="flex flex-1 flex-col items-center">
            <Box className="flex w-full items-center">
              <Box
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300"
                sx={{
                  background: reached ? "var(--whiold-primary)" : "var(--whiold-bg-soft, #F1EDE9)",
                  color: reached ? "#fff" : "var(--whiold-text-muted)",
                  border: reached ? "none" : "1px solid var(--whiold-border)",
                }}
              >
                <Icon size={14} />
              </Box>
              {!isLast && (
                <Box
                  className="mx-1 h-[2px] flex-1 rounded-full transition-colors duration-300"
                  sx={{ background: i < currentIndex ? "var(--whiold-primary)" : "var(--whiold-border)" }}
                />
              )}
            </Box>
            <Typography
              sx={{
                fontSize: 10.5,
                fontWeight: reached ? 700 : 500,
                color: reached ? "var(--whiold-text-heading)" : "var(--whiold-text-muted)",
                mt: 0.75,
                textAlign: "center",
              }}
            >
              {meta.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

/* ------------------------------------------------------------------ */
/*  Main component                                                      */
/* ------------------------------------------------------------------ */
const AllOrders = () => {
  const [orders, setOrders] = useState(seedOrders);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusMenuAnchor, setStatusMenuAnchor] = useState(null);
  const [statusMenuOrderId, setStatusMenuOrderId] = useState(null);

  /* ---- derived stats ---- */
  const stats = useMemo(() => {
    const revenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + orderTotal(o), 0);
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      revenue,
    };
  }, [orders]);

  const filterCounts = useMemo(() => {
    const counts = { all: orders.length };
    Object.keys(STATUS_META).forEach((s) => {
      counts[s] = orders.filter((o) => o.status === s).length;
    });
    return counts;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (activeFilter === "all") return orders;
    return orders.filter((o) => o.status === activeFilter);
  }, [orders, activeFilter]);

  /* ---- handlers ---- */
  const updateStatus = (orderId, nextStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o)));
    setSelectedOrder((prev) => (prev && prev.id === orderId ? { ...prev, status: nextStatus } : prev));
    setStatusMenuAnchor(null);
    Swal.fire({
      icon: "success",
      title: `Marked as ${STATUS_META[nextStatus].label}`,
      toast: true,
      position: "top-end",
      timer: 1600,
      showConfirmButton: false,
    });
    // TODO: replace with real API call
    // await axios.patch(`/api/orders/${orderId}/status`, { status: nextStatus });
  };

  const cancelOrder = (order) => {
    Swal.fire({
      icon: "warning",
      title: `Cancel order ${order.id}?`,
      text: "This can't be undone from here.",
      showCancelButton: true,
      confirmButtonColor: "#D64545",
      confirmButtonText: "Yes, cancel it",
      cancelButtonText: "Keep order",
    }).then((res) => {
      if (res.isConfirmed) updateStatus(order.id, "cancelled");
    });
  };

  const openStatusMenu = (event, orderId) => {
    event.stopPropagation();
    setStatusMenuAnchor(event.currentTarget);
    setStatusMenuOrderId(orderId);
  };

  /* ---- table columns ---- */
  const columns = [
    {
      field: "id",
      headerName: "Order",
      width: 150,
      renderCell: (params) => (
        <Typography sx={{ fontSize: 12.5, fontWeight: 700, fontFamily: "monospace", color: "var(--whiold-text-heading)" }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "customer",
      headerName: "Customer",
      flex: 1,
      minWidth: 220,
      renderCell: (params) => (
        <Box className="flex items-center gap-3 py-2">
          <Avatar
            sx={{
              width: 32,
              height: 32,
              fontSize: 13,
              fontWeight: 700,
              background: "var(--whiold-primary-soft)",
              color: "var(--whiold-primary)",
            }}
          >
            {params.value.charAt(0)}
          </Avatar>
          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: "var(--whiold-text-heading)", lineHeight: 1.35 }}>
              {params.value}
            </Typography>
            <Typography sx={{ fontSize: 11.5, color: "var(--whiold-text-muted)", lineHeight: 1.35 }}>
              {params.row.payment}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "itemsCount",
      headerName: "Items",
      width: 100,
      valueGetter: (_, row) => row.items.reduce((s, it) => s + it.qty, 0),
      renderCell: (params) => (
        <Typography sx={{ fontSize: 13, color: "var(--whiold-text-body)" }}>{params.value} pcs</Typography>
      ),
    },
    {
      field: "total",
      headerName: "Total",
      width: 130,
      valueGetter: (_, row) => orderTotal(row),
      renderCell: (params) => (
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: "var(--whiold-text-heading)" }}>
          {inr(params.value)}
        </Typography>
      ),
    },
    {
      field: "date",
      headerName: "Date",
      width: 120,
      renderCell: (params) => (
        <Typography sx={{ fontSize: 12.5, color: "var(--whiold-text-muted)" }}>
          {new Date(params.value).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 180,
      renderCell: (params) => (
        <StatusPill status={params.value} onClick={(e) => openStatusMenu(e, params.row.id)} />
      ),
    },
    {
      field: "actions",
      headerName: "",
      width: 110,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box className="flex items-center gap-1.5">
          <IconButton size="small" onClick={() => setSelectedOrder(params.row)} title="View order">
            <Eye size={16} color="var(--whiold-text-muted)" />
          </IconButton>
          <IconButton size="small" onClick={() => cancelOrder(params.row)} title="Cancel order">
            <MoreVertical size={16} color="var(--whiold-text-muted)" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const filterTabs = [
    { key: "all", label: "All" },
    { key: "pending", label: STATUS_META.pending.label },
    { key: "processing", label: STATUS_META.processing.label },
    { key: "shipped", label: STATUS_META.shipped.label },
    { key: "delivered", label: STATUS_META.delivered.label },
    { key: "cancelled", label: STATUS_META.cancelled.label },
  ];

  return (
    <Box className="flex flex-col gap-7" sx={{ pt: { xs: 2, sm: 3 }, pb: 4, px: { xs: 0.5, sm: 0 } }}>
      {/* Header */}
      <Box className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Box>
          <Typography sx={{ fontSize: 22, fontWeight: 800, color: "var(--whiold-text-heading)", lineHeight: 1.3 }}>
            All Orders
          </Typography>
          <Typography sx={{ fontSize: 13.5, color: "var(--whiold-text-muted)", mt: 0.5 }}>
            Track, update and manage every Whiold order in one place
          </Typography>
        </Box>
        <ButtonComponent
          variant="outlined"
          size="medium"
          startIcon={<RefreshCcw size={15} />}
          onClick={() => setOrders(seedOrders)}
        >
          Refresh
        </ButtonComponent>
      </Box>

      {/* Stats */}
      <Box className="flex flex-wrap gap-5">
        <StatCard label="Total Orders" value={stats.total} accent="#B8703F" icon={Package} />
        <StatCard label="Pending" value={stats.pending} accent="#B8862B" icon={Clock} />
        <StatCard label="Delivered" value={stats.delivered} accent="#2E9E5B" icon={CheckCircle2} />
        <StatCard label="Revenue" value={inr(stats.revenue)} accent="#3B6FB6" icon={IndianRupee} />
      </Box>

      {/* Filter pills */}
      <Box className="flex flex-wrap items-center gap-3" sx={{ py: 0.5 }}>
        {filterTabs.map((tab) => {
          const active = activeFilter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveFilter(tab.key)}
              className="rounded-full border px-4.5 py-2.5 text-[13px] font-semibold transition-colors"
              style={{
                borderColor: active ? "var(--whiold-primary)" : "var(--whiold-border)",
                background: active ? "var(--whiold-primary)" : "var(--whiold-bg)",
                color: active ? "#fff" : "var(--whiold-text-body)",
              }}
            >
              {tab.label}
              <span
                className="ml-2 rounded-full px-1.5 text-[11px]"
                style={{
                  background: active ? "rgba(255,255,255,0.22)" : "var(--whiold-primary-soft)",
                  color: active ? "#fff" : "var(--whiold-primary)",
                }}
              >
                {filterCounts[tab.key] ?? 0}
              </span>
            </button>
          );
        })}
      </Box>

      {/* Table */}
      <TableComponent title="Orders" rows={filteredOrders} columns={columns} />

      {/* Status change menu */}
      <Menu anchorEl={statusMenuAnchor} open={Boolean(statusMenuAnchor)} onClose={() => setStatusMenuAnchor(null)}>
        {STATUS_FLOW.map((s) => (
          <MenuItem key={s} onClick={() => updateStatus(statusMenuOrderId, s)} sx={{ fontSize: 13, gap: 1 }}>
            <StatusPill status={s} />
          </MenuItem>
        ))}
        <Divider />
        <MenuItem
          onClick={() => {
            const order = orders.find((o) => o.id === statusMenuOrderId);
            setStatusMenuAnchor(null);
            if (order) cancelOrder(order);
          }}
          sx={{ fontSize: 13, gap: 1, color: STATUS_META.cancelled.color }}
        >
          <XCircle size={14} /> Cancel order
        </MenuItem>
      </Menu>

      {/* Order detail drawer */}
      <Drawer anchor="right" open={Boolean(selectedOrder)} onClose={() => setSelectedOrder(null)}>
        {selectedOrder && (
          <Box
            className="flex h-full w-[92vw] max-w-[420px] flex-col"
            sx={{ background: "var(--whiold-bg)" }}
          >
            {/* Drawer header */}
            <Box className="flex items-start justify-between border-b p-5" sx={{ borderColor: "var(--whiold-border)" }}>
              <Box>
                <Typography sx={{ fontSize: 11, color: "var(--whiold-text-muted)", fontWeight: 600 }}>
                  ORDER
                </Typography>
                <Typography sx={{ fontSize: 17, fontWeight: 800, color: "var(--whiold-text-heading)", fontFamily: "monospace" }}>
                  {selectedOrder.id}
                </Typography>
              </Box>
              <IconButton size="small" onClick={() => setSelectedOrder(null)}>
                <X size={18} />
              </IconButton>
            </Box>

            <Box className="flex flex-1 flex-col gap-5 overflow-y-auto p-5">
              {/* Journey */}
              <Box>
                <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: "var(--whiold-text-muted)", mb: 1, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Status
                </Typography>
                <OrderJourney status={selectedOrder.status} />
              </Box>

              <Divider />

              {/* Customer */}
              <Box>
                <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: "var(--whiold-text-muted)", mb: 1, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Customer
                </Typography>
                <Box className="flex items-center gap-2.5">
                  <Avatar sx={{ width: 36, height: 36, background: "var(--whiold-primary-soft)", color: "var(--whiold-primary)", fontWeight: 700 }}>
                    {selectedOrder.customer.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: "var(--whiold-text-heading)" }}>
                      {selectedOrder.customer}
                    </Typography>
                    <Box className="flex items-center gap-1">
                      <Phone size={11} color="var(--whiold-text-muted)" />
                      <Typography sx={{ fontSize: 12, color: "var(--whiold-text-muted)" }}>
                        {selectedOrder.phone}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box className="mt-2 flex items-start gap-1.5">
                  <MapPin size={13} color="var(--whiold-text-muted)" style={{ marginTop: 2 }} />
                  <Typography sx={{ fontSize: 12.5, color: "var(--whiold-text-body)", lineHeight: 1.4 }}>
                    {selectedOrder.address}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              {/* Items */}
              <Box>
                <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: "var(--whiold-text-muted)", mb: 1.5, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Items
                </Typography>
                <Box className="flex flex-col gap-2.5">
                  {selectedOrder.items.map((it, i) => (
                    <Box key={i} className="flex items-center justify-between">
                      <Box>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: "var(--whiold-text-heading)" }}>
                          {it.name}
                        </Typography>
                        <Typography sx={{ fontSize: 11.5, color: "var(--whiold-text-muted)" }}>
                          Qty {it.qty} × {inr(it.price)}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: 13, fontWeight: 700, color: "var(--whiold-text-heading)" }}>
                        {inr(it.qty * it.price)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Divider />

              {/* Payment summary */}
              <Box className="flex items-center justify-between rounded-xl p-3.5" sx={{ background: "var(--whiold-primary-soft)" }}>
                <Box className="flex items-center gap-1.5">
                  <CreditCard size={14} color="var(--whiold-primary)" />
                  <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: "var(--whiold-primary)" }}>
                    {selectedOrder.payment}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: 16, fontWeight: 800, color: "var(--whiold-primary)" }}>
                  {inr(orderTotal(selectedOrder))}
                </Typography>
              </Box>
            </Box>

            {/* Drawer actions */}
            {selectedOrder.status !== "cancelled" && selectedOrder.status !== "delivered" && (
              <Box className="flex gap-2 border-t p-4" sx={{ borderColor: "var(--whiold-border)" }}>
                <ButtonComponent
                  fullWidth
                  variant="outlined"
                  color="error"
                  onClick={() => cancelOrder(selectedOrder)}
                >
                  Cancel
                </ButtonComponent>
                <ButtonComponent
                  fullWidth
                  variant="contained"
                  onClick={() => {
                    const next = STATUS_FLOW[STATUS_FLOW.indexOf(selectedOrder.status) + 1];
                    if (next) updateStatus(selectedOrder.id, next);
                  }}
                >
                  Mark as {STATUS_META[STATUS_FLOW[STATUS_FLOW.indexOf(selectedOrder.status) + 1]]?.label}
                </ButtonComponent>
              </Box>
            )}
          </Box>
        )}
      </Drawer>
    </Box>
  );
};

export default AllOrders;