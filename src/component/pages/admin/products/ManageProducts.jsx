import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  Plus,
  ImageOff,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  X,
} from "lucide-react";
import ButtonComponent from "../../../ui/ButtonComponent";
import InputComponent from "../../../ui/InputComponent";
import { useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────────────────────────
   Dummy data — apne API call se replace kar dena (e.g. useEffect
   + fetch /admin/products). Shape same rakhna taaki neeche ka
   logic bina change ke chal jaaye.
───────────────────────────────────────────────────────────── */
const DUMMY_PRODUCTS = [
  {
    id: "1",
    name: "Copperline ceramic mug",
    sku: "HOM-COPP-4821",
    category: "Home & living",
    price: 649,
    stock: 42,
    status: "active",
    image: "",
  },
  {
    id: "2",
    name: "Terra glow face serum",
    sku: "BEA-TERR-1092",
    category: "Beauty & personal care",
    price: 899,
    stock: 6,
    status: "active",
    image: "",
  },
  {
    id: "3",
    name: "Nightshade wireless earbuds",
    sku: "ELE-NIGH-3345",
    category: "Electronics",
    price: 2499,
    stock: 0,
    status: "draft",
    image: "",
  },
  {
    id: "4",
    name: "Weekend linen shirt",
    sku: "APP-WEEK-7710",
    category: "Apparel",
    price: 1299,
    stock: 18,
    status: "active",
    image: "",
  },
];

const CATEGORY_OPTIONS = [
  { value: "", label: "All categories" },
  { value: "Electronics", label: "Electronics" },
  { value: "Apparel", label: "Apparel" },
  { value: "Home & living", label: "Home & living" },
  { value: "Beauty & personal care", label: "Beauty & personal care" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
];

const PAGE_SIZE = 5;

const StatusPill = ({ status }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
      status === "active"
        ? "bg-[var(--whiold-primary-soft)] text-[var(--whiold-primary)]"
        : "bg-[var(--whiold-bg-soft)] text-[var(--whiold-text-muted)]"
    }`}
  >
    <span
      className={`h-1.5 w-1.5 rounded-full ${
        status === "active" ? "bg-[var(--whiold-primary)]" : "bg-[var(--whiold-text-muted)]"
      }`}
    />
    {status === "active" ? "Active" : "Draft"}
  </span>
);

const StockBadge = ({ stock }) => {
  const isLow = stock > 0 && stock <= 10;
  const isOut = stock === 0;
  return (
    <span
      className={`inline-flex items-center gap-1 text-[12.5px] font-medium ${
        isOut ? "text-[#C0392B]" : isLow ? "text-[var(--whiold-600)]" : "text-[var(--whiold-text-body)]"
      }`}
    >
      {(isLow || isOut) && <AlertTriangle size={12} />}
      {isOut ? "Out of stock" : `${stock} in stock`}
    </span>
  );
};

const ProductThumb = ({ image, name }) => (
  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-[var(--whiold-radius-sm)] border border-[var(--whiold-border)] bg-[var(--whiold-bg-soft)]">
    {image ? (
      <img src={image} alt={name} className="h-full w-full object-cover" />
    ) : (
      <ImageOff size={16} className="text-[var(--whiold-text-muted)]" />
    )}
  </div>
);

const RowActions = ({ onView, onEdit, onDelete }) => (
  <div className="flex items-center gap-1">
    <button
      type="button"
      onClick={onView}
      className="rounded-[8px] p-2 text-[var(--whiold-text-muted)] transition-colors duration-200 hover:!bg-[var(--whiold-bg-soft)] hover:!text-[var(--whiold-text-body)]"
      aria-label="View product"
    >
      <Eye size={15} />
    </button>
    <button
      type="button"
      onClick={onEdit}
      className="rounded-[8px] p-2 text-[var(--whiold-text-muted)] transition-colors duration-200 hover:!bg-[var(--whiold-primary-soft)] hover:!text-[var(--whiold-primary)]"
      aria-label="Edit product"
    >
      <Edit3 size={15} />
    </button>
    <button
      type="button"
      onClick={onDelete}
      className="rounded-[8px] p-2 text-[var(--whiold-text-muted)] transition-colors duration-200 hover:!bg-[#FDECEA] hover:!text-[#C0392B]"
      aria-label="Delete product"
    >
      <Trash2 size={15} />
    </button>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   Delete confirmation — lightweight inline modal (SweetAlert2
   use karti hai agar wo already project mein set hai to us
   'alertService.js' se yahan swap kar sakti hai).
───────────────────────────────────────────────────────────── */
const DeleteConfirmModal = ({ product, onCancel, onConfirm }) => {
  if (!product) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-[380px] rounded-[var(--whiold-radius-lg)] border border-[var(--whiold-border)] bg-[var(--whiold-bg)] p-6 shadow-[var(--whiold-shadow-card)]">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FDECEA] text-[#C0392B]">
            <AlertTriangle size={18} />
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full p-1 text-[var(--whiold-text-muted)] transition-colors duration-200 hover:!bg-[var(--whiold-bg-soft)]"
          >
            <X size={16} />
          </button>
        </div>
        <h3 className="mb-1.5 text-[16px] font-semibold text-[var(--whiold-text-heading)]">Delete product</h3>
        <p className="mb-5 text-[13.5px] leading-relaxed text-[var(--whiold-text-body)]">
          "{product.name}" will be removed permanently. This cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <ButtonComponent variant="outlined" onClick={onCancel} sx={{ color: "var(--whiold-text-body)" }}>
            Cancel
          </ButtonComponent>
          <ButtonComponent
            onClick={() => onConfirm(product.id)}
            sx={{
              background: "#C0392B",
              "&:hover": { background: "#A5301F" },
            }}
          >
            Delete
          </ButtonComponent>
        </div>
      </div>
    </div>
  );
};

const ManageProduct = ({ onEditProduct, onViewProduct, onDeleteProduct }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(DUMMY_PRODUCTS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [productToDelete, setProductToDelete] = useState(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !search.trim() ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !category || p.category === category;
      const matchesStatus = !status || p.status === status;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, category, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const handleDeleteConfirm = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    onDeleteProduct?.(id);
    setProductToDelete(null);
  };

  const hasResults = paginated.length > 0;

  return (
    <div className="mx-auto max-w-[1180px] px-4 py-6">
      {/* ── Header ── */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[var(--whiold-text-heading)]">Manage products</h1>
          <p className="text-[13.5px] text-[var(--whiold-text-body)]">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <ButtonComponent onClick={() => navigate("/admin/products/add")} sx={{ alignSelf: "flex-start" }}>
          <Plus size={16} style={{ marginRight: 6 }} />
          Add product
        </ButtonComponent>
      </div>

      {/* ── Filters ── */}
      <div className="mb-5 grid grid-cols-1 gap-3 rounded-[var(--whiold-radius-lg)] border border-[var(--whiold-border)] bg-[var(--whiold-bg)] p-4 sm:grid-cols-[minmax(0,1fr)_200px_180px]">
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--whiold-text-muted)]"
          />
          <input
            value={search}
            onChange={(e) => handleFilterChange(setSearch)(e.target.value)}
            placeholder="Search by name or SKU"
            className="h-[44px] w-full rounded-[var(--whiold-radius-sm)] border border-[var(--whiold-border)] bg-[var(--whiold-bg-input)] pl-9 pr-3 text-[13.5px] text-[var(--whiold-text-heading)] outline-none transition-colors duration-200 placeholder:text-[var(--whiold-text-muted)] focus:!border-[var(--whiold-border-focus)] focus:!shadow-[var(--whiold-shadow-focus)]"
          />
        </div>

        <InputComponent
          type="select"
          value={category}
          onChange={(e) => handleFilterChange(setCategory)(e.target.value)}
          options={CATEGORY_OPTIONS}
          label={undefined}
          placeholder="Category"
        />

        <InputComponent
          type="select"
          value={status}
          onChange={(e) => handleFilterChange(setStatus)(e.target.value)}
          options={STATUS_OPTIONS}
          label={undefined}
          placeholder="Status"
        />
      </div>

      {/* ── Desktop table ── */}
      <div className="hidden overflow-hidden rounded-[var(--whiold-radius-lg)] border border-[var(--whiold-border)] bg-[var(--whiold-bg)] md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[var(--whiold-border)] bg-[var(--whiold-bg-soft)]">
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--whiold-text-muted)]">
                Product
              </th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--whiold-text-muted)]">
                Category
              </th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--whiold-text-muted)]">
                Price
              </th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--whiold-text-muted)]">
                Stock
              </th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--whiold-text-muted)]">
                Status
              </th>
              <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-[var(--whiold-text-muted)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((product) => (
              <tr
                key={product.id}
                className="border-b border-[var(--whiold-border)] transition-colors duration-200 last:border-b-0 hover:!bg-[var(--whiold-bg-soft)]"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <ProductThumb image={product.image} name={product.name} />
                    <div>
                      <p className="text-[13.5px] font-semibold text-[var(--whiold-text-heading)]">{product.name}</p>
                      <p className="font-mono text-[11px] text-[var(--whiold-text-muted)]">{product.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-[13px] text-[var(--whiold-text-body)]">{product.category}</td>
                <td className="px-5 py-3.5 text-[13.5px] font-semibold text-[var(--whiold-text-heading)]">
                  ₹{product.price.toLocaleString("en-IN")}
                </td>
                <td className="px-5 py-3.5">
                  <StockBadge stock={product.stock} />
                </td>
                <td className="px-5 py-3.5">
                  <StatusPill status={product.status} />
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex justify-end">
                    <RowActions
                      onView={() => onViewProduct?.(product)}
                      onEdit={() => onEditProduct?.(product)}
                      onDelete={() => setProductToDelete(product)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!hasResults && <EmptyState />}
      </div>

      {/* ── Mobile cards ── */}
      <div className="flex flex-col gap-3 md:hidden">
        {paginated.map((product) => (
          <div
            key={product.id}
            className="rounded-[var(--whiold-radius-lg)] border border-[var(--whiold-border)] bg-[var(--whiold-bg)] p-4"
          >
            <div className="mb-3 flex items-start gap-3">
              <ProductThumb image={product.image} name={product.name} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-[var(--whiold-text-heading)]">{product.name}</p>
                <p className="font-mono text-[11px] text-[var(--whiold-text-muted)]">{product.sku}</p>
                <p className="mt-0.5 text-[12.5px] text-[var(--whiold-text-body)]">{product.category}</p>
              </div>
              <StatusPill status={product.status} />
            </div>

            <div className="mb-3 flex items-center justify-between border-t border-[var(--whiold-border)] pt-3">
              <span className="text-[15px] font-semibold text-[var(--whiold-text-heading)]">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              <StockBadge stock={product.stock} />
            </div>

            <div className="flex justify-end border-t border-[var(--whiold-border)] pt-2">
              <RowActions
                onView={() => onViewProduct?.(product)}
                onEdit={() => onEditProduct?.(product)}
                onDelete={() => setProductToDelete(product)}
              />
            </div>
          </div>
        ))}

        {!hasResults && <EmptyState />}
      </div>

      {/* ── Pagination ── */}
      {hasResults && (
        <div className="mt-5 flex items-center justify-between">
          <p className="text-[12.5px] text-[var(--whiold-text-muted)]">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-[var(--whiold-border)] text-[var(--whiold-text-body)] transition-colors duration-200 hover:!border-[var(--whiold-primary)] hover:!text-[var(--whiold-primary)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-[var(--whiold-border)] text-[var(--whiold-text-body)] transition-colors duration-200 hover:!border-[var(--whiold-primary)] hover:!text-[var(--whiold-primary)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        product={productToDelete}
        onCancel={() => setProductToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--whiold-bg-soft)] text-[var(--whiold-text-muted)]">
      <Filter size={20} />
    </div>
    <p className="text-[14px] font-semibold text-[var(--whiold-text-heading)]">No products match these filters</p>
    <p className="text-[13px] text-[var(--whiold-text-muted)]">Try adjusting your search or filters.</p>
  </div>
);

export default ManageProduct;