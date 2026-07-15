import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Drawer from "@mui/material/Drawer";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu as MenuIcon,
  X,
  ChevronDown,
} from "lucide-react";
import ButtonComponent from "../../../ui/ButtonComponent";
import mainContent from "../../../../constants/mainContent";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useCart } from "../../../../context/CartContext";
import CategoryMegaMenu from "./Categorymenu";
import { CATEGORIES } from "./CategoryData";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shopping" },
  { label: "Collections", to: "/collections" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const Navbar = ({ wishlistCount = 3 }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false); // "Shop by Category" accordion toggle
  const navigate = useNavigate();
  const { itemCount: cartCount } = useCart();

  return (
    <>
      {/* Announcement strip */}
      <div
        className="hidden sm:block text-center text-[13px] font-medium py-1.5 tracking-wide"
        style={{
          background: "var(--whiold-gradient-brand)",
          color: "var(--whiold-text-on-primary)",
        }}
      >
        Free shipping on orders above ₹2,999 · Use code{" "}
        <span className="font-semibold">WHIOLD10</span> for 10% off ·{" "}
        <Link
          to="/register"
          className="underline font-bold hover:opacity-80 transition"
          style={{ color: "inherit" }}
        >
          Sign Up
        </Link>
      </div>

      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          top: 0,
          backgroundColor: "#ffff",
          backdropFilter: "blur(80px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: "1px solid var(--whiold-border)",
          boxShadow: "var(--whiold-shadow-card)",
          color: "var(--whiold-text-heading)",
        }}
      >
        <Toolbar
          disableGutters
          className="mx-auto w-full max-w-7xl px-5 lg:px-10"
          sx={{ minHeight: "85px !important", py: 0.5 }}
        >
          {/* Logo — hides on mobile while the mobile search takeover is open */}
          <div
            className={`relative z-10 items-center mr-8 lg:mr-12 ${
              mobileSearchOpen ? "hidden lg:flex" : "flex"
            }`}
          >
            <img
              src={mainContent.logo}
              alt={mainContent.appName}
              className="h-21 lg:h-20 w-auto object-contain"
            />
          </div>

          {/* Desktop nav links — CategoryMegaMenu sits first, then the rest of NAV_LINKS.
              `relative` here is what the mega-menu panel anchors its position off of. */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 relative">
            <CategoryMegaMenu />
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="group relative flex items-center gap-1 px-3 py-2 text-[14.5px] font-medium rounded-[var(--whiold-radius-sm)] transition-colors duration-200 hover:text-[var(--whiold-primary)]"
                style={{ color: "var(--whiold-text-body)" }}
              >
                {link.label}
                {link.hasDropdown && (
                  <ChevronDown
                    size={16}
                    className="transition-transform duration-200 group-hover:rotate-180"
                  />
                )}
                <span className="absolute left-3 right-3 -bottom-0.5 h-[2px] scale-x-0 origin-center rounded-full bg-[var(--whiold-primary)] transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>

          {/* Search bar (expandable, desktop) */}
          <div className="hidden lg:flex items-center mr-2">
            <AnimatePresence initial={false}>
              {searchOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 240, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <InputBase
                    autoFocus
                    placeholder="Search products..."
                    sx={{
                      height: "38px",
                      px: 2,
                      borderRadius: "var(--whiold-radius-sm)",
                      backgroundColor: "var(--whiold-input-bg)",
                      border: "1px solid var(--whiold-border)",
                      fontSize: "14px",
                      color: "var(--whiold-text-heading)",
                      "&:focus-within": {
                        borderColor: "var(--whiold-border-focus)",
                        boxShadow: "var(--whiold-shadow-focus)",
                      },
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <IconButton
              onClick={() => setSearchOpen((p) => !p)}
              className="transition-transform duration-200 hover:scale-110"
              sx={{
                color: searchOpen
                  ? "var(--whiold-primary)"
                  : "var(--whiold-text-body)",
                "&:hover": { backgroundColor: "var(--whiold-primary-soft)" },
              }}
            >
              {searchOpen ? <X size={19} /> : <Search size={19} />}
            </IconButton>
          </div>

          {/* Right icons — desktop */}
          <div className="hidden lg:flex items-center gap-1">
            <IconButton
              className="transition-transform duration-200 hover:scale-110"
              onClick={() => navigate("/login")}
              sx={{
                color: "var(--whiold-text-body)",
                "&:hover": { backgroundColor: "var(--whiold-primary-soft)" },
              }}
            >
              <User size={19} />
            </IconButton>

            <IconButton
              className="transition-transform duration-200 hover:scale-110"
              sx={{
                color: "var(--whiold-text-body)",
                "&:hover": { backgroundColor: "var(--whiold-primary-soft)" },
              }}
            >
              <Badge
                badgeContent={wishlistCount}
                onClick={() => navigate("/wishlist")}
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "var(--whiold-primary)",
                    color: "#fff",
                    fontSize: "10px",
                    height: "16px",
                    minWidth: "16px",
                  },
                }}
              >
                <Heart size={19} />
              </Badge>
            </IconButton>

            <IconButton
              onClick={() => navigate("/cart")}
              className="transition-transform duration-200 hover:scale-110"
              sx={{
                color: "var(--whiold-text-body)",
                "&:hover": { backgroundColor: "var(--whiold-primary-soft)" },
              }}
            >
              <Badge
                badgeContent={cartCount}
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "var(--whiold-primary)",
                    color: "#fff",
                    fontSize: "10px",
                    height: "16px",
                    minWidth: "16px",
                  },
                }}
              >
                <ShoppingBag size={19} />
              </Badge>
            </IconButton>

            <ButtonComponent
              onClick={() => navigate("/login")}
              size="small"
              sx={{ ml: 1.5 }}
            >
              Shop Now
            </ButtonComponent>
          </div>

          {/* Mobile row — icons OR the in-navbar search takeover */}
          <div className="flex lg:hidden items-center flex-1 ml-auto justify-end">
            <AnimatePresence mode="wait" initial={false}>
              {mobileSearchOpen ? (
                <motion.div
                  key="mobile-search-bar"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center w-full gap-2"
                >
                  {/* Gradient-bordered glassy pill search */}
                  <div
                    className="relative flex-1 rounded-full"
                    style={{
                      background: "var(--whiold-gradient-brand)",
                      padding: "1.5px",
                      boxShadow: "var(--whiold-shadow-focus)",
                    }}
                  >
                    <div
                      className="flex items-center w-full rounded-full px-4"
                      style={{
                        height: "46px",
                        backgroundColor: "rgba(255,255,255,0.97)",
                        backdropFilter: "blur(16px)",
                        WebkitBackdropFilter: "blur(16px)",
                      }}
                    >
                      <Search
                        size={18}
                        className="shrink-0"
                        style={{ color: "var(--whiold-primary)" }}
                      />
                      <input
                        autoFocus
                        type="text"
                        placeholder="Search for products, brands..."
                        className="w-full bg-transparent border-none outline-none px-3 text-[14.5px]"
                        style={{ color: "var(--whiold-text-heading)" }}
                      />
                    </div>
                  </div>

                  <IconButton
                    onClick={() => setMobileSearchOpen(false)}
                    sx={{
                      backgroundColor: "var(--whiold-primary-soft)",
                      color: "var(--whiold-primary)",
                      width: 42,
                      height: 42,
                      flexShrink: 0,
                    }}
                  >
                    <X size={18} />
                  </IconButton>
                </motion.div>
              ) : (
                <motion.div
                  key="mobile-default-icons"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-1"
                >
                  <IconButton
                    onClick={() => setMobileSearchOpen(true)}
                    className="transition-transform duration-200 active:scale-90"
                    sx={{ color: "var(--whiold-text-body)" }}
                  >
                    <Search size={20} />
                  </IconButton>

                  <IconButton
                    onClick={() => navigate("/cart")}
                    sx={{ color: "var(--whiold-text-body)" }}
                  >
                    <Badge
                      badgeContent={cartCount}
                      sx={{
                        "& .MuiBadge-badge": {
                          backgroundColor: "var(--whiold-primary)",
                          color: "#fff",
                          fontSize: "9px",
                          height: "15px",
                          minWidth: "15px",
                        },
                      }}
                    >
                      <ShoppingBag size={20} />
                    </Badge>
                  </IconButton>

                  <IconButton
                    onClick={() => setMobileOpen(true)}
                    sx={{ color: "var(--whiold-text-heading)" }}
                  >
                    <MenuIcon size={22} />
                  </IconButton>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: "80%",
            maxWidth: "340px",
            background: "var(--whiold-gradient-panel)",
          },
        }}
      >
        <div className="flex flex-col h-full px-6 py-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <span
              className="text-2xl font-bold bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--whiold-gradient-brand)" }}
            >
              Whiold
            </span>
            <IconButton
              onClick={() => setMobileOpen(false)}
              sx={{ color: "var(--whiold-text-heading)" }}
            >
              <X size={22} />
            </IconButton>
          </div>

          <InputBase
            placeholder="Search products..."
            startAdornment={
              <Search
                size={17}
                style={{ marginRight: 8, color: "var(--whiold-text-muted)" }}
              />
            }
            sx={{
              height: "46px",
              px: 2,
              mb: 3,
              borderRadius: "var(--whiold-radius-sm)",
              backgroundColor: "var(--whiold-input-bg)",
              border: "1px solid var(--whiold-border)",
              fontSize: "14px",
            }}
          />

          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="group flex items-center justify-between px-3 py-3.5 rounded-[var(--whiold-radius-sm)] text-[15px] font-medium transition-colors duration-200 hover:text-[var(--whiold-primary)] hover:bg-[var(--whiold-primary-soft)]"
                style={{ color: "var(--whiold-text-body)" }}
              >
                {link.label}
                {link.hasDropdown && (
                  <ChevronDown
                    size={16}
                    className="transition-transform duration-200 group-hover:rotate-180"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* ---------- Shop by Category — mobile accordion, reuses shared CATEGORIES data ---------- */}
          <button
            onClick={() => setMobileCatOpen((v) => !v)}
            className="group flex items-center justify-between px-3 py-3.5 mt-1 rounded-[var(--whiold-radius-sm)] text-[15px] font-medium transition-colors duration-200 hover:text-[var(--whiold-primary)] hover:bg-[var(--whiold-primary-soft)]"
            style={{ color: "var(--whiold-text-body)" }}
          >
            Shop by Category
            <ChevronDown
              size={16}
              className="transition-transform duration-200"
              style={{ transform: mobileCatOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </button>

          <AnimatePresence initial={false}>
            {mobileCatOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden pl-3"
              >
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-2.5 text-[14px] transition-colors duration-200 hover:text-[var(--whiold-primary)]"
                    style={{ color: "var(--whiold-text-body)" }}
                  >
                    <img
                      src={cat.image}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                    {cat.name}
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <Divider sx={{ my: 3, borderColor: "var(--whiold-border)" }} />

          <div className="flex items-center gap-3 mb-6">
            <IconButton
              className="transition-transform duration-200 hover:scale-110"
              sx={{
                backgroundColor: "var(--whiold-primary-soft)",
                color: "var(--whiold-primary)",
              }}
            >
              <User size={18} />
            </IconButton>
            <IconButton
              className="transition-transform duration-200 hover:scale-110"
              sx={{
                backgroundColor: "var(--whiold-primary-soft)",
                color: "var(--whiold-primary)",
              }}
            >
              <Badge
                badgeContent={wishlistCount}
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "var(--whiold-primary)",
                    color: "#fff",
                    fontSize: "9px",
                    height: "15px",
                    minWidth: "15px",
                  },
                }}
              >
                <Heart size={18} />
              </Badge>
            </IconButton>
          </div>

          <div className="mt-auto">
            <ButtonComponent fullWidth>Shop Now</ButtonComponent>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default Navbar;