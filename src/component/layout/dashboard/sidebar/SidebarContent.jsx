import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, List } from "@mui/material";

import SidebarItem from "./SidebarItem";
import CollapsedItem from "./CollapsedItem";
import { getVisibleSections } from "./sidebarUtils";

const SidebarContent = ({
  role,
  collapsed,
  onNavigate,
  activePath,
}) => {
  const sections = useMemo(
    () => getVisibleSections(role),
    [role]
  );

  const [openKey, setOpenKey] = useState(null);

  const handleToggle = useCallback((path) => {
    setOpenKey((prev) => (prev === path ? null : path));
  }, []);

  // Sidebar collapse hote hi open accordion close ho jaye
  useEffect(() => {
    if (collapsed) {
      setOpenKey(null);
    }
  }, [collapsed]);

  return (
    <Box className="flex h-full flex-col gap-1 overflow-y-auto overflow-x-hidden px-2.5 py-4">
      {sections.map((section) => (
        <Box key={section.section} className="mb-2">
          {!collapsed && (
            <p className="mb-1.5 px-3 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--whiold-sidebar-section-label,var(--whiold-text-muted))]">
              {section.section}
            </p>
          )}

          <List disablePadding className="flex flex-col gap-1">
            {section.items.map((item) =>
              collapsed ? (
                <CollapsedItem
                  key={item.path}
                  item={item}
                  onNavigate={onNavigate}
                  activePath={activePath}
                />
              ) : (
                <SidebarItem
                  key={item.path}
                  item={item}
                  isOpen={openKey === item.path}
                  onToggle={handleToggle}
                  onNavigate={onNavigate}
                  activePath={activePath}
                />
              )
            )}
          </List>
        </Box>
      ))}
    </Box>
  );
};

export default SidebarContent;