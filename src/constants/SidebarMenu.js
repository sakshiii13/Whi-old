import {
  LayoutDashboard,
  Users,
  UserCog,
  Wallet,
  BarChart3,
  ClipboardList,
  Bell,
  Settings,
  LifeBuoy,
  Package,
  ShoppingCart,
  FolderTree,
  PlusCircle,
  ListChecks,
  Tags,
  PackageSearch,
  ClipboardCheck,
} from "lucide-react";
import { LuPackageOpen,LuPackageCheck } from "react-icons/lu";
import { adminRoutes, userRoutes } from "./router";

const SIDEBAR_MENU = [
  {
    section: "Overview",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, path: adminRoutes.ADMIN_DASHBOARD, roles: ["admin"] },
      { label: "Dashboard", icon: LayoutDashboard, path: "/subadmin", roles: ["subadmin"] },
      { label: "Dashboard", icon: LayoutDashboard, path: userRoutes.DASHBOARD, roles: ["user"] },
    ],
  },
  {
    section: "Orders",
    items: [
      { label: "All Orders", icon: ShoppingCart, path: adminRoutes.ORDERS, roles: ["admin", "subadmin"] },
      { label: "All Orders", icon: LuPackageOpen, path: userRoutes.ALL_ORDERS, roles: ["user"] },
      { label: "Track Orders", icon: LuPackageCheck, path: userRoutes.TRACK_ORDERS, roles: ["user"] },
    ]
  },
  {
    section: "Rewards",
    items: [
      { label: "Reward History", icon: BarChart3, path: userRoutes.REWARDS, roles: ["user"] },
  
    ]
  },
  {
    section: "Catalog",
    items: [
      {
        label: "Products",
        icon: Package,
        path: adminRoutes.ADMIN_PRODUCTS,
        roles: ["admin"],
        children: [
          { label: "Add Product", icon: PlusCircle, path: "/admin/products/add", roles: ["admin"] },
          { label: "Manage Products", icon: PackageSearch, path: "/admin/products/manage", roles: ["admin"] },
        ],
      },
      {
        label: "Category Management",
        icon: FolderTree,
        path: adminRoutes.ADMIN_CATEGORIES,
        roles: ["admin"],
        children: [
          { label: "Categories", icon: FolderTree, path: "/admin/category", roles: ["admin"] },
          { label: "Sub Categories", icon: ListChecks, path: "/admin/subcategory", roles: ["admin"] },
          { label: "Brands", icon: Tags, path: "/admin/brands", roles: ["admin"] },
        ],
      },
      {
        label: "Orders",
        icon: ShoppingCart,
        path: adminRoutes.ORDERS,
        roles: ["admin", "subadmin"],
        children: [
          { label: "Manage Orders", icon: ClipboardCheck, path: "/admin/manage-orders", roles: ["admin", "subadmin"] },
        ],
      },
    
    ],
  },
  {
    
    section: "Management",
    items: [
      { label: "Users", icon: Users, path: "/admin/users", roles: ["admin"] },
      { label: "Sub Admins", icon: UserCog, path: "/admin/subadmins", roles: ["admin"] },
      { label: "My Users", icon: Users, path: "/subadmin/users", roles: ["subadmin"] },
      { label: "Bonus", icon: Wallet, path: "/admin/bonus", roles: ["admin", "subadmin"] },
    ],
  },
  {
    section: "Fund Management",
    items: [
      { label: "Add Money", icon: BarChart3, path: "/user/add-money", roles: ["user"] },
      { label: "Withdraw", icon: ClipboardList, path: "/user/withdraw", roles: ["user", "admin"] },
      { label: "Wallet History", icon: ClipboardList, path: "user/wallet-history", roles: ["user"] },
    ],
  },
  {
    section: "Account",
    items: [
      { label: "Notifications", icon: Bell, path: "/notifications", roles: [] },
      { label: "Settings", icon: Settings, path: "/settings", roles: [] },
      { label: "Support", icon: LifeBuoy, path: "/support", roles: [] },
    ],
  },
];

export default SIDEBAR_MENU;