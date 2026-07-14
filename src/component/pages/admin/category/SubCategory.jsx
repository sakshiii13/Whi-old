import { useMemo, useState } from "react";
import {
  Box,Stack,Typography,Chip,Avatar,Dialog,DialogContent,DialogTitle,IconButton,Divider,Slide,Fade,Grow,
} from "@mui/material";
import {
  Layers,Plus,Pencil,Trash2,X,ChevronRight,FolderTree,CircleCheck,CircleSlash,
} from "lucide-react";

import TableComponent from "../../../ui/TableComponent";
import ButtonComponent from "../../../ui/ButtonComponent";
import InputComponent from "../../../ui/InputComponent";

const slideProps = { direction: "up" };

/* ---------- mock data — swap for your API ---------- */
const parentCategories = ["Sarees", "Lehengas", "Kurtis", "Jewellery", "Footwear"];

const initialSubcategories = [
  { id: 1, name: "Banarasi Silk", category: "Sarees", slug: "banarasi-silk", status: "active", products: 38 },
  { id: 2, name: "Cotton Handloom", category: "Sarees", slug: "cotton-handloom", status: "active", products: 51 },
  { id: 3, name: "Bridal Lehengas", category: "Lehengas", slug: "bridal-lehengas", status: "active", products: 22 },
  { id: 4, name: "Anarkali Kurtis", category: "Kurtis", slug: "anarkali-kurtis", status: "inactive", products: 64 },
  { id: 5, name: "Necklace Sets", category: "Jewellery", slug: "necklace-sets", status: "active", products: 19 },
];

const catColor = (name) => {
  const palette = ["#BA704F", "#3B82F6", "#0F9D58", "#9333EA", "#F59E0B"];
  const idx = parentCategories.indexOf(name) % palette.length;
  return palette[idx] ?? "#BA704F";
};

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
      sx={{ borderColor: "var(--whiold-border)", background: "var(--whiold-bg)", boxShadow: "var(--whiold-shadow-card)", minWidth: 200 }}
    >
      <Box className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" sx={{ background: accent.soft, color: accent.solid }}>
        {icon}
      </Box>
      <Box>
        <Typography sx={{ fontSize: 20, fontWeight: 700, color: "var(--whiold-text-heading)", lineHeight: 1.1 }}>{value}</Typography>
        <Typography sx={{ fontSize: 12.5, color: "var(--whiold-text-muted)", mt: 0.3 }}>{label}</Typography>
      </Box>
    </Box>
  </Grow>
);

const emptyForm = { name: "", category: parentCategories[0], slug: "", status: "active" };

const Subcategory = () => {
  const [subcategories, setSubcategories] = useState(initialSubcategories);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const stats = useMemo(() => {
    const active = subcategories.filter((s) => s.status === "active").length;
    const parentsUsed = new Set(subcategories.map((s) => s.category)).size;
    return { total: subcategories.length, active, parentsUsed };
  }, [subcategories]);

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEditModal = (row) => {
    setEditingId(row.id);
    setForm({ name: row.name, category: row.category, slug: row.slug, status: row.status });
    setOpen(true);
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setForm((f) => ({ ...f, name, slug: editingId ? f.slug : name.toLowerCase().trim().replace(/\s+/g, "-") }));
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editingId) {
      setSubcategories((prev) => prev.map((s) => (s.id === editingId ? { ...s, ...form } : s)));
    } else {
      setSubcategories((prev) => [...prev, { id: Date.now(), ...form, products: 0 }]);
    }
    setOpen(false);
  };

  const handleDelete = (id) => {
    setSubcategories((prev) => prev.filter((s) => s.id !== id));
    setConfirmDeleteId(null);
  };

  const columns = [
    {
      field: "name",
      headerName: "Subcategory",
      flex: 1.6,
      minWidth: 260,
      renderCell: (params) => (
        <Box className="flex h-full items-center gap-2">
          <Chip
            size="small"
            label={params.row.category}
            sx={{
              height: 22,
              fontSize: 11,
              fontWeight: 700,
              borderRadius: "7px",
              color: catColor(params.row.category),
              backgroundColor: `${catColor(params.row.category)}1A`,
            }}
          />
          <ChevronRight size={14} color="var(--whiold-text-muted)" />
          <Box>
            <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: "var(--whiold-text-heading)" }}>{params.row.name}</Typography>
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
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: "var(--whiold-text-body)" }}>{params.value}</Typography>
      ),
    },
    { field: "status", headerName: "Status", flex: 0.8, minWidth: 120, renderCell: (params) => <StatusChip status={params.value} /> },
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
      <Fade in timeout={350}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={2}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box className="flex h-11 w-11 items-center justify-center rounded-2xl" sx={{ background: "var(--whiold-primary-soft)", color: "var(--whiold-primary)" }}>
              <Layers size={20} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 18, fontWeight: 700, color: "var(--whiold-text-heading)" }}>Subcategories</Typography>
              <Typography sx={{ fontSize: 12.5, color: "var(--whiold-text-muted)" }}>
                Nest finer groupings under each parent category
              </Typography>
            </Box>
          </Stack>
          <ButtonComponent color="primary" variant="contained" startIcon={<Plus size={17} />} onClick={openAddModal}>
            Add Subcategory
          </ButtonComponent>
        </Stack>
      </Fade>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <StatCard icon={<FolderTree size={20} />} label="Total subcategories" value={stats.total} accent={{ soft: "var(--whiold-primary-soft)", solid: "var(--whiold-primary)" }} delay={0} />
        <StatCard icon={<CircleCheck size={20} />} label="Active" value={stats.active} accent={{ soft: "rgba(15,157,88,0.1)", solid: "#0F9D58" }} delay={120} />
        <StatCard icon={<Layers size={20} />} label="Parent categories used" value={stats.parentsUsed} accent={{ soft: "rgba(147,51,234,0.1)", solid: "#9333EA" }} delay={240} />
      </Stack>

      <TableComponent title="All Subcategories" rows={subcategories} columns={columns} />

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth TransitionComponent={Slide} TransitionProps={slideProps} PaperProps={{ sx: { borderRadius: "20px" } }}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 16, color: "var(--whiold-text-heading)" }}>
            {editingId ? "Edit Subcategory" : "New Subcategory"}
          </Typography>
          <IconButton size="small" onClick={() => setOpen(false)}>
            <X size={18} />
          </IconButton>
        </DialogTitle>
        <Divider sx={{ borderColor: "var(--whiold-border)" }} />
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={2.2}>
            <InputComponent
              label="Parent category"
              type="select"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              options={parentCategories.map((c) => ({ value: c, label: c }))}
              fullWidth
            />
            <InputComponent label="Subcategory name" value={form.name} onChange={handleNameChange} required fullWidth />
            <InputComponent label="Slug" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} helperText="Used in the product URL" fullWidth />
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
                {editingId ? "Save changes" : "Create subcategory"}
              </ButtonComponent>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(confirmDeleteId)} onClose={() => setConfirmDeleteId(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}>
        <DialogContent>
          <Box className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl" sx={{ background: "rgba(244,63,94,0.1)", color: "#F43F5E" }}>
            <Trash2 size={20} />
          </Box>
          <Typography align="center" sx={{ fontWeight: 700, fontSize: 15, color: "var(--whiold-text-heading)" }}>
            Delete this subcategory?
          </Typography>
          <Typography align="center" sx={{ fontSize: 13, color: "var(--whiold-text-muted)", mt: 0.5, mb: 3 }}>
            Products inside it will move back to their parent category only.
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

export default Subcategory;