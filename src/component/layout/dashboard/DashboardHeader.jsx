import React, { useState, useEffect, useCallback, useMemo } from "react";
import { LogOut, Shield, Maximize2, Minimize2, Sun, Moon, CloudSun } from "lucide-react";
import { AppBar, Toolbar, Box, IconButton, Tooltip, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';


const ROLE_CONFIG = {
  admin: {
    badge: "Admin",
    profileLabel: "Admin",
    profilePath: "/admin/profile",
    canOpenProfile: false,
    fallbackTitle: "Admin Dashboard",
  },
  subadmin: {
    badge: "Sub Admin",
    profileLabel: "Sub Admin",
    profilePath: "/subadmin/profile",
    canOpenProfile: true,
    fallbackTitle: "Sub Admin Dashboard",
  },
  user: {
    badge: "User",
    profileLabel: "Profile",
    profilePath: "/profile",
    canOpenProfile: true,
    fallbackTitle: "User Dashboard",
  },
  // 4th role ka naam finalize hote hi yahan ek naya key daal dena,
  // tab tak wo neeche wale fallback se `user` jaisa hi behave karega.
};

const getRoleConfig = (role) => ROLE_CONFIG[role] || ROLE_CONFIG.user;

// Time ke hisaab se greeting + chhota icon — isse header thoda "alive" lagta hai
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Good morning", Icon: Sun };
  if (hour < 17) return { text: "Good afternoon", Icon: CloudSun };
  return { text: "Good evening", Icon: Moon };
};

const DashboardHeader = ({ user: userProp, role: roleProp, onLogout }) => {
  const navigate = useNavigate();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [user, setUser] = useState(userProp || null);

  useEffect(() => {
    if (userProp) {
      setUser(userProp);
      return;
    }
    try {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
    } catch (err) {
      console.error("Dashboard header: user parse failed", err);
    }
  }, [userProp]);

  const role = (roleProp || sessionStorage.getItem("role") || "user").toLowerCase();
  const { badge, profileLabel, profilePath, canOpenProfile, fallbackTitle } = getRoleConfig(role);
  const isManagement = role === "admin" || role === "subadmin";
  const greeting = useMemo(() => getGreeting(), []);

  useEffect(() => {
    const onFSChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFSChange);
    return () => document.removeEventListener("fullscreenchange", onFSChange);
  }, []);

  const handleFullscreenToggle = useCallback(async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else if (document.exitFullscreen) await document.exitFullscreen();
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      return;
    }
    localStorage.removeItem("user");
    sessionStorage.clear();
    navigate("/login");
  };

  const displayName = user?.name || fallbackTitle;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <Box className="px-3 py-3 sm:px-4">
      <AppBar
        position="static"
        elevation={0}
        component="div"
        className="!bg-transparent !text-inherit relative overflow-hidden rounded-[26px] border border-[var(--whiold-border)] shadow-[var(--whiold-shadow-card)]"
        style={{ backgroundImage: "var(--whiold-gradient-panel)" }}
      >
        {/* soft decorative blob — bas thoda sa "cute" glow, kahin bhi cut nahi hoga */}
        <div className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-[var(--whiold-primary)] opacity-[0.08] blur-2xl" />
        <div className="pointer-events-none absolute -left-6 -bottom-10 h-20 w-20 rounded-full bg-[var(--whiold-400)] opacity-[0.10] blur-2xl" />

        <Toolbar disableGutters className="!min-h-0 flex items-center justify-between gap-3 px-3 py-3.5 sm:px-4">
          {/* ── LEFT: avatar + greeting ── */}
          <Box className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            {/* Avatar with soft gradient ring */}
            <Box className="flex-shrink-0 rounded-full p-[2.5px]" style={{ backgroundImage: "var(--whiold-gradient-brand)" }}>
              {user?.profilePhoto ? (
                <Avatar
                  src={user.profilePhoto}
                  className="!h-9 !w-9 !border-2 !border-white sm:!h-10 sm:!w-10"
                />
              ) : (
                <Avatar className="!h-9 !w-9 !border-2 !border-white !bg-[var(--whiold-bg)] font-serif !text-sm !font-bold !text-[var(--whiold-primary)] sm:!h-10 sm:!w-10">
                  {initial}
                </Avatar>
              )}
            </Box>

            <Box className="min-w-0">
              <Box className="flex items-center gap-1 text-[10px] font-medium text-[var(--whiold-text-muted)] sm:text-[11px]">
                <greeting.Icon size={11} className="text-[var(--whiold-primary)]" />
                <span>{greeting.text}</span>
              </Box>
              <h2 className="m-0 max-w-[120px] truncate font-serif text-[13px] font-bold leading-tight text-[var(--whiold-text-heading)] sm:max-w-[220px] sm:text-[15px] md:max-w-none">
                {displayName}
              </h2>
            </Box>
          </Box>

          {/* ── RIGHT: role pill + actions ── */}
          <Box className="flex flex-shrink-0 items-center gap-1.5 sm:gap-2">
            {/* Role pill — cute rounded-full badge with icon */}
            {/* <Box className="hidden items-center gap-1.5 rounded-full border border-[var(--whiold-border)] bg-white/70 px-3 py-1.5 sm:flex">
              <PersonIcon size={11} className="text-[var(--whiold-primary)]" />
              <span className="font-mono text-[15px] font-semibold text-[var(--whiold-text-body)]">{badge}</span>
            </Box> */}

            {/* Fullscreen */}
            <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"} arrow>
              <IconButton
                onClick={handleFullscreenToggle}
                size="small"
                className="!hidden !h-9 !w-9 !rounded-full !border !border-[var(--whiold-border)] !bg-white/70 !text-[var(--whiold-primary)] transition-all duration-200 hover:!scale-105 hover:!bg-[var(--whiold-primary)] hover:!text-white sm:!flex"
              >
                {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </IconButton>
            </Tooltip>

            {/* Profile chip — visible on management roles, clickable if allowed */}
            {isManagement && (
              <Box
                onClick={canOpenProfile ? () => navigate(profilePath) : undefined}
                className={`hidden items-center gap-1.5 rounded-full border border-[var(--whiold-border)] bg-white/70 px-3 py-1.5 md:flex ${
                  canOpenProfile ? "cursor-pointer transition-colors duration-200 hover:border-[var(--whiold-primary)]" : "cursor-default"
                }`}
              >
                <Shield size={11} className="text-[var(--whiold-primary)]" />
                <span className="font-mono text-[10px] font-semibold text-[var(--whiold-text-body)]">{profileLabel}</span>
              </Box>
            )}

            {/* Logout — soft rose pill, distinctly different from the rest */}
            <Tooltip title="Logout" arrow>
              <IconButton
                onClick={handleLogout}
                size="small"
                className="!h-9 !w-9 !rounded-full !border !border-rose-200 !bg-rose-50 !text-rose-400 transition-all duration-200 hover:!scale-105 hover:!bg-rose-400 hover:!text-white"
              >
                <LogOut size={14} />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default DashboardHeader;