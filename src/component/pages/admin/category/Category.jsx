import { useMemo, useState } from "react";
import {
  Box,Stack,Typography,Chip,Avatar,Dialog,DialogContent,DialogTitle,IconButton,Divider,Slide,Fade,Grow,
} from "@mui/material";
import {
  Tag,Plus,Pencil,Trash2,X,ImagePlus,Layers,CircleCheck,CircleSlash,
} from "lucide-react";

import TableComponent from "../../../ui/TableComponent";
import ButtonComponent from "../../../ui/ButtonComponent";
import InputComponent from "../../../ui/InputComponent";

/* Dialog slide-up transition */
const SlideUp = Slide;
const slideProps = { direction: "up" };

/* ---------- mock data — swap for your API ---------- */
const initialCategories = [
  { id: 1, name: "Sarees", slug: "sarees", image: "", status: "active", products: 128, createdAt: "2026-02-11" },
  { id: 2, name: "Lehengas", slug: "lehengas", image: "", status: "active", products: 76, createdAt: "2026-02-18" },
  { id: 3, name: "Kurtis", slug: "kurtis", image: "", status: "active", products: 214, createdAt: "2026-03-02" },
  { id: 4, name: "Jewellery", slug: "jewellery", image: "", status: "inactive", products: 42, createdAt: "2026-03-15" },
  { id: 5, name: "Footwear", slug: "footwear", image: "", status: "active", products: 63, createdAt: "2026-04-01" },
];

/* ---------- small presentational bits ---------- */
const StatusChip = ({ status }) => {
  const isActive = status === "active";
  return (
    <Chip
      size="small"
      icon={isActive ? <CircleCheck size={14} /> : <CircleSlash size={14} />}
      label={isActive ? "Active" : "Inactive"}
      sx={{
        height: 26,
        fontWeight: 600,
        fontSize: "12px",
        borderRadius: "8px",
        color: isActive ? "#0F9D58" : "#94A3B8",
        backgroundColor: isActive ? "rgba(15,157,88,0.1)" : "rgba(148,163,184,0.14)",
        "& .MuiChip-icon": { color: "inherit", marginLeft: "8px" },
      }}
    />
  );
};

const StatCard = ({ icon, label, value, accent, delay }) => (
  <Grow in timeout={400 + delay}>
    <Box
      className="flex flex-1 items-center gap-3 rounded-2xl border p-4"
      sx={{
        borderColor: "var(--whiold-border)",
        background: "var(--whiold-bg)",
        boxShadow: "var(--whiold-shadow-card)",
        minWidth: 200,
      }}
    >
      <Box
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
        sx={{ background: accent.soft, color: accent.solid }}
      >
        {icon}
      </Box>
      <Box>
        <Typography sx={{ fontSize: 20, fontWeight: 700, color: "var(--whiold-text-heading)", lineHeight: 1.1 }}>
          {value}
        </Typography>
        <Typography sx={{ fontSize: 12.5, color: "var(--whiold-text-muted)", mt: 0.3 }}>{label}</Typography>
      </Box>
    </Box>
  </Grow>
);

const emptyForm = { name: "", slug: "", image: "", status: "active" };

const Category = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const stats = useMemo(() => {
    const active = categories.filter((c) => c.status === "active").length;
    const totalProducts = categories.reduce((sum, c) => sum + c.products, 0);
    return { total: categories.length, active, totalProducts };
  }, [categories]);

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEditModal = (row) => {
    setEditingId(row.id);
    setForm({ name: row.name, slug: row.slug, image: row.image, status: row.status });
    setOpen(true);
  };

  const handleImagePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setForm((f) => ({
      ...f,
      name,
      slug: editingId ? f.slug : name.toLowerCase().trim().replace(/\s+/g, "-"),
    }));
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editingId) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editingId ? { ...c, ...form } : c))
      );
    } else {
      setCategories((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...form,
          products: 0,
          createdAt: new Date().toISOString().slice(0, 10),
        },
      ]);
    }
    setOpen(false);
  };

  const handleDelete = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setConfirmDeleteId(null);
  };

  const columns = [
    {
      field: "name",
      headerName: "Category",
      flex: 1.4,
      minWidth: 200,
      renderCell: (params) => (
        <Box className="flex h-full items-center gap-2.5">
          <Avatar
            src={params.row.image || undefined}
            variant="rounded"
            sx={{
              width: 34,
              height: 34,
              borderRadius: "9px",
              fontSize: 13,
              fontWeight: 700,
              background: "var(--whiold-gradient-brand)",
              color: "#fff",
            }}
          >
            {params.row.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: "var(--whiold-text-heading)" }}>
              {params.row.name}
            </Typography>
            <Typography sx={{ fontSize: 11.5, color: "var(--whiold-text-muted)" }}>/{params.row.slug}</Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "products",
      headerName: "Products",
      flex: 0.7,
      minWidth: 110,
      renderCell: (params) => (
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: "var(--whiold-text-body)" }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      minWidth: 120,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
    { field: "createdAt", headerName: "Created", flex: 0.8, minWidth: 120 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.7,
      minWidth: 110,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <IconButton
            size="small"
            onClick={() => openEditModal(params.row)}
            sx={{ color: "var(--whiold-text-muted)", "&:hover": { color: "var(--whiold-primary)", background: "var(--whiold-primary-soft)" } }}
          >
            <Pencil size={16} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setConfirmDeleteId(params.row.id)}
            sx={{ color: "var(--whiold-text-muted)", "&:hover": { color: "#F43F5E", background: "rgba(244,63,94,0.08)" } }}
          >
            <Trash2 size={16} />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box className="flex flex-col gap-5">
      {/* Header */}
      <Fade in timeout={350}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={2}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              className="flex h-11 w-11 items-center justify-center rounded-2xl"
              sx={{ background: "var(--whiold-primary-soft)", color: "var(--whiold-primary)" }}
            >
              <Tag size={20} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 18, fontWeight: 700, color: "var(--whiold-text-heading)" }}>
                Categories
              </Typography>
              <Typography sx={{ fontSize: 12.5, color: "var(--whiold-text-muted)" }}>
                Organize how products are grouped across the storefront
              </Typography>
            </Box>
          </Stack>
          <ButtonComponent color="primary" variant="contained" startIcon={<Plus size={17} />} onClick={openAddModal}>
            Add Category
          </ButtonComponent>
        </Stack>
      </Fade>

      {/* Stats */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <StatCard
          icon={<Layers size={20} />}
          label="Total categories"
          value={stats.total}
          accent={{ soft: "var(--whiold-primary-soft)", solid: "var(--whiold-primary)" }}
          delay={0}
        />
        <StatCard
          icon={<CircleCheck size={20} />}
          label="Active"
          value={stats.active}
          accent={{ soft: "rgba(15,157,88,0.1)", solid: "#0F9D58" }}
          delay={120}
        />
        <StatCard
          icon={<Tag size={20} />}
          label="Products linked"
          value={stats.totalProducts}
          accent={{ soft: "rgba(59,130,246,0.1)", solid: "#3B82F6" }}
          delay={240}
        />
      </Stack>

      <TableComponent title="All Categories" rows={categories} columns={columns} />

      {/* Add / Edit modal */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
        TransitionComponent={SlideUp}
        TransitionProps={slideProps}
        PaperProps={{ sx: { borderRadius: "20px" } }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 16, color: "var(--whiold-text-heading)" }}>
            {editingId ? "Edit Category" : "New Category"}
          </Typography>
          <IconButton size="small" onClick={() => setOpen(false)}>
            <X size={18} />
          </IconButton>
        </DialogTitle>
        <Divider sx={{ borderColor: "var(--whiold-border)" }} />
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={2.2}>
            <label
              htmlFor="cat-image"
              className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed p-3 transition-colors"
              style={{ borderColor: "var(--whiold-border)" }}
            >
              <Avatar
                src={form.image || undefined}
                variant="rounded"
                sx={{ width: 48, height: 48, borderRadius: "12px", background: "var(--whiold-primary-soft)", color: "var(--whiold-primary)" }}
              >
                <ImagePlus size={20} />
              </Avatar>
              <Box>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: "var(--whiold-text-heading)" }}>
                  {form.image ? "Change image" : "Upload category image"}
                </Typography>
                <Typography sx={{ fontSize: 11.5, color: "var(--whiold-text-muted)" }}>PNG or JPG, square works best</Typography>
              </Box>
              <input id="cat-image" type="file" accept="image/*" hidden onChange={handleImagePick} />
            </label>

            <InputComponent label="Category name" value={form.name} onChange={handleNameChange} required fullWidth />
            <InputComponent
              label="Slug"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              helperText="Used in the product URL"
              fullWidth
            />
            <InputComponent
              label="Status"
              type="select"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
              fullWidth
            />

            <Stack direction="row" spacing={1.5} justifyContent="flex-end" pt={1}>
              <ButtonComponent variant="outlined" color="inherit" onClick={() => setOpen(false)}>
                Cancel
              </ButtonComponent>
              <ButtonComponent color="primary" variant="contained" onClick={handleSave}>
                {editingId ? "Save changes" : "Create category"}
              </ButtonComponent>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog
        open={Boolean(confirmDeleteId)}
        onClose={() => setConfirmDeleteId(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}
      >
        <DialogContent>
          <Box
            className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl"
            sx={{ background: "rgba(244,63,94,0.1)", color: "#F43F5E" }}
          >
            <Trash2 size={20} />
          </Box>
          <Typography align="center" sx={{ fontWeight: 700, fontSize: 15, color: "var(--whiold-text-heading)" }}>
            Delete this category?
          </Typography>
          <Typography align="center" sx={{ fontSize: 13, color: "var(--whiold-text-muted)", mt: 0.5, mb: 3 }}>
            Products inside it won't be deleted, but they'll lose this grouping.
          </Typography>
          <Stack direction="row" spacing={1.5}>
            <ButtonComponent fullWidth variant="outlined" color="inherit" onClick={() => setConfirmDeleteId(null)}>
              Cancel
            </ButtonComponent>
            <ButtonComponent fullWidth color="error" variant="contained" onClick={() => handleDelete(confirmDeleteId)}>
              Delete
            </ButtonComponent>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Category;