import { useMemo, useState } from "react";
import {
  Box,Stack,Typography,Chip,Avatar, Drawer,IconButton,Divider,Grow,Fade,Select,MenuItem,
} from "@mui/material";
import {
  Package,Clock,Truck,CheckCircle2,XCircle,X,MapPin,CreditCard,Eye,
} from "lucide-react";

import TableComponent from "../../../ui/TableComponent";
import ButtonComponent from "../../../ui/ButtonComponent";

/* ---------- mock data — swap for your API ---------- */
const initialOrders = [
  {
    id: 1,
    orderId: "WH-10231",
    customer: "Ananya Sharma",
    email: "ananya.sharma@gmail.com",
    items: [
      { name: "Banarasi Silk Saree", qty: 1, price: 4200 },
      { name: "Kundan Necklace Set", qty: 1, price: 1800 },
    ],
    total: 6000,
    payment: "paid",
    status: "processing",
    address: "14 MG Road, Indore, MP",
    date: "2026-07-02",
  },
  {
    id: 2,
    orderId: "WH-10232",
    customer: "Rhea Kapoor",
    email: "rhea.kapoor@gmail.com",
    items: [{ name: "Bridal Lehenga", qty: 1, price: 12500 }],
    total: 12500,
    payment: "paid",
    status: "shipped",
    address: "22 Palasia, Indore, MP",
    date: "2026-07-03",
  },
  {
    id: 3,
    orderId: "WH-10233",
    customer: "Meera Nair",
    email: "meera.nair@gmail.com",
    items: [{ name: "Anarkali Kurti", qty: 2, price: 1650 }],
    total: 3300,
    payment: "pending",
    status: "pending",
    address: "9 Vijay Nagar, Indore, MP",
    date: "2026-07-04",
  },
  {
    id: 4,
    orderId: "WH-10234",
    customer: "Divya Reddy",
    email: "divya.reddy@gmail.com",
    items: [{ name: "Cotton Handloom Saree", qty: 1, price: 2100 }],
    total: 2100,
    payment: "paid",
    status: "delivered",
    address: "5 Race Course Road, Indore, MP",
    date: "2026-06-28",
  },
  {
    id: 5,
    orderId: "WH-10235",
    customer: "Sana Sheikh",
    email: "sana.sheikh@gmail.com",
    items: [{ name: "Footwear — Juttis", qty: 1, price: 950 }],
    total: 950,
    payment: "failed",
    status: "cancelled",
    address: "3 Bhawarkuan, Indore, MP",
    date: "2026-06-30",
  },
];

const statusMeta = {
  pending: { label: "Pending", color: "#F59E0B", soft: "rgba(245,158,11,0.12)", icon: Clock },
  processing: { label: "Processing", color: "#3B82F6", soft: "rgba(59,130,246,0.12)", icon: Package },
  shipped: { label: "Shipped", color: "#9333EA", soft: "rgba(147,51,234,0.12)", icon: Truck },
  delivered: { label: "Delivered", color: "#0F9D58", soft: "rgba(15,157,88,0.12)", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "#F43F5E", soft: "rgba(244,63,94,0.12)", icon: XCircle },
};

const paymentMeta = {
  paid: { label: "Paid", color: "#0F9D58", soft: "rgba(15,157,88,0.1)" },
  pending: { label: "Payment pending", color: "#F59E0B", soft: "rgba(245,158,11,0.1)" },
  failed: { label: "Payment failed", color: "#F43F5E", soft: "rgba(244,63,94,0.1)" },
};

const currency = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const StatusChip = ({ status }) => {
  const meta = statusMeta[status];
  const Icon = meta.icon;
  return (
    <Chip
      size="small"
      icon={<Icon size={13} />}
      label={meta.label}
      sx={{
        height: 26,
        fontWeight: 600,
        fontSize: "12px",
        borderRadius: "8px",
        color: meta.color,
        backgroundColor: meta.soft,
        "& .MuiChip-icon": { color: "inherit", marginLeft: "8px" },
      }}
    />
  );
};

const PaymentChip = ({ payment }) => {
  const meta = paymentMeta[payment];
  return (
    <Chip
      size="small"
      label={meta.label}
      sx={{ height: 24, fontWeight: 600, fontSize: "11.5px", borderRadius: "7px", color: meta.color, backgroundColor: meta.soft }}
    />
  );
};

const StatCard = ({ icon, label, value, accent, delay }) => (
  <Grow in timeout={350 + delay}>
    <Box
      className="flex flex-1 items-center gap-3 rounded-2xl border p-4"
      sx={{ borderColor: "var(--whiold-border)", background: "var(--whiold-bg)", boxShadow: "var(--whiold-shadow-card)", minWidth: 170 }}
    >
      <Box className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" sx={{ background: accent.soft, color: accent.solid }}>
        {icon}
      </Box>
      <Box>
        <Typography sx={{ fontSize: 19, fontWeight: 700, color: "var(--whiold-text-heading)", lineHeight: 1.1 }}>{value}</Typography>
        <Typography sx={{ fontSize: 12, color: "var(--whiold-text-muted)", mt: 0.3 }}>{label}</Typography>
      </Box>
    </Box>
  </Grow>
);

const ManageOrder = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [viewOrder, setViewOrder] = useState(null);

  const stats = useMemo(() => {
    const counts = { pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 };
    let revenue = 0;
    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
      if (o.payment === "paid") revenue += o.total;
    });
    return { counts, revenue };
  }, [orders]);

  const updateStatus = (id, newStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
    setViewOrder((prev) => (prev && prev.id === id ? { ...prev, status: newStatus } : prev));
  };

  const columns = [
    {
      field: "orderId",
      headerName: "Order",
      flex: 1.3,
      minWidth: 210,
      renderCell: (params) => (
        <Box>
          <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: "var(--whiold-text-heading)" }}>{params.row.orderId}</Typography>
          <Typography sx={{ fontSize: 11.5, color: "var(--whiold-text-muted)" }}>{params.row.date}</Typography>
        </Box>
      ),
    },
    {
      field: "customer",
      headerName: "Customer",
      flex: 1.4,
      minWidth: 210,
      renderCell: (params) => (
        <Box className="flex h-full items-center gap-2">
          <Avatar sx={{ width: 30, height: 30, fontSize: 12.5, fontWeight: 700, background: "var(--whiold-gradient-brand)", color: "#fff" }}>
            {params.row.customer.charAt(0)}
          </Avatar>
          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: "var(--whiold-text-heading)" }}>{params.row.customer}</Typography>
            <Typography sx={{ fontSize: 11, color: "var(--whiold-text-muted)" }}>{params.row.email}</Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "total",
      headerName: "Total",
      flex: 0.8,
      minWidth: 110,
      renderCell: (params) => (
        <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: "var(--whiold-text-heading)" }}>{currency(params.value)}</Typography>
      ),
    },
    { field: "payment", headerName: "Payment", flex: 0.9, minWidth: 140, renderCell: (params) => <PaymentChip payment={params.value} /> },
    {
      field: "status",
      headerName: "Order Status",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Select
          size="small"
          value={params.value}
          onChange={(e) => updateStatus(params.row.id, e.target.value)}
          onClick={(e) => e.stopPropagation()}
          renderValue={(val) => <StatusChip status={val} />}
          sx={{
            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            "& .MuiSelect-select": { paddingY: "2px !important" },
          }}
        >
          {Object.entries(statusMeta).map(([key, meta]) => (
            <MenuItem key={key} value={key} sx={{ fontSize: 13 }}>
              {meta.label}
            </MenuItem>
          ))}
        </Select>
      ),
    },
    {
      field: "actions",
      headerName: "",
      flex: 0.5,
      minWidth: 70,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={() => setViewOrder(params.row)}
          sx={{ color: "var(--whiold-text-muted)", "&:hover": { color: "var(--whiold-primary)", background: "var(--whiold-primary-soft)" } }}
        >
          <Eye size={17} />
        </IconButton>
      ),
    },
  ];

  return (
    <Box className="flex flex-col gap-5">
      <Fade in timeout={350}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={2}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box className="flex h-11 w-11 items-center justify-center rounded-2xl" sx={{ background: "var(--whiold-primary-soft)", color: "var(--whiold-primary)" }}>
              <Package size={20} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 18, fontWeight: 700, color: "var(--whiold-text-heading)" }}>Manage Orders</Typography>
              <Typography sx={{ fontSize: 12.5, color: "var(--whiold-text-muted)" }}>Track and update every order in one place</Typography>
            </Box>
          </Stack>
        </Stack>
      </Fade>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} flexWrap="wrap" useFlexGap>
        <StatCard icon={<Clock size={18} />} label="Pending" value={stats.counts.pending} accent={{ soft: statusMeta.pending.soft, solid: statusMeta.pending.color }} delay={0} />
        <StatCard icon={<Package size={18} />} label="Processing" value={stats.counts.processing} accent={{ soft: statusMeta.processing.soft, solid: statusMeta.processing.color }} delay={80} />
        <StatCard icon={<Truck size={18} />} label="Shipped" value={stats.counts.shipped} accent={{ soft: statusMeta.shipped.soft, solid: statusMeta.shipped.color }} delay={160} />
        <StatCard icon={<CheckCircle2 size={18} />} label="Delivered" value={stats.counts.delivered} accent={{ soft: statusMeta.delivered.soft, solid: statusMeta.delivered.color }} delay={240} />
        <StatCard icon={<CreditCard size={18} />} label="Revenue collected" value={currency(stats.revenue)} accent={{ soft: "var(--whiold-primary-soft)", solid: "var(--whiold-primary)" }} delay={320} />
      </Stack>

      <TableComponent title="All Orders" rows={orders} columns={columns} />

      {/* Order detail drawer */}
      <Drawer anchor="right" open={Boolean(viewOrder)} onClose={() => setViewOrder(null)} PaperProps={{ sx: { width: { xs: "100%", sm: 420 }, borderRadius: "20px 0 0 20px" } }}>
        {viewOrder && (
          <Box className="flex h-full flex-col p-5">
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Box>
                <Typography sx={{ fontSize: 16, fontWeight: 700, color: "var(--whiold-text-heading)" }}>{viewOrder.orderId}</Typography>
                <Typography sx={{ fontSize: 12, color: "var(--whiold-text-muted)" }}>{viewOrder.date}</Typography>
              </Box>
              <IconButton size="small" onClick={() => setViewOrder(null)}>
                <X size={18} />
              </IconButton>
            </Stack>

            <StatusChip status={viewOrder.status} />

            <Divider sx={{ my: 2.5, borderColor: "var(--whiold-border)" }} />

            <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
              <Avatar sx={{ width: 40, height: 40, background: "var(--whiold-gradient-brand)", color: "#fff", fontWeight: 700 }}>
                {viewOrder.customer.charAt(0)}
              </Avatar>
              <Box>
                <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: "var(--whiold-text-heading)" }}>{viewOrder.customer}</Typography>
                <Typography sx={{ fontSize: 12, color: "var(--whiold-text-muted)" }}>{viewOrder.email}</Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="flex-start" mb={2.5}>
              <MapPin size={15} color="var(--whiold-text-muted)" style={{ marginTop: 2 }} />
              <Typography sx={{ fontSize: 12.5, color: "var(--whiold-text-body)" }}>{viewOrder.address}</Typography>
            </Stack>

            <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: "var(--whiold-text-heading)", mb: 1 }}>Items</Typography>
            <Stack spacing={1.2} mb={2.5}>
              {viewOrder.items.map((item, i) => (
                <Stack key={i} direction="row" justifyContent="space-between" sx={{ fontSize: 13 }}>
                  <Typography sx={{ fontSize: 13, color: "var(--whiold-text-body)" }}>
                    {item.name} <span style={{ color: "var(--whiold-text-muted)" }}>× {item.qty}</span>
                  </Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: "var(--whiold-text-heading)" }}>{currency(item.price * item.qty)}</Typography>
                </Stack>
              ))}
            </Stack>

            <Divider sx={{ mb: 2, borderColor: "var(--whiold-border)" }} />

            <Stack direction="row" justifyContent="space-between" mb={3}>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: "var(--whiold-text-heading)" }}>Total</Typography>
              <Typography sx={{ fontSize: 15, fontWeight: 700, color: "var(--whiold-primary)" }}>{currency(viewOrder.total)}</Typography>
            </Stack>

            <Box mt="auto">
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: "var(--whiold-text-muted)", mb: 1 }}>Update status</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {Object.entries(statusMeta).map(([key, meta]) => (
                  <ButtonComponent
                    key={key}
                    size="small"
                    variant={viewOrder.status === key ? "contained" : "outlined"}
                    color={viewOrder.status === key ? "primary" : "inherit"}
                    onClick={() => updateStatus(viewOrder.id, key)}
                  >
                    {meta.label}
                  </ButtonComponent>
                ))}
              </Stack>
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  );
};

export default ManageOrder