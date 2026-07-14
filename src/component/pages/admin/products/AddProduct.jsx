import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Package,
  Tag,
  Layers,
  ImageIcon,
  CheckCircle2,
  Plus,
  Trash2,
  RefreshCw,
  ChevronRight,
  ChevronLeft as ChevronLeftIcon,
  ImageOff,
} from "lucide-react";
import ButtonComponent from "../../../ui/ButtonComponent";
import InputComponent from "../../../ui/InputComponent";

/* ─────────────────────────────────────────────────────────────
   Static config — Tailwind JIT ke liye static rakha hai, kabhi
   template-literal se class mat banana (dynamic classes purge
   ho jaati hain build ke time).
───────────────────────────────────────────────────────────── */
const STEPS = [
  { key: "basic", label: "Basic details", icon: Package },
  { key: "pricing", label: "Pricing & stock", icon: Tag },
  { key: "variants", label: "Variants", icon: Layers },
  { key: "media", label: "Media", icon: ImageIcon },
  { key: "review", label: "Review", icon: CheckCircle2 },
];

const CATEGORY_OPTIONS = [
  { value: "electronics", label: "Electronics" },
  { value: "apparel", label: "Apparel" },
  { value: "home", label: "Home & living" },
  { value: "beauty", label: "Beauty & personal care" },
];

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
];

const emptyVariant = () => ({
  id: crypto.randomUUID(),
  attribute: "",
  value: "",
  stock: "",
  priceDelta: "",
});

const emptyImage = () => ({ id: crypto.randomUUID(), url: "" });

const generateSku = (name, category) => {
  const namePart = (name || "PRD").replace(/[^a-zA-Z0-9]/g, "").slice(0, 4).toUpperCase() || "PRD";
  const catPart = (category || "GEN").slice(0, 3).toUpperCase();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${catPart}-${namePart}-${rand}`;
};

/* ───────────────────────────────── Live preview card ──────────────────────────────── */
const ProductPreviewCard = ({ data }) => {
  const primaryImage = data.images.find((img) => img.url.trim())?.url;
  const hasCompare = Number(data.comparePrice) > Number(data.price || 0);

  return (
    <div className="sticky top-6 rounded-[var(--whiold-radius-lg)] border border-[var(--whiold-border)] bg-[var(--whiold-bg)] p-5 shadow-[var(--whiold-shadow-card)]">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-mono text-[10.5px] font-semibold uppercase tracking-wider text-[var(--whiold-text-muted)]">
          Live preview
        </p>
        <span className="rounded-full bg-[var(--whiold-primary-soft)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--whiold-primary)]">
          {data.status === "active" ? "Active" : "Draft"}
        </span>
      </div>

      <div className="mb-4 flex h-44 w-full items-center justify-center overflow-hidden rounded-[var(--whiold-radius-md)] bg-[var(--whiold-bg-soft)]">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={data.name || "Product preview"}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className={`h-full w-full flex-col items-center justify-center gap-2 text-[var(--whiold-text-muted)] ${
            primaryImage ? "hidden" : "flex"
          }`}
        >
          <ImageOff size={26} strokeWidth={1.5} />
          <span className="font-mono text-[11px]">No image yet</span>
        </div>
      </div>

      {data.category && (
        <p className="mb-1 font-mono text-[10.5px] font-semibold uppercase tracking-wider text-[var(--whiold-primary)]">
          {CATEGORY_OPTIONS.find((c) => c.value === data.category)?.label || data.category}
        </p>
      )}

      <h3 className="mb-1 text-[16px] font-semibold leading-snug text-[var(--whiold-text-heading)]">
        {data.name || "Your product name will appear here"}
      </h3>

      <p className="mb-3 line-clamp-2 text-[12.5px] leading-relaxed text-[var(--whiold-text-body)]">
        {data.description || "A short description will show here once you write it."}
      </p>

      <div className="mb-3 flex items-baseline gap-2">
        <span className="text-[19px] font-bold text-[var(--whiold-text-heading)]">
          ₹{data.price ? Number(data.price).toLocaleString("en-IN") : "0"}
        </span>
        {hasCompare && (
          <span className="text-[13px] text-[var(--whiold-text-muted)] line-through">
            ₹{Number(data.comparePrice).toLocaleString("en-IN")}
          </span>
        )}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-[var(--whiold-border)] px-2.5 py-1 text-[10.5px] font-medium text-[var(--whiold-text-body)]">
          Stock: {data.stock || 0}
        </span>
        {data.sku && (
          <span className="rounded-full border border-[var(--whiold-border)] px-2.5 py-1 font-mono text-[10.5px] font-medium text-[var(--whiold-text-body)]">
            {data.sku}
          </span>
        )}
      </div>

      {data.variants.some((v) => v.value) && (
        <div className="flex flex-wrap gap-1.5 border-t border-[var(--whiold-border)] pt-3">
          {data.variants
            .filter((v) => v.value)
            .map((v) => (
              <span
                key={v.id}
                className="rounded-[8px] bg-[var(--whiold-bg-soft)] px-2 py-1 text-[10.5px] font-medium text-[var(--whiold-text-body)]"
              >
                {v.attribute ? `${v.attribute}: ` : ""}
                {v.value}
              </span>
            ))}
        </div>
      )}
    </div>
  );
};

/* ───────────────────────────────── Copper thread stepper ──────────────────────────────── */
const StepRail = ({ activeIndex, onStepClick, furthestReached }) => (
  <div className="flex flex-col gap-0">
    {STEPS.map((step, index) => {
      const Icon = step.icon;
      const isActive = index === activeIndex;
      const isDone = index < activeIndex;
      const isClickable = index <= furthestReached;

      return (
        <div key={step.key} className="flex gap-3">
          <div className="flex flex-col items-center">
            <button
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onStepClick(index)}
              className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border transition-all duration-300 ease-out ${
                isActive
                  ? "border-[var(--whiold-primary)] bg-[var(--whiold-primary)] text-white shadow-[var(--whiold-shadow-btn)]"
                  : isDone
                  ? "border-[var(--whiold-primary)] bg-[var(--whiold-primary-soft)] text-[var(--whiold-primary)]"
                  : "border-[var(--whiold-border)] bg-[var(--whiold-bg)] text-[var(--whiold-text-muted)]"
              } ${isClickable ? "cursor-pointer hover:!border-[var(--whiold-primary)]" : "cursor-not-allowed"}`}
            >
              {isDone ? <CheckCircle2 size={16} /> : <Icon size={15} />}
            </button>
            {index < STEPS.length - 1 && (
              <div className="my-1 h-10 w-[2px] overflow-hidden rounded-full bg-[var(--whiold-border)]">
                <div
                  className="w-full rounded-full bg-[var(--whiold-primary)] transition-all duration-500 ease-out"
                  style={{ height: isDone ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>

          <div className={`pb-8 ${index === STEPS.length - 1 ? "pb-0" : ""}`}>
            <p
              className={`pt-1.5 text-[13.5px] font-semibold transition-colors duration-300 ${
                isActive || isDone ? "text-[var(--whiold-text-heading)]" : "text-[var(--whiold-text-muted)]"
              }`}
            >
              {step.label}
            </p>
            <p className="text-[11.5px] text-[var(--whiold-text-muted)]">Step {index + 1} of {STEPS.length}</p>
          </div>
        </div>
      );
    })}
  </div>
);

/* ───────────────────────────────── Main component ──────────────────────────────── */
const AddProduct = ({ onSubmit }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [furthestReached, setFurthestReached] = useState(0);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const contentRef = useRef(null);

  const [data, setData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    comparePrice: "",
    stock: "",
    sku: "",
    status: "draft",
    variants: [emptyVariant()],
    images: [emptyImage()],
  });

  // Step transition ke waqt content ko halka fade+slide de dete hain — CSS
  // transition se, GSAP yahan overkill hai kyunki sirf ek baar per click chalta hai.
  const [transitionKey, setTransitionKey] = useState(0);
  useEffect(() => {
    setTransitionKey((k) => k + 1);
  }, [activeStep]);

  const update = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const updateVariant = (id, field, value) => {
    setData((prev) => ({
      ...prev,
      variants: prev.variants.map((v) => (v.id === id ? { ...v, [field]: value } : v)),
    }));
  };

  const addVariant = () => setData((prev) => ({ ...prev, variants: [...prev.variants, emptyVariant()] }));
  const removeVariant = (id) =>
    setData((prev) => ({
      ...prev,
      variants: prev.variants.length > 1 ? prev.variants.filter((v) => v.id !== id) : prev.variants,
    }));

  const updateImage = (id, url) =>
    setData((prev) => ({
      ...prev,
      images: prev.images.map((img) => (img.id === id ? { ...img, url } : img)),
    }));

  const addImage = () => setData((prev) => ({ ...prev, images: [...prev.images, emptyImage()] }));
  const removeImage = (id) =>
    setData((prev) => ({
      ...prev,
      images: prev.images.length > 1 ? prev.images.filter((img) => img.id !== id) : prev.images,
    }));

  const handleGenerateSku = () => update("sku", generateSku(data.name, data.category));

  const validateStep = (stepIndex) => {
    const newErrors = {};
    if (stepIndex === 0) {
      if (!data.name.trim()) newErrors.name = "Product name is required";
      if (!data.category) newErrors.category = "Select a category";
    }
    if (stepIndex === 1) {
      if (!data.price || Number(data.price) <= 0) newErrors.price = "Enter a valid price";
      if (data.stock === "" || Number(data.stock) < 0) newErrors.stock = "Enter available stock";
      if (!data.sku.trim()) newErrors.sku = "Generate or enter a SKU";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep(activeStep)) return;
    const next = Math.min(activeStep + 1, STEPS.length - 1);
    setActiveStep(next);
    setFurthestReached((f) => Math.max(f, next));
  };

  const goBack = () => setActiveStep((s) => Math.max(0, s - 1));

  const handleStepClick = (index) => {
    if (index > activeStep && !validateStep(activeStep)) return;
    setActiveStep(index);
  };

  const handleSubmit = async () => {
    if (!validateStep(0) || !validateStep(1)) {
      setActiveStep(!validateStep(0) ? 0 : 1);
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit?.(data);
    } finally {
      setSubmitting(false);
    }
  };

  const isLastStep = activeStep === STEPS.length - 1;

  return (
    <div className="mx-auto max-w-[1180px] px-4 py-6">
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-[var(--whiold-text-heading)]">Add product</h1>
        <p className="text-[13.5px] text-[var(--whiold-text-body)]">
          Fill in the details below — the preview on the right updates as you go. 
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_minmax(0,1fr)_340px]">
        {/* ── Stepper rail ── */}
        <div className="rounded-[var(--whiold-radius-lg)] border border-[var(--whiold-border)] bg-[var(--whiold-bg)] p-5 lg:h-fit">
          <StepRail activeIndex={activeStep} onStepClick={handleStepClick} furthestReached={furthestReached} />
        </div>

        {/* ── Form content ── */}
        <div className="rounded-[var(--whiold-radius-lg)] border border-[var(--whiold-border)] bg-[var(--whiold-bg)] p-6">
          <div key={transitionKey} className="animate-[fadeSlide_0.35s_ease-out]">
            {activeStep === 0 && (
              <div className="flex flex-col gap-5">
                <InputComponent
                  label="Product name"
                  value={data.name}
                  onChange={(e) => update("name", e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                />
                <InputComponent
                  label="Category"
                  type="select"
                  value={data.category}
                  onChange={(e) => update("category", e.target.value)}
                  options={CATEGORY_OPTIONS}
                  error={!!errors.category}
                  helperText={errors.category}
                  required
                />
                <InputComponent
                  label="Description"
                  type="textarea"
                  rows={5}
                  value={data.description}
                  onChange={(e) => update("description", e.target.value)}
                  helperText="A short, clear summary customers will see first."
                />
              </div>
            )}

            {activeStep === 1 && (
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <InputComponent
                    label="Price (₹)"
                    type="number"
                    value={data.price}
                    onChange={(e) => update("price", e.target.value)}
                    error={!!errors.price}
                    helperText={errors.price}
                    required
                  />
                  <InputComponent
                    label="Compare-at price (₹)"
                    type="number"
                    value={data.comparePrice}
                    onChange={(e) => update("comparePrice", e.target.value)}
                    helperText="Optional — shown as a struck-through price."
                  />
                </div>

                <InputComponent
                  label="Available stock"
                  type="number"
                  value={data.stock}
                  onChange={(e) => update("stock", e.target.value)}
                  error={!!errors.stock}
                  helperText={errors.stock}
                  required
                />

                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <InputComponent
                      label="SKU"
                      value={data.sku}
                      onChange={(e) => update("sku", e.target.value)}
                      error={!!errors.sku}
                      helperText={errors.sku || "Auto-generate or enter your own."}
                    />
                  </div>
                  <ButtonComponent color="" variant="outlined" size="medium" onClick={handleGenerateSku} sx={{ height: "48px", flexShrink: 0  ,color: "var(--whiold-primary)" }}>
                    <RefreshCw size={15} style={{ marginRight: 6 }} />
                    Generate
                  </ButtonComponent>
                </div>

                <InputComponent
                  label="Status"
                  type="select"
                  value={data.status}
                  onChange={(e) => update("status", e.target.value)}
                  options={STATUS_OPTIONS}
                />
              </div>
            )}

            {activeStep === 2 && (
              <div className="flex flex-col gap-4">
                <p className="text-[13px] text-[var(--whiold-text-body)]">
                  Add variant options like colour, size, or material. Leave this as-is if the product has none.
                </p>

                {data.variants.map((variant, index) => (
                  <div
                    key={variant.id}
                    className="rounded-[var(--whiold-radius-md)] border border-[var(--whiold-border)] bg-[var(--whiold-bg-soft)] p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-wide text-[var(--whiold-text-muted)]">
                        Variant {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeVariant(variant.id)}
                        disabled={data.variants.length === 1}
                        className="text-[var(--whiold-text-muted)] transition-colors duration-200 hover:!text-[#C0392B] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <InputComponent
                        label="Attribute (e.g. Color)"
                        value={variant.attribute}
                        onChange={(e) => updateVariant(variant.id, "attribute", e.target.value)}
                      />
                      <InputComponent
                        label="Value (e.g. Copper)"
                        value={variant.value}
                        onChange={(e) => updateVariant(variant.id, "value", e.target.value)}
                      />
                      <InputComponent
                        label="Variant stock"
                        type="number"
                        value={variant.stock}
                        onChange={(e) => updateVariant(variant.id, "stock", e.target.value)}
                      />
                      <InputComponent
                        label="Price adjustment (₹)"
                        type="number"
                        value={variant.priceDelta}
                        onChange={(e) => updateVariant(variant.id, "priceDelta", e.target.value)}
                        helperText="Added on top of the base price."
                      />
                    </div>
                  </div>
                ))}

                <ButtonComponent color="" variant="outlined" onClick={addVariant} sx={{ alignSelf: "flex-start", color: "var(--whiold-primary)" }}>
                  <Plus size={15} style={{ marginRight: 6 }} />
                  Add variant
                </ButtonComponent>
              </div>
            )}

            {activeStep === 3 && (
              <div className="flex flex-col gap-4">
                <p className="text-[13px] text-[var(--whiold-text-body)]">
                  Paste image URLs — the first valid one becomes the main preview image.
                </p>

                {data.images.map((image, index) => (
                  <div key={image.id} className="flex items-center gap-3">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-[var(--whiold-radius-sm)] border border-[var(--whiold-border)] bg-[var(--whiold-bg-soft)]">
                      {image.url ? (
                        <img
                          src={image.url}
                          alt={`Product ${index + 1}`}
                          className="h-full w-full object-cover"
                          onError={(e) => (e.currentTarget.style.opacity = "0.15")}
                        />
                      ) : (
                        <ImageOff size={16} className="text-[var(--whiold-text-muted)]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <InputComponent
                        label={`Image URL ${index + 1}`}
                        value={image.url}
                        onChange={(e) => updateImage(image.id, e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      disabled={data.images.length === 1}
                      className="mb-1 flex-shrink-0 self-end text-[var(--whiold-text-muted)] transition-colors duration-200 hover:!text-[#C0392B] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                <ButtonComponent variant="outlined" onClick={addImage} sx={{ alignSelf: "flex-start" }}>
                  <Plus size={15} style={{ marginRight: 6 }} />
                  Add another image
                </ButtonComponent>
              </div>
            )}

            {activeStep === 4 && (
              <div className="flex flex-col gap-5">
                <p className="text-[13px] text-[var(--whiold-text-body)]">
                  Review everything before publishing. You can jump back to any step to make changes.
                </p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <ReviewRow label="Name" value={data.name} />
                  <ReviewRow label="Category" value={CATEGORY_OPTIONS.find((c) => c.value === data.category)?.label} />
                  <ReviewRow label="Price" value={data.price && `₹${Number(data.price).toLocaleString("en-IN")}`} />
                  <ReviewRow label="Stock" value={data.stock} />
                  <ReviewRow label="SKU" value={data.sku} />
                  <ReviewRow label="Status" value={STATUS_OPTIONS.find((s) => s.value === data.status)?.label} />
                </div>

                <div>
                  <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-wide text-[var(--whiold-text-muted)]">
                    Variants
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {data.variants.filter((v) => v.value).length === 0 && (
                      <span className="text-[13px] text-[var(--whiold-text-muted)]">No variants added</span>
                    )}
                    {data.variants
                      .filter((v) => v.value)
                      .map((v) => (
                        <span
                          key={v.id}
                          className="rounded-[8px] bg-[var(--whiold-primary-soft)] px-2.5 py-1 text-[12px] font-medium text-[var(--whiold-primary)]"
                        >
                          {v.attribute ? `${v.attribute}: ` : ""}
                          {v.value}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Navigation ── */}
          <div className="mt-8 flex items-center justify-between border-t border-[var(--whiold-border)] pt-5">
            <ButtonComponent variant="text" onClick={goBack} disabled={activeStep === 0} sx={{ color: "var(--whiold-text-body)" }}>
              <ChevronLeftIcon size={16} style={{ marginRight: 4 }} />
              Back
            </ButtonComponent>

            {isLastStep ? (
              <ButtonComponent onClick={handleSubmit} loading={submitting}>
                Publish product
              </ButtonComponent>
            ) : (
              <ButtonComponent onClick={goNext}>
                Continue
                <ChevronRight size={16} style={{ marginLeft: 4 }} />
              </ButtonComponent>
            )}
          </div>
        </div>

        {/* ── Live preview ── */}
        <div>
          <ProductPreviewCard data={data} />
        </div>
      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

const ReviewRow = ({ label, value }) => (
  <div className="rounded-[var(--whiold-radius-sm)] border border-[var(--whiold-border)] bg-[var(--whiold-bg-soft)] px-3.5 py-2.5">
    <p className="font-mono text-[10px] font-semibold uppercase tracking-wide text-[var(--whiold-text-muted)]">{label}</p>
    <p className="text-[13.5px] font-medium text-[var(--whiold-text-heading)]">{value || "—"}</p>
  </div>
);

export default AddProduct;